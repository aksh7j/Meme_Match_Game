import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Gorbagana Testnet Configuration
export const GORBAGANA_RPC_ENDPOINT = 'https://rpc.gorbagana.wtf'; // Placeholder - will need actual endpoint
export const GORBAGANA_TESTNET_FALLBACK = clusterApiUrl('devnet'); // Fallback to Solana devnet

export interface GorbaganaWallet {
  publicKey: PublicKey | null;
  connected: boolean;
  balance: number;
  disconnect: () => void;
  sendTransaction: (recipient: string, amount: number) => Promise<string>;
}

class GorbaganaWalletManager {
  private connection: Connection;
  private wallet: any = null;
  
  constructor() {
    // Try Gorbagana first, fallback to Solana devnet
    this.connection = new Connection(GORBAGANA_RPC_ENDPOINT, 'confirmed');
  }

  async connectBackpack(): Promise<GorbaganaWallet> {
    try {
      // Check if Backpack is installed
      const backpack = (window as any).backpack;
      if (!backpack) {
        throw new Error('Backpack wallet not found. Please install Backpack extension.');
      }

      // Connect to Backpack
      const response = await backpack.connect();
      this.wallet = backpack;

      const publicKey = new PublicKey(response.publicKey);
      const balance = await this.getBalance(publicKey);

      return {
        publicKey,
        connected: true,
        balance,
        disconnect: this.disconnect.bind(this),
        sendTransaction: this.sendTransaction.bind(this)
      };
    } catch (error) {
      console.error('Failed to connect to Backpack:', error);
      throw error;
    }
  }

  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL/GOR
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async sendTransaction(recipient: string, amount: number): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      // This would be implemented with actual Gorbagana transaction logic
      // For now, simulate transaction
      const signature = `gorbagana_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In real implementation, construct and send actual transaction
      console.log(`Sending ${amount} GOR to ${recipient}`);
      
      return signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  disconnect(): void {
    this.wallet = null;
  }
}

export const gorbaganaWallet = new GorbaganaWalletManager();

// Token costs for game actions
export const TOKEN_COSTS = {
  START_GAME: 10, // GOR tokens to start a game
  CREATE_ROOM: 25, // GOR tokens to create multiplayer room
  JOIN_ROOM: 5,   // GOR tokens to join room
  WINNER_REWARD: 50 // GOR tokens for winning
};