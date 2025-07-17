import React, { useState } from 'react';

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

type CommunityQuiz = {
  id?: number;
  title: string;
  questions: QuizQuestion[];
  author?: string;
};

const CommunityQuiz: React.FC = () => {
  const [step, setStep] = useState<'create' | 'play' | 'done'>('create');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState<QuizQuestion>({ question: '', options: ['', '', '', ''], answer: 0 });
  const [feedback, setFeedback] = useState<string | null>(null);

  // Création d'un quiz
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestions([...questions, currentQ]);
    setCurrentQ({ question: '', options: ['', '', '', ''], answer: 0 });
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/community-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions }),
    })
      .then(res => res.json())
      .then(data => {
        setFeedback(data.message || "Quiz partagé !");
        setStep('done');
      })
      .catch(() => setFeedback("Erreur lors de la création du quiz."));
  };

  // Jouer à un quiz (exemple simplifié)
  // TODO : charger un quiz existant et gérer le jeu

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg max-w-xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700 dark:text-cyan-300">Quiz communautaire</h2>
      {step === 'create' && (
        <>
          <form onSubmit={handleAddQuestion} className="space-y-4 mb-6">
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Titre du quiz</span>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded border border-slate-300 mt-2"
                required
                aria-label="Titre du quiz"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Question</span>
              <input
                type="text"
                value={currentQ.question}
                onChange={e => setCurrentQ(q => ({ ...q, question: e.target.value }))}
                className="w-full px-4 py-2 rounded border border-slate-300 mt-2"
                required
                aria-label="Question"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currentQ.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={e => setCurrentQ(q => {
                    const opts = [...q.options];
                    opts[i] = e.target.value;
                    return { ...q, options: opts };
                  })}
                  className="px-2 py-1 rounded border border-slate-300"
                  placeholder={`Option ${i + 1}`}
                  required
                  aria-label={`Option ${i + 1}`}
                />
              ))}
            </div>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Bonne réponse (1-4)</span>
              <input
                type="number"
                min={1}
                max={4}
                value={currentQ.answer + 1}
                onChange={e => setCurrentQ(q => ({ ...q, answer: Number(e.target.value) - 1 }))}
                className="w-20 px-2 py-1 rounded border border-slate-300"
                required
                aria-label="Bonne réponse"
              />
            </label>
            <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
              Ajouter la question
            </button>
          </form>
          {questions.length > 0 && (
            <form onSubmit={handleSubmitQuiz}>
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Partager le quiz ({questions.length} questions)
              </button>
            </form>
          )}
        </>
      )}
      {step === 'done' && (
        <div className="mt-4 text-cyan-700 dark:text-cyan-300 font-semibold">{feedback}</div>
      )}
    </div>
  );
};

export default CommunityQuiz;