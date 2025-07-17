
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Award, RefreshCw, Loader, CheckCircle, Clock, Star, BookOpen } from './icons';
import { View, QuizResult, QuizLevel, QuizLevelConfig, QuizQuestion } from '../types';
import { generateQuiz } from '../services/gameService';
import { useCertificationProgress } from '../hooks/useCertificationState';

declare const jspdf: any;
declare const html2canvas: any;

interface ExamenProps {
    setView: (view: View) => void;
}

const LEVEL_CONFIGS: Record<QuizLevel, QuizLevelConfig> = {
  Bronze: { name: 'Bronze', questions: 25, passingScore: 70, time: 10, colors: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-300/50 dark:border-orange-400/50', iconContainer: 'bg-orange-200 dark:bg-orange-800' } },
  Argent: { name: 'Argent', questions: 50, passingScore: 75, time: 20, colors: { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-300', border: 'border-slate-400/50', iconContainer: 'bg-slate-300 dark:bg-slate-600' } },
  Or: { name: 'Or', questions: 100, passingScore: 80, time: 40, colors: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-500 dark:text-amber-400', border: 'border-amber-400/50', iconContainer: 'bg-amber-200 dark:bg-amber-800' } }
};

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const DiplomaSeal: React.FC<{ color: string }> = ({ color }) => (
    <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full ${color} opacity-80`}>
            <path d="M 50,2 A 48,48 0 1,1 49.99,2.0001 M 50,10 A 40,40 0 1,1 49.99,10.0001" fill="currentColor"/>
        </svg>
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full ${color} opacity-70 transform rotate-12`}>
            <path d="M 50,5 A 45,45 0 1,1 49.99,5.0001 M 50,12 A 38,38 0 1,1 49.99,12.0001" fill="currentColor"/>
        </svg>
        <Star className="absolute inset-0 m-auto w-10 h-10 text-white" />
    </div>
);

// Amélioration UX : explication du module examen
  /*
    Module Examen : Passez un test officiel pour valider vos compétences en Numèè.
    Choisissez un niveau, répondez aux questions dans le temps imparti, et obtenez un diplôme exportable si vous réussissez.
    Ce module remplace et améliore l’ancienne certification.
  */
const Examen: React.FC<ExamenProps> = ({ setView }) => {
    const [name, setName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const diplomaRef = useRef<HTMLDivElement>(null);

    const [examState, setExamState] = useState<'selection' | 'taking' | 'loading' | 'finished'>('selection');
    const [currentLevel, setCurrentLevel] = useState<QuizLevelConfig | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [finalResult, setFinalResult] = useState<QuizResult | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    
    const [progress, updateProgress] = useCertificationProgress();

    useEffect(() => {
        if (finalResult && currentLevel) {
            const percentage = (finalResult.score / finalResult.total) * 100;
            const passed = percentage >= currentLevel.passingScore && !finalResult.timedOut;
            if (passed) {
                updateProgress(finalResult.level, finalResult.score, passed);
            }
        }
    }, [finalResult, currentLevel, updateProgress]);

    useEffect(() => {
      let timer: ReturnType<typeof setInterval>;
      if (examState === 'taking' && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else if (examState === 'taking' && timeLeft === 0) {
        if(currentLevel) {
            setFinalResult({ score, total: questions.length, level: currentLevel.name, timedOut: true });
        }
        setExamState('finished');
      }
      return () => clearInterval(timer);
    }, [examState, timeLeft, score, questions.length, currentLevel]);

    const startExam = useCallback(async (level: QuizLevel) => {
      const config = LEVEL_CONFIGS[level];
      setCurrentLevel(config);
      setExamState('loading');
      const data = await generateQuiz(config.questions);
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFinalResult(null);
      setTimeLeft(config.time * 60);
      setExamState('taking');
    }, []);

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === questions[currentQuestionIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            if (currentLevel) {
              setFinalResult({ score, total: questions.length, level: currentLevel.name });
            }
            setExamState('finished');
        }
    };

    const handleDownload = async () => {
        if (!diplomaRef.current || !name.trim() || !finalResult) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(diplomaRef.current, { scale: 3, backgroundColor: null, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Certificat-Numee-${finalResult.level}-${name.trim().replace(' ', '_')}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Une erreur est survenue lors de la création du PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (examState === 'selection') {
      return (
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-3"><Award className="w-10 h-10 text-yellow-500" />Centre de Examen</h2>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Choisissez votre niveau d'examen pour obtenir un certificat.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Object.keys(LEVEL_CONFIGS) as QuizLevel[]).map(level => {
              const config = LEVEL_CONFIGS[level];
              const levelProgress = progress[level];
              const isPassed = levelProgress?.passed ?? false;
              const highScore = levelProgress?.highScore ?? 0;

              return (
                <div key={level} className={`relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-xl border-2 ${config.colors.border} ${isPassed ? '' : 'hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'} flex flex-col`}>
                    {isPassed && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <CheckCircle className="w-4 h-4" /> Terminé
                        </div>
                    )}
                    <div className="text-center flex-grow">
                        <div className={`inline-block p-4 ${config.colors.iconContainer} rounded-full mb-4`}>
                            <Award className={`w-12 h-12 ${config.colors.text}`} />
                        </div>
                        <h3 className={`text-2xl font-bold ${config.colors.text}`}>Certificat {level}</h3>
                        <div className="text-slate-700 dark:text-slate-200 space-y-1 mt-2">
                          <p className="font-semibold">{config.questions} questions</p>
                          <p className="font-semibold">{config.time} minutes</p>
                          {isPassed && <p className="font-semibold">Meilleur Score: {highScore}/{config.questions}</p>}
                        </div>
                        <p className={`font-bold mt-2 ${config.colors.text}`}>{config.passingScore}% requis pour réussir</p>
                    </div>
                    <button onClick={() => startExam(level)} className={`mt-6 w-full px-6 py-3 ${config.colors.bg} ${config.colors.text} font-bold rounded-full hover:opacity-80 transition-opacity`}>
                        {isPassed ? "Améliorer mon score" : "Commencer l'examen"}
                    </button>
                </div>
              );
            })}
          </div>
        </div>
      )
    }

    if (examState === 'loading') {
      return <div className="flex justify-center items-center h-64"><Loader className="animate-spin h-12 w-12 text-cyan-500" /></div>;
    }

    if (examState === 'taking' && currentLevel) {
      const currentQuestion = questions[currentQuestionIndex];
      const getButtonClass = (option: string) => {
        if (!isAnswered) return 'bg-white dark:bg-slate-700 hover:bg-cyan-100 dark:hover:bg-slate-600';
        if (option === currentQuestion.answer) return 'bg-green-500 text-white';
        if (option === selectedAnswer) return 'bg-red-500 text-white';
        return 'bg-white dark:bg-slate-700 opacity-60';
      };
      return (
        <div className="p-4 sm:p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-slate-700 dark:text-slate-300">
              <h2 className="text-xl font-bold">Examen {currentLevel.name}</h2>
              <div className="flex items-center gap-4">
                 <p className="font-bold text-cyan-500">Score: {score}</p>
                 <div className={`font-bold flex items-center gap-1 ${timeLeft < 30 ? 'text-red-500' : ''}`}>
                    <Clock className="w-5 h-5"/>
                    <span>{formatTime(timeLeft)}</span>
                 </div>
              </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6">
              <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
          <p className="text-center text-3xl font-bold my-8 text-slate-800 dark:text-slate-100">"{currentQuestion.question}"</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map(option => (
                  <button key={option} onClick={() => handleAnswer(option)} disabled={isAnswered} className={`p-4 rounded-lg text-lg font-semibold transition-all duration-200 border-2 border-transparent ${getButtonClass(option)}`}>{option}</button>
              ))}
          </div>
          {isAnswered && (
              <button onClick={handleNextQuestion} className="w-full mt-8 py-3 bg-cyan-500 text-white font-bold rounded-full text-lg hover:bg-cyan-600 transition-colors">
                  {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
              </button>
          )}
        </div>
      );
    }
    
    if (examState === 'finished' && finalResult && currentLevel) {
      const percentage = (finalResult.score / finalResult.total) * 100;
      const passed = percentage >= currentLevel.passingScore && !finalResult.timedOut;
      const oldHighScore = progress[finalResult.level]?.highScore ?? 0;
      const isNewHighScore = passed && finalResult.score > oldHighScore;

      const tierConfig = {
        Bronze: { level: 'Bronze', gradient: 'bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-800/30 dark:to-yellow-800/30', borderColor: 'border-orange-500/50 dark:border-orange-600/50', titleColor: 'text-orange-800 dark:text-orange-300', textColor: 'text-orange-900 dark:text-orange-200', nameColor: 'text-cyan-800 dark:text-cyan-300', sealColor: 'text-orange-500' },
        Argent: { level: 'Argent', gradient: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700/30 dark:to-slate-600/30', borderColor: 'border-slate-400/50 dark:border-slate-500/50', titleColor: 'text-slate-700 dark:text-slate-200', textColor: 'text-slate-700 dark:text-slate-300', nameColor: 'text-cyan-600 dark:text-cyan-400', sealColor: 'text-slate-500' },
        Or: { level: 'Or', gradient: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-800/30 dark:to-amber-800/30', borderColor: 'border-amber-400/50 dark:border-amber-500/50', titleColor: 'text-amber-800 dark:text-amber-300', textColor: 'text-slate-800 dark:text-amber-200', nameColor: 'text-cyan-700 dark:text-cyan-300', sealColor: 'text-amber-500' },
      }[finalResult.level];
      
      if (!passed) {
        return (
          <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mt-4">Examen terminé !</h2>
            {finalResult.timedOut ? (
                <>
                    <p className="text-5xl font-bold my-4 text-red-500">Temps écoulé !</p>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Vous devez répondre à toutes les questions dans le temps imparti.
                    </p>
                </>
            ) : (
                <>
                    <p className="text-5xl font-bold my-4 text-red-500">{finalResult.score} / {finalResult.total}</p>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Score requis : {currentLevel.passingScore}%. Malheureusement, ce n'est pas suffisant cette fois-ci.
                    </p>
                </>
            )}
            <button onClick={() => startExam(finalResult.level)} className="mt-8 px-6 py-3 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-600 transition-colors flex items-center gap-2 mx-auto">
                <RefreshCw /> Réessayer l'examen {finalResult.level}
            </button>
          </div>
        )
      }

      return (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Félicitations ! Vous avez obtenu le Certificat <span className={tierConfig.textColor}>{finalResult.level}</span>!</h2>
              {isNewHighScore && (
                <div className="mt-4 inline-flex items-center gap-2 text-lg font-semibold bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full">
                    <Star className="w-6 h-6 text-yellow-500"/>
                    Nouveau record personnel !
                </div>
              )}
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <div className="mb-6">
                  <label htmlFor="name" className="block text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">Entrez votre nom complet pour le certificat :</label>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Jean Dupont" className="w-full px-4 py-2 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"/>
              </div>
              <div ref={diplomaRef} className={`p-2 diploma-border ${tierConfig.gradient}`}>
                  <div className={`p-8 border-2 border-dashed ${tierConfig.borderColor} flex flex-col items-center text-center relative overflow-hidden bg-white/50 dark:bg-slate-800/50`}>
                      <BookOpen className={`absolute -top-8 -left-8 w-32 h-32 opacity-5 ${tierConfig.sealColor}`} />
                      <Award className={`absolute -bottom-8 -right-8 w-32 h-32 opacity-5 ${tierConfig.sealColor}`} />
                      <h1 className={`text-4xl md:text-5xl font-serif font-bold ${tierConfig.titleColor}`}>Certificat d'Accomplissement</h1>
                      <p className={`mt-2 text-sm font-bold tracking-widest uppercase ${tierConfig.textColor}`}>{`NIVEAU ${tierConfig.level.toUpperCase()}`}</p>
                      <div className={`w-24 h-1 my-6 ${tierConfig.sealColor} bg-opacity-50`}></div>
                      <p className="mt-2 text-xl font-serif text-slate-700 dark:text-slate-300">Ce certificat est fièrement présenté à</p>
                      <p className={`font-cursive text-4xl ${tierConfig.nameColor} my-4 border-b-2 border-dotted ${tierConfig.borderColor} pb-2 px-4 min-h-[56px] w-full`}>{name || "Votre Nom Ici"}</p>
                      <p className="mt-2 text-lg font-serif text-slate-600 dark:text-slate-400">pour avoir brillamment réussi l'examen de certification sur la langue</p>
                      <h2 className={`text-4xl font-bold my-2 ${tierConfig.titleColor} font-cursive`}>Numèè</h2>
                      <p className="text-lg font-serif text-slate-600 dark:text-slate-400">avec un score de <strong className="text-2xl">{finalResult.score} / {finalResult.total}</strong></p>
                      <div className="flex justify-between items-center w-full mt-10">
                          <div className='text-center'><p className="font-serif text-lg border-t-2 border-slate-500 pt-2">Date</p><p>{new Date().toLocaleDateString('fr-FR')}</p></div>
                          <div className="relative">
                            <DiplomaSeal color={tierConfig.sealColor} />
                          </div>
                          <div className='text-center'><p className="font-serif text-lg border-t-2 border-slate-500 pt-2">Signature</p><p className="font-cursive">Numèè V2</p></div>
                      </div>
                  </div>
              </div>
              <div className="mt-8 text-center">
                  <button onClick={handleDownload} disabled={!name.trim() || isGenerating} className="px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center gap-3 mx-auto">
                      {isGenerating ? 'Génération...' : 'Télécharger mon diplôme'}
                      <Download />
                  </button>
              </div>
          </div>
        </div>
      );
    }

    return null; // Should not be reached
};

export default Examen;
