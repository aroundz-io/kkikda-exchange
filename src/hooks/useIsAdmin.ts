"use client";

import { useAccount, useReadContract } from "wagmi";
import { type Address } from "viem";
import { ADDRESSES, BSC_CHAIN_ID, KKIKDA_NFT_ABI } from "@/lib/web3/contracts";

/**
 * DEFAULT_ADMIN_ROLE on OpenZeppelin AccessControl is 32 zero bytes.
 */
const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

/** Minimal ABI fragment to read Ownable.owner(). */
const OWNABLE_ABI = [
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
] as const;

/**
 * Admin gate for the wallet currently connected.
 *
 * The deployed KKIKDA_NFT contract has both Ownable + AccessControl, but
 * the bytecode currently on BSC testnet was deployed before the
 * `_grantRole(DEFAULT_ADMIN_ROLE, deployer)` calls were added to the
 * constructor — so `hasRole` returns false even though the deployer is
 * the recorded `owner()`. We therefore treat "wallet === Ownable.owner()"
 * as also-admin for UI gating, alongside the standard `hasRole` check.
 *
 * Calls are pinned to `chainId: BSC_CHAIN_ID` so detection still works
 * while the wallet is on the wrong network.
 *
 * NB: on-chain actions that require AccessControl roles (mint, pause,
 * etc.) will still revert against the current bytecode unless the roles
 * are explicitly granted, or the contracts are redeployed.
 */
export function useIsAdmin() {
  const { address, isConnected } = useAccount();

  const roleQuery = useReadContract({
    chainId: BSC_CHAIN_ID,
    address: ADDRESSES.KKIKDA_NFT as Address,
    abi: KKIKDA_NFT_ABI,
    functionName: "hasRole",
    args: address ? [DEFAULT_ADMIN_ROLE, address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  const ownerQuery = useReadContract({
    chainId: BSC_CHAIN_ID,
    address: ADDRESSES.KKIKDA_NFT as Address,
    abi: OWNABLE_ABI,
    functionName: "owner",
    query: { enabled: isConnected && !!address },
  });

  const hasRole = (roleQuery.data as boolean | undefined) ?? false;
  const owner = ownerQuery.data as Address | undefined;
  const isOwner = !!(
    address &&
    owner &&
    address.toLowerCase() === owner.toLowerCase()
  );

  return {
    isAdmin: hasRole || isOwner,
    isLoading: roleQuery.isLoading || ownerQuery.isLoading,
    isConnected,
    address,
  };
}
