'use client';

import { Clock, MousePointer, Route, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '@/lib/game-logic';

interface StatsPanelProps {
  clickCount: number;
  elapsed: number;
  path: string[];
  targetArticle: string;
  currentArticle: string;
  timerEnabled: boolean;
  clickLimitEnabled: boolean;
  clickLimit: number;
  timeLimitSeconds: number;
}

export function StatsPanel({
  clickCount,
  elapsed,
  path,
  targetArticle,
  timerEnabled,
  clickLimitEnabled,
  clickLimit,
  timeLimitSeconds,
}: StatsPanelProps) {
  const timeRemaining = timeLimitSeconds - elapsed;
  const isTimeWarning = timerEnabled && timeRemaining <= 60;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {timerEnabled && (
        <div
          className={`flex items-center gap-1.5 text-sm font-mono font-semibold ${
            isTimeWarning ? 'text-red-400' : 'text-slate-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTime(Math.max(0, timeRemaining))}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5 text-sm text-slate-300">
        <MousePointer className="w-4 h-4" />
        <span className="font-mono font-semibold">
          {clickCount}
          {clickLimitEnabled && <span className="text-slate-500">/{clickLimit}</span>}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-slate-300">
        <Route className="w-4 h-4" />
        <span className="font-mono font-semibold">{path.length}</span>
        <span className="text-slate-500">pages</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-slate-300">
        <Target className="w-4 h-4 text-violet-400" />
        <span className="text-slate-400">→</span>
        <Badge
          variant="outline"
          className="text-violet-300 border-violet-500/50 bg-violet-500/10 text-xs"
        >
          {decodeURIComponent(targetArticle).replace(/_/g, ' ')}
        </Badge>
      </div>
    </div>
  );
}
