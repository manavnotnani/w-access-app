import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Abi } from "viem";

import { publicClient, walletClient, contracts, activeChain } from "./eth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getGuardianCount(): Promise<bigint> {
  const params = {
    address: contracts.walletImplementation.address,
    abi: contracts.walletImplementation.abi as unknown as Abi,
    functionName: "getGuardianCount",
    args: [],
  } as unknown as Parameters<typeof publicClient.readContract>[0];

  const result = await publicClient.readContract(params);
  return result as bigint;
}

export async function addGuardian(guardian: `0x${string}`) {
  if (!walletClient) throw new Error("Wallet not connected");
  const [account] = await walletClient.getAddresses();

  const params = {
    chain: activeChain,
    account,
    address: contracts.walletImplementation.address,
    abi: contracts.walletImplementation.abi as unknown as Abi,
    functionName: "addGuardian",
    args: [guardian],
  } as unknown as Parameters<typeof walletClient.writeContract>[0];

  const hash = await walletClient.writeContract(params);
  return publicClient.waitForTransactionReceipt({ hash });
}
