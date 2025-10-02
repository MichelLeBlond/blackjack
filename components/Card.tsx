
import React from 'react';
import type { Suit, Rank } from '../types';
import { Suit as SuitEnum } from '../types';

interface CardProps {
  suit: Suit;
  rank: Rank;
  isFaceDown?: boolean;
}

export const CardComponent: React.FC<CardProps> = ({ suit, rank, isFaceDown = false }) => {
  const suitColor = (suit === SuitEnum.Hearts || suit === SuitEnum.Diamonds) ? 'text-red-500' : 'text-black';

  if (isFaceDown) {
    return (
      <div className="w-24 h-36 bg-blue-500 rounded-lg shadow-md border-2 border-white flex items-center justify-center transition-all duration-300 transform hover:scale-105">
        <div className="w-20 h-32 bg-blue-700 rounded-md grid grid-cols-2 gap-1 p-1">
            <div className="bg-blue-500 rounded-sm"></div>
            <div className="bg-blue-500 rounded-sm"></div>
            <div className="bg-blue-500 rounded-sm"></div>
            <div className="bg-blue-500 rounded-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-24 h-36 bg-white rounded-lg shadow-md border border-gray-200 p-2 flex flex-col justify-between transition-all duration-300 transform hover:scale-105">
      <div className={`text-left ${suitColor}`}>
        <div className="font-bold text-xl">{rank}</div>
        <div className="text-lg">{suit}</div>
      </div>
      <div className={`text-right ${suitColor} transform rotate-180`}>
        <div className="font-bold text-xl">{rank}</div>
        <div className="text-lg">{suit}</div>
      </div>
    </div>
  );
};
