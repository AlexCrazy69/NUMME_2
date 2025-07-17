import React from 'react';
import { View } from '../types';
import { Award, BookOpen, Certificate, Flower, Info, Mail, MapPin, Sparkles } from './icons';
import WordOfTheDay from './WordOfTheDay';
import AlphabetNav from './AlphabetNav';
import ImageCarousel from './ImageCarousel';

interface HomeProps {
    setView: (view: View, letter?: string) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {

    const handleLetterClick = (letter: string) => {
        setView('dictionary', letter);
    };

    return (
        <div className="space-y-16">
<ImageCarousel />
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-cyan-600 to-blue-800 text-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-1 text-sm font-medium">
                            <Certificate className="w-5 h-5 text-cyan-300" />
                            <span>Certification officielle de l'Académie des Langues Kanak</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Découvrez la richesse de la langue <span className="text-cyan-300 font-cursive">Numèè</span>
                        </h1>
                        <p className="text-lg text-slate-200">
                            Plateforme professionnelle d'apprentissage linguistique développée en collaboration avec l'Académie des Langues Kanak pour la préservation et la transmission du patrimoine linguistique de Nouvelle-Calédonie.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                             <button
                                onClick={() => setView('dictionary')}
                                className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-full text-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <BookOpen className="w-5 h-5" />
                                Explorer le dictionnaire
                            </button>
                             <button
                                onClick={() => setView('guide-touristique')}
                                className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-300 font-bold rounded-full text-lg hover:bg-cyan-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                            >
                                Guide de démarrage
                            </button>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm">
                       <h3 className="text-xl font-bold mb-4">Exploration rapide</h3>
                        <AlphabetNav onLetterClick={handleLetterClick} />
                    </div>
                </div>
            </section>

            {/* Quick Start Guide Section */}
            <section className="text-center py-12">
                <MapPin className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Nouveau sur le territoire ?</h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Commencez par les bases avec notre guide pour touristes et nouveaux arrivants.</p>
                <button
                    onClick={() => setView('guide-touristique')}
                    className="mt-6 px-8 py-3 bg-cyan-500 text-white font-bold rounded-full text-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
                >
                    Consulter le Guide
                </button>
             </section>

            {/* Word of the Day Section */}
            <WordOfTheDay />

            {/* Certification Section */}
            <section className="py-12">
                 <div className="text-center mb-12 relative">
                    <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-3">
                        <Award className="w-10 h-10 text-yellow-500" />
                        Certification Numèè
                    </h2>
                     <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Obtenez votre certificat officiel de maîtrise</p>
                     <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 sparkle-1" />
                     <Sparkles className="absolute -top-2 right-8 w-6 h-6 text-cyan-400 sparkle-2" />
                     <Sparkles className="absolute top-8 -right-2 w-5 h-5 text-pink-400 sparkle-3" />
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Bronze Card */}
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-center">
                            <div className="inline-block p-4 bg-orange-100 dark:bg-orange-900/80 rounded-full mb-4 animate-shine">
                                <Award className="w-12 h-12 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">Certificat Bronze</h3>
                            <p className="font-semibold mt-2 text-slate-700 dark:text-slate-200">Niveau débutant</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">25 questions / 10 min</p>
                            <p className="font-bold mt-1 text-slate-600 dark:text-slate-300">70% requis pour réussir</p>
                        </div>
                    </div>

                    {/* Argent Card */}
                     <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 hover:shadow-slate-500/20 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-center">
                            <div className="inline-block p-4 bg-slate-200 dark:bg-slate-700/80 rounded-full mb-4 animate-shine" style={{animationDelay: '0.2s'}}>
                                <Award className="w-12 h-12 text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400">Certificat Argent</h3>
                            <p className="font-semibold mt-2 text-slate-700 dark:text-slate-200">Niveau intermédiaire</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">50 questions / 20 min</p>
                            <p className="font-bold mt-1 text-slate-600 dark:text-slate-300">75% requis pour réussir</p>
                        </div>
                    </div>

                    {/* Or Card */}
                     <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-center">
                             <div className="inline-block p-4 bg-amber-100 dark:bg-amber-900/80 rounded-full mb-4 animate-shine" style={{animationDelay: '0.4s'}}>
                                <Award className="w-12 h-12 text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">Certificat Or</h3>
                            <p className="font-semibold mt-2 text-slate-700 dark:text-slate-200">Niveau avancé</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">100 questions / 40 min</p>
                            <p className="font-bold mt-1 text-slate-600 dark:text-slate-300">80% requis pour réussir</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-blue-100/70 dark:bg-blue-900/30 backdrop-blur-md p-6 rounded-2xl flex items-center space-x-4">
                    <Info className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-800 dark:text-blue-200">Information importante</h4>
                        <p className="text-blue-700 dark:text-blue-300">
                           Les certificats sont authentifiés et exportables en PDF. Ils peuvent être utilisés pour valoriser vos compétences linguistiques.
                           Pour commencer, <span onClick={() => setView('certification')} className="font-bold underline cursor-pointer hover:text-blue-600">tentez un examen de certification !</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;