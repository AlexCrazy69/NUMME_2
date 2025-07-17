import React, { useState, useCallback, useMemo } from 'react';
import { View } from '../types';
import { useDictionary } from '../hooks/useDictionary';
import { ChevronLeft, RefreshCw } from './icons';

interface FillInTheBlankGameProps {
  setView: (view: View) => void;
}

interface GameData {
  numeeSentence: string;
  frenchSentenceGapped: string;
  answer: string;
}

const FillInTheBlankGame: React.FC<FillInTheBlankGameProps> = ({ setView }) => {
  const dictionary = useDictionary();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);

  const validEntries = useMemo(() => 
    dictionary.filter(entry => entry.examples && entry.examples.length > 0 && entry.examples[0].french && entry.examples[0].french.split(' ').length > 3),
    [dictionary]
  );
  
  const generateNewRound = useCallback(() => {
    if (validEntries.length === 0) {
        setGameState('finished');
        return;
    };

    let foundSuitableRound = false;
    let attempts = 0;
    while(!foundSuitableRound && attempts < 20) {
        const entry = validEntries[Math.floor(Math.random() * validEntries.length)];
        const example = entry.examples[0];
        const words = example.french.split(' ');
        
        // Find a word to hide that is not too short
        let wordToHide = '';
        let wordIndex = -1;
        let wordAttempts = 0;
        while(wordToHide.length < 4 && wordAttempts < 10) {
          wordIndex = Math.floor(Math.random() * words.length);
          wordToHide = words[wordIndex].replace(/[.,!?]/g, '');
          wordAttempts++;
        }
        
        if (wordToHide) {
            const gappedWords = [...words];
            gappedWords[wordIndex] = '_____';

            setGameData({
              numeeSentence: example.numee,
              frenchSentenceGapped: gappedWords.join(' '),
              answer: wordToHide,
            });
            setUserAnswer('');
            setFeedback(null);
            foundSuitableRound = true;
        }
        attempts++;
    }

    if (!foundSuitableRound) {
        setGameState('finished');
    }
  }, [validEntries]);

  const startGame = () => {
    setScore(0);
    setRounds(0);
    setGameState('playing');
    generateNewRound();
  };

  const checkAnswer = () => {
    if (!gameData) return;
    const isCorrect = userAnswer.trim().toLowerCase() === gameData.answer.toLowerCase();
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const nextRound = () => {
    setRounds(r => r + 1);
    if(rounds >= 9) {
        setGameState('finished');
    } else {
        generateNewRound();
    }
  }

  if (gameState === 'idle') {
    return (
       <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl">
            <button onClick={() => setView('games')} className="absolute top-4 left-4 flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                <ChevronLeft className="w-4 h-4"/> Retour aux jeux
            </button>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Complétez la Phrase</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Lisez la phrase en Numèè et retrouvez le mot manquant dans sa traduction française.</p>
            <button
                onClick={startGame}
                className="mt-8 px-8 py-3 bg-cyan-500 text-white font-bold rounded-full text-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Commencer à jouer
            </button>
        </div>
    );
  }
  
  if (gameState === 'finished') {
    return <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mt-4">Jeu terminé !</h2>
        <p className="text-5xl font-bold my-4 text-cyan-500">{score} / 10</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button onClick={startGame} className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2">
                <RefreshCw /> Rejouer
            </button>
            <button onClick={() => setView('games')} className="px-6 py-3 bg-slate-500 text-white font-bold rounded-full hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                <ChevronLeft /> Retour aux jeux
            </button>
        </div>
    </div>;
  }

  return (
    <div className="p-4 sm:p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <button onClick={() => setView('games')} className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                <ChevronLeft className="w-4 h-4"/> Abandonner
            </button>
             <p className="font-bold text-cyan-500">Score: {score}</p>
        </div>
        
        <div className="space-y-4">
            <p className="text-lg text-slate-500 dark:text-slate-400">Phrase en Numèè :</p>
            <p className="text-2xl font-bold text-center italic text-slate-800 dark:text-slate-100">"{gameData?.numeeSentence}"</p>
        </div>

        <div className="space-y-4">
            <p className="text-lg text-slate-500 dark:text-slate-400">Complétez la traduction :</p>
            <p className="text-2xl text-center italic text-slate-700 dark:text-slate-300">"{gameData?.frenchSentenceGapped}"</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            <input 
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
                placeholder="Votre réponse..."
                disabled={!!feedback}
                className="flex-grow w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
            {!feedback ? (
                 <button onClick={checkAnswer} className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors">Vérifier</button>
            ): (
                 <button onClick={nextRound} className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors">
                    {rounds >= 9 ? "Terminer" : "Suivant"}
                 </button>
            )}
        </div>

        {feedback && (
             <div className={`p-4 rounded-lg text-white font-bold text-center ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                {feedback === 'correct' ? 'Correct !' : `Incorrect. La réponse était : "${gameData?.answer}"`}
            </div>
        )}
    </div>
  );
};

export default FillInTheBlankGame;