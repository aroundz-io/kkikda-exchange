'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Address } from 'viem';
import { KKD_TOKEN_ABI, RWA_TOKEN_ABI } from '@/lib/web3/contracts';

const ERC20_ABI = KKD_TOKEN_ABI;

// ---------------------------------------------------------------------------
// Generic read hook -- call any view/pure function on an ERC-20 contract
// ---------------------------------------------------------------------------
export function useTokenRead<
  TFunctionName extends (typeof ERC20_ABI)[number] extends { type: 'function'; name: infer N } ? N : never,
>(
  tokenAddress: Address | undefined,
  functionName: TFunctionName,
  args?: readonly unknown[],
) {
  const result = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: functionName as 'name',
    args: args as never,
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

// ---------------------------------------------------------------------------
// Balance hook
// ---------------------------------------------------------------------------
export function useTokenBalance(
  tokenAddress: Address | undefined,
  userAddress: Address | undefined,
) {
  const result = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!userAddress,
    },
  });

  return {
    balance: result.data as bigint | undefined,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

// ---------------------------------------------------------------------------
// Mint hook (admin)
// ---------------------------------------------------------------------------
export function useTokenMint(tokenAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mint = (to: Address, amount: bigint) => {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'mint',
      args: [to, amount],
    });
  };

  return { mint, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Burn hook
// ---------------------------------------------------------------------------
export function useTokenBurn(tokenAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const burn = (amount: bigint) => {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'burn',
      args: [amount],
    });
  };

  return { burn, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Pause hook
// ---------------------------------------------------------------------------
export function useTokenPause(tokenAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const pause = () => {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'pause',
    });
  };

  return { pause, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Unpause hook
// ---------------------------------------------------------------------------
export function useTokenUnpause(tokenAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const unpause = () => {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'unpause',
    });
  };

  return { unpause, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Approve hook
// ---------------------------------------------------------------------------
export function useTokenApprove(tokenAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (spender: Address, amount: bigint) => {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Redeem hook (RWA tokens -- uses extended ABI)
// ---------------------------------------------------------------------------
export function useTokenRedeem(tokenAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const redeem = (amount: bigint) => {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: RWA_TOKEN_ABI,
      functionName: 'redeem',
      args: [amount],
    });
  };

  return { redeem, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}
