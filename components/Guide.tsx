
import React, { useState, useRef, useEffect } from 'react';
import { View } from '../types';
import { guideData, GuideCategory } from '../data/guideData';
import { Volume2, MapPin, Play, StopCircle } from './icons';

let utteranceQueue: SpeechSynthesisUtterance[] = [];
let speechCategory: string | null = null;

const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  utteranceQueue = [];
  speechCategory = null;
};

const PhraseCard: React.FC<{
  french: string;
  numee: string;
  isSpeaking: boolean;
}> = ({ french, numee, isSpeaking }) => (
  <div
    className={`bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:scale-105 ${isSpeaking ? 'ring-2 ring-cyan-500 scale-105' : ''}`}
  >
    <div>
      <p className="font-semibold text-slate-700 dark:text-slate-200">{french}</p>
      <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{numee}</p>
    </div>
    <button
      onClick={() => {
        stopSpeech();
        const utterance = new SpeechSynthesisUtterance(numee);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }}
      className="p-2 rounded-full text-slate-500 hover:text-cyan-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      title={`Écouter la prononciation de ${numee}`}
      aria-label={`Écouter la prononciation de ${numee}`}
    >
      <Volume2 />
    </button>
  </div>
);

const CategorySection: React.FC<{ category: GuideCategory; onPlay: (category: GuideCategory) => void; onStop: () => void; isPlaying: boolean; speakingIndex: number | null }> = ({ category, onPlay, onStop, isPlaying, speakingIndex }) => (
  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30 dark:border-slate-700/50">
    <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
            <div className="bg-cyan-500 p-3 rounded-full shadow-lg">{category.icon}</div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{category.title}</h3>
        </div>
        <button
            onClick={() => isPlaying ? onStop() : onPlay(category)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-cyan-100 dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-slate-600 transition-colors"
        >
            {isPlaying ? <StopCircle className="w-5 h-5"/> : <Play className="w-5 h-5"/>}
            <span>{isPlaying ? "Arrêter" : "Lire la catégorie"}</span>
        </button>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      {category.phrases.map((phrase, index) => (
        <PhraseCard key={index} french={phrase.french} numee={phrase.numee} isSpeaking={isPlaying && speakingIndex === index} />
      ))}
    </div>
  </div>
);

const Guide: React.FC<{ setView: (view: View) => void }> = () => {
    const [speakingCategory, setSpeakingCategory] = useState<string | null>(null);
    const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

    useEffect(() => {
        return () => stopSpeech();
    }, []);

    const playCategory = (category: GuideCategory) => {
        if (speakingCategory) {
            handleStop();
        }

        speechCategory = category.title;
        setSpeakingCategory(category.title);
        
        let currentIndex = 0;

        const speakNext = () => {
            // Check if we should still be speaking this category
            if (speechCategory !== category.title || currentIndex >= category.phrases.length) {
                handleStop();
                return;
            }
            
            setSpeakingIndex(currentIndex);
            const utterance = new SpeechSynthesisUtterance(category.phrases[currentIndex].numee);
            utterance.lang = 'fr-FR';
            utterance.rate = 0.8;
            utterance.onend = () => {
                currentIndex++;
                speakNext();
            };
            speechSynthesis.speak(utterance);
        };
        
        speakNext();
    };

    const handleStop = () => {
        stopSpeech();
        setSpeakingCategory(null);
        setSpeakingIndex(null);
    };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <MapPin className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Guide de Démarrage</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          Les mots et phrases essentiels pour bien débuter en langue Numèè.
        </p>
      </div>

      <div className="space-y-8">
        {guideData.map((category, index) => (
          <CategorySection 
            key={index} 
            category={category}
            onPlay={playCategory}
            onStop={handleStop}
            isPlaying={speakingCategory === category.title}
            speakingIndex={speakingCategory === category.title ? speakingIndex : null}
          />
        ))}
      </div>
    </div>
  );
};

export default Guide;