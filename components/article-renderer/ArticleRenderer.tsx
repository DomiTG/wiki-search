'use client';

import { useEffect, useRef, useCallback } from 'react';
import { rewriteArticleLinks } from '@/lib/sanitize';

interface ArticleRendererProps {
  html: string;
  title: string;
  onNavigate: (article: string) => void;
}

export function ArticleRenderer({ html, title, onNavigate }: ArticleRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const processedHtml = rewriteArticleLinks(html);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement | null;
      if (!link) return;

      e.preventDefault();
      e.stopPropagation();

      if (link.dataset.blocked === 'true' || link.dataset.external === 'true') {
        return;
      }

      const article = link.dataset.wikiArticle;
      if (article) {
        onNavigate(article);
      }
    },
    [onNavigate]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <div
      ref={containerRef}
      className="wiki-content prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
