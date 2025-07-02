import { Server, Socket } from "socket.io";
import { MultiplayerGameState, GameCard } from "../shared/schema";

interface PlayerInfo {
  id: string;
  username: string;
  walletAddress: string;
  score: number;
  completedAt?: number;
}

interface GameRoom {
  id: string;
  hostId: string;
  players: Map<string, PlayerInfo>;
  gameState: MultiplayerGameState;
  maxPlayers: number;
  tokenEntry: number;
  winnerReward: number;
  isStarted: boolean;
  isFinished: boolean;
  timer: number;
  timerInterval?: NodeJS.Timeout;
}

const gameRooms = new Map<string, GameRoom>();
const playerToRoom = new Map<string, string>();

// Create cards for the game
function createGameCards(): GameCard[] {
  const memeTypes = ['pepe', 'wojak', 'doge', 'cheems', 'chad', 'stonks', 'distracted', 'gigachad'];
  const cards: GameCard[] = [];
  
  // Create pairs of cards
  memeTypes.forEach((type, index) => {
    cards.push(
      { id: index * 2, type, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, type, isFlipped: false, isMatched: false }
    );
  });
  
  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  return cards;
}

function generateRoomId(): string {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function startGameTimer(roomId: string, io: Server) {
  const room = gameRooms.get(roomId);
  if (!room) return;

  room.timer = 120; // 2 minutes
  room.timerInterval = setInterval(() => {
    room.timer--;
    
    // Broadcast timer update
    io.to(roomId).emit('timer-update', { timer: room.timer });
    
    // Check if time is up
    if (room.timer <= 0) {
      endGame(roomId, io);
    }
  }, 1000);
}

function endGame(roomId: string, io: Server) {
  const room = gameRooms.get(roomId);
  if (!room) return;

  if (room.timerInterval) {
    clearInterval(room.timerInterval);
  }

  room.isFinished = true;
  
  // Determine winner (highest score, or fastest completion)
  let winner: PlayerInfo | null = null;
  let maxScore = -1;
  let earliestCompletion = Infinity;

  Array.from(room.players.values()).forEach(player => {
    if (player.score > maxScore || 
        (player.score === maxScore && player.completedAt && player.completedAt < earliestCompletion)) {
      winner = player;
      maxScore = player.score;
      if (player.completedAt) {
        earliestCompletion = player.completedAt;
      }
    }
  });

  // Broadcast game end
  io.to(roomId).emit('game-ended', {
    winner: winner ? winner.id : null,
    finalScores: Array.from(room.players.values()),
    reward: room.winnerReward
  });

  // Clean up room after 30 seconds
  setTimeout(() => {
    // Remove players from room mapping
    Array.from(room.players.keys()).forEach(playerId => {
      playerToRoom.delete(playerId);
    });
    gameRooms.delete(roomId);
  }, 30000);
}

export function setupMultiplayerHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Create game room
    socket.on('create-room', (data: { 
      username: string; 
      walletAddress: string; 
      maxPlayers?: number;
      tokenEntry?: number;
    }) => {
      const roomId = generateRoomId();
      const playerInfo: PlayerInfo = {
        id: socket.id,
        username: data.username,
        walletAddress: data.walletAddress,
        score: 0
      };

      const gameRoom: GameRoom = {
        id: roomId,
        hostId: socket.id,
        players: new Map([[socket.id, playerInfo]]),
        gameState: {
          cards: createGameCards(),
          players: { [socket.id]: playerInfo },
          gameStarted: false,
          gameEnded: false,
          timer: 120
        },
        maxPlayers: data.maxPlayers || 2,
        tokenEntry: data.tokenEntry || 5,
        winnerReward: (data.tokenEntry || 5) * 2, // Winner gets double the entry
        isStarted: false,
        isFinished: false,
        timer: 120
      };

      gameRooms.set(roomId, gameRoom);
      playerToRoom.set(socket.id, roomId);
      
      socket.join(roomId);
      socket.emit('room-created', { roomId, gameState: gameRoom.gameState });
    });

    // Join game room
    socket.on('join-room', (data: { 
      roomId: string; 
      username: string; 
      walletAddress: string; 
    }) => {
      const room = gameRooms.get(data.roomId);
      
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      if (room.players.size >= room.maxPlayers) {
        socket.emit('error', { message: 'Room is full' });
        return;
      }

      if (room.isStarted) {
        socket.emit('error', { message: 'Game already started' });
        return;
      }

      const playerInfo: PlayerInfo = {
        id: socket.id,
        username: data.username,
        walletAddress: data.walletAddress,
        score: 0
      };

      room.players.set(socket.id, playerInfo);
      room.gameState.players[socket.id] = playerInfo;
      playerToRoom.set(socket.id, data.roomId);

      socket.join(data.roomId);
      
      // Notify all players in room
      io.to(data.roomId).emit('player-joined', { 
        player: playerInfo,
        gameState: room.gameState 
      });
    });

    // Start game
    socket.on('start-game', () => {
      const roomId = playerToRoom.get(socket.id);
      if (!roomId) return;

      const room = gameRooms.get(roomId);
      if (!room || room.hostId !== socket.id) return;

      room.isStarted = true;
      room.gameState.gameStarted = true;
      
      // Start timer
      startGameTimer(roomId, io);
      
      io.to(roomId).emit('game-started', { gameState: room.gameState });
    });

    // Handle card flip
    socket.on('flip-card', (data: { cardId: number }) => {
      const roomId = playerToRoom.get(socket.id);
      if (!roomId) return;

      const room = gameRooms.get(roomId);
      if (!room || !room.isStarted || room.isFinished) return;

      const card = room.gameState.cards.find(c => c.id === data.cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      card.isFlipped = true;
      
      // Check for matches
      const flippedCards = room.gameState.cards.filter(c => c.isFlipped && !c.isMatched);
      
      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        
        setTimeout(() => {
          if (card1.type === card2.type) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            
            // Award points to player
            const player = room.players.get(socket.id);
            if (player) {
              player.score++;
              room.gameState.players[socket.id].score++;
            }
            
            // Check if game is complete
            const allMatched = room.gameState.cards.every(c => c.isMatched);
            if (allMatched) {
              const player = room.players.get(socket.id);
              if (player) {
                player.completedAt = Date.now();
                room.gameState.players[socket.id].completedAt = Date.now();
              }
              endGame(roomId, io);
              return;
            }
          } else {
            // No match, flip back
            card1.isFlipped = false;
            card2.isFlipped = false;
          }
          
          // Broadcast updated state
          io.to(roomId).emit('game-updated', { gameState: room.gameState });
        }, 1000); // 1 second delay to show the cards
      }
      
      // Broadcast immediate flip
      io.to(roomId).emit('card-flipped', { 
        cardId: data.cardId, 
        gameState: room.gameState 
      });
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      
      const roomId = playerToRoom.get(socket.id);
      if (roomId) {
        const room = gameRooms.get(roomId);
        if (room) {
          room.players.delete(socket.id);
          delete room.gameState.players[socket.id];
          
          // If host left, end the game
          if (room.hostId === socket.id) {
            io.to(roomId).emit('host-left');
            endGame(roomId, io);
          } else {
            // Notify remaining players
            io.to(roomId).emit('player-left', { 
              playerId: socket.id,
              gameState: room.gameState 
            });
          }
        }
        
        playerToRoom.delete(socket.id);
      }
    });

    // Get room list
    socket.on('get-rooms', () => {
      const availableRooms = Array.from(gameRooms.values())
        .filter(room => !room.isStarted && room.players.size < room.maxPlayers)
        .map(room => ({
          id: room.id,
          hostUsername: room.players.get(room.hostId)?.username || 'Unknown',
          playerCount: room.players.size,
          maxPlayers: room.maxPlayers,
          tokenEntry: room.tokenEntry,
          winnerReward: room.winnerReward
        }));
      
      socket.emit('rooms-list', { rooms: availableRooms });
    });
  });
}