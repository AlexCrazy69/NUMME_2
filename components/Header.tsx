
import React, { useState, useRef, useEffect } from 'react';
import { View, Theme } from '../types';
import { Home, BookOpen, Award, Puzzle, Sun, Moon, Laptop, Menu, X, User, LogOut, LogIn, Mail, Briefcase, Book, Check } from './icons';
import { useUser } from '../hooks/useUser';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}> = ({ label, icon, isActive, onClick, isMobile = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 transition-all duration-300 ease-in-out ${
      isMobile 
        ? `w-full text-left p-4 rounded-lg text-lg ${isActive ? 'bg-cyan-500 text-white theme-button-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 theme-text-p theme-button-secondary-hover'}`
        : `px-4 py-2 rounded-full text-sm font-medium transform hover:scale-105 ${isActive ? 'bg-cyan-500 text-white shadow-lg theme-button-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-cyan-100 dark:hover:bg-slate-700 theme-text-p theme-button-secondary-hover'}`
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const UserMenu: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
    const { user, logout } = useUser();
    const [isOpen, setIsOpen] = useState(false);
  
    const handleLogout = () => {
      logout();
      setIsOpen(false);
      setView('home');
    };
  
    if (!user) {
      return (
        <button
          onClick={() => setView('login')}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-cyan-100 dark:hover:bg-slate-700 transition-colors theme-text-p theme-button-secondary-hover"
        >
          <LogIn className="w-5 h-5" />
          Connexion
        </button>
      );
    }
    
    const handleDashboardClick = () => {
      if (user.role === 'admin') {
        setView('admin');
      } else {
        setView('user-dashboard');
      }
      setIsOpen(false);
    }

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-cyan-100 dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 capitalize theme-button-secondary"
        >
          <User className="w-5 h-5" />
          {user.username}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
            <button
              onClick={handleDashboardClick}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <User className="w-5 h-5" /> 
              {user.role === 'admin' ? 'Tableau de Bord Admin' : 'Mon Tableau de Bord'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Déconnexion
            </button>
          </div>
        )}
      </div>
    );
};

const ThemeMenu: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Seulement deux thèmes : Clair (universitaire) et Sombre (design)
    const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
        { id: 'light', label: 'Clair universitaire', icon: <Sun className="w-5 h-5" /> },
        { id: 'dark', label: 'Sombre design', icon: <Moon className="w-5 h-5" /> }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        setIsOpen(false);
    };
    
    const currentTheme = themes.find(t => t.id === theme) || themes[0];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors theme-text-p theme-button-secondary-hover"
                aria-label="Changer le thème"
            >
                {currentTheme.icon}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    {themes.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleThemeChange(t.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between gap-2"
                        >
                            <div className="flex items-center gap-2">
                                {t.icon}
                                <span>{t.label}</span>
                            </div>
                            {theme === t.id && <Check className="w-4 h-4 text-cyan-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ currentView, setView, theme, setTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  }
  
  const navLinks = [
    { view: 'home', label: 'Accueil', icon: <Home /> },
    { view: 'dictionary', label: 'Dictionnaire', icon: <BookOpen /> },
    { view: 'guide', label: 'Guide', icon: <Briefcase /> },
    { view: 'games', label: 'Jeux', icon: <Puzzle /> },
    { view: 'examen', label: 'Examen', icon: <Award /> },
    { view: 'contact', label: 'Contact', icon: <Mail /> },
  ] as const;

  return (
    <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-md sticky top-0 z-50 theme-header">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => setView('home')} className="flex items-center focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-1 -ml-1">
             <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-cursive theme-link">
                Numèè V2
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1 theme-text-subtle">
                D'après I. Bril & J-M. Konyi
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => (
                 <NavItem
                    key={link.view}
                    label={link.label}
                    icon={link.icon}
                    isActive={currentView === link.view}
                    onClick={() => handleNavClick(link.view)}
                  />
              ))}
            </div>
            
            <ThemeMenu theme={theme} setTheme={setTheme} />

            <div className="hidden md:block">
                <UserMenu setView={setView} />
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {/* Hamburger uniquement sur mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Ouvrir le menu de navigation"
                title="Ouvrir le menu de navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold font-cursive text-cyan-600 dark:text-cyan-400">Navigation</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Fermer le menu de navigation"
                title="Fermer le menu de navigation"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-2 flex-grow">
              {navLinks.map(link => (
                 <NavItem
                    key={link.view}
                    label={link.label}
                    icon={link.icon}
                    isActive={currentView === link.view}
                    onClick={() => handleNavClick(link.view)}
                    isMobile={true}
                  />
              ))}
            </div>
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <UserMenu setView={setView} />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
