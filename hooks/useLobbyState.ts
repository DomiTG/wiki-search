'use client';

import { useState, useCallback } from 'react';
import { LobbyState, Player, GameSettings } from '@/lib/types';
import { generateRoomCode, generateId, playerColors } from '@/lib/helpers';
import { DEFAULT_SETTINGS } from '@/lib/game-logic';

export function useLobbyState() {
  const [lobby, setLobby] = useState<LobbyState | null>(null);

  const createLobby = useCallback((mode: 'solo' | 'private', playerName: string) => {
    const playerId = generateId();
    const player: Player = {
      id: playerId,
      name: playerName,
      isHost: true,
      isReady: mode === 'solo',
      color: playerColors()[0],
    };
    const newLobby: LobbyState = {
      id: generateId(),
      code: generateRoomCode(),
      mode,
      players: [player],
      settings: { ...DEFAULT_SETTINGS },
      status: 'waiting',
      hostId: playerId,
    };
    setLobby(newLobby);
    return newLobby;
  }, []);

  const joinLobby = useCallback((code: string, playerName: string) => {
    const playerId = generateId();
    const hostId = generateId();
    const player: Player = {
      id: playerId,
      name: playerName,
      isHost: false,
      isReady: false,
      color: playerColors()[1],
    };
    const host: Player = {
      id: hostId,
      name: 'Host Player',
      isHost: true,
      isReady: true,
      color: playerColors()[0],
    };
    const newLobby: LobbyState = {
      id: generateId(),
      code: code.toUpperCase(),
      mode: 'private',
      players: [host, player],
      settings: { ...DEFAULT_SETTINGS },
      status: 'waiting',
      hostId,
    };
    setLobby(newLobby);
    return newLobby;
  }, []);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    setLobby((prev) =>
      prev ? { ...prev, settings: { ...prev.settings, ...settings } } : prev
    );
  }, []);

  const toggleReady = useCallback((playerId: string) => {
    setLobby((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, isReady: !p.isReady } : p
        ),
      };
    });
  }, []);

  const leaveLobby = useCallback(() => {
    setLobby(null);
  }, []);

  return { lobby, createLobby, joinLobby, updateSettings, toggleReady, leaveLobby };
}
