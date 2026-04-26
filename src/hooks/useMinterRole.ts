"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { type Abi, type Address } from "viem";
import { KKIKDA_NFT_ABI, KKD_TOKEN_ABI, RWA_TOKEN_ABI } from "@/lib/web3/contracts";

type MintableAbi =
  | typeof KKIKDA_NFT_ABI
  | typeof KKD_TOKEN_ABI
  | typeof RWA_TOKEN_ABI;

/**
 * Returns whether the given account holds MINTER_ROLE on the given contract.
 * Reads MINTER_ROLE() then hasRole(role, account) from chain.
 */
export function useMinterRole(
  contractAddress: Address | undefined,
  account: Address | undefined,
  abi: MintableAbi,
) {
  const roleQuery = useReadContract({
    address: contractAddress,
    abi: abi as Abi,
    functionName: "MINTER_ROLE",
    query: {
      enabled: !!contractAddress,
    },
  });

  const role = roleQuery.data as `0x${string}` | undefined;

  const hasRoleQuery = useReadContracts({
    contracts:
      role && account && contractAddress
        ? [
            {
              address: contractAddress,
              abi: abi as Abi,
              functionName: "hasRole",
              args: [role, account],
            },
          ]
        : [],
    query: {
      enabled: !!role && !!account && !!contractAddress,
    },
  });

  const hasRole = hasRoleQuery.data?.[0]?.result as boolean | undefined;
  const isLoading = roleQuery.isLoading || hasRoleQuery.isLoading;

  return {
    hasRole: hasRole ?? false,
    isLoading,
    role,
    refetch: hasRoleQuery.refetch,
  };
}
