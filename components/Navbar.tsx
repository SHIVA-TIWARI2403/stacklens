import React from 'react';
import { Layers, Sparkles, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Stack<span className="text-indigo-400">Lens</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs text-zinc-400">
          <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Architecture Engine Active</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free & Open</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
