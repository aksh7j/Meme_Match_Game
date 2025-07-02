import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GorbaganaWallet, gorbaganaWallet } from '@/lib/solana';

interface WalletContextType {
  wallet: GorbaganaWallet | null;
  connecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connecting: false,
  error: null,
  connectWallet: async () => {},
  disconnectWallet: () => {}
});

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<GorbaganaWallet | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setConnecting(true);
    setError(null);
    
    try {
      const connectedWallet = await gorbaganaWallet.connectBackpack();
      setWallet(connectedWallet);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    gorbaganaWallet.disconnect();
    setWallet(null);
    setError(null);
  };

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if Backpack is already connected
        const backpack = (window as any).backpack;
        if (backpack && backpack.isConnected) {
          await connectWallet();
        }
      } catch (err) {
        console.log('No existing wallet connection found');
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <WalletContext.Provider value={{
      wallet,
      connecting,
      error,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
}