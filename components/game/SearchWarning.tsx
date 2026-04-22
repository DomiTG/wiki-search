'use client';

import { AlertTriangle } from 'lucide-react';

interface SearchWarningProps {
  show: boolean;
}

export function SearchWarning({ show }: SearchWarningProps) {
  if (!show) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-red-900/90 border border-red-500/50 text-red-200 px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-2xl backdrop-blur-sm">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        <span className="text-sm font-medium">
          No searching allowed! Navigate using article links only.
        </span>
      </div>
    </div>
  );
}
