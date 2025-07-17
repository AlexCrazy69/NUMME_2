// Memory avec images - version simple, extensible
import React, { useState } from 'react';

const images = [
  { src: '/img/banane.png', label: 'Banane' },
  { src: '/img/pomme.png', label: 'Pomme' },
  { src: '/img/chien.png', label: 'Chien' },
  { src: '/img/chat.png', label: 'Chat' },
  { src: '/img/livre.png', label: 'Livre' },
  { src: '/img/soleil.png', label: 'Soleil' }
];

function shuffle(array: any[]) {
  return array
    .concat(array)
    .sort(() => Math.random() - 0.5)
    .map((item, i) => ({ ...item, id: i }));
}

const MemoryImageGame: React.FC = () => {
  const [cards, setCards] = useState(() => shuffle(images));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);

  const handleFlip = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setTimeout(() => {
        const [i1, i2] = newFlipped;
        if (cards[i1].label === cards[i2].label) {
          setMatched([...matched, i1, i2]);
        }
        setFlipped([]);
        setTurns(t => t + 1);
      }, 800);
    }
  };

  const resetGame = () => {
    setCards(shuffle(images));
    setFlipped([]);
    setMatched([]);
    setTurns(0);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Memory Images</h2>
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`relative w-28 h-32 rounded-lg shadow-lg cursor-pointer flex items-center justify-center bg-white dark:bg-slate-800 border-2 ${flipped.includes(idx) || matched.includes(idx) ? 'border-green-500' : 'border-slate-200 dark:border-slate-700'}`}
            onClick={() => handleFlip(idx)}
          >
            {(flipped.includes(idx) || matched.includes(idx)) ? (
              <img src={card.src} alt={card.label} className="w-20 h-20 object-contain" />
            ) : (
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p>Tours : {turns}</p>
        {matched.length === cards.length && (
          <button onClick={resetGame} className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Rejouer</button>
        )}
      </div>
    </div>
  );
};

export default MemoryImageGame;