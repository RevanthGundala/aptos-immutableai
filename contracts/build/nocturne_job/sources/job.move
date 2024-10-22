module nocturne_job_addr::job {
    use std::string::String;
    use std::option::{Self, Option};
    use std::timestamp;
    use std::vector;
    use std::signer;
    use aptos_framework::event;
    
    // Errors
    const E_SUBMIT_FAILED: u64 = 1;
    const E_CLAIM_FAILED: u64 = 2;
    const E_NO_JOBS: u64 = 3;
    const E_UPDATE_FAILED: u64 = 4;
    const E_NOT_OWNER: u64 = 5;
    const E_NOT_WORKER: u64 = 6;
    const E_CALLER_BUSY: u64 = 7;
    const E_NOT_ADMIN: u64 = 8;
    const E_WORKER_ALREADY_REGISTERED: u64 = 9;
    const E_WORKER_NOT_REGISTERED: u64 = 10;

    // Job Status
    const CREATED: u8 = 11;
    const IN_PROGRESS: u8 = 12;
    const FAILED: u8 = 13;
    const COMPLETED: u8 = 14;

    // Events
    #[event]
    struct JobSubmitted has drop, store {
        creator: address,
        job_id: u64,
    }

    #[event]
    struct JobUpdated has drop, store {
        creator: address,
        job_id: u64,
        status: u8,
    }

    #[event]
    struct JobCompleted has drop, store {
        creator: address,
        job_id: u64,
    }

    #[event]
    struct WorkerRegistered has drop, store {
        worker: address,
    }

    #[event]
    struct WorkerRemoved has drop, store {
        worker: address,
    }

    // Resources
    struct NocturneJob has key {
        jobs: vector<Job>,
        workers: vector<address>,
        admin: address,
    }

    struct Job has copy, store, drop {
        creator: address,
        cid_manifest: String,
        cid_results: Option<String>,
        status: u8,
        created_at: u64,
        updated_at: Option<u64>,
        completed_at: Option<u64>,
        worker: Option<address>,
    }

    // Initialize module
    fun init_module(nocturne_job_signer: &signer) {
        let nocturne_job = NocturneJob {
            jobs: vector::empty<Job>(),
            workers: vector::empty<address>(),
            admin: signer::address_of(nocturne_job_signer),
        };
        move_to(nocturne_job_signer, nocturne_job);
    }

    // Admin functions
    public entry fun register_worker(admin: &signer, worker: address) acquires NocturneJob {
        let nocturne_job = borrow_global_mut<NocturneJob>(@nocturne_job_addr);
        assert!(signer::address_of(admin) == nocturne_job.admin, E_NOT_ADMIN);
        assert!(!vector::contains(&nocturne_job.workers, &worker), E_WORKER_ALREADY_REGISTERED);
        
        vector::push_back(&mut nocturne_job.workers, worker);
        event::emit(WorkerRegistered { worker });
    }

    public entry fun remove_worker(admin: &signer, worker: address) acquires NocturneJob {
        let nocturne_job = borrow_global_mut<NocturneJob>(@nocturne_job_addr);
        assert!(signer::address_of(admin) == nocturne_job.admin, E_NOT_ADMIN);
        
        let (exists, index) = vector::index_of(&nocturne_job.workers, &worker);
        assert!(exists, E_WORKER_NOT_REGISTERED);
        
        vector::remove(&mut nocturne_job.workers, index);
        event::emit(WorkerRemoved { worker });
    }

    // Job management functions
    public entry fun submit(creator: &signer, cid_manifest: String) acquires NocturneJob {
        let nocturne_job = borrow_global_mut<NocturneJob>(@nocturne_job_addr);
        
        let job = Job {
            creator: signer::address_of(creator),
            cid_manifest,
            cid_results: option::none(),
            status: CREATED,
            created_at: timestamp::now_seconds(),
            updated_at: option::none(),
            completed_at: option::none(),
            worker: option::none(),
        };
        
        vector::push_back(&mut nocturne_job.jobs, job);
        let job_id = vector::length(&nocturne_job.jobs) - 1;
        
        event::emit(JobSubmitted {
            creator: signer::address_of(creator),
            job_id,
        });
    }

    public entry fun claim(worker: &signer, job_id: u64) acquires NocturneJob {
        let nocturne_job = borrow_global_mut<NocturneJob>(@nocturne_job_addr);
        let worker_addr = signer::address_of(worker);
        
        // Verify worker is registered
        assert!(vector::contains(&nocturne_job.workers, &worker_addr), E_NOT_WORKER);
        
        // Verify worker isn't already working on another job
        let jobs = &nocturne_job.jobs;
        let job_count = vector::length(jobs);
        let i = 0;
        while (i < job_count) {
            let job = vector::borrow(jobs, i);
            if (option::is_some(&job.worker)) {
                let current_worker = option::borrow(&job.worker);
                assert!(*current_worker != worker_addr || job.status == COMPLETED || job.status == FAILED, E_CALLER_BUSY);
            };
            i = i + 1;
        };
        
        let job = vector::borrow_mut(&mut nocturne_job.jobs, job_id);
        assert!(job.status == CREATED, E_CLAIM_FAILED);
        
        job.status = IN_PROGRESS;
        job.worker = option::some(worker_addr);
        job.updated_at = option::some(timestamp::now_seconds());
        
        event::emit(JobUpdated {
            creator: job.creator,
            job_id,
            status: IN_PROGRESS,
        });
    }

    public entry fun complete(worker: &signer, job_id: u64, cid_result: String) acquires NocturneJob {
        let nocturne_job = borrow_global_mut<NocturneJob>(@nocturne_job_addr);
        let worker_addr = signer::address_of(worker);
        
        let job = vector::borrow_mut(&mut nocturne_job.jobs, job_id);
        assert!(option::contains(&job.worker, &worker_addr), E_NOT_WORKER);
        assert!(job.status == IN_PROGRESS, E_UPDATE_FAILED);
        
        job.status = COMPLETED;
        job.cid_results = option::some(cid_result);
        job.completed_at = option::some(timestamp::now_seconds());
        job.updated_at = option::some(timestamp::now_seconds());
        
        event::emit(JobCompleted {
            creator: job.creator,
            job_id,
        });
    }

    public entry fun fail(worker: &signer, job_id: u64) acquires NocturneJob {
        let nocturne_job = borrow_global_mut<NocturneJob>(@nocturne_job_addr);
        let worker_addr = signer::address_of(worker);
        
        let job = vector::borrow_mut(&mut nocturne_job.jobs, job_id);
        assert!(option::contains(&job.worker, &worker_addr), E_NOT_WORKER);
        assert!(job.status == IN_PROGRESS, E_UPDATE_FAILED);
        
        job.status = FAILED;
        job.completed_at = option::some(timestamp::now_seconds());
        job.updated_at = option::some(timestamp::now_seconds());
        
        event::emit(JobUpdated {
            creator: job.creator,
            job_id,
            status: FAILED,
        });
    }

    // View functions
    #[view]
    public fun get_jobs(): vector<Job> acquires NocturneJob {
        let nocturne_job = borrow_global<NocturneJob>(@nocturne_job_addr);
        nocturne_job.jobs
    }

    #[view]
    public fun get_jobs_by_creator(creator: address, status: Option<u8>): vector<Job> acquires NocturneJob {
        let jobs = get_jobs();
        let filtered_jobs = vector::empty<Job>();
        
        let i = 0;
        let len = vector::length(&jobs);
        while (i < len) {
            let job = vector::borrow(&jobs, i);
            if (job.creator == creator) {
                if (option::is_none(&status) || option::contains(&status, &job.status)) {
                    vector::push_back(&mut filtered_jobs, *job);
                };
            };
            i = i + 1;
        };
        
        filtered_jobs
    }

    #[view]
    public fun get_jobs_by_worker(worker: address, status: Option<u8>): vector<Job> acquires NocturneJob {
        let jobs = get_jobs();
        let filtered_jobs = vector::empty<Job>();
        
        let i = 0;
        let len = vector::length(&jobs);
        while (i < len) {
            let job = vector::borrow(&jobs, i);
            if (option::is_some(&job.worker) && option::contains(&job.worker, &worker)) {
                if (option::is_none(&status) || option::contains(&status, &job.status)) {
                    vector::push_back(&mut filtered_jobs, *job);
                };
            };
            i = i + 1;
        };
        
        filtered_jobs
    }

    #[view]
    public fun is_worker(worker: address): bool acquires NocturneJob {
        let nocturne_job = borrow_global<NocturneJob>(@nocturne_job_addr);
        vector::contains(&nocturne_job.workers, &worker)
    }

    #[view]
    public fun get_admin(): address acquires NocturneJob {
        let nocturne_job = borrow_global<NocturneJob>(@nocturne_job_addr);
        nocturne_job.admin
    }
}