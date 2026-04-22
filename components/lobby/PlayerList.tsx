'use client';

import { Player } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Crown, CheckCircle, Clock } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
        Players ({players.length})
      </p>
      {players.map((player) => (
        <div
          key={player.id}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
            player.id === currentPlayerId
              ? 'bg-violet-500/10 border-violet-500/30'
              : 'bg-slate-800/50 border-slate-700/50'
          }`}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: player.color }}
          >
            {player.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-200 truncate">{player.name}</span>
              {player.id === currentPlayerId && (
                <Badge
                  variant="outline"
                  className="text-xs border-violet-500/50 text-violet-400 shrink-0"
                >
                  You
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {player.isHost && <Crown className="w-4 h-4 text-yellow-400" />}
            {player.isReady ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Clock className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
