"use client";
import {
  AptosWalletAdapterProvider,
  Wallet,
} from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

import React from "react";

export default function AptosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wallets: Wallet[] = [];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      optInWallets={["Petra"]}
      dappConfig={{ network: Network.DEVNET }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
