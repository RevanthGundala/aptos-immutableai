module 0x01:: Job {
    use std::debug; //for testing purposes
    use std::string;
    use std::signer;
    use std::vector;
    use std::timestamp;
    use aptos_framework::event;
    use aptos_framework::account;


const E_SUBMIT_FAILED: u64 = 1;
const E_CLAIM_FAILED: u64 = 2;
const E_NO_JOBS: u64 = 3;
const E_UPDATE_FAILED: u64 = 4;
const E_NOT_OWNER: u64 = 5;
const E_NOT_WORKER: u64 = 6;
const E_CALLER_BUSY: u64 = 7;

#[event]
    struct JobCompletedEvent has drop, store {
        creator: address,
        job_id: u64,
        task_id: u64,

    }
#[event]
    // JobSubmitted Event
    struct JobSubmitted has drop, store {
        creator: address,
        job_id: u64,
    }

    
#[event]
    // JobUpdated Event
    struct JobUpdated has drop, store {
        creator: address,
        job_id: u64,
        status: u8, // JobStatus as u8
    }


  
#[event]
    // TaskClaimed Event
    struct TaskClaimed has drop, store {
        worker: address,
        task_id: u64,
    }


#[event]
    // TaskFailed Event
    struct TaskFailed has drop, store {
        worker: address,
        task_id: u64,
    }

      // Task Resource
    struct Task has copy, drop, store {
        ///Task ID
        id: u64,
        /// The worker account id
        worker: Option<AccountId>,
        /// The status of the task
        status: JobStatus,
        /// The number of retries for the task
        retries: u64,
        /// The timestamp when the task was created
        created_at: Timestamp,
        /// The timestamp when the task was last updated
        updated_at: Option<Timestamp>,
        /// The timestamp when the task was completed
        completed_at: Option<Timestamp>,
    }

    // Job Resource
    struct Job has store {
        creator: AccountId,
        cid_manifest: String,
        cid_results: Option<vector<vector<u8>>>,
        tip: Option<u128>,
        tasks: vector<Task>,
        created_at: Timestamp,
        updated_at: Option<Timestamp>,
        completed_at: Option<Timestamp>,
    }

    // NocturneJob Resource
    struct NocturneJob has store {
        jobs: vector<Job>,
        max_retries: u64,
        max_tasks: u64,
    }
    fun init_module() {}

    public fun submit(){}

    public fun claim(){}
    
    public fun failed(){}

    public fun complete(){}

    public fun cancel(){}

   ///////View Functionc///////
    
    public fun get_job(){}
   
    public fun get_jobs(): vector<jobs> acquires NocturneJob (){
        borrow_global<NocturneJob>(@0x01).jobs;
    }
   
    public fun get_jobs_by_creator(){}
    
    public fun get_jobs_by_worker(){}


}
    