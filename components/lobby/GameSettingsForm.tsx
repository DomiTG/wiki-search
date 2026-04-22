'use client';

import { GameSettings } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Timer, MousePointer } from 'lucide-react';
import { pickRandomPair } from '@/lib/wikipedia';
import { DIFFICULTY_PRESETS } from '@/lib/game-logic';

interface GameSettingsFormProps {
  settings: GameSettings;
  onUpdate: (settings: Partial<GameSettings>) => void;
  isHost: boolean;
}

export function GameSettingsForm({ settings, onUpdate, isHost }: GameSettingsFormProps) {
  const randomize = () => {
    const pair = pickRandomPair();
    onUpdate({ startArticle: pair.start, targetArticle: pair.target });
  };

  const applyPreset = (difficulty: 'easy' | 'medium' | 'hard') => {
    onUpdate({ ...DIFFICULTY_PRESETS[difficulty], difficulty });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-semibold text-slate-200">Game Settings</span>
        {!isHost && (
          <Badge variant="outline" className="text-xs text-slate-500 border-slate-700">
            Host only
          </Badge>
        )}
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-xs uppercase tracking-wider">Difficulty</Label>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <Button
              key={d}
              size="sm"
              variant={settings.difficulty === d ? 'default' : 'outline'}
              className={`capitalize ${
                settings.difficulty === d
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
              onClick={() => applyPreset(d)}
              disabled={!isHost}
            >
              {d}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-400 text-xs uppercase tracking-wider">Articles</Label>
          {isHost && (
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white h-7 px-2"
              onClick={randomize}
            >
              <Shuffle className="w-3.5 h-3.5 mr-1" />
              Random
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-slate-500 text-xs mb-1.5 block">Start Article</Label>
            <Input
              value={settings.startArticle.replace(/_/g, ' ')}
              onChange={(e) => onUpdate({ startArticle: e.target.value.replace(/ /g, '_') })}
              disabled={!isHost}
              className="bg-slate-800 border-slate-700 text-slate-200 text-sm"
              placeholder="e.g. Albert Einstein"
            />
          </div>
          <div>
            <Label className="text-slate-500 text-xs mb-1.5 block">Target Article</Label>
            <Input
              value={settings.targetArticle.replace(/_/g, ' ')}
              onChange={(e) => onUpdate({ targetArticle: e.target.value.replace(/ /g, '_') })}
              disabled={!isHost}
              className="bg-slate-800 border-slate-700 text-slate-200 text-sm"
              placeholder="e.g. Pizza"
            />
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-sm text-slate-300">Timer</p>
            {settings.timerEnabled && (
              <p className="text-xs text-slate-500">{settings.timeLimitSeconds / 60} minutes</p>
            )}
          </div>
        </div>
        <Switch
          checked={settings.timerEnabled}
          onCheckedChange={(v) => onUpdate({ timerEnabled: v })}
          disabled={!isHost}
        />
      </div>

      {/* Click limit */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-sm text-slate-300">Click Limit</p>
            {settings.clickLimitEnabled && (
              <p className="text-xs text-slate-500">{settings.clickLimit} clicks max</p>
            )}
          </div>
        </div>
        <Switch
          checked={settings.clickLimitEnabled}
          onCheckedChange={(v) => onUpdate({ clickLimitEnabled: v })}
          disabled={!isHost}
        />
      </div>
    </div>
  );
}
