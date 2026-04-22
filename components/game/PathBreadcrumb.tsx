'use client';

import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PathBreadcrumbProps {
  path: string[];
}

export function PathBreadcrumb({ path }: PathBreadcrumbProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap" orientation="horizontal">
      <div className="flex items-center gap-1 text-xs text-slate-500 pb-1">
        {path.map((article, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
            <span
              className={`shrink-0 ${
                i === path.length - 1 ? 'text-slate-300 font-medium' : 'text-slate-500'
              }`}
            >
              {decodeURIComponent(article).replace(/_/g, ' ')}
            </span>
          </span>
        ))}
      </div>
    </ScrollArea>
  );
}
