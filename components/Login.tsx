import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { View } from '../types';
import { LogIn } from './icons';

interface LoginProps {
  setView: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(username, password);
      if (user) {
        if (user.role === 'admin') {
          setView('admin');
        } else {
          setView('user-dashboard');
        }
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-white/30 dark:border-slate-700/50">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Connexion
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 placeholder-slate-500 text-slate-900 dark:text-white rounded-t-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                placeholder="Nom d'utilisateur"
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 placeholder-slate-500 text-slate-900 dark:text-white rounded-b-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300" aria-hidden="true" />
              </span>
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;