"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { type Address } from "viem";
import {
  PANCAKE_ROUTER,
  PANCAKE_ROUTER_ABI,
  WBNB,
  USDT,
  ADDRESSES,
} from "@/lib/web3/contracts";

const ROUTER = PANCAKE_ROUTER as Address;

/** Quote how many tokens you get for a given input amount along a path. */
export function useSwapQuote(
  amountIn: bigint | undefined,
  path: readonly Address[] | undefined,
) {
  const result = useReadContract({
    address: ROUTER,
    abi: PANCAKE_ROUTER_ABI,
    functionName: "getAmountsOut",
    args: amountIn && path ? [amountIn, path as Address[]] : undefined,
    query: {
      enabled: !!amountIn && !!path && path.length >= 2 && amountIn > BigInt(0),
    },
  });

  const amounts = result.data as readonly bigint[] | undefined;
  return {
    amountOut: amounts ? amounts[amounts.length - 1] : undefined,
    amounts,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
}

/**
 * Swap exact ERC-20 tokens for ERC-20 tokens via PancakeSwap V2.
 * Requires the caller to have approved the router for `tokenAmount` of the
 * input token. Path must be a list of token addresses; for KKDA↔USDT we
 * route through WBNB since direct pairs don't always exist on testnet.
 */
export function useSwapExactTokensForTokens() {
  const { writeContract, data: hash, isPending, isError, error, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const swap = (
    tokenAmount: bigint,
    minOut: bigint,
    path: readonly Address[],
    to: Address,
    deadlineSeconds = 60 * 20,
  ) => {
    const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineSeconds);
    writeContract({
      address: ROUTER,
      abi: PANCAKE_ROUTER_ABI,
      functionName: "swapExactTokensForTokens",
      args: [tokenAmount, minOut, [...path], to, deadline],
    });
  };

  return { swap, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

/** Convenient address constants. */
export const KKDA_ADDRESS = ADDRESSES.KKD_TOKEN as Address;
export const USDT_ADDRESS = USDT as Address;
export const WBNB_ADDRESS = WBNB as Address;
