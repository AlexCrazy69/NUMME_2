import React, { useState } from 'react';
import { Mail } from './icons';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Suggestion/Correction pour Numèè V2');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:contact@numee-v2.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-3">
          <Mail className="w-10 h-10 text-cyan-500" />
          Contactez-nous
        </h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          Votre avis est important. Faites-nous part de vos suggestions, corrections ou questions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold">Merci pour votre message !</h3>
            <p className="mt-2">Votre client de messagerie devrait s'ouvrir. Si ce n'est pas le cas, vous pouvez nous envoyer un email directement à <strong>contact@numee-v2.com</strong>.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nom</label>
            <input type="text" name="name" id="name" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Votre Email</label>
            <input type="email" name="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
           <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Sujet</label>
            <select id="subject" name="subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 rounded-md">
                <option>Suggestion/Correction pour Numèè V2</option>
                <option>Question sur la langue Numèè</option>
                <option>Problème technique</option>
                <option>Autre</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
            <textarea id="message" name="message" rows={4} required value={message} onChange={e => setMessage(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></textarea>
          </div>
          <div className="text-right">
             <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                Envoyer le message
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Contact;
