import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FaucetState {
  balance: string;
  amountPerRequest: string;
  rateLimit: string;
  walletAddress: string;
  isConnected: boolean;
  isLoading: boolean;
}

export default function GorbaganaFaucet() {
  const [faucetState, setFaucetState] = useState<FaucetState>({
    balance: '26158.86',
    amountPerRequest: '1-100',
    rateLimit: '1 per 24 hours',
    walletAddress: '',
    isConnected: false,
    isLoading: false
  });

  const handleWalletConnect = async () => {
    setFaucetState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate wallet connection
    setTimeout(() => {
      setFaucetState(prev => ({
        ...prev,
        isLoading: false,
        isConnected: true,
        walletAddress: '0x742d35Cc6634C0532925a3b8D598bC76DC7c7cC5'
      }));
    }, 1500);
  };

  const handleClaimTokens = async () => {
    if (!faucetState.walletAddress) return;
    
    setFaucetState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate token claim
    setTimeout(() => {
      const randomAmount = Math.floor(Math.random() * 100) + 1;
      setFaucetState(prev => ({
        ...prev,
        isLoading: false,
        balance: (parseFloat(prev.balance) - randomAmount).toFixed(2)
      }));
    }, 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg text-white max-w-md mx-auto p-6">
      <div className="text-center pb-4">
        <h2 className="text-2xl font-bold text-green-400 mb-2">
          Gorbagana Faucet
        </h2>
        <p className="text-gray-400 text-sm">
          Get free GOR tokens for testing
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Faucet Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Faucet Balance:</span>
            <span className="text-green-400 font-semibold">{faucetState.balance} GOR</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Amount per request:</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white">{faucetState.amountPerRequest} GOR</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Rate limit:</span>
            <span className="text-white">{faucetState.rateLimit}</span>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="space-y-3">
          <h3 className="text-green-400 font-medium">Wallet Address</h3>
          
          {faucetState.isConnected ? (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <p className="text-green-400 text-sm break-all">{faucetState.walletAddress}</p>
            </div>
          ) : (
            <Input
              value={faucetState.walletAddress}
              onChange={(e) => setFaucetState(prev => ({ ...prev, walletAddress: e.target.value }))}
              placeholder="Enter your Gorbagana wallet address"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-400"
            />
          )}
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          {!faucetState.isConnected ? (
            <Button
              onClick={handleWalletConnect}
              disabled={faucetState.isLoading || !faucetState.walletAddress}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-all duration-200"
            >
              {faucetState.isLoading ? 'CONNECTING...' : 'LOGIN WITH X'}
            </Button>
          ) : (
            <Button
              onClick={handleClaimTokens}
              disabled={faucetState.isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-all duration-200"
            >
              {faucetState.isLoading ? 'CLAIMING TOKENS...' : 'CLAIM GOR TOKENS'}
            </Button>
          )}
          
          {faucetState.isConnected && (
            <Button
              onClick={() => setFaucetState(prev => ({ ...prev, isConnected: false, walletAddress: '' }))}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Disconnect Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}