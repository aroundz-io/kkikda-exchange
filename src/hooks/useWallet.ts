'use client';

import { useEffect, useRef } from 'react';
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { useStore } from '@/stores/useStore';
import { BSC_CHAIN_ID } from '@/lib/web3/contracts';

// ---------------------------------------------------------------------------
// useWalletSync
//
// Bridges wagmi's live wallet state into the app's Zustand store so the rest
// of the UI can read `useStore(s => s.user)` without touching wagmi directly.
//
// Usage: call once in the root layout or in the Navbar component.
//   function RootLayout({ children }) {
//     useWalletSync();
//     return ...
//   }
// ---------------------------------------------------------------------------
export function useWalletSync() {
  const { address, isConnected, isDisconnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Track whether the user was connected at least once in this session.
  // This prevents firing disconnectWallet() on initial page load when
  // wagmi starts in the "disconnected" state.
  const hasBeenConnected = useRef(false);

  const { data: balanceData } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });

  const setUser = useStore((s) => s.setUser);
  const clearUser = useStore((s) => s.clearUser);

  // --- Sync connection state into store ---
  useEffect(() => {
    if (isConnected && address) {
      hasBeenConnected.current = true;

      const formattedBalance = balanceData
        ? parseFloat(formatEther(balanceData.value))
        : 0;

      setUser({
        address,
        balance: formattedBalance,
      });
    }
  }, [isConnected, address, balanceData, setUser]);

  // --- Clear store on disconnect (only if previously connected) ---
  useEffect(() => {
    if (isDisconnected && hasBeenConnected.current) {
      hasBeenConnected.current = false;
      clearUser();
    }
  }, [isDisconnected, clearUser]);

  // --- Auto-switch to BSC if on wrong chain ---
  useEffect(() => {
    if (isConnected && chainId !== BSC_CHAIN_ID) {
      switchChain({ chainId: BSC_CHAIN_ID });
    }
  }, [isConnected, chainId, switchChain]);

  return {
    address,
    isConnected,
    isDisconnected,
    chainId,
    isWrongChain: isConnected && chainId !== BSC_CHAIN_ID,
    balance: balanceData,
  };
}
