import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Proposition = {
  id: number;
  mot: string;
  definition: string;
  exemple: string;
  auteur: string;
  statut: string;
};

type CommunityQuiz = {
  id: number;
  title: string;
  questions: any[];
  author: string;
  statut: string;
};

const AdminModeration: React.FC = () => {
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [quizzes, setQuizzes] = useState<CommunityQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/propositions').then(res => res.json()),
      fetch('/api/community-quiz').then(res => res.json()),
    ])
      .then(([props, quizs]) => {
        setPropositions(props);
        setQuizzes(quizs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProposition = (id: number, statut: string) => {
    fetch(`/api/propositions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
      .then(res => res.json())
      .then(() => {
        setPropositions(props => props.filter(p => p.id !== id));
        toast.success(`Proposition ${statut === 'validé' ? 'validée' : 'refusée'}`);
      });
  };

  const handleQuiz = (id: number, statut: string) => {
    fetch(`/api/community-quiz/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
      .then(res => res.json())
      .then(() => {
        setQuizzes(qs => qs.filter(q => q.id !== id));
        toast.success(`Quiz ${statut === 'validé' ? 'validé' : 'refusé'}`);
      });
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-cyan-700 dark:text-cyan-300">Modération collaborative</h2>
      <div>
        <h3 className="text-xl font-semibold mb-4">Propositions de mots/exemples</h3>
        {propositions.length === 0 ? (
          <div className="text-slate-500">Aucune proposition en attente.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th>Mot</th>
                <th>Définition</th>
                <th>Exemple</th>
                <th>Auteur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {propositions.map(p => (
                <tr key={p.id}>
                  <td>{p.mot}</td>
                  <td>{p.definition}</td>
                  <td>{p.exemple}</td>
                  <td>{p.auteur}</td>
                  <td>
                    <button onClick={() => handleProposition(p.id, 'validé')} className="px-2 py-1 bg-green-600 text-white rounded mr-2">Valider</button>
                    <button onClick={() => handleProposition(p.id, 'refusé')} className="px-2 py-1 bg-red-600 text-white rounded">Refuser</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Quiz communautaires</h3>
        {quizzes.length === 0 ? (
          <div className="text-slate-500">Aucun quiz en attente.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Questions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(q => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td>{q.author}</td>
                  <td>{q.questions.length}</td>
                  <td>
                    <button onClick={() => handleQuiz(q.id, 'validé')} className="px-2 py-1 bg-green-600 text-white rounded mr-2">Valider</button>
                    <button onClick={() => handleQuiz(q.id, 'refusé')} className="px-2 py-1 bg-red-600 text-white rounded">Refuser</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminModeration;