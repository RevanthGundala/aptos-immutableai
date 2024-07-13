"use client";
import {
  AptosWalletAdapterProvider,
  Wallet,
} from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { NightlyWallet } from "@nightlylabs/aptos-wallet-adapter-plugin";

import React from "react";

export default function AptosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wallets: Wallet[] = [new PetraWallet(), new NightlyWallet()];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      optInWallets={["Petra", "Nightly"]}
      dappConfig={{ network: Network.DEVNET }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
