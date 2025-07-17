import React from 'react';

interface AlphabetNavProps {
  onLetterClick: (letter: string) => void;
  activeLetter?: string;
}

const AlphabetNav: React.FC<AlphabetNavProps> = ({ onLetterClick, activeLetter }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
      {alphabet.map((letter) => (
        <button
          key={letter}
          onClick={() => onLetterClick(letter)}
          className={`
            w-8 h-8 md:w-9 md:h-9 flex items-center justify-center 
            font-bold text-sm md:text-base rounded-lg transition-all duration-200 
            transform hover:scale-110
            ${
              activeLetter === letter
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-cyan-100 dark:hover:bg-slate-600'
            }
          `}
          aria-label={`Filtrer par la lettre ${letter}`}
          aria-pressed={activeLetter === letter}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default AlphabetNav;
