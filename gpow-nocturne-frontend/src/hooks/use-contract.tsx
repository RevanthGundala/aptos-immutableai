"use client";

import toast from "react-hot-toast";
import { useWallet, WalletInfo } from "@aptos-labs/wallet-adapter-react";
import useAptos from "./use-aptos";

export default function useContract() {
  // TODO: Get contract address
  const CONTRACT_ADDRESS = "0x";
  const { account, connected, signAndSubmitTransaction, wallets } = useWallet();
  const { aptos } = useAptos();

  const submitJob = async (
    cidManifest: string,
    taskCount: number,
    wallet: WalletInfo
  ) => {
    if (!connected) {
      toast.error("RPC connect failed!");
      return;
    } else if (!wallet) {
      toast.error("Please connect your wallet!");
      return;
    }

    try {
      const tx = await signAndSubmitTransaction({
        sender: account?.address || "",
        data: {
          function: `${CONTRACT_ADDRESS}::job::submit`,
          functionArguments: [cidManifest, taskCount],
        },
      });
      // TODO: Get gas limit
      //   const tx = await aptos.transaction.build.simple({
      //     sender: account?.address || "",
      //     data: {
      //       function: `${CONTRACT_ADDRESS}::job::submit`,
      //       functionArguments: [cidManifest, taskCount],
      //     },
      //   });
      //   const committedTxn = await aptos.signAndSubmitTransaction({
      //     signer: account,
      //     transaction: tx,
      //   });
      //   await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
      //   console.log(`Committed transaction: ${committedTxn.hash}`);
      //   const unsub = await state.contract.tx
      //     .submit(
      //       { value: 0, gasLimit: gasLimitResult.value },
      //       cidManifest,
      //       taskCountArray
      //     )
      //     .signAndSend(
      //       wallet,
      //       { signer: injector.signer },
      //       ({ events = [], status }: any) => {
      //         events.forEach(({ event }: any) => {
      //           console.log("event", event);
      //           const { method } = event;
      //           if (method === "ExtrinsicSuccess" && status.type === "InBlock") {
      //             toast.success("Job created successfully!");
      //             return;
      //           } else if (method === "ExtrinsicFailed") {
      //             console.log(`An error occured: ${method}.`);
      //             toast.error("Job creation failed!");
      //             return;
      //           }
      //         });
      //       }
      //     );
    } catch (error: any) {
      if (error.message.includes("1010")) {
        console.error(
          "Invalid Transaction: Inability to pay some fees, e.g., account balance too low."
        );
        toast.error("Failed! Your account balance is too low.");
      } else {
        console.log("Error interacting with the contract: " + error.message);
      }
    }
  };
  return {
    submitJob,
  };
}
