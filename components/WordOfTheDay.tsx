import React, { useEffect, useState } from 'react';

type Challenge = {
  id: number;
  word: string;
  definition: string;
  date: string;
  type: 'deviner' | 'utiliser';
  solution?: string;
};

const WordOfTheDay: React.FC = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/daily-challenge')
      .then(res => res.json())
      .then(setChallenge)
      .catch(() => setChallenge(null));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;
    fetch('/api/daily-challenge/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: challenge.id, answer: userInput }),
    })
      .then(res => res.json())
      .then(data => setFeedback(data.feedback))
      .catch(() => setFeedback("Erreur lors de la soumission."));
  };

  if (!challenge) {
    return <div className="p-4">Chargement du défi du jour...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg max-w-xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700 dark:text-cyan-300">Défi du jour</h2>
      <div className="mb-4">
        <span className="font-semibold">Mot à deviner&nbsp;:</span>
        <span className="ml-2 text-lg italic">{challenge.type === 'deviner' ? '???' : challenge.word}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Définition&nbsp;:</span>
        <span className="ml-2">{challenge.definition}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            {challenge.type === 'deviner'
              ? "Votre proposition pour le mot mystère"
              : "Proposez une phrase avec ce mot"}
          </span>
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            className="w-full px-4 py-2 rounded border border-slate-300 mt-2"
            required
            aria-label="Votre réponse"
          />
        </label>
        <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
          Envoyer
        </button>
      </form>
      {feedback && (
        <div className="mt-4 text-cyan-700 dark:text-cyan-300 font-semibold">{feedback}</div>
      )}
    </div>
  );
};

export default WordOfTheDay;