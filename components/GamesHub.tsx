
import React from 'react';
import { View } from '../types';
import { Puzzle, Type, ChevronRight, Blocks } from './icons';

interface GamesHubProps {
  setView: (view: View) => void;
}

const GameCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => {
  return (
    <div 
      className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col text-center"
      onClick={onClick}
    >
      <div className="mx-auto bg-cyan-100 dark:bg-cyan-900/80 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{title}</h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400 flex-grow">{description}</p>
      <div className="mt-6">
        <span className="font-bold text-cyan-500 flex items-center justify-center gap-2">
          Jouer maintenant <ChevronRight className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
};

const GamesHub: React.FC<GamesHubProps> = ({ setView }) => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-3">
          <Puzzle className="w-10 h-10 text-cyan-500" />
          Centre de Jeux
        </h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Apprenez en vous amusant avec nos jeux interactifs.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <GameCard
          title="Jeu de Mémoire"
          description="Associez les mots en Numèè à leur traduction française. Testez votre mémoire et enrichissez votre vocabulaire."
          icon={<Puzzle className="w-12 h-12 text-cyan-500" />}
          onClick={() => setView('memory-game')}
        />
        <GameCard
          title="Complétez la Phrase"
          description="Un mot a été retiré de la phrase traduite. Serez-vous capable de le retrouver ? Idéal pour apprendre en contexte."
          icon={<Type className="w-12 h-12 text-cyan-500" />}
          onClick={() => setView('fill-in-the-blank')}
        />
         <GameCard
          title="Mots Numèè"
          description="Formez des mots à partir de lettres piochées. Jouez contre un ami et montrez qui maîtrise le mieux le dictionnaire !"
          icon={<Blocks className="w-12 h-12 text-cyan-500" />}
          onClick={() => setView('scrabble-game')}
        />
        <GameCard
          title="7 familles Numèè"
          description="Rassemble les cartes d’une même famille (animaux, fruits, objets, nature) pour gagner !"
          icon={<span className="text-3xl">👨‍👩‍👧‍👦</span>}
          onClick={() => setView('seven-families-game')}
        />
        <GameCard
          title="Memory Images"
          description="Retrouvez les paires d’images (objets, animaux, fruits) pour entraîner votre mémoire visuelle et votre vocabulaire."
          icon={<img src="/img/banane.png" alt="Memory" className="w-12 h-12" />}
          onClick={() => setView('memory-image-game')}
        />
        {/* Jeux en ligne et apprentissage visuel */}
        <div className="col-span-full flex flex-col gap-6 mt-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-2xl shadow text-center">
            <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">Jeux en ligne (prochainement)</h3>
            <p className="text-yellow-800 dark:text-yellow-200 mb-2">Affrontez d’autres utilisateurs en temps réel : quiz, 7 familles, jeux de couleurs…</p>
            <button
              className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-full opacity-60 cursor-not-allowed"
              disabled
            >
              Bientôt disponible
            </button>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/30 p-6 rounded-2xl shadow text-center">
            <h3 className="text-2xl font-bold text-pink-700 dark:text-pink-300 mb-2">Apprentissage avec images & vignettes</h3>
            <p className="text-pink-800 dark:text-pink-200 mb-2">Découvrez des jeux visuels pour apprendre en s’amusant : couleurs, objets, animaux…</p>
            <button
              className="px-6 py-3 bg-pink-500 text-white font-bold rounded-full opacity-60 cursor-not-allowed"
              disabled
            >
              Bientôt disponible
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesHub;