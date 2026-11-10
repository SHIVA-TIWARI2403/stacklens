import React, { useState } from 'react';
import { Sparkles, Terminal, Cpu, Cloud, Lightbulb, Copy, Check } from 'lucide-react';
import { ArchitectureSummary } from '@/lib/gemini';

interface ArchitectureBreakdownProps {
  architecture: ArchitectureSummary;
  hostname: string;
}

export default function ArchitectureBreakdown({ architecture, hostname }: ArchitectureBreakdownProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `Architecture Breakdown for ${hostname}:
Overview: ${architecture.overview}
Frontend Role: ${architecture.frontendRole}
Backend Role: ${architecture.backendRole}
Infrastructure: ${architecture.infrastructureRole}
Clone Tips: ${architecture.cloneTips}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-indigo-950/40 via-zinc-900/60 to-zinc-950 border border-indigo-500/30 p-6 md:p-8 relative overflow-hidden glow-effect">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Architecture Intelligence
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            How <span className="text-indigo-400">{hostname}</span> is Built
          </h3>
          <p className="text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
            {architecture.overview}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-indigo-500/50 text-xs text-zinc-200 hover:text-white transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied Report!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>Copy Breakdown</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Frontend Role */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/80 p-5">
          <div className="flex items-center gap-2.5 text-cyan-400 font-semibold text-sm mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <span>Frontend & Client Experience</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {architecture.frontendRole}
          </p>
        </div>

        {/* Backend Role */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/80 p-5">
          <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <span>Backend, APIs & Business Logic</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {architecture.backendRole}
          </p>
        </div>

        {/* Infrastructure Role */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/80 p-5">
          <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <span>Hosting, CDN & Delivery</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {architecture.infrastructureRole}
          </p>
        </div>

        {/* Clone Guidance */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-5">
          <div className="flex items-center gap-2.5 text-indigo-300 font-semibold text-sm mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-indigo-300" />
            </div>
            <span>How to Clone this Stack</span>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed">
            {architecture.cloneTips}
          </p>
        </div>
      </div>
    </div>
  );
}
