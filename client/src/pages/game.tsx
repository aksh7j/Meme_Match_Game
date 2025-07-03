import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useWallet } from '@/components/WalletProvider';
import GorbaganaFaucet from '@/components/GorbaganaFaucet';

interface Card {
  id: number;
  type: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameState {
  isPlaying: boolean;
  timer: number;
  matches: number;
  flippedCards: Card[];
  cards: Card[];
  startTime: number | null;
  showWinModal: boolean;
  showLoseModal: boolean;
}

const CARD_TYPES = [
  'pepe', 'wojak', 'doge', 'cheems', 
  'chad', 'stonks', 'distracted', 'gigachad'
];

const CARD_COLORS = [
  'from-purple-500 to-purple-600',
  'from-blue-500 to-blue-600', 
  'from-teal-500 to-teal-600',
  'from-yellow-500 to-yellow-600',
  'from-red-500 to-red-600',
  'from-green-500 to-green-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600'
];

const MEME_EMOJIS = {
  pepe: '🐸',
  wojak: '😢', 
  doge: '🐕',
  cheems: '🐶',
  chad: '💪',
  stonks: '📈',
  distracted: '👀',
  gigachad: '🗿'
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createCards(): Card[] {
  const cardPairs = [...CARD_TYPES, ...CARD_TYPES];
  const shuffled = shuffleArray(cardPairs);
  
  return shuffled.map((type, index) => ({
    id: index,
    type,
    isFlipped: false,
    isMatched: false
  }));
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    timer: 60,
    matches: 0,
    flippedCards: [],
    cards: createCards(),
    startTime: null,
    showWinModal: false,
    showLoseModal: false
  });

