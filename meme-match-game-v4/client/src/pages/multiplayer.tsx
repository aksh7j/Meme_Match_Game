import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWallet } from '@/components/WalletProvider';
import { TOKEN_COSTS } from '@/lib/solana';
import { GameCard, MultiplayerGameState } from '../../../shared/schema';
import { useToast } from '@/hooks/use-toast';

interface RoomInfo {
  id: string;
  hostUsername: string;
  playerCount: number;
  maxPlayers: number;
  tokenEntry: number;
  winnerReward: number;
}

export default function Multiplayer() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [gameState, setGameState] = useState<MultiplayerGameState | null>(null);
  const [availableRooms, setAvailableRooms] = useState<RoomInfo[]>([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [gameEndData, setGameEndData] = useState<any>(null);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [tokenEntry, setTokenEntry] = useState(TOKEN_COSTS.JOIN_ROOM);
  
  const { wallet } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (!wallet) return;

    const newSocket = io({
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      setConnected(true);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    // Room management events
    newSocket.on('room-created', (data) => {
      setCurrentRoom(data.roomId);
      setGameState(data.gameState);
      toast({
        title: "Room Created",
        description: `Room ${data.roomId} created successfully!`
      });
    });

    newSocket.on('player-joined', (data) => {
      setGameState(data.gameState);
      toast({
        title: "Player Joined",
        description: `${data.player.username} joined the room`
      });
    });

    newSocket.on('game-started', (data) => {
      setGameState(data.gameState);
      toast({
        title: "Game Started",
        description: "The multiplayer game has begun!"
      });
    });

    newSocket.on('card-flipped', (data) => {
      setGameState(data.gameState);
    });

    newSocket.on('game-updated', (data) => {
      setGameState(data.gameState);
    });

    newSocket.on('timer-update', (data) => {
      if (gameState) {
        setGameState(prev => prev ? { ...prev, timer: data.timer } : null);
      }
    });

    newSocket.on('game-ended', (data) => {
      setGameEndData(data);
      setShowGameEnd(true);
    });

    newSocket.on('rooms-list', (data) => {
      setAvailableRooms(data.rooms);
    });

    newSocket.on('error', (data) => {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive"
      });
    });

    return () => {
      newSocket.close();
    };
  }, [wallet]);

  const createRoom = () => {
    if (!socket || !wallet || !username) return;

    socket.emit('create-room', {
      username,
      walletAddress: wallet.publicKey?.toBase58(),
      maxPlayers,
      tokenEntry
    });
    setShowCreateRoom(false);
  };

  const joinRoom = (roomId: string) => {
    if (!socket || !wallet || !username) return;

    socket.emit('join-room', {
      roomId,
      username,
      walletAddress: wallet.publicKey?.toBase58()
    });
    setShowJoinRoom(false);
  };

  const startGame = () => {
    if (!socket) return;
    socket.emit('start-game');
  };

  const flipCard = (cardId: number) => {
    if (!socket || !gameState?.gameStarted || gameState.gameEnded) return;
    socket.emit('flip-card', { cardId });
  };

  const refreshRooms = () => {
    if (!socket) return;
    socket.emit('get-rooms');
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    setGameState(null);
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMemeEmoji = (type: string) => {
    const memeEmojis: { [key: string]: string } = {
      'pepe': '🐸', 'wojak': '😐', 'doge': '🐕', 'cheems': '🐕‍🦺',
      'chad': '💪', 'stonks': '📈', 'distracted': '👀', 'gigachad': '🗿'
    };
    return memeEmojis[type] || '❓';
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Connect Wallet</CardTitle>
            <CardDescription className="text-center">
              Connect your Backpack wallet to play multiplayer games on Gorbagana testnet
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Connecting...</CardTitle>
            <CardDescription className="text-center">
              Connecting to multiplayer servers...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (currentRoom && gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Game Header */}
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Room: {currentRoom}</h1>
                <p className="text-green-400">
                  Players: {Object.keys(gameState.players).length} | 
                  Timer: {formatTime(gameState.timer)}
                </p>
              </div>
              <div className="flex gap-4">
                {!gameState.gameStarted && Object.keys(gameState.players).length >= 2 && (
                  <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                    Start Game
                  </Button>
                )}
                <Button onClick={leaveRoom} variant="outline">
                  Leave Room
                </Button>
              </div>
            </div>
          </div>

          {/* Players Panel */}
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(gameState.players).map((player) => (
                <div key={player.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{player.username}</p>
                      <p className="text-gray-400 text-sm">
                        {player.walletAddress.slice(0, 8)}...
                      </p>
                    </div>
                    <Badge variant="secondary">
                      Score: {player.score}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Board */}
          {gameState.gameStarted && (
            <div className="bg-black/20 backdrop-blur-md rounded-lg p-6">
              <div className="grid grid-cols-4 gap-4">
                {gameState.cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => flipCard(card.id)}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-4xl cursor-pointer
                      transition-all duration-300 transform hover:scale-105
                      ${card.isFlipped || card.isMatched 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }
                      ${card.isMatched ? 'opacity-60' : ''}
                    `}
                  >
                    {card.isFlipped || card.isMatched ? getMemeEmoji(card.type) : '?'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game End Modal */}
          <Dialog open={showGameEnd} onOpenChange={setShowGameEnd}>
            <DialogContent>
              <DialogTitle>Game Over!</DialogTitle>
              <DialogDescription>
                {gameEndData && (
                  <div className="space-y-4">
                    <p className="text-lg">
                      Winner: {gameEndData.winner ? 
                        gameState.players[gameEndData.winner]?.username : 'None'
                      }
                    </p>
                    <p>Reward: {gameEndData.reward} GOR tokens</p>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Final Scores:</h3>
                      {gameEndData.finalScores.map((player: any) => (
                        <div key={player.id} className="flex justify-between">
                          <span>{player.username}</span>
                          <span>{player.score} matches</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md rounded-lg p-8">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            Multiplayer Meme Match
          </h1>

          {/* Username Input */}
          <div className="mb-6">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="text-center text-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <Button 
              onClick={() => setShowCreateRoom(true)}
              disabled={!username}
              className="bg-green-600 hover:bg-green-700"
            >
              Create Room ({TOKEN_COSTS.CREATE_ROOM} GOR)
            </Button>
            <Button 
              onClick={() => {
                setShowJoinRoom(true);
                refreshRooms();
              }}
              disabled={!username}
              variant="outline"
            >
              Join Room
            </Button>
          </div>

          {/* Available Rooms */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">Available Rooms</h2>
              <Button onClick={refreshRooms} variant="outline" size="sm">
                Refresh
              </Button>
            </div>
            
            {availableRooms.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No rooms available. Create one to start playing!
              </p>
            ) : (
              <div className="grid gap-4">
                {availableRooms.map((room) => (
                  <div key={room.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Room {room.id}</p>
                        <p className="text-gray-400">
                          Host: {room.hostUsername} | 
                          Players: {room.playerCount}/{room.maxPlayers} |
                          Entry: {room.tokenEntry} GOR
                        </p>
                      </div>
                      <Button 
                        onClick={() => joinRoom(room.id)}
                        disabled={!username}
                        size="sm"
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Room Modal */}
        <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
          <DialogContent>
            <DialogTitle>Create Game Room</DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Players</label>
                  <Input
                    type="number"
                    min="2"
                    max="4"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Entry Fee (GOR)</label>
                  <Input
                    type="number"
                    min="1"
                    value={tokenEntry}
                    onChange={(e) => setTokenEntry(parseInt(e.target.value))}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Winner receives: {tokenEntry * maxPlayers} GOR
                </p>
                <Button onClick={createRoom} className="w-full">
                  Create Room
                </Button>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}