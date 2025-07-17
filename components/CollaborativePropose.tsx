import React, { useState } from 'react';

const CollaborativePropose: React.FC = () => {
  const [step, setStep] = useState<'mot' | 'exemple'>('mot');
  const [mot, setMot] = useState('');
  const [definition, setDefinition] = useState('');
  const [exemple, setExemple] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmitMot = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('exemple');
  };

  const handleSubmitExemple = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/propositions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mot, definition, exemple }),
    })
      .then(res => res.json())
      .then(data => setFeedback(data.message || "Proposition envoyée, merci !"))
      .catch(() => setFeedback("Erreur lors de l'envoi de la proposition."));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg max-w-xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700 dark:text-cyan-300">Proposer un mot ou un exemple</h2>
      {step === 'mot' && (
        <form onSubmit={handleSubmitMot} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Mot proposé</span>
            <input
              type="text"
              value={mot}
              onChange={e => setMot(e.target.value)}
              className="w-full px-4 py-2 rounded border border-slate-300 mt-2"
              required
              aria-label="Mot proposé"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Définition</span>
            <input
              type="text"
              value={definition}
              onChange={e => setDefinition(e.target.value)}
              className="w-full px-4 py-2 rounded border border-slate-300 mt-2"
              required
              aria-label="Définition proposée"
            />
          </label>
          <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
            Proposer un exemple
          </button>
        </form>
      )}
      {step === 'exemple' && (
        <form onSubmit={handleSubmitExemple} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Exemple d'utilisation</span>
            <input
              type="text"
              value={exemple}
              onChange={e => setExemple(e.target.value)}
              className="w-full px-4 py-2 rounded border border-slate-300 mt-2"
              required
              aria-label="Exemple proposé"
            />
          </label>
          <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
            Envoyer la proposition
          </button>
        </form>
      )}
      {feedback && (
        <div className="mt-4 text-cyan-700 dark:text-cyan-300 font-semibold">{feedback}</div>
      )}
    </div>
  );
};

export default CollaborativePropose;