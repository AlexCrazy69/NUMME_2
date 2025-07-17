import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

type Word = {
  id: number;
  numee: string;
  french: string;
  type: string;
  definition?: string;
  phonetic?: string;
  variants?: string;
};

interface DictionaryTableProps {
  words: Word[];
  onEdit: (word: Word) => void;
  onDelete: (id: number) => void;
}

const DictionaryTable: React.FC<DictionaryTableProps> = ({ words, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" aria-label="Tableau du dictionnaire">
      <thead className="bg-slate-50 dark:bg-slate-700">
        <tr>
          <th className="px-4 py-2">Mot</th>
          <th className="px-4 py-2">Traduction</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Définition</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
        {words.map((w) => (
          <tr key={w.id} tabIndex={0}>
            <td className="px-4 py-2">{w.numee}</td>
            <td className="px-4 py-2">{w.french}</td>
            <td className="px-4 py-2">{w.type}</td>
            <td className="px-4 py-2">{w.definition}</td>
            <td className="px-4 py-2 text-right">
              <button
                onClick={() => onEdit(w)}
                className="text-indigo-600 hover:text-indigo-900 mr-2"
                aria-label={`Modifier ${w.numee}`}
                tabIndex={0}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(w.id)}
                className="text-red-600 hover:text-red-900"
                aria-label={`Supprimer ${w.numee}`}
                tabIndex={0}
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DictionaryTable;