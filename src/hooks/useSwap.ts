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

/** Swap exact BNB for tokens via PancakeSwap V2. */
export function useSwapExactBnbForTokens() {
  const { writeContract, data: hash, isPending, isError, error, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const swap = (
    bnbAmount: bigint,
    minOut: bigint,
    tokenOut: Address,
    to: Address,
    deadlineSeconds = 60 * 20,
  ) => {
    const path = [WBNB as Address, tokenOut];
    const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineSeconds);
    writeContract({
      address: ROUTER,
      abi: PANCAKE_ROUTER_ABI,
      functionName: "swapExactETHForTokens",
      args: [minOut, path, to, deadline],
      value: bnbAmount,
    });
  };

  return { swap, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

/** Swap exact tokens for BNB via PancakeSwap V2. Requires prior token approval to the router. */
export function useSwapExactTokensForBnb() {
  const { writeContract, data: hash, isPending, isError, error, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const swap = (
    tokenAmount: bigint,
    minOut: bigint,
    tokenIn: Address,
    to: Address,
    deadlineSeconds = 60 * 20,
  ) => {
    const path = [tokenIn, WBNB as Address];
    const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineSeconds);
    writeContract({
      address: ROUTER,
      abi: PANCAKE_ROUTER_ABI,
      functionName: "swapExactTokensForETH",
      args: [tokenAmount, minOut, path, to, deadline],
    });
  };

  return { swap, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

/** Convenient KKDA token address constant. */
export const KKDA_ADDRESS = ADDRESSES.KKD_TOKEN as Address;
