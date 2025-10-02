
import React, { useState, useEffect, useCallback } from 'react';
import type { Card, Hand, Rank } from './types';
import { Suit, GameState } from './types';
import { HandComponent } from './components/Hand';

// --- Helper Functions ---
const SUITS: Suit[] = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = (): Card[] => {
  return SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank })));
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getCardValue = (rank: Rank): number => {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank, 10);
};

const calculateHandValue = (hand: Hand): number => {
  let value = hand.reduce((sum, card) => sum + getCardValue(card.rank), 0);
  let aces = hand.filter(card => card.rank === 'A').length;

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
};

// --- App Component ---
function App() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Hand>([]);
  const [dealerHand, setDealerHand] = useState<Hand>([]);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [dealerScore, setDealerScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>(GameState.GAME_OVER);
  const [message, setMessage] = useState<string>('Click "New Game" to start!');

  const startGame = useCallback(() => {
    const newDeck = shuffleDeck(createDeck());
    const initialPlayerHand = [newDeck.pop()!, newDeck.pop()!];
    const initialDealerHand = [newDeck.pop()!, newDeck.pop()!];

    setPlayerHand(initialPlayerHand);
    setDealerHand(initialDealerHand);
    setDeck(newDeck);
    
    const initialPlayerScore = calculateHandValue(initialPlayerHand);
    const initialDealerScore = calculateHandValue(initialDealerHand);

    if (initialPlayerScore === 21) {
      if (initialDealerScore === 21) {
        setMessage("Push! Both have Blackjack.");
      } else {
        setMessage("Blackjack! You win!");
      }
      setGameState(GameState.GAME_OVER);
    } else {
      setMessage("Your turn. Hit or Stand?");
      setGameState(GameState.PLAYER_TURN);
    }
  }, []);

  useEffect(() => {
    setPlayerScore(calculateHandValue(playerHand));
  }, [playerHand]);

  useEffect(() => {
    setDealerScore(calculateHandValue(dealerHand));
  }, [dealerHand]);
  
  const handleHit = useCallback(() => {
    if (gameState !== GameState.PLAYER_TURN) return;

    const [newCard, ...remainingDeck] = deck;
    const newPlayerHand = [...playerHand, newCard];
    setPlayerHand(newPlayerHand);
    setDeck(remainingDeck);

    if (calculateHandValue(newPlayerHand) > 21) {
      setMessage("Bust! You lose.");
      setGameState(GameState.GAME_OVER);
    }
  }, [deck, gameState, playerHand]);

  const handleStand = useCallback(() => {
    if (gameState !== GameState.PLAYER_TURN) return;
    setGameState(GameState.DEALER_TURN);
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.DEALER_TURN) {
      const score = calculateHandValue(dealerHand);
      if (score > 21) {
        setMessage("Dealer busts! You win!");
        setGameState(GameState.GAME_OVER);
      } else if (score >= 17) {
        const pScore = calculateHandValue(playerHand);
        if (pScore > score) {
          setMessage("You win!");
        } else if (score > pScore) {
          setMessage("Dealer wins!");
        } else {
          setMessage("Push! It's a tie.");
        }
        setGameState(GameState.GAME_OVER);
      } else {
        const timer = setTimeout(() => {
          const [newCard, ...remainingDeck] = deck;
          setDealerHand(prevHand => [...prevHand, newCard]);
          setDeck(remainingDeck);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, dealerHand, deck]);

  return (
    <div className="bg-green-800 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-4 shadow-text">Blackjack</h1>

        <HandComponent title="Dealer's Hand" hand={dealerHand} score={dealerScore} gameState={gameState} isDealer={true} />

        <div className="my-6 text-center h-20 flex flex-col justify-center items-center">
          <p className="text-2xl font-bold text-yellow-300 transition-opacity duration-300">{message}</p>
          <div className="mt-4 flex space-x-4">
            {gameState === GameState.GAME_OVER && (
              <button onClick={startGame} className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-yellow-400 transition transform hover:scale-105">
                New Game
              </button>
            )}
            {gameState === GameState.PLAYER_TURN && (
              <>
                <button onClick={handleHit} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-green-400 transition transform hover:scale-105">
                  Hit
                </button>
                <button onClick={handleStand} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-red-400 transition transform hover:scale-105">
                  Stand
                </button>
              </>
            )}
          </div>
        </div>

        <HandComponent title="Your Hand" hand={playerHand} score={playerScore} gameState={gameState} isDealer={false} />
      </div>
    </div>
  );
}

export default App;
