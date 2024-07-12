"use client";
import axios from "axios";
import { create } from 'kubo-rpc-client';

export default function useIpfs() {
    const URL = process.env.NEXT_PUBLIC_IPFS_NODE_URL || "";
    const uploadFileToIPFS = async (file: File) => {
        if (!file) {
            console.error("No file provided for upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${URL}/api/v0/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 10000  // Optional: Add a timeout for the request
            });

            if (response.status === 200 && response.data) {
                return response.data;
            } else {
                console.error(`Unexpected response: ${response.status} - ${response.statusText}`);
            }
        } catch (error: any) {
            if (error.response) {
                console.error(`Error uploading file: ${error.response.status} - ${error.response.statusText}`);
            } else if (error.request) {
                console.error("Error: No response received from IPFS node.");
            } else {
                console.error(`Error setting up request: ${error.message}`);
            }
        }
    };


    const uploadDataUsingKubo = async (file: File | string) => {
        if (!file) {
            console.error("No file provided for upload.");
            return;
        }

        try {
            const client = create({ url: `${URL}` });
            const response = await client.add(file);

            if (response && response.path) {
                return response;
            } else {
                console.error("Unexpected response from IPFS node.");
            }
        } catch (error: any) {
            console.error(`Error uploading data using Kubo: ${error.message}`);
        }
    };

    return {
        uploadFileToIPFS,
        uploadDataUsingKubo
    };
}
