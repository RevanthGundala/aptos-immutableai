"use client";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export default function useAptos() {
  const aptos = new Aptos(new AptosConfig({ network: Network.DEVNET }));
  return { aptos };
}
