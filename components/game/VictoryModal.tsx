'use client';

import { Trophy, Clock, MousePointer, Route, Copy, RotateCcw, Home } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/game-logic';
import { GameState } from '@/lib/types';

interface VictoryModalProps {
  open: boolean;
  state: GameState;
  elapsed: number;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export function VictoryModal({
  open,
  state,
  elapsed,
  onPlayAgain,
  onReturnHome,
}: VictoryModalProps) {
  const copyResult = () => {
    const result = [
      `🏆 WikiRace Result`,
      `📍 ${decodeURIComponent(state.startArticle).replace(/_/g, ' ')} → ${decodeURIComponent(state.targetArticle).replace(/_/g, ' ')}`,
      `🖱️ Clicks: ${state.clickCount}`,
      `⏱️ Time: ${formatTime(elapsed)}`,
      `🗺️ Path (${state.path.length} pages):`,
      state.path.map((p, i) => `  ${i + 1}. ${decodeURIComponent(p).replace(/_/g, ' ')}`).join('\n'),
    ].join('\n');
    navigator.clipboard.writeText(result);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <div className="text-center space-y-6 py-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center ring-2 ring-yellow-500/40">
                <Trophy className="w-10 h-10 text-yellow-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">✓</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">You made it!</h2>
            <p className="text-slate-400 mt-1 text-sm">
              {decodeURIComponent(state.startArticle).replace(/_/g, ' ')} →{' '}
              {decodeURIComponent(state.targetArticle).replace(/_/g, ' ')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <MousePointer className="w-5 h-5 text-violet-400 mx-auto mb-1" />
              <div className="text-2xl font-bold font-mono">{state.clickCount}</div>
              <div className="text-xs text-slate-500">clicks</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-2xl font-bold font-mono">{formatTime(elapsed)}</div>
              <div className="text-xs text-slate-500">time</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <Route className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-2xl font-bold font-mono">{state.path.length}</div>
              <div className="text-xs text-slate-500">pages</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={copyResult}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Result
            </Button>
            <Button onClick={onPlayAgain} className="bg-violet-600 hover:bg-violet-700 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button
              onClick={onReturnHome}
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
