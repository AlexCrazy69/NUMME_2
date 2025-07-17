// Jeu des 7 familles adapté Numèè (animaux, fruits, objets, nature, etc.)
import React, { useState } from 'react';

const FAMILIES = [
  {
    name: "Animaux",
    cards: [
      { fr: "Chien", numee: "kêê" },
      { fr: "Chat", numee: "pwi" },
      { fr: "Oiseau", numee: "kô" },
      { fr: "Poisson", numee: "mwêê" }
    ]
  },
  {
    name: "Fruits",
    cards: [
      { fr: "Banane", numee: "banan" },
      { fr: "Pomme", numee: "pom" },
      { fr: "Mangue", numee: "mang" },
      { fr: "Noix de coco", numee: "koko" }
    ]
  },
  {
    name: "Objets",
    cards: [
      { fr: "Livre", numee: "liv" },
      { fr: "Chaise", numee: "chais" },
      { fr: "Table", numee: "tab" },
      { fr: "Stylo", numee: "stil" }
    ]
  },
  {
    name: "Nature",
    cards: [
      { fr: "Arbre", numee: "arbr" },
      { fr: "Fleur", numee: "flèr" },
      { fr: "Pierre", numee: "piyèr" },
      { fr: "Eau", numee: "wâ" }
    ]
  }
];

function shuffle(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

const SevenFamiliesGame: React.FC = () => {
  const [deck, setDeck] = useState(() =>
    shuffle(FAMILIES.flatMap(fam => fam.cards.map(card => ({ ...card, family: fam.name }))))
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const handleSelect = (idx: number) => {
    if (selected.length === 2 || selected.includes(idx) || found.includes(deck[idx].fr)) return;
    const newSelected = [...selected, idx];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setTimeout(() => {
        const [i1, i2] = newSelected;
        if (deck[i1].family === deck[i2].family && deck[i1].fr !== deck[i2].fr) {
          setFound([...found, deck[i1].fr, deck[i2].fr]);
          setScore(s => s + 1);
        }
        setSelected([]);
      }, 900);
    }
  };

  const resetGame = () => {
    setDeck(shuffle(FAMILIES.flatMap(fam => fam.cards.map(card => ({ ...card, family: fam.name })))));
    setSelected([]);
    setFound([]);
    setScore(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Jeu des 7 familles Numèè</h2>
      <p className="mb-4 text-center text-slate-700 dark:text-slate-300">Retrouvez les paires de la même famille (animaux, fruits, objets, nature) !</p>
      <div className="grid grid-cols-4 gap-4">
        {deck.map((card, idx) => (
          <button
            key={idx}
            className={`rounded-lg shadow-lg h-24 flex flex-col items-center justify-center border-2 text-lg font-bold
              ${selected.includes(idx) || found.includes(card.fr) ? 'bg-cyan-100 dark:bg-cyan-900 border-cyan-500 text-cyan-800 dark:text-cyan-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
            onClick={() => handleSelect(idx)}
            disabled={selected.includes(idx) || found.includes(card.fr)}
          >
            {(selected.includes(idx) || found.includes(card.fr)) ? (
              <>
                <span>{card.fr}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{card.numee}</span>
                <span className="text-xs mt-1">{card.family}</span>
              </>
            ) : (
              <span>?</span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p>Score : {score}</p>
        {found.length === deck.length && (
          <button onClick={resetGame} className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Rejouer</button>
        )}
      </div>
    </div>
  );
};

export default SevenFamiliesGame;