  const resetGame = useCallback(() => {
    setGameState({
      isPlaying: false,
      timer: 60,
      matches: 0,
      flippedCards: [],
      cards: createCards(),
      startTime: null,
      showWinModal: false,
      showLoseModal: false
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      timer: 60,
      matches: 0,
      flippedCards: [],
      cards: createCards(),
      startTime: Date.now(),
      showWinModal: false,
      showLoseModal: false
    }));
  }, []);

  const flipCard = useCallback((cardId: number) => {
    if (!gameState.isPlaying || gameState.flippedCards.length >= 2) return;

    setGameState(prev => {
      const card = prev.cards.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prev;

      const updatedCards = prev.cards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      );

      const newFlippedCards = [...prev.flippedCards, { ...card, isFlipped: true }];

      return {
        ...prev,
        cards: updatedCards,
        flippedCards: newFlippedCards
      };
    });
  }, [gameState.isPlaying, gameState.flippedCards.length]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (gameState.flippedCards.length === 2) {
      const [card1, card2] = gameState.flippedCards;
      
      if (card1.type === card2.type) {
        // Match found
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            cards: prev.cards.map(c => 
              c.id === card1.id || c.id === card2.id 
                ? { ...c, isMatched: true }
                : c
            ),
            flippedCards: [],
            matches: prev.matches + 1
          }));
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            cards: prev.cards.map(c => 
              c.id === card1.id || c.id === card2.id 
                ? { ...c, isFlipped: false }
                : c
            ),
            flippedCards: []
          }));
        }, 1000);
      }
    }
  }, [gameState.flippedCards]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && gameState.timer > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timer: prev.timer - 1
        }));
      }, 1000);
    } else if (gameState.timer === 0 && gameState.isPlaying) {
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        showLoseModal: true
      }));
    }

    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.timer]);

  // Check for win condition
  useEffect(() => {
    if (gameState.matches === 8 && gameState.isPlaying) {
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        showWinModal: true
      }));
    }
  }, [gameState.matches, gameState.isPlaying]);

  const completionTime = gameState.startTime 
    ? ((Date.now() - gameState.startTime) / 1000).toFixed(1)
    : '0';

  const progressPercent = Math.round((gameState.matches / 8) * 100);

  return (
    <div className="gradient-bg min-h-screen">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            MEME MATCH
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl font-medium mb-6">
            Gorbagana Memory Game
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">Memory Challenge</span>
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium">Time Attack</span>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium">Match Pairs</span>
          </div>
        </div>

        {/* Game Controls */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Timer Display */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{gameState.timer}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Seconds</div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 hidden md:block"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{gameState.matches}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Matches</div>
              </div>
            </div>

            {/* Game Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={startGame}
                disabled={gameState.isPlaying}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gameState.isPlaying ? 'Playing...' : 'Start Game'}
              </Button>
              <Button 
                onClick={resetGame}
                disabled={!gameState.isPlaying}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm mb-3">
              <span className="font-medium">Progress</span>
              <span className="font-medium">{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="meme-grid">
            {gameState.cards.map((card, index) => (
              <div 
                key={card.id}
                className={`card-flip cursor-pointer transition-transform hover:scale-105 ${card.isFlipped || card.isMatched ? 'card-flipped' : ''}`}
                onClick={() => flipCard(card.id)}
              >
                <div className="card-inner relative w-full aspect-square">
                  {/* Card Front (Hidden) */}
                  <div className="card-front absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-300 dark:border-gray-600">
                    <div className="text-3xl text-gray-400 dark:text-gray-500">?</div>
                  </div>
                  {/* Card Back (Meme Face) */}
                  <div className="card-back absolute inset-0 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                    <div className="text-5xl">
                      {MEME_EMOJIS[card.type as keyof typeof MEME_EMOJIS]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Game Status */}
          <div className="mt-8 text-center">
            <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">
              {!gameState.isPlaying && gameState.matches === 0 
                ? 'Click "Start Game" to begin the challenge!'
                : gameState.isPlaying 
                ? 'Find the matching meme pairs!'
                : 'Game Over!'
              }
            </div>
          </div>
        </div>

        {/* Game Instructions and Faucet Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          
          {/* Instructions */}
          <div className="bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="font-display text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">How to Play</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">1</span>
                <p className="text-gray-700 dark:text-gray-300">Click "Start Game" to begin and activate the 60-second timer</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">2</span>
                <p className="text-gray-700 dark:text-gray-300">Click two cards to flip and reveal the hidden meme faces</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">3</span>
                <p className="text-gray-700 dark:text-gray-300">Match identical memes to keep them permanently revealed</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">4</span>
                <p className="text-gray-700 dark:text-gray-300">Find all 8 pairs before the timer reaches zero to win!</p>
              </div>
            </div>
          </div>

          {/* Gorbagana Faucet */}
          <div className="flex items-center justify-center">
            <GorbaganaFaucet />
          </div>
          
        </div>

      </div>

      {/* Win Modal */}
      <Dialog open={gameState.showWinModal} onOpenChange={() => setGameState(prev => ({ ...prev, showWinModal: false }))}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-w-md">
          <DialogTitle className="sr-only">Game Won</DialogTitle>
          <div className="text-center animate-bounce-in p-6">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">Congratulations!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You successfully matched all the meme pairs!</p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completionTime}s</div>
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">Completion Time</div>
            </div>
            <Button 
              onClick={() => {
                setGameState(prev => ({ ...prev, showWinModal: false }));
                resetGame();
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl w-full"
            >
              Play Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lose Modal */}
      <Dialog open={gameState.showLoseModal} onOpenChange={() => setGameState(prev => ({ ...prev, showLoseModal: false }))}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-w-md">
          <DialogTitle className="sr-only">Game Over</DialogTitle>
          <div className="text-center animate-bounce-in p-6">
            <div className="text-6xl mb-6">⏰</div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">Time's Up!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Don't worry, try again to beat the challenge!</p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{gameState.matches}/8</div>
              <div className="text-red-600 dark:text-red-400 text-sm font-medium">Matches Found</div>
            </div>
            <Button 
              onClick={() => {
                setGameState(prev => ({ ...prev, showLoseModal: false }));
                resetGame();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl w-full"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
