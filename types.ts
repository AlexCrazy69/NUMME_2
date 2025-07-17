
export type Theme = 'light' | 'dark';

export type View = 'home' | 'dictionary' | 'quiz' | 'games' | 'memory-game' | 'memory-image-game' | 'seven-families-game' | 'fill-in-the-blank-game' | 'examen' | 'certification' | 'login' | 'admin' | 'contact' | 'scrabble-game' | 'user-dashboard' | 'guide';

export type QuizLevel = 'Bronze' | 'Argent' | 'Or';

export interface LevelProgressData {
  passed: boolean;
  highScore: number;
}
export type LevelProgress = Partial<Record<QuizLevel, LevelProgressData>>;


export interface QuizLevelConfig {
  name: QuizLevel;
  questions: number;
  passingScore: number;
  time: number; // en minutes
  colors: {
    bg: string;
    text: string;
    border: string;
    iconContainer: string;
  };
}

export interface DictionaryEntry {
  numee: string;
  french: string;
  type: string;
  definition?: string;
  examples: {
    numee: string;
    french: string;
  }[];
  phonetic?: string;
  homonym?: string;
  literal?: string;
  variants?: string;
  crossReference?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface MemoryGameWordPair {
    numee: string;
    french: string;
}

export interface QuizResult {
  score: number;
  total: number;
  level: QuizLevel;
  timedOut?: boolean;
}

// User Management
export interface User {
  username: string;
  role: 'admin' | 'user';
}

// Scrabble Game Types
export interface ScrabbleLetter {
  letter: string;
  points: number;
}

export interface Tile extends ScrabbleLetter {
  id: string; // Unique ID for each tile instance
}

export interface Player {
  rack: (Tile | null)[];
  score: number;
}