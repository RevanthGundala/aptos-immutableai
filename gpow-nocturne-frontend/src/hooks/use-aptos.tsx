"use client";

import toast from "react-hot-toast";
import { CONTRACT_ADDRESS } from "@/constants/selectFields";
import { useAptosProvider, useAptosWallet } from "@razorlabs/wallet-kit";
import { UserTransactionResponse } from "@aptos-labs/ts-sdk";

export default function useAptos() {
  const { account, connected, signAndSubmitTransaction } = useAptosWallet();
  const endpoint = "https://aptos.testnet.suzuka.movementlabs.xyz/v1";
  const provider = useAptosProvider(endpoint);

  const submitJob = async (cidManifest: string, taskCount: number) => {
    try {
      // TODO: Get gas limit
      console.log("Submitting job...");
      if (!connected) {
        throw new Error("Wallet not connected");
      }
      if (!account?.address) {
        throw new Error("No account address found");
      }
      const tx = await signAndSubmitTransaction({
        payload: {
          function: `${CONTRACT_ADDRESS}::job::submit`,
          functionArguments: [cidManifest, taskCount, 0],
        },
      });
      console.log(
        `View transaction at: https://explorer.movementnetwork.xyz/txn/${
          (tx as any).args.hash
        }?network=testnet`
      );
      const txReceipt = await provider.waitForTransaction({
        transactionHash: (tx as any).args.hash,
      });
      console.dir(txReceipt, { depth: null });
      if (
        (txReceipt as UserTransactionResponse).events[0].type ===
        `${CONTRACT_ADDRESS}::job::JobSubmitted`
      ) {
        toast.success("Job created successfully!");
      } else {
        toast.error("Job creation failed!");
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return {
    submitJob,
  };
}
