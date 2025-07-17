
import React, { useState, useEffect, useCallback } from 'react';
import { generateMemoryGameWords } from '../services/gameService';
import { MemoryGameWordPair, View } from '../types';
import { RefreshCw, Loader, ChevronLeft, Smile, BrainCircuit, Trophy } from './icons';
import { playFlipSound } from '../services/soundService';

interface Card {
  id: number;
  content: string;
  type: 'numee' | 'french';
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  setView: (view: View) => void;
}

type Difficulty = 'Facile' | 'Moyen' | 'Difficile';

const DIFFICULTY_CONFIG = {
  'Facile': { pairs: 6, grid: 'grid-cols-4', size: 'text-xl md:text-2xl' },
  'Moyen': { pairs: 8, grid: 'grid-cols-4', size: 'text-xl md:text-2xl' },
  'Difficile': { pairs: 10, grid: 'grid-cols-5', size: 'text-lg md:text-xl' },
};


const MemoryGame: React.FC<MemoryGameProps> = ({ setView }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'selecting' | 'loading' | 'playing' | 'finished'>('selecting');
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('Moyen');

  const createGameBoard = useCallback((wordPairs: MemoryGameWordPair[]) => {
    const gameCards: Card[] = [];
    wordPairs.forEach((pair, index) => {
      gameCards.push({ id: index * 2, content: pair.numee, type: 'numee', pairId: index, isFlipped: false, isMatched: false });
      gameCards.push({ id: index * 2 + 1, content: pair.french, type: 'french', pairId: index, isFlipped: false, isMatched: false });
    });
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setGameState('playing');
    setMoves(0);
    setFlippedCards([]);
  }, []);

  const startGame = useCallback(async (level: Difficulty) => {
    setDifficulty(level);
    setGameState('loading');
    const config = DIFFICULTY_CONFIG[level];
    const words = await generateMemoryGameWords(config.pairs);
    createGameBoard(words);
  }, [createGameBoard]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards.find(c => c.id === firstIndex);
      const secondCard = cards.find(c => c.id === secondIndex);

      setMoves(m => m + 1);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setCards(prev => prev.map(card => (card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card)));
          setFlippedCards([]);
        }, 800);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => (flippedCards.includes(card.id) ? { ...card, isFlipped: false } : card)));
          setFlippedCards([]);
        }, 1200);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
        setTimeout(() => setGameState('finished'), 500);
    }
  }, [cards]);

  const handleCardClick = (id: number) => {
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    playFlipSound();
    setCards(prev => prev.map(c => (c.id === id ? { ...c, isFlipped: true } : c)));
    setFlippedCards(prev => [...prev, id]);
  };
  
  if (gameState === 'selecting') {
    return (
       <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl">
            <button onClick={() => setView('games')} className="absolute top-4 left-4 flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                <ChevronLeft className="w-4 h-4"/> Retour aux jeux
            </button>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Jeu de Mémoire</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Choisissez votre niveau de difficulté.</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => startGame('Facile')} className="flex-1 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg"><Smile /> Facile</button>
                <button onClick={() => startGame('Moyen')} className="flex-1 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-lg"><BrainCircuit /> Moyen</button>
                <button onClick={() => startGame('Difficile')} className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-lg"><Trophy /> Difficile</button>
            </div>
        </div>
    );
  }

  if (gameState === 'loading') {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin h-12 w-12 text-cyan-500" /></div>;
  }
  
  if (gameState === 'finished') {
    return <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold text-green-500">Bravo !</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Vous avez terminé le niveau {difficulty} en {moves} coups.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button onClick={() => setGameState('selecting')} className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2">
                 <RefreshCw /> Changer de niveau
            </button>
             <button onClick={() => setView('games')} className="px-6 py-3 bg-slate-500 text-white font-bold rounded-full hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                <ChevronLeft /> Retour aux jeux
            </button>
        </div>
    </div>;
  }

  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
             <button onClick={() => setGameState('selecting')} className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                <ChevronLeft className="w-4 h-4"/> Changer de niveau
            </button>
            <p className="text-center text-xl font-medium text-slate-600 dark:text-slate-300">Coups: {moves}</p>
        </div>
        <div className={`grid ${config.grid} gap-2 md:gap-4 max-w-2xl mx-auto`}>
            {cards.map((card) => (
                <div key={card.id} className="aspect-square perspective-1000" onClick={() => handleCardClick(card.id)}>
                    <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                        <div className="absolute w-full h-full backface-hidden bg-cyan-500 rounded-lg flex items-center justify-center cursor-pointer shadow-lg">
                           <span className="text-white text-3xl font-bold">?</span>
                        </div>
                        <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg flex items-center justify-center shadow-lg text-slate-800
                            ${card.isMatched ? 'bg-green-300 dark:bg-green-700' : 'bg-white dark:bg-slate-300'}`}>
                           <span className={`${config.size} font-bold p-1 text-center`}>{card.content}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <style>{`
            .perspective-1000 { perspective: 1000px; }
            .transform-style-3d { transform-style: preserve-3d; }
            .rotate-y-180 { transform: rotateY(180deg); }
            .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        `}</style>
    </div>
  );
};

export default MemoryGame;
