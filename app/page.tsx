'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import TechCard from '@/components/TechCard';
import ArchitectureBreakdown from '@/components/ArchitectureBreakdown';
import CompareView, { ScanResult } from '@/components/CompareView';
import { Search, Globe, ArrowRight, Loader2, AlertCircle, Clock, CheckCircle, ShieldAlert, Sparkles, Shield, Binary, Eye, Lock, Swords, LayoutList } from 'lucide-react';
import { DetectedTech } from '@/lib/technologies';
import { ArchitectureSummary } from '@/lib/gemini';

export default function Home() {
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');

  // Single Mode States
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Compare Mode States
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [compareResults, setCompareResults] = useState<{ siteA: ScanResult; siteB: ScanResult } | null>(null);

  const popularSites = [
    { name: 'Flipkart', url: 'flipkart.com' },
    { name: 'Vercel', url: 'vercel.com' },
    { name: 'Apple', url: 'apple.com' },
    { name: 'Shopify', url: 'shopify.com' },
    { name: 'Netflix', url: 'netflix.com' }
  ];

  const popularBattles = [
    { name: 'Zomato vs Swiggy', a: 'zomato.com', b: 'swiggy.com' },
    { name: 'Flipkart vs Amazon', a: 'flipkart.com', b: 'amazon.in' },
    { name: 'Vercel vs Netlify', a: 'vercel.com', b: 'netlify.com' },
    { name: 'Netflix vs Spotify', a: 'netflix.com', b: 'spotify.com' }
  ];

  const handleScan = async (targetUrl?: string) => {
    const finalUrl = (targetUrl || url).trim();
    if (!finalUrl) {
      setError('Please enter a website URL.');
      return;
    }

    setLoading(true);
    setError(null);
    if (targetUrl) setUrl(targetUrl);

    try {
      const res = await fetch('/api/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to inspect website.');
        setResult(null);
      } else {
        setResult(data);
        setActiveCategory('all');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred while scanning.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (targetA?: string, targetB?: string) => {
    const finalA = (targetA || urlA).trim();
    const finalB = (targetB || urlB).trim();

    if (!finalA || !finalB) {
      setCompareError('Please enter both website URLs to compare.');
      return;
    }

    setCompareLoading(true);
    setCompareError(null);
    if (targetA) setUrlA(targetA);
    if (targetB) setUrlB(targetB);

    try {
      const [resA, resB] = await Promise.all([
        fetch('/api/inspect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: finalA })
        }),
        fetch('/api/inspect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: finalB })
        })
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      if (!resA.ok) {
        setCompareError(`Failed to inspect Site A (${finalA}): ${dataA.error || 'Error'}`);
        return;
      }
      if (!resB.ok) {
        setCompareError(`Failed to inspect Site B (${finalB}): ${dataB.error || 'Error'}`);
        return;
      }

      setCompareResults({
        siteA: dataA,
        siteB: dataB
      });
    } catch (err: any) {
      setCompareError(err?.message || 'Comparison scan failed.');
    } finally {
      setCompareLoading(false);
    }
  };

  const filteredTechnologies = result ? (
    activeCategory === 'all' 
      ? result.detected 
      : (activeCategory === 'backend' 
          ? result.detected.filter(t => t.category === 'backend' || t.category === 'server')
          : (activeCategory === 'cms'
              ? result.detected.filter(t => t.category === 'cms' || t.category === 'ecommerce')
              : (activeCategory === 'payment'
                  ? result.detected.filter(t => t.category === 'payment' || t.category === 'database')
                  : result.detected.filter(t => t.category === activeCategory))))
  ) : [];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
          {/* MODE TOGGLE SWITCHER */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 shadow-inner">
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'single'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Single Inspector</span>
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'compare'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Compare Mode (Battle ⚔️)</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                NEW
              </span>
            </button>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            {viewMode === 'single' ? (
              <>
                Hackers-Grade <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Tech Stack</span> Inspector
              </>
            ) : (
              <>
                Side-by-Side <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Stack Battle</span> Arena
              </>
            )}
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            {viewMode === 'single'
              ? "Deconstruct any website's architecture — headers, cookies, CSP policies, frontend engines, backend APIs, CDNs, and security posture in seconds."
              : 'Pit any two websites head-to-head. Compare their frontend frameworks, backend engines, CDNs, security grades, and AI architecture verdicts.'}
          </p>

          {/* SINGLE MODE SEARCH BAR */}
          {viewMode === 'single' && (
            <div className="max-w-2xl mx-auto mt-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleScan();
                }}
                className="relative flex items-center"
              >
                <div className="absolute left-4 text-zinc-500 pointer-events-none">
                  <Globe className="w-5 h-5 text-indigo-400" />
                </div>

                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter domain (e.g., flipkart.com, netflix.com, apple.com)"
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-white text-sm transition-all shadow-xl placeholder:text-zinc-500"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Infiltrating...</span>
                    </>
                  ) : (
                    <>
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* QUICK PILLS */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-zinc-500">
                <span className="text-zinc-400 font-medium">Quick targets:</span>
                {popularSites.map((site) => (
                  <button
                    key={site.name}
                    onClick={() => handleScan(site.url)}
                    disabled={loading}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-indigo-300 hover:border-zinc-700 transition-colors"
                  >
                    {site.name}
                  </button>
                ))}
              </div>

              {error && (
                <div className="max-w-2xl mx-auto mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-xs text-left">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* COMPARE MODE DUAL INPUT */}
          {viewMode === 'compare' && (
            <div className="max-w-3xl mx-auto mt-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCompare();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                  {/* Site A Input */}
                  <div className="sm:col-span-5 relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        A
                      </span>
                    </div>
                    <input
                      type="text"
                      value={urlA}
                      onChange={(e) => setUrlA(e.target.value)}
                      placeholder="e.g. zomato.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-white text-sm transition-all shadow-xl placeholder:text-zinc-500 font-mono"
                    />
                  </div>

                  {/* VS Badge */}
                  <div className="sm:col-span-1 flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-amber-400">
                      VS
                    </span>
                  </div>

                  {/* Site B Input */}
                  <div className="sm:col-span-5 relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        B
                      </span>
                    </div>
                    <input
                      type="text"
                      value={urlB}
                      onChange={(e) => setUrlB(e.target.value)}
                      placeholder="e.g. swiggy.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none text-white text-sm transition-all shadow-xl placeholder:text-zinc-500 font-mono"
                    />
                  </div>
                </div>

                {/* Compare Submit Button */}
                <button
                  type="submit"
                  disabled={compareLoading}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  {compareLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Simulating Stack Battle...</span>
                    </>
                  ) : (
                    <>
                      <Swords className="w-4 h-4" />
                      <span>Compare Tech Stacks ⚔️</span>
                    </>
                  )}
                </button>
              </form>

              {/* QUICK BATTLE PRESETS */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-zinc-500">
                <span className="text-zinc-400 font-medium">Popular Battles:</span>
                {popularBattles.map((battle) => (
                  <button
                    key={battle.name}
                    onClick={() => handleCompare(battle.a, battle.b)}
                    disabled={compareLoading}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-zinc-700 transition-colors"
                  >
                    {battle.name}
                  </button>
                ))}
              </div>

              {compareError && (
                <div className="max-w-2xl mx-auto mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-xs text-left">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>{compareError}</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* RESULTS SECTION: COMPARE MODE */}
        {viewMode === 'compare' && compareResults && (
          <section className="max-w-5xl mx-auto px-4 pb-20">
            <CompareView siteA={compareResults.siteA} siteB={compareResults.siteB} />
          </section>
        )}

        {/* RESULTS SECTION: SINGLE MODE */}
        {viewMode === 'single' && result && (
          <section className="max-w-5xl mx-auto px-4 pb-20 space-y-8 animate-in fade-in duration-300">
            {/* SCAN SUMMARY & RECON STATS BAR */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-zinc-200 text-sm font-semibold">{result.hostname}</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[11px]">
                  HTTP {result.status}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                  result.recon.grade === 'A' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : (result.recon.grade === 'B' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30')
                }`}>
                  Security Grade: {result.recon.grade} ({result.recon.securityScore}/100)
                </span>
              </div>

              <div className="flex items-center gap-4 text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  {result.scanTimeMs}ms
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {result.totalDetected} Tech Signatures Found
                </span>
              </div>
            </div>

            {/* HACKER RECONNAISSANCE AUDIT PANEL */}
            <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs tracking-wider uppercase">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span>Security & Infrastructure Reconnaissance</span>
                </div>
                <div className="text-[11px] text-zinc-500">
                  {result.recon.cookiesCount} Cookies Intercepted • {result.recon.scriptsCount} Script Bundles Scanned
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {result.recon.clues.map((clue, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-zinc-300 font-mono text-[11px]">
                    <span>{clue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI ARCHITECTURE BREAKDOWN */}
            <ArchitectureBreakdown 
              architecture={result.architecture} 
              hostname={result.hostname} 
            />

            {/* CATEGORY FILTER TABS */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Tech', count: result.detected.length },
                  { id: 'frontend', label: 'Frontend UI', count: result.categories.frontend.length },
                  { id: 'backend', label: 'Backend & Server', count: (result.categories.backend.length + (result.categories.server?.length || 0)) },
                  { id: 'styling', label: 'Styling', count: result.categories.styling.length },
                  { id: 'hosting', label: 'Hosting & CDN', count: result.categories.hosting.length },
                  { id: 'analytics', label: 'Analytics & Observability', count: result.categories.analytics.length },
                  { id: 'payment', label: 'Payments & Database', count: ((result.categories.payment?.length || 0) + (result.categories.database?.length || 0)) },
                  { id: 'cms', label: 'CMS & E-Commerce', count: (result.categories.cms.length + result.categories.ecommerce.length) }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeCategory === tab.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === tab.id ? 'bg-indigo-800 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* TECH CARDS GRID */}
            {filteredTechnologies.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-zinc-950/40 border border-zinc-800 text-zinc-500 text-xs">
                No signatures identified in this specific category for {result.hostname}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTechnologies.map((tech) => (
                  <TechCard key={tech.name} tech={tech} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 StackLens — Hacker-grade web reconnaissance & architecture inspector.</p>
          <div className="flex items-center gap-3">
            <span>Powered by Next.js & Gemini AI</span>
            <span>•</span>
            <span className="text-indigo-400">100% Free & Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
