"use client";

import { useAccount, useReadContract } from "wagmi";
import { type Address } from "viem";
import { ADDRESSES, KKIKDA_NFT_ABI } from "@/lib/web3/contracts";

/**
 * DEFAULT_ADMIN_ROLE on OpenZeppelin AccessControl is 32 zero bytes.
 * This is the highest privilege role on the contract — typically held by the
 * deployer and able to grant/revoke other roles.
 */
const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

/**
 * Returns whether the connected wallet holds DEFAULT_ADMIN_ROLE on the
 * KKIKDA_NFT contract. We use the NFT contract as the canonical admin check —
 * the same wallet typically also holds admin on the token/marketplace/staking
 * contracts since they were deployed together.
 */
export function useIsAdmin() {
  const { address, isConnected } = useAccount();

  const result = useReadContract({
    address: ADDRESSES.KKIKDA_NFT as Address,
    abi: KKIKDA_NFT_ABI,
    functionName: "hasRole",
    args: address ? [DEFAULT_ADMIN_ROLE, address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  return {
    isAdmin: (result.data as boolean | undefined) ?? false,
    isLoading: result.isLoading,
    isConnected,
    address,
  };
}
