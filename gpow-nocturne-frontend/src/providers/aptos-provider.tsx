"use client";
import { AptosWalletProvider } from "@razorlabs/wallet-kit";
import "@razorlabs/wallet-kit/style.css";

import React from "react";

export default function AptosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AptosWalletProvider>{children}</AptosWalletProvider>;
}
