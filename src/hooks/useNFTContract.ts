'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Address } from 'viem';
import { KKIKDA_NFT_ABI, ADDRESSES } from '@/lib/web3/contracts';

const NFT_ABI = KKIKDA_NFT_ABI;
const NFT_ADDRESS = ADDRESSES.KKIKDA_NFT as Address;

// ---------------------------------------------------------------------------
// Mint NFT (admin only) -- safeMint(to, uri)
// ---------------------------------------------------------------------------
export function useNFTMint() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mint = (to: Address, uri: string) => {
    writeContract({
      address: NFT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'safeMint',
      args: [to, uri],
    });
  };

  return { mint, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Burn NFT
// ---------------------------------------------------------------------------
export function useNFTBurn() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const burn = (tokenId: bigint) => {
    writeContract({
      address: NFT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'burn',
      args: [tokenId],
    });
  };

  return { burn, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Balance
// ---------------------------------------------------------------------------
export function useNFTBalance(userAddress: Address | undefined) {
  const result = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
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
// Token URI (metadata)
// ---------------------------------------------------------------------------
export function useNFTTokenURI(tokenId: bigint | undefined) {
  const result = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  return {
    uri: result.data as string | undefined,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

// ---------------------------------------------------------------------------
// Owner of token
// ---------------------------------------------------------------------------
export function useNFTOwner(tokenId: bigint | undefined) {
  const result = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  return {
    owner: result.data as Address | undefined,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

// ---------------------------------------------------------------------------
// Total minted
// ---------------------------------------------------------------------------
export function useNFTTotalMinted() {
  const result = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'totalMinted',
  });

  return {
    totalMinted: result.data as bigint | undefined,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

// ---------------------------------------------------------------------------
// Approve (single token or operator)
// ---------------------------------------------------------------------------
export function useNFTApprove() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (to: Address, tokenId: bigint) => {
    writeContract({
      address: NFT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'approve',
      args: [to, tokenId],
    });
  };

  const setApprovalForAll = (operator: Address, approved: boolean) => {
    writeContract({
      address: NFT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'setApprovalForAll',
      args: [operator, approved],
    });
  };

  return {
    approve,
    setApprovalForAll,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    reset,
  };
}
