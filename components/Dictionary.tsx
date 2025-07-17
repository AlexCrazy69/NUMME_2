import React, { useState, useMemo, useEffect } from 'react';
import { View } from '../types';
import { Search, Volume2, BookOpen } from './icons';
import AlphabetNav from './AlphabetNav';

type DictionaryEntry = {
  id: number;
  numee: string;
  french: string;
  type: string;
  definition?: string;
  phonetic?: string;
  variants?: string;
  examples?: { numee: string; french: string }[];
  literal?: string;
  homonym?: string;
  crossReference?: string;
};

const handleSpeak = (textToSpeak: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Désolé, la synthèse vocale n'est pas supportée par votre navigateur.");
  }
};

const InfoTag: React.FC<{ label: string; value: string; isClickable?: boolean; onClick?: (value: string) => void }> = ({ label, value, isClickable, onClick }) => {
  if (!value) return null;
  const cleanValue = value.replace(/[{()}]/g, '');
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(cleanValue);
    }
  };
  return (
    <div className="text-xs text-slate-500 dark:text-slate-400">
      <span className="font-semibold">{label}:</span>{' '}
      {isClickable && onClick ? (
        <button onClick={handleClick} className="italic hover:underline text-cyan-600 dark:text-cyan-400 text-left">{cleanValue}</button>
      ) : (
        <span className="italic">{cleanValue}</span>
      )}
    </div>
  );
};

const DictionaryCard: React.FC<{ entry: DictionaryEntry; onSearch: (term: string) => void; }> = ({ entry, onSearch }) => (
  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border border-white/30 dark:border-slate-700/50 transform hover:-translate-y-1 flex flex-col">
    <div className="flex-grow">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{entry.numee}</h3>
          {entry.phonetic && <span className="text-slate-500 dark:text-slate-400 font-mono">[{entry.phonetic}]</span>}
        </div>
        {entry.type && <span className="italic text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">{entry.type}</span>}
      </div>
      <p className="text-lg text-slate-700 dark:text-slate-300 mt-1">{entry.french}</p>
      {entry.definition && <p className="mt-2 text-slate-600 dark:text-slate-400">{entry.definition}</p>}
      <div className="mt-3 space-y-1">
        {entry.literal && <InfoTag label="Trad. litt." value={entry.literal} />}
        {entry.variants && <InfoTag label="Variantes" value={entry.variants} />}
        {entry.homonym && <InfoTag label="Homonyme" value={entry.homonym} />}
        {entry.crossReference && <InfoTag label="Voir aussi" value={entry.crossReference} isClickable onClick={onSearch} />}
      </div>
      {entry.examples && entry.examples.length > 0 && entry.examples[0].numee && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <p className="font-semibold text-sm text-slate-600 dark:text-slate-400">Exemple{entry.examples.length > 1 ? 's' : ''} :</p>
          {entry.examples.map((ex, index) => (
            <div key={index}>
              <p className="italic text-slate-600 dark:text-slate-300">"{ex.numee}"</p>
              <p className="italic text-slate-500 dark:text-slate-400 text-sm">"{ex.french}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="mt-4 flex justify-end">
      <button
        onClick={() => handleSpeak(entry.numee)}
        className="text-slate-400 hover:text-cyan-500 transition-colors"
        title="Écouter la prononciation"
        aria-label={`Écouter la prononciation du mot ${entry.numee}`}
      >
        <Volume2 />
      </button>
    </div>
  </div>
);

interface DictionaryProps {
  setView: (view: View, letter?: string) => void;
  initialLetter: string;
}

const Dictionary: React.FC<DictionaryProps> = ({ setView, initialLetter }) => {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialLetter) {
      handleLetterClick(initialLetter);
    }
  }, [initialLetter]);

  useEffect(() => {
    const fetchWords = () => {
      if (!activeLetter && !searchTerm) {
        setDictionary([]);
        setLoading(false);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setError(null);
      setHasSearched(true);

      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      } else if (activeLetter) {
        params.append('letter', activeLetter);
      }
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      fetch(`/api/words?${params.toString()}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('La réponse du réseau n’était pas valide');
          }
          return res.json();
        })
        .then(data => {
          setDictionary(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Erreur lors du chargement du dictionnaire');
          setLoading(false);
        });
    };
    
    // Déclenche la recherche uniquement si un terme de recherche est présent
    // ou si une lettre est active.
    if (searchTerm || activeLetter) {
        const timer = setTimeout(() => fetchWords(), 300); // Léger debounce pour la recherche
        return () => clearTimeout(timer);
    } else {
        fetchWords();
    }

  }, [searchTerm, activeLetter, page, limit]);

  const handleLetterClick = (letter: string) => {
    setPage(1);
    setSearchTerm('');
    setActiveLetter(letter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setActiveLetter('');
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (term: string) => {
    setPage(1);
    setActiveLetter('');
    setSearchTerm(term);
  };

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setPage(p => p + 1);

  return (
    <div>
      <AlphabetNav onLetterClick={handleLetterClick} activeLetter={activeLetter} />
      <div className="my-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher un mot ou une définition..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
          aria-label="Rechercher un mot ou une définition"
        />
        <Search className="w-5 h-5 text-slate-400" />
      </div>
      {loading ? (
        <div className="text-center p-8">Chargement...</div>
      ) : error ? (
        <div className="text-red-500 text-center p-8">{error}</div>
      ) : !hasSearched ? (
        <div className="text-center p-10 text-5xl font-bold text-slate-300 dark:text-slate-600 select-none">*</div>
      ) : dictionary.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dictionary.map(entry => (
              <DictionaryCard key={entry.id} entry={entry} onSearch={handleSearchSubmit} />
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={handlePrevPage} disabled={page === 1} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50">Page précédente</button>
            <span className="self-center">Page {page}</span>
            <button onClick={handleNextPage} disabled={dictionary.length < limit} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50">Page suivante</button>
          </div>
        </>
      ) : (
        <div className="text-center p-8 text-slate-500">Aucun résultat trouvé.</div>
      )}
    </div>
  );
};

export default Dictionary;