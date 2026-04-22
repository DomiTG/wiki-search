import { GameState, GameSettings } from './types';

export const DEFAULT_SETTINGS: GameSettings = {
  startArticle: 'Albert_Einstein',
  targetArticle: 'Pizza',
  timerEnabled: true,
  timeLimitSeconds: 600,
  clickLimitEnabled: false,
  clickLimit: 20,
  difficulty: 'medium',
};

export const DIFFICULTY_PRESETS: Record<string, Partial<GameSettings>> = {
  easy: { timerEnabled: false, clickLimitEnabled: false },
  medium: { timerEnabled: true, timeLimitSeconds: 600, clickLimitEnabled: false },
  hard: { timerEnabled: true, timeLimitSeconds: 300, clickLimitEnabled: true, clickLimit: 15 },
};

export function createInitialGameState(settings: GameSettings): GameState {
  return {
    status: 'idle',
    currentArticle: settings.startArticle,
    targetArticle: settings.targetArticle,
    startArticle: settings.startArticle,
    path: [settings.startArticle],
    clickCount: 0,
    startTime: null,
    endTime: null,
    settings,
  };
}

export function navigateToArticle(state: GameState, article: string): GameState {
  const now = Date.now();
  const newPath = [...state.path, article];
  const newClickCount = state.clickCount + 1;
  const isWon = normalizeTitle(article) === normalizeTitle(state.targetArticle);

  return {
    ...state,
    status: isWon ? 'won' : 'playing',
    currentArticle: article,
    path: newPath,
    clickCount: newClickCount,
    startTime: state.startTime ?? now,
    endTime: isWon ? now : null,
  };
}

export function normalizeTitle(title: string): string {
  return decodeURIComponent(title).replace(/_/g, ' ').toLowerCase().trim();
}

export function checkWin(current: string, target: string): boolean {
  return normalizeTitle(current) === normalizeTitle(target);
}

export function getElapsedSeconds(state: GameState): number {
  if (!state.startTime) return 0;
  const end = state.endTime ?? Date.now();
  return Math.floor((end - state.startTime) / 1000);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function isTimeUp(state: GameState): boolean {
  if (!state.settings.timerEnabled || !state.startTime) return false;
  return getElapsedSeconds(state) >= state.settings.timeLimitSeconds;
}

export function isClickLimitReached(state: GameState): boolean {
  if (!state.settings.clickLimitEnabled) return false;
  return state.clickCount >= state.settings.clickLimit;
}
