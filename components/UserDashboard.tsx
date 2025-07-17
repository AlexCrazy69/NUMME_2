
import React from 'react';
import { useUser } from '../hooks/useUser';
import { useCertificationProgress } from '../hooks/useCertificationState';
import { View, QuizLevel, QuizLevelConfig } from '../types';
import { Award, CheckCircle, ChevronRight, User } from './icons';

// Duplicated from Certification.tsx for simplicity. In a larger app, this would be in a shared config file.
const LEVEL_CONFIGS: Record<QuizLevel, QuizLevelConfig> = {
    Bronze: { name: 'Bronze', questions: 25, passingScore: 70, time: 10, colors: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-300 dark:border-orange-500/50', iconContainer: 'bg-orange-200 dark:bg-orange-800' } },
    Argent: { name: 'Argent', questions: 50, passingScore: 75, time: 20, colors: { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-300', border: 'border-slate-400/50', iconContainer: 'bg-slate-300 dark:bg-slate-600' } },
    Or: { name: 'Or', questions: 100, passingScore: 80, time: 40, colors: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-500 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-500/50', iconContainer: 'bg-amber-200 dark:bg-amber-800' } }
};

interface UserDashboardProps {
    setView: (view: View) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ setView }) => {
  const { user } = useUser();
  const [progress] = useCertificationProgress();

  if (!user) {
    return null; // Should be handled by router, but good practice
  }

  return (
    <div className="space-y-12">
        <div className="text-center">
            <User className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Mon Tableau de Bord</h2>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Bienvenue, {user.username} !</p>
        </div>

        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/30 dark:border-slate-700/50">
            <h3 className="text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-200">Progression des Certifications</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.keys(LEVEL_CONFIGS) as QuizLevel[]).map(level => {
                    const config = LEVEL_CONFIGS[level];
                    const levelProgress = progress[level];
                    const isPassed = levelProgress?.passed ?? false;
                    const highScore = levelProgress?.highScore ?? 0;

                    return (
                        <div key={level} className={`relative bg-white/60 dark:bg-slate-800/60 p-6 rounded-2xl flex flex-col shadow-lg border-2 ${config.colors.border}`}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-full ${config.colors.iconContainer}`}>
                                    <Award className={`w-8 h-8 ${config.colors.text}`} />
                                </div>
                                <div>
                                    <h4 className={`text-xl font-bold ${config.colors.text}`}>{level}</h4>
                                    {isPassed ? (
                                        <div className="flex items-center text-sm font-bold text-green-600 dark:text-green-400">
                                            <CheckCircle className="w-4 h-4 mr-1"/> Débloqué
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400">
                                            À tenter
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="text-slate-700 dark:text-slate-300 space-y-1 mt-2 text-sm flex-grow">
                                <p><strong>Objectif :</strong> {config.passingScore}%</p>
                                <p><strong>Meilleur Score :</strong> {isPassed ? `${highScore} / ${config.questions}` : 'Non tenté'}</p>
                            </div>
                            
                            <button 
                                onClick={() => setView('certification')}
                                className="mt-6 w-full px-4 py-2 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-600 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                {isPassed ? "Refaire l'examen" : "Passer l'examen"} <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

         <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/30 dark:border-slate-700/50">
            <h3 className="text-2xl font-semibold mb-4">Statistiques de Jeux</h3>
            <p className="text-slate-500 dark:text-slate-400">
            Bientôt, vous pourrez suivre ici vos statistiques pour les jeux de mémoire, de complétion et de mots.
            </p>
        </div>
    </div>
  );
};

export default UserDashboard;