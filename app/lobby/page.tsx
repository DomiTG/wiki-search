'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Globe, ArrowLeft, Users, Lock, User, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLobbyState } from '@/hooks/useLobbyState';
import { GameSettingsForm } from '@/components/lobby/GameSettingsForm';
import { PlayerList } from '@/components/lobby/PlayerList';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function LobbyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultMode = searchParams.get('mode') || 'solo';
  const { lobby, createLobby, joinLobby, updateSettings, leaveLobby } = useLobbyState();

  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = (mode: 'solo' | 'private') => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    createLobby(mode, playerName.trim());
  };

  const handleJoin = () => {
    if (!playerName.trim()) { setError('Please enter your name'); return; }
    if (!joinCode.trim() || joinCode.trim().length < 4) { setError('Enter a valid room code'); return; }
    setError('');
    joinLobby(joinCode.trim(), playerName.trim());
  };

  const copyCode = () => {
    if (lobby) {
      navigator.clipboard.writeText(lobby.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startGame = () => {
    if (lobby) {
      router.push(
        `/game?start=${encodeURIComponent(lobby.settings.startArticle)}&target=${encodeURIComponent(lobby.settings.targetArticle)}`
      );
    }
  };

  if (lobby) {
    const currentPlayer = lobby.players[lobby.mode === 'solo' ? 0 : lobby.players.length - 1];
    const isHost = currentPlayer?.isHost ?? false;
    const allReady = lobby.players.every((p) => p.isReady || p.isHost);

    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => leaveLobby()}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Leave
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" />
              <span className="font-semibold">WikiRace</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {lobby.mode !== 'solo' && (
                <>
                  <span className="text-slate-500 text-sm">Room:</span>
                  <Badge className="bg-slate-800 text-slate-200 border-slate-700 font-mono tracking-widest">
                    {lobby.code}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-slate-400"
                    onClick={copyCode}
                  >
                    {copied ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </>
              )}
              {lobby.mode === 'solo' && (
                <Badge variant="outline" className="border-violet-500/50 text-violet-300">
                  Solo
                </Badge>
              )}
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <GameSettingsForm
                    settings={lobby.settings}
                    onUpdate={updateSettings}
                    isHost={isHost}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {lobby.mode !== 'solo' && (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <PlayerList players={lobby.players} currentPlayerId={currentPlayer?.id} />
                  </CardContent>
                </Card>
              )}

              <Button
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                onClick={startGame}
                disabled={lobby.mode !== 'solo' && !allReady}
              >
                {lobby.mode === 'solo'
                  ? 'Start Game'
                  : isHost
                  ? 'Start Match'
                  : 'Waiting for host...'}
              </Button>

              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-2">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Quick Info
                </p>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <p>
                    → <span className="text-slate-300">Start:</span>{' '}
                    {lobby.settings.startArticle.replace(/_/g, ' ')}
                  </p>
                  <p>
                    → <span className="text-slate-300">Target:</span>{' '}
                    {lobby.settings.targetArticle.replace(/_/g, ' ')}
                  </p>
                  <p>
                    → <span className="text-slate-300">Timer:</span>{' '}
                    {lobby.settings.timerEnabled
                      ? `${lobby.settings.timeLimitSeconds / 60} min`
                      : 'Off'}
                  </p>
                  <p>
                    → <span className="text-slate-300">Click limit:</span>{' '}
                    {lobby.settings.clickLimitEnabled
                      ? `${lobby.settings.clickLimit} clicks`
                      : 'Off'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <nav className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-400" />
            <span className="font-semibold">WikiRace</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Join the Race</h1>
            <p className="text-slate-400 text-sm">Choose how you want to play</p>
          </div>

          <div>
            <Label htmlFor="name" className="text-slate-400 text-sm mb-2 block">
              Your Name
            </Label>
            <Input
              id="name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="bg-slate-900 border-slate-700 text-white"
              maxLength={24}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Tabs
            defaultValue={
              defaultMode === 'join' ? 'join' : defaultMode === 'create' ? 'create' : 'solo'
            }
          >
            <TabsList className="w-full bg-slate-900 border border-slate-800">
              <TabsTrigger
                value="solo"
                className="flex-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Solo
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5" />
                Create
              </TabsTrigger>
              <TabsTrigger
                value="join"
                className="flex-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Join
              </TabsTrigger>
            </TabsList>

            <TabsContent value="solo" className="mt-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm text-slate-400">
                    Play on your own. No timer, no pressure — unless you set it yourself.
                  </p>
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={() => handleCreate('solo')}
                  >
                    Play Solo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="mt-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm text-slate-400">
                    Create a private room. Share the code with friends to race together.
                  </p>
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={() => handleCreate('private')}
                  >
                    Create Private Room
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="join" className="mt-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-5 space-y-3">
                  <div>
                    <Label className="text-slate-400 text-sm mb-2 block">Room Code</Label>
                    <Input
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="e.g. ABC123"
                      maxLength={8}
                      className="bg-slate-800 border-slate-700 text-white font-mono tracking-widest uppercase"
                    />
                  </div>
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={handleJoin}
                  >
                    Join Room
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function LobbyPage() {
  return (
    <Suspense>
      <LobbyPageContent />
    </Suspense>
  );
}
