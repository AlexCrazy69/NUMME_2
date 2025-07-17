

import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Dictionary from './components/Dictionary';
import Quiz from './components/Quiz';
import MemoryImageGame from './components/MemoryImageGame';
import MemoryGame from './components/MemoryGame';
import SevenFamiliesGame from './components/SevenFamiliesGame';
import Examen from './components/Certification';
import GamesHub from './components/GamesHub';
import FillInTheBlankGame from './components/FillInTheBlankGame';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Contact from './components/Contact';
import ScrabbleGame from './components/ScrabbleGame';
import Guide from './components/Guide';
import { View } from './types';
import { useTheme } from './hooks/useTheme';
import { UserProvider, useUser } from './hooks/useUser';
import ErrorBoundary from './components/ErrorBoundary';

import ImageCarousel from './components/ImageCarousel';

const AppContent: React.FC = () => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<View>('home');
  const { theme, setTheme } = useTheme();

  const navigate = useCallback((view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home setView={navigate} />;
      case 'dictionary':
        return <Dictionary setView={navigate} />;
      case 'quiz':
        return <Quiz setView={navigate} />;
      case 'memory-game':
        return <MemoryGame setView={navigate} />;
      case 'memory-image-game':
        return <MemoryImageGame setView={navigate} />;
      case 'seven-families-game':
        return <SevenFamiliesGame setView={navigate} />;
      case 'fill-in-the-blank-game':
        return <FillInTheBlankGame setView={navigate} />;
      case 'scrabble-game':
        return <ScrabbleGame setView={navigate} />;
      case 'games':
        return <GamesHub setView={navigate} />;
      case 'examen':
        return <Examen setView={navigate} />;
      case 'login':
        return <Login setView={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboard setView={navigate} />;
      case 'user-dashboard':
        return <UserDashboard setView={navigate} />;
      case 'contact':
        return <Contact />;
      case 'guide':
        return <Guide />;
      default:
        return <Home setView={navigate} />;
    }
  };

  const appBg = 'bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm';

  return (
    <div className={`flex flex-col min-h-screen ${appBg} text-slate-800 dark:text-slate-200`}>
      <ImageCarousel />
      <Header currentView={currentView} setView={navigate} theme={theme} setTheme={setTheme} />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <div key={currentView} className="w-full max-w-7xl mx-auto animate-fade-in-up">
          {renderView()}
        </div>
      </main>
      <Footer setView={navigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </UserProvider>
  );
}

export default App;

