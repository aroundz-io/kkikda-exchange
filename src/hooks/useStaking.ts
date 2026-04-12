'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Address, formatEther } from 'viem';
import { STAKING_ABI, ADDRESSES } from '@/lib/web3/contracts';

const STAKING_ADDRESS = ADDRESSES.STAKING as Address;

// ---------------------------------------------------------------------------
// Stake KKD tokens
// ---------------------------------------------------------------------------
export function useStake() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stake = (amount: bigint) => {
    writeContract({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [amount],
    });
  };

  return { stake, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Unstake KKD tokens
// ---------------------------------------------------------------------------
export function useUnstake() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const unstake = (amount: bigint) => {
    writeContract({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [amount],
    });
  };

  return { unstake, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Claim staking rewards
// ---------------------------------------------------------------------------
export function useClaimRewards() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimRewards = () => {
    writeContract({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'claimRewards',
    });
  };

  return { claimRewards, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Pending rewards (read)
// ---------------------------------------------------------------------------
export function usePendingRewards(userAddress: Address | undefined) {
  const result = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'pendingRewards',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const raw = result.data as bigint | undefined;

  return {
    rewards: raw,
    rewardsFormatted: raw !== undefined ? formatEther(raw) : undefined,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

// ---------------------------------------------------------------------------
// Staked balance (read)
// ---------------------------------------------------------------------------
export function useStakedBalance(userAddress: Address | undefined) {
  const result = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'stakedBalance',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const raw = result.data as bigint | undefined;

  return {
    staked: raw,
    stakedFormatted: raw !== undefined ? formatEther(raw) : undefined,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

// ---------------------------------------------------------------------------
// Staking info (aggregated reads: totalStaked, apyRate, minStake, lockPeriod)
// ---------------------------------------------------------------------------
export function useStakingInfo() {
  const totalStakedResult = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'totalStaked',
  });

  const apyRateResult = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'apy',
  });

  const minStakeResult = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'minStakeAmount',
  });

  const lockPeriodResult = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'lockPeriod',
  });

  const totalStaked = totalStakedResult.data as bigint | undefined;
  const apyRate = apyRateResult.data as bigint | undefined;
  const minStake = minStakeResult.data as bigint | undefined;
  const lockPeriod = lockPeriodResult.data as bigint | undefined;

  const isLoading =
    totalStakedResult.isLoading ||
    apyRateResult.isLoading ||
    minStakeResult.isLoading ||
    lockPeriodResult.isLoading;

  const isError =
    totalStakedResult.isError ||
    apyRateResult.isError ||
    minStakeResult.isError ||
    lockPeriodResult.isError;

  const refetch = () => {
    totalStakedResult.refetch();
    apyRateResult.refetch();
    minStakeResult.refetch();
    lockPeriodResult.refetch();
  };

  return {
    totalStaked,
    totalStakedFormatted: totalStaked !== undefined ? formatEther(totalStaked) : undefined,
    apyRate,
    minStake,
    minStakeFormatted: minStake !== undefined ? formatEther(minStake) : undefined,
    lockPeriod,
    lockPeriodSeconds: lockPeriod !== undefined ? Number(lockPeriod) : undefined,
    isLoading,
    isError,
    refetch,
  };
}
