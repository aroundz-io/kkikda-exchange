'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Address } from 'viem';
import { MARKETPLACE_ABI, ADDRESSES } from '@/lib/web3/contracts';

const MARKETPLACE_ADDRESS = ADDRESSES.MARKETPLACE as Address;

// ---------------------------------------------------------------------------
// Listing info type
// ---------------------------------------------------------------------------
export interface Listing {
  seller: Address;
  nftContract: Address;
  tokenId: bigint;
  price: bigint;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// List item for sale
// ---------------------------------------------------------------------------
export function useListItem() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const listItem = (nftContract: Address, tokenId: bigint, price: bigint) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'listItem',
      args: [nftContract, tokenId, price],
    });
  };

  return { listItem, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Buy listed item (sends BNB as msg.value)
// ---------------------------------------------------------------------------
export function useBuyItem() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buyItem = (nftContract: Address, tokenId: bigint, price: bigint) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'buyItem',
      args: [nftContract, tokenId],
      value: price,
    });
  };

  return { buyItem, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Cancel listing
// ---------------------------------------------------------------------------
export function useCancelListing() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelListing = (nftContract: Address, tokenId: bigint) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'cancelListing',
      args: [nftContract, tokenId],
    });
  };

  return { cancelListing, hash, isPending, isConfirming, isSuccess, isError, error, reset };
}

// ---------------------------------------------------------------------------
// Read listing info
// ---------------------------------------------------------------------------
export function useGetListing(
  nftContract: Address | undefined,
  tokenId: bigint | undefined,
) {
  const result = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getListing',
    args: nftContract && tokenId !== undefined ? [nftContract, tokenId] : undefined,
    query: {
      enabled: !!nftContract && tokenId !== undefined,
    },
  });

  // The contract returns a tuple that viem decodes as an object
  const listing = result.data as Listing | undefined;

  return {
    listing,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
