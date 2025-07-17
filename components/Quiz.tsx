
import React, { useState, useCallback } from 'react';
import { generateQuiz } from '../services/gameService';
import { QuizQuestion, View } from '../types';
import { Award, RefreshCw, Loader, ChevronRight } from './icons';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';


interface QuizProps {
  setView: (view: View) => void;
}

const Quiz: React.FC<QuizProps> = ({ setView }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished' | 'idle'>('idle');

  const fetchQuestions = useCallback(async () => {
    setGameState('loading');
    const data = await generateQuiz(10); // 10 questions pour le mode entraînement
    setQuestions(data);
    setGameState('playing');
    // Reset state for new game
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, []);
  
  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1);
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setGameState('finished');
    }
  };
  
  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white/80 dark:bg-slate-700/80 hover:bg-cyan-100 dark:hover:bg-slate-600';
    }
    const isCorrect = option === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      return 'bg-green-500 text-white';
    }
    if (option === selectedAnswer && !isCorrect) {
      return 'bg-red-500 text-white';
    }
    return 'bg-white/60 dark:bg-slate-700/60 opacity-60';
  };

  if (gameState === 'idle') {
    return (
       <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Mode Entraînement</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Entraînez-vous avec ce quiz rapide. Pas de pression, juste pour le plaisir d'apprendre !</p>
            <button
                onClick={fetchQuestions}
                className="mt-8 px-8 py-3 bg-cyan-500 text-white font-bold rounded-full text-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Commencer l'entraînement
            </button>
        </div>
    );
  }

  if (gameState === 'loading') {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin h-12 w-12 text-cyan-500" /></div>;
  }
  
  if (gameState === 'finished') {
    return <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mt-4">Entraînement terminé !</h2>
        <p className="text-5xl font-bold my-4 text-cyan-500">{score} / {questions.length}</p>
        
        <p className="text-lg text-slate-500 dark:text-slate-400">
            Continuez comme ça ! Plus vous vous entraînez, plus vous êtes prêt pour la certification.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button onClick={fetchQuestions} className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2">
                <RefreshCw /> Rejouer
            </button>
            <button onClick={() => setView('certification')} className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-full hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
                Tenter une Certification <ChevronRight />
            </button>
        </div>
    </div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="p-4 sm:p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1}/{questions.length}</h2>
            <p className="font-bold text-cyan-500">Score: {score}</p>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6">
            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>

        <p className="text-center text-3xl font-bold my-8 text-slate-800 dark:text-slate-100">"{currentQuestion.question}"</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map(option => (
                <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={`p-4 rounded-lg text-lg font-semibold transition-all duration-200 border-2 border-transparent ${getButtonClass(option)}`}
                >
                    {option}
                </button>
            ))}
        </div>

        {isAnswered && (
             <button
                onClick={handleNextQuestion}
                className="w-full mt-8 py-3 bg-cyan-500 text-white font-bold rounded-full text-lg hover:bg-cyan-600 transition-colors"
            >
                {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
            </button>
        )}
    </div>
  );
};

export default Quiz;
