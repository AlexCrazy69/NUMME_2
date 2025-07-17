import { useState, useEffect, useCallback } from 'react';
import { LevelProgress, QuizLevel } from '../types';

const STORAGE_KEY = 'numeeV2_progress';

export const useCertificationProgress = (): [
  LevelProgress,
  (level: QuizLevel, newScore: number, passed: boolean) => void
] => {
  const [progress, setProgress] = useState<LevelProgress>({});

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setProgress(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to parse progress from localStorage', error);
      setProgress({});
    }
  }, []);

  const updateLevelProgress = useCallback((level: QuizLevel, newScore: number, passed: boolean) => {
    setProgress((prev) => {
      const currentProgress = prev[level] || { passed: false, highScore: 0 };
      const newProgressData = {
        passed: currentProgress.passed || passed,
        highScore: Math.max(currentProgress.highScore, newScore),
      };
      
      const newProgress = { ...prev, [level]: newProgressData };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      } catch (error) {
        console.error('Failed to save progress to localStorage', error);
      }
      return newProgress;
    });
  }, []);

  return [progress, updateLevelProgress];
};