
import { QuizQuestion, MemoryGameWordPair, ScrabbleLetter } from '../types';
import { fullDictionary } from '../data/dictionary';

// Filter for entries that can be used in quizzes (have a clear question/answer format)
const quizCompatibleEntries = fullDictionary.filter(entry => 
    entry.french && entry.french.split(' ').length < 4 && !entry.french.includes('(')
);

// Filter for entries suitable for memory games (simple word pairs)
const memoryGameWords = fullDictionary.filter(entry =>
    entry.numee.length > 2 && entry.french.length > 2 && !entry.numee.includes('-') && !entry.french.includes(' ')
).map(entry => ({ numee: entry.numee, french: entry.french }));


export const generateQuiz = (questionCount: number = 10): Promise<QuizQuestion[]> => {
    const shuffledEntries = [...quizCompatibleEntries].sort(() => 0.5 - Math.random());
    const selectedEntries = shuffledEntries.slice(0, questionCount);

    const questions: QuizQuestion[] = selectedEntries.map(entry => {
        // For each question, get a fresh set of wrong answers from the whole pool
        const otherOptions = [...quizCompatibleEntries]
            .filter(e => e.numee !== entry.numee) // Exclude the correct answer
            .sort(() => 0.5 - Math.random()) // Shuffle the rest
            .slice(0, 3) // Take 3 random wrong answers
            .map(e => e.numee);
            
        const options = [...otherOptions, entry.numee].sort(() => 0.5 - Math.random());
        
        return {
            question: entry.french,
            options: options,
            answer: entry.numee
        };
    });

    return new Promise(resolve => setTimeout(() => resolve(questions), 300));
};

export const generateMemoryGameWords = (count: number = 8): Promise<MemoryGameWordPair[]> => {
    const shuffled = [...memoryGameWords].sort(() => 0.5 - Math.random());
    return new Promise(resolve => setTimeout(() => resolve(shuffled.slice(0, count)), 300));
};

const SCRABBLE_LETTERS_DISTRIBUTION: { letter: string; points: number; count: number }[] = [
    { letter: 'A', points: 1, count: 9 }, { letter: 'B', points: 3, count: 2 }, { letter: 'C', points: 3, count: 2 },
    { letter: 'D', points: 2, count: 3 }, { letter: 'E', points: 1, count: 15 }, { letter: 'F', points: 4, count: 2 },
    { letter: 'G', points: 2, count: 2 }, { letter: 'H', points: 4, count: 2 }, { letter: 'I', points: 1, count: 8 },
    { letter: 'J', points: 8, count: 1 }, { letter: 'K', points: 10, count: 1 }, { letter: 'L', points: 1, count: 5 },
    { letter: 'M', points: 2, count: 3 }, { letter: 'N', points: 1, count: 6 }, { letter: 'O', points: 1, count: 6 },
    { letter: 'P', points: 3, count: 2 }, { letter: 'Q', points: 8, count: 1 }, { letter: 'R', points: 1, count: 6 },
    { letter: 'S', points: 1, count: 6 }, { letter: 'T', points: 1, count: 6 }, { letter: 'U', points: 1, count: 6 },
    { letter: 'V', points: 4, count: 2 }, { letter: 'W', points: 10, count: 1 }, { letter: 'X', points: 10, count: 1 },
    { letter: 'Y', points: 10, count: 1 }, { letter: 'Z', points: 10, count: 1 },
];

export const getScrabbleLetters = (): ScrabbleLetter[] => {
    const letterBag: ScrabbleLetter[] = [];
    SCRABBLE_LETTERS_DISTRIBUTION.forEach(item => {
        for(let i = 0; i < item.count; i++) {
            letterBag.push({ letter: item.letter, points: item.points });
        }
    });
    return letterBag;
};