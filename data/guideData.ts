import React from 'react';
import { Home, HelpCircle, Users, Hash, Mail } from '../components/icons';

export interface GuidePhrase {
  french: string;
  numee: string;
  pronunciation?: string;
}

export interface GuideCategory {
  title: string;
  icon: React.ReactNode;
  phrases: GuidePhrase[];
}

export const guideData: GuideCategory[] = [
  {
    title: 'Salutations & Politesse',
    icon: React.createElement(Home, { className: "w-8 h-8 text-white" }),
    phrases: [
      { french: 'Bonjour', numee: 'Bôôcuu' },
      { french: 'Merci', numee: 'Mèsi' },
      { french: "S'il vous plaît", numee: 'Soopla' },
      { french: 'Oui', numee: 'Éé' },
      { french: 'Non', numee: 'Yaa' },
    ],
  },
  {
    title: 'Questions Courantes',
    icon: React.createElement(HelpCircle, { className: "w-8 h-8 text-white" }),
    phrases: [
      { french: 'Comment vas-tu ?', numee: 'Gu a tré ?' },
      { french: 'Où est... ?', numee: 'Âgaa... ?' },
      { french: 'Qu\'est-ce que c\'est ?', numee: 'Âgaa nââ yoo ?' },
      { french: 'Quel est ton nom ?', numee: 'Âgaa vanïï-o ?' },
    ],
  },
  {
    title: 'Personnes',
    icon: React.createElement(Users, { className: "w-8 h-8 text-white" }),
    phrases: [
      { french: 'Homme', numee: 'Ngâmoro' },
      { french: 'Femme', numee: 'Nyô' },
      { french: 'Enfant / Garçon', numee: 'Niikwêrê' },
      { french: 'Fille', numee: 'Nôrô' },
      { french: 'Mère', numee: 'Nyââ' },
      { french: 'Père', numee: 'Cica' },
    ],
  },
  {
    title: 'Chiffres',
    icon: React.createElement(Hash, { className: "w-8 h-8 text-white" }),
    phrases: [
      { french: 'Un', numee: 'Dètaa' },
      { french: 'Deux', numee: 'Boo' },
      { french: 'Trois', numee: 'Bètîî' },
      { french: 'Quatre', numee: 'Bèvoo' },
    ],
  },
  {
    title: 'Essentiels',
    icon: React.createElement(Mail, { className: "w-8 h-8 text-white" }),
    phrases: [
      { french: 'Manger', numee: 'Kii(rè)' },
      { french: 'Boire', numee: 'Kûû(rê)' },
      { french: 'Eau', numee: 'Jo' },
      { french: 'Nourriture', numee: 'Kaii' },
      { french: 'Maison', numee: 'Mwâ' },
      { french: 'Pirogue / Bateau', numee: 'Nyo' },
    ],
  },
];