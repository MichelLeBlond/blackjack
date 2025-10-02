
import React from 'react';
import type { Hand as HandType } from '../types';
import { GameState } from '../types';
import { CardComponent } from './Card';

interface HandProps {
  title: string;
  hand: HandType;
  score: number;
  gameState: GameState;
  isDealer: boolean;
}

export const HandComponent: React.FC<HandProps> = ({ title, hand, score, gameState, isDealer }) => {
  const showScore = isDealer ? gameState !== GameState.PLAYER_TURN : true;

  return (
    <div className="my-4">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">{title} - Score: {showScore ? score : '?'}</h2>
      <div className="flex justify-center space-x-[-50px] min-h-[150px] items-center p-4">
        {hand.length === 0 && <div className="w-24 h-36 border-2 border-dashed border-gray-400 rounded-lg"></div>}
        {hand.map((card, index) => {
          const isFaceDown = isDealer && index === 0 && gameState === GameState.PLAYER_TURN;
          return <CardComponent key={`${card.suit}-${card.rank}-${index}`} suit={card.suit} rank={card.rank} isFaceDown={isFaceDown} />;
        })}
      </div>
    </div>
  );
};
