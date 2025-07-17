import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../hooks/useUser';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

// Type pour un mot du dictionnaire
type Word = {
  id: number;
  numee: string;
  french: string;
  type: string;
  definition?: string;
  phonetic?: string;
  variants?: string;
  examples?: string;
  literal?: string;
  homonym?: string;
  crossReference?: string;
};

// Props du formulaire
interface DictionaryFormProps {
  word: Partial<Word> | null;
  onSave: (word: Partial<Word>) => void;
  onCancel: () => void;
}

const DictionaryForm: React.FC<DictionaryFormProps> = ({ word, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Word>>({});

  useEffect(() => {
    setFormData(word || {});
  }, [word]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numee || !formData.french || !formData.type) {
      toast.error('Les champs "Numèè", "Français" et "Type" sont obligatoires.');
      return;
    }
    onSave(formData);
  };

  const fields: (keyof Word)[] = ['numee', 'french', 'type', 'phonetic', 'definition', 'variants', 'examples', 'literal', 'homonym', 'crossReference'];
  const fieldLabels: Record<string, string> = {
    numee: 'Numèè',
    french: 'Français',
    type: 'Type',
    phonetic: 'Phonétique (transcription phonétique)',
    definition: 'Définition',
    variants: 'Variantes',
    examples: 'Exemples',
    literal: 'Sens littéral',
    homonym: 'Homonyme',
    crossReference: 'Référence croisée',
  };
  const placeholders: Record<string, string> = {
    homonym: "Préciser l'homonyme pour lever l'ambiguïté",
    crossReference: "Lien vers un autre mot (ex: voir 'autre mot')",
    variants: "Autres formes ou orthographes du mot",
    literal: "Traduction littérale si différent du sens principal"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{word?.id ? 'Modifier le mot' : 'Ajouter un nouveau mot'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field} className={['definition', 'examples'].includes(field) ? 'md:col-span-2' : ''}>
                <label htmlFor={field} className="block text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                  {fieldLabels[field] || field.replace(/([A-Z])/g, ' $1')}
                </label>
                {['definition', 'examples'].includes(field) ? (
                  <textarea
                    id={field}
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  />
                ) : (
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    placeholder={placeholders[field] || ''}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    required={['numee', 'french', 'type'].includes(field)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-white bg-cyan-600 hover:bg-cyan-700">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AdminDashboard: React.FC = () => {
  const { user } = useUser();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingWord, setEditingWord] = useState<Partial<Word> | null>(null);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWords = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`http://localhost:3001/api/words`);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      } else {
        // Pour la vue admin, on peut vouloir charger par défaut, donc on utilise une lettre commune.
        url.searchParams.append('letter', 'a');
      }
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('La réponse du réseau n\'était pas correcte');
      const data = await res.json();
      
      setWords(data);
      setHasNextPage(data.length === limit);
    } catch (err) {
      setError('Erreur lors du chargement des mots.');
      toast.error('Erreur lors du chargement des mots.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleSaveWord = async (word: Partial<Word>) => {
    const isUpdating = !!word.id;
    const url = isUpdating ? `/api/words/${word.id}` : '/api/words';
    const method = isUpdating ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(word),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erreur serveur');
      }

      toast.success(`Mot ${isUpdating ? 'modifié' : 'ajouté'} avec succès !`);
      setEditingWord(null);
      fetchWords(); // Recharger les données
    } catch (err) {
      toast.error(err.message || `Erreur lors de la sauvegarde du mot.`);
    }
  };

  const handleDeleteWord = async (wordId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce mot ? Cette action est irréversible.')) return;

    try {
      const res = await fetch(`/api/words/${wordId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      
      toast.success('Mot supprimé avec succès.');
      fetchWords(); // Recharger les données
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression du mot.');
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchWords();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-500">Accès Interdit</h2>
        <p className="mt-4">Vous n'avez pas les autorisations nécessaires pour voir cette page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <Toaster position="top-right" />
      
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Tableau de bord Administrateur</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Gestion complète du dictionnaire Numèè.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Gestion du Dictionnaire</h2>
          <button onClick={() => setEditingWord({})} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors w-full md:w-auto">
            <FaPlus /> Ajouter un mot
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un mot (numee, français, définition...)"
            className="flex-grow px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700"
          />
          <button type="submit" className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">
            <FaSearch />
          </button>
        </form>

        {loading ? (
          <div className="text-center py-8">Chargement des données...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {words.map((word) => (
              <div key={word.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{word.type}</p>
                      <h4 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{word.numee}</h4>
                      <p className="text-slate-600 dark:text-slate-300">{word.french}</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      <button onClick={() => setEditingWord(word)} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full bg-slate-100 dark:bg-slate-700" aria-label={`Modifier ${word.numee}`}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteWord(word.id)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-full bg-slate-100 dark:bg-slate-700" aria-label={`Supprimer ${word.numee}`}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  {word.definition && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{word.definition}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center gap-4 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 disabled:opacity-50">
            Précédent
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-400">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={!hasNextPage || loading} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 disabled:opacity-50">
            Suivant
          </button>
        </div>
      </div>

      {editingWord && (
        <DictionaryForm
          word={editingWord}
          onSave={handleSaveWord}
          onCancel={() => setEditingWord(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
