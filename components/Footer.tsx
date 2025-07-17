import React from 'react';
import { Twitter, Instagram, Facebook, FlecheFaitiere } from './icons';
import { View } from '../types';

interface FooterProps {
    setView: (view: View) => void;
}

const FooterLink: React.FC<{ children: React.ReactNode, onClick?: () => void, href?: string }> = ({ children, onClick, href }) => {
    const commonClasses = "text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors";
    
    if (onClick) {
      return (
        <button onClick={onClick} className={commonClasses}>
          {children}
        </button>
      );
    }
    
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={commonClasses}>
        {children}
      </a>
    );
  };
  

const SocialLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-500 transition-transform duration-300 hover:scale-110">
      {children}
    </a>
);


const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-white/50 dark:bg-slate-800/50 shadow-inner mt-12 py-10 relative overflow-hidden rounded-t-3xl">
      {/* Amélioration UI : fond dégradé subtil et arrondis */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50 via-blue-100 to-cyan-100 dark:from-slate-900 dark:to-blue-900 pointer-events-none -z-10"></div>
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-6">
            <FlecheFaitiere className="h-12 w-12 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm mb-8">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Navigation</h3>
            <ul className="space-y-1">
              <li><FooterLink onClick={() => setView('home')}>Accueil</FooterLink></li>
              <li><FooterLink onClick={() => setView('dictionary')}>Dictionnaire</FooterLink></li>
              <li><FooterLink onClick={() => setView('games')}>Jeux</FooterLink></li>
              <li><FooterLink onClick={() => setView('examen')}>Examen</FooterLink></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Ressources</h3>
             <ul className="space-y-1">
              <li><FooterLink href="https://www.alk.nc/">Académie des Langues Kanak</FooterLink></li>
              <li><FooterLink href="https://lacito.cnrs.fr/">LACITO - CNRS</FooterLink></li>
              <li><FooterLink href="https://www.numee.langue-kanak.com/">Site original (V1)</FooterLink></li>
            </ul>
          </div>
          <div className="space-y-2">
             <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">À Propos</h3>
             <ul className="space-y-1">
              <li><FooterLink onClick={() => setView('guide-touristique')}>Guide de démarrage</FooterLink></li>
              <li><FooterLink onClick={() => setView('contact')}>Contactez-nous</FooterLink></li>
             </ul>
          </div>
           <div className="space-y-2">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Communauté</h3>
             <div className="flex justify-center md:justify-center space-x-4">
                <SocialLink href="#"><Twitter className="w-6 h-6" /></SocialLink>
                <SocialLink href="#"><Instagram className="w-6 h-6" /></SocialLink>
                <SocialLink href="#"><Facebook className="w-6 h-6" /></SocialLink>
             </div>
          </div>
        </div>
         <div className="text-center text-xs mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
             <p>Basé sur le dictionnaire Numèè-Français réalisé par Isabelle Bril (LACITO-CNRS) et Jean-Marie Konyi.</p>
        {/* Bouton de téléchargement du dictionnaire PC */}
        <div className="mt-8">
          {/* Pour que ce bouton fonctionne, place le fichier .zip dans /public/download/dico-numee.zip */}
          <a
            href="/download/dico-numee.zip"
            className="inline-block px-6 py-3 bg-cyan-700 text-white font-bold rounded-lg shadow hover:bg-cyan-800 transition"
            download
          >
            Télécharger le Dictionnaire PC (offline)
          </a>
        </div>
            <p className="mt-1">&copy; {new Date().getFullYear()} Numèè V2. Un projet éducatif pour la valorisation des langues de Nouvelle-Calédonie.</p>
        </div>
      </div>
    </footer>
  );
};



export default Footer;