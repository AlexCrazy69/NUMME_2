import React, { useEffect, useRef } from 'react';

type Word = {
  id?: number;
  numee?: string;
  french?: string;
  type?: string;
  definition?: string;
  phonetic?: string;
  variants?: string;
};

interface DictionaryFormProps {
  form: Partial<Word>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Word>>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editWord: Word | null;
}

const DictionaryForm: React.FC<DictionaryFormProps> = ({ form, setForm, onSubmit, onCancel, editWord }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [editWord]);

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit} aria-label={editWord ? "Formulaire d'édition de mot" : "Formulaire d'ajout de mot"}>
      <div className="flex gap-4">
        <label className="flex-1">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Mot</span>
          <input
            ref={inputRef}
            type="text"
            value={form.numee || ''}
            onChange={e => setForm(f => ({ ...f, numee: e.target.value }))}
            className="w-full px-4 py-2 rounded border border-slate-300"
            required
            aria-required="true"
            aria-label="Mot"
          />
        </label>
        <label className="flex-1">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Traduction</span>
          <input
            type="text"
            value={form.french || ''}
            onChange={e => setForm(f => ({ ...f, french: e.target.value }))}
            className="w-full px-4 py-2 rounded border border-slate-300"
            required
            aria-required="true"
            aria-label="Traduction"
          />
        </label>
      </div>
      <div className="flex gap-4">
        <label className="flex-1">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Type</span>
          <input
            type="text"
            value={form.type || ''}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full px-4 py-2 rounded border border-slate-300"
            aria-label="Type"
          />
        </label>
        <label className="flex-1">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Définition</span>
          <input
            type="text"
            value={form.definition || ''}
            onChange={e => setForm(f => ({ ...f, definition: e.target.value }))}
            className="w-full px-4 py-2 rounded border border-slate-300"
            aria-label="Définition"
          />
        </label>
      </div>
      <div className="flex gap-4">
        <label className="flex-1">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Phonétique</span>
          <input
            type="text"
            value={form.phonetic || ''}
            onChange={e => setForm(f => ({ ...f, phonetic: e.target.value }))}
            className="w-full px-4 py-2 rounded border border-slate-300"
            aria-label="Phonétique"
          />
        </label>
        <label className="flex-1">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Variantes</span>
          <input
            type="text"
            value={form.variants || ''}
            onChange={e => setForm(f => ({ ...f, variants: e.target.value }))}
            className="w-full px-4 py-2 rounded border border-slate-300"
            aria-label="Variantes"
          />
        </label>
      </div>
      <div className="flex gap-4">
        <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700" aria-label={editWord ? "Enregistrer le mot" : "Ajouter le mot"}>
          {editWord ? 'Enregistrer' : 'Ajouter'}
        </button>
        <button type="button" className="px-6 py-2 bg-slate-300 rounded hover:bg-slate-400" onClick={onCancel} aria-label="Annuler">
          Annuler
        </button>
      </div>
    </form>
  );
};

export default DictionaryForm;