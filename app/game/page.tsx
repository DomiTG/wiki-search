'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Globe, ArrowLeft, Loader2, AlertCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameState } from '@/hooks/useGameState';
import { useHotkeyBlocker } from '@/hooks/useHotkeyBlocker';
import { ArticleRenderer } from '@/components/article-renderer/ArticleRenderer';
import { StatsPanel } from '@/components/game/StatsPanel';
import { PathBreadcrumb } from '@/components/game/PathBreadcrumb';
import { VictoryModal } from '@/components/game/VictoryModal';
import { SearchWarning } from '@/components/game/SearchWarning';
import { DEFAULT_SETTINGS } from '@/lib/game-logic';
import { WikiApiResponse } from '@/lib/types';

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const startArticle = searchParams.get('start') || DEFAULT_SETTINGS.startArticle;
  const targetArticle = searchParams.get('target') || DEFAULT_SETTINGS.targetArticle;

  const settings = { ...DEFAULT_SETTINGS, startArticle, targetArticle };
  const { state, elapsed, startGame, navigate, resetGame } = useGameState(settings);
  const { showWarning } = useHotkeyBlocker(true);

  const [article, setArticle] = useState<WikiApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const loadArticle = useCallback(
    async (title: string) => {
      setLoading(true);
      setFetchError('');
      try {
        const res = await fetch(`/api/wiki?title=${encodeURIComponent(title)}`);
        const data: WikiApiResponse = await res.json();
        if (data.error) {
          setFetchError(data.error);
        } else {
          setArticle(data);
          if (state.status === 'idle') {
            startGame();
          }
        }
      } catch {
        setFetchError('Failed to load article. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [state.status, startGame]
  );

  useEffect(() => {
    loadArticle(state.currentArticle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentArticle]);

  const handleNavigate = (articleTitle: string) => {
    navigate(articleTitle);
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" style={{ userSelect: 'none' }}>
      <SearchWarning show={showWarning} />

      <header className="border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white h-8 px-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <Globe className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <StatsPanel
              clickCount={state.clickCount}
              elapsed={elapsed}
              path={state.path}
              targetArticle={state.targetArticle}
              currentArticle={state.currentArticle}
              timerEnabled={state.settings.timerEnabled}
              clickLimitEnabled={state.settings.clickLimitEnabled}
              clickLimit={state.settings.clickLimit}
              timeLimitSeconds={state.settings.timeLimitSeconds}
            />
          </div>
        </div>
        <div className="border-t border-slate-800/40 max-w-5xl mx-auto px-4 py-1.5">
          <PathBreadcrumb path={state.path} />
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {article && !loading && (
          <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="text-2xl font-bold text-white"
                dangerouslySetInnerHTML={{ __html: article.title }}
              />
              {article.summary && (
                <p className="text-slate-400 text-sm mt-1 line-clamp-2 max-w-2xl">
                  {article.summary}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className="border-violet-500/40 text-violet-300 bg-violet-500/10 shrink-0 flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              {decodeURIComponent(targetArticle).replace(/_/g, ' ')}
            </Badge>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-violet-400 mx-auto" />
              <p className="text-slate-400 text-sm">Loading article...</p>
            </div>
          </div>
        )}

        {fetchError && !loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4 max-w-sm">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-slate-300 font-medium">Could not load article</p>
              <p className="text-slate-500 text-sm">{fetchError}</p>
              <Button
                onClick={() => loadArticle(state.currentArticle)}
                variant="outline"
                className="border-slate-700 text-slate-300"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {article && !loading && !fetchError && (
          <div className="wiki-article-content" style={{ userSelect: 'text' }}>
            <ArticleRenderer
              html={article.content}
              title={article.title}
              onNavigate={handleNavigate}
            />
          </div>
        )}
      </main>

      <VictoryModal
        open={state.status === 'won'}
        state={state}
        elapsed={elapsed}
        onPlayAgain={handlePlayAgain}
        onReturnHome={handleReturnHome}
      />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense>
      <GameContent />
    </Suspense>
  );
}
