"use client";

import toast from "react-hot-toast";
import { useWallet, WalletInfo } from "@aptos-labs/wallet-adapter-react";
import { CONTRACT_ADDRESS } from "@/constants/selectFields";
import {
  Aptos,
  AptosConfig,
  Network,
  UserTransactionResponse,
} from "@aptos-labs/ts-sdk";

export default function useAptos() {
  const {
    connect,
    account,
    connected,
    signAndSubmitTransaction,
    wallets,
    network,
    changeNetwork,
  } = useWallet();
  const aptos = new Aptos(new AptosConfig({ network: Network.DEVNET }));

  const submitJob = async (
    cidManifest: string,
    taskCount: number,
    wallet: WalletInfo
  ) => {
    if (!connected) {
      connect(wallets![0].name); // Connect to the first wallet in the list
    }
    if (network?.name !== Network.DEVNET) {
      changeNetwork(Network.DEVNET);
    }

    try {
      // TODO: Get gas limit
      console.log("Submitting job...");
      const tx = await signAndSubmitTransaction({
        sender: account?.address || "",
        data: {
          function: `${CONTRACT_ADDRESS}::job::submit`,
          functionArguments: [cidManifest, taskCount, 0],
        },
      });
      const txReceipt = await aptos.waitForTransaction({
        transactionHash: tx.hash,
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
      //   if (error.message.includes("1010")) {
      //     console.error(
      //       "Invalid Transaction: Inability to pay some fees, e.g., account balance too low."
      //     );
      //     toast.error("Failed! Your account balance is too low.");
      //   } else {
      //     console.log("Error interacting with the contract: " + error.message);
      //   }
      console.log(error);
    }
  };
  return {
    submitJob,
  };
}
