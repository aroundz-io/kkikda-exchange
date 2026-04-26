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
  PANCAKE_PAIR_ABI,
  PANCAKE_FACTORY_ABI,
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

/**
 * Add liquidity to a PancakeSwap V2 pair. Caller must first approve the
 * router to spend `amountADesired` of tokenA and `amountBDesired` of tokenB.
 * If the pair does not yet exist, calling addLiquidity creates it with the
 * given amounts setting the initial price.
 */
export function useAddLiquidity() {
  const { writeContract, data: hash, isPending, isError, error, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const addLiquidity = (
    tokenA: Address,
    tokenB: Address,
    amountADesired: bigint,
    amountBDesired: bigint,
    to: Address,
    slippage = 0.05, // 5% default — first-seed has no reference price
    deadlineSeconds = 60 * 20,
  ) => {
    const slippageBps = BigInt(Math.floor((1 - slippage) * 10_000));
    const amountAMin = (amountADesired * slippageBps) / BigInt(10_000);
    const amountBMin = (amountBDesired * slippageBps) / BigInt(10_000);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineSeconds);
    writeContract({
      address: ROUTER,
      abi: PANCAKE_ROUTER_ABI,
      functionName: "addLiquidity",
      args: [
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline,
      ],
    });
  };

  return {
    addLiquidity,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    reset,
  };
}

/**
 * Resolve the LP pair contract address for two tokens via the V2 factory.
 * Returns the zero address if the pair does not exist yet.
 */
export function usePairAddress(tokenA: Address | undefined, tokenB: Address | undefined) {
  const factoryQuery = useReadContract({
    address: ROUTER,
    abi: PANCAKE_ROUTER_ABI,
    functionName: "factory",
  });
  const factory = factoryQuery.data as Address | undefined;

  const pairQuery = useReadContract({
    address: factory,
    abi: PANCAKE_FACTORY_ABI,
    functionName: "getPair",
    args: tokenA && tokenB ? [tokenA, tokenB] : undefined,
    query: { enabled: !!factory && !!tokenA && !!tokenB },
  });

  const pair = pairQuery.data as Address | undefined;
  const exists =
    pair !== undefined && pair !== "0x0000000000000000000000000000000000000000";

  return {
    pair: exists ? pair : undefined,
    exists,
    factory,
    isLoading: factoryQuery.isLoading || pairQuery.isLoading,
    refetch: pairQuery.refetch,
  };
}

/** Read on-chain reserves for an LP pair. */
export function usePairReserves(pair: Address | undefined) {
  const reservesQuery = useReadContract({
    address: pair,
    abi: PANCAKE_PAIR_ABI,
    functionName: "getReserves",
    query: { enabled: !!pair },
  });

  const token0Query = useReadContract({
    address: pair,
    abi: PANCAKE_PAIR_ABI,
    functionName: "token0",
    query: { enabled: !!pair },
  });

  const reserves = reservesQuery.data as
    | readonly [bigint, bigint, number]
    | undefined;

  return {
    reserve0: reserves?.[0],
    reserve1: reserves?.[1],
    blockTimestampLast: reserves?.[2],
    token0: token0Query.data as Address | undefined,
    isLoading: reservesQuery.isLoading || token0Query.isLoading,
    refetch: () => {
      reservesQuery.refetch();
      token0Query.refetch();
    },
  };
}

/** Convenient address constants. */
export const KKDA_ADDRESS = ADDRESSES.KKD_TOKEN as Address;
export const USDT_ADDRESS = USDT as Address;
export const WBNB_ADDRESS = WBNB as Address;
