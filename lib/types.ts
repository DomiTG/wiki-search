export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  color: string;
}

export interface GameSettings {
  startArticle: string;
  targetArticle: string;
  timerEnabled: boolean;
  timeLimitSeconds: number;
  clickLimitEnabled: boolean;
  clickLimit: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'custom';
}

export interface LobbyState {
  id: string;
  code: string;
  mode: 'solo' | 'private' | 'public';
  players: Player[];
  settings: GameSettings;
  status: 'waiting' | 'in_progress' | 'finished';
  hostId: string;
}

export interface GameState {
  status: 'idle' | 'playing' | 'won' | 'lost';
  currentArticle: string;
  targetArticle: string;
  startArticle: string;
  path: string[];
  clickCount: number;
  startTime: number | null;
  endTime: number | null;
  settings: GameSettings;
}

export interface ArticleContent {
  title: string;
  html: string;
  summary: string;
}

export interface WikiApiResponse {
  title: string;
  content: string;
  summary: string;
  error?: string;
}
