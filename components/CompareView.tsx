import React from 'react';
import { Trophy, Zap, Shield, ExternalLink, ArrowRight, CheckCircle2, AlertTriangle, Layers, Sparkles } from 'lucide-react';
import { DetectedTech } from '@/lib/technologies';
import { ArchitectureSummary } from '@/lib/gemini';

export interface ScanResult {
  url: string;
  hostname: string;
  status: number;
  scanTimeMs: number;
  totalDetected: number;
  detected: DetectedTech[];
  categories: Record<string, DetectedTech[]>;
  architecture: ArchitectureSummary;
  recon: {
    securityScore: number;
    grade: string;
    clues: string[];
    cookiesCount: number;
    scriptsCount: number;
  };
}

interface CompareViewProps {
  siteA: ScanResult;
  siteB: ScanResult;
}

export default function CompareView({ siteA, siteB }: CompareViewProps) {
  // Determine Winners
  const speedWinner = siteA.scanTimeMs < siteB.scanTimeMs ? 'A' : (siteA.scanTimeMs > siteB.scanTimeMs ? 'B' : 'Tie');
  const securityWinner = siteA.recon.securityScore > siteB.recon.securityScore ? 'A' : (siteA.recon.securityScore < siteB.recon.securityScore ? 'B' : 'Tie');
  const techWinner = siteA.totalDetected > siteB.totalDetected ? 'A' : (siteA.totalDetected < siteB.totalDetected ? 'B' : 'Tie');

  const categoriesToCompare: { id: string; label: string }[] = [
    { id: 'frontend', label: 'Frontend Frameworks' },
    { id: 'backend', label: 'Backend & Server Engines' },
    { id: 'styling', label: 'Styling Systems' },
    { id: 'hosting', label: 'Hosting & CDN Infrastructure' },
    { id: 'analytics', label: 'Analytics & Observability' },
    { id: 'payment', label: 'Payments & Cloud DB' }
  ];

  const getTechForCat = (result: ScanResult, catId: string) => {
    if (catId === 'backend') {
      return [...(result.categories.backend || []), ...(result.categories.server || [])];
    }
    if (catId === 'payment') {
      return [...(result.categories.payment || []), ...(result.categories.database || [])];
    }
    return result.categories[catId] || [];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ⚔️ BATTLE HEADLINE SCOREBOARD */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-cyan-950/60 border border-indigo-500/30 p-6 md:p-8 glow-effect">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left pb-6 border-b border-indigo-500/20">
          {/* Site A Header */}
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Site A
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5 font-mono truncate">
              {siteA.hostname}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              HTTP {siteA.status} • {siteA.scanTimeMs}ms
            </p>
          </div>

          {/* VS Battle Badge */}
          <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-indigo-500/50 flex items-center justify-center font-black text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-cyan-400 shadow-lg shadow-indigo-500/20 shrink-0">
            VS
          </div>

          {/* Site B Header */}
          <div className="flex-1 text-center sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Site B
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5 font-mono truncate">
              {siteB.hostname}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              HTTP {siteB.status} • {siteB.scanTimeMs}ms
            </p>
          </div>
        </div>

        {/* HEAD-TO-HEAD WINNER METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {/* Metric 1: Security Grade */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
            <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block">
              Security Defense
            </span>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className={`text-base font-bold ${siteA.recon.grade === 'A' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {siteA.recon.grade} ({siteA.recon.securityScore}%)
              </span>
              <span className="text-zinc-600 text-xs">vs</span>
              <span className={`text-base font-bold ${siteB.recon.grade === 'A' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {siteB.recon.grade} ({siteB.recon.securityScore}%)
              </span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-indigo-400 flex items-center justify-center gap-1">
              {securityWinner !== 'Tie' ? (
                <>
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Leader: {securityWinner === 'A' ? siteA.hostname : siteB.hostname}</span>
                </>
              ) : (
                <span>Tied Defense</span>
              )}
            </div>
          </div>

          {/* Metric 2: Scan Response Speed */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
            <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block">
              Server Response Speed
            </span>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-base font-bold text-white font-mono">{siteA.scanTimeMs}ms</span>
              <span className="text-zinc-600 text-xs">vs</span>
              <span className="text-base font-bold text-white font-mono">{siteB.scanTimeMs}ms</span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Faster: {speedWinner === 'A' ? siteA.hostname : siteB.hostname}</span>
            </div>
          </div>

          {/* Metric 3: Stack Complexity */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
            <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block">
              Disclosed Tech Footprint
            </span>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-base font-bold text-white">{siteA.totalDetected} Tech</span>
              <span className="text-zinc-600 text-xs">vs</span>
              <span className="text-base font-bold text-white">{siteB.totalDetected} Tech</span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-indigo-400 flex items-center justify-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>{techWinner === 'A' ? `${siteA.hostname} has richer detection` : `${siteB.hostname} has richer detection`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 CATEGORY-BY-CATEGORY SIDE-BY-SIDE BREAKDOWN */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Architecture & Stack Matrix</span>
        </h4>

        <div className="space-y-4">
          {categoriesToCompare.map((cat) => {
            const listA = getTechForCat(siteA, cat.id);
            const listB = getTechForCat(siteB, cat.id);

            return (
              <div key={cat.id} className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden">
                <div className="px-5 py-2.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>{cat.label}</span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {listA.length} vs {listB.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800/80 p-4 gap-4 md:gap-0">
                  {/* Left Column: Site A */}
                  <div className="md:pr-4 space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block md:hidden">
                      {siteA.hostname}
                    </span>
                    {listA.length === 0 ? (
                      <p className="text-xs text-zinc-600 italic py-1">No explicit signatures detected</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {listA.map((t) => (
                          <div
                            key={t.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-white"
                          >
                            <span>{t.icon}</span>
                            <span className="font-semibold">{t.name}</span>
                            <span className="text-[10px] text-zinc-400">({t.confidence}%)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Site B */}
                  <div className="md:pl-4 space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block md:hidden">
                      {siteB.hostname}
                    </span>
                    {listB.length === 0 ? (
                      <p className="text-xs text-zinc-600 italic py-1">No explicit signatures detected</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {listB.map((t) => (
                          <div
                            key={t.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-white"
                          >
                            <span>{t.icon}</span>
                            <span className="font-semibold">{t.name}</span>
                            <span className="text-[10px] text-zinc-400">({t.confidence}%)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🧠 SIDE-BY-SIDE AI ARCHITECTURE VERDICTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Site A Architecture */}
        <div className="rounded-2xl bg-zinc-950/80 border border-indigo-500/30 p-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{siteA.hostname} Architecture</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed mt-2">
            {siteA.architecture.overview}
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300">Clone Strategy: </span>
            {siteA.architecture.cloneTips}
          </div>
        </div>

        {/* Site B Architecture */}
        <div className="rounded-2xl bg-zinc-950/80 border border-cyan-500/30 p-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{siteB.hostname} Architecture</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed mt-2">
            {siteB.architecture.overview}
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300">Clone Strategy: </span>
            {siteB.architecture.cloneTips}
          </div>
        </div>
      </div>
    </div>
  );
}
