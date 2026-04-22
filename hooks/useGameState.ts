'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GameSettings } from '@/lib/types';
import {
  createInitialGameState,
  navigateToArticle,
  getElapsedSeconds,
  isTimeUp,
  isClickLimitReached,
} from '@/lib/game-logic';

export function useGameState(settings: GameSettings) {
  const [state, setState] = useState<GameState>(() => createInitialGameState(settings));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const startGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'playing',
      startTime: Date.now(),
    }));
  }, []);

  const navigate = useCallback((article: string) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      return navigateToArticle(prev, article);
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(createInitialGameState(settings));
    setElapsed(0);
  }, [settings]);

  useEffect(() => {
    if (state.status === 'playing') {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (isTimeUp(prev)) {
            return { ...prev, status: 'lost', endTime: Date.now() };
          }
          if (isClickLimitReached(prev)) {
            return { ...prev, status: 'lost', endTime: Date.now() };
          }
          return prev;
        });
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.startTime]);

  useEffect(() => {
    if (state.startTime) {
      const end = state.endTime ?? Date.now();
      setElapsed(Math.floor((end - state.startTime) / 1000));
    }
  }, [state.startTime, state.endTime, state.status]);

  // Keep elapsed in sync with actual time
  const syncedElapsed = state.startTime
    ? Math.floor(((state.endTime ?? Date.now()) - state.startTime) / 1000)
    : 0;

  return { state, elapsed: state.status === 'playing' ? elapsed : syncedElapsed, startGame, navigate, resetGame };
}
