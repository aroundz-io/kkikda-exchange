"use client";

import { useAccount, useReadContract } from "wagmi";
import { type Address } from "viem";
import { ADDRESSES, BSC_CHAIN_ID, KKIKDA_NFT_ABI } from "@/lib/web3/contracts";

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
 *
 * NB: we pin the call to `chainId: BSC_CHAIN_ID` so the role check still
 * works while the user's wallet is on a different chain (otherwise wagmi
 * would route the eth_call to whichever chain the wallet currently uses
 * and silently return false because our contract doesn't exist there).
 */
export function useIsAdmin() {
  const { address, isConnected } = useAccount();

  const result = useReadContract({
    chainId: BSC_CHAIN_ID,
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
