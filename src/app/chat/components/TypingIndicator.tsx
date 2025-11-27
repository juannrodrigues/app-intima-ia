'use client';

import { Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-[200px]">
      <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
