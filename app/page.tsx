'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import TechCard from '@/components/TechCard';
import ArchitectureBreakdown from '@/components/ArchitectureBreakdown';
import { Search, Globe, ArrowRight, Loader2, AlertCircle, Clock, CheckCircle, ShieldAlert, Sparkles, Shield, Binary, Eye, Lock } from 'lucide-react';
import { DetectedTech } from '@/lib/technologies';
import { ArchitectureSummary } from '@/lib/gemini';

interface ReconData {
  securityScore: number;
  grade: string;
  clues: string[];
  cookiesCount: number;
  scriptsCount: number;
}

interface ScanResult {
  url: string;
  hostname: string;
  status: number;
  scanTimeMs: number;
  totalDetected: number;
  detected: DetectedTech[];
  categories: Record<string, DetectedTech[]>;
  architecture: ArchitectureSummary;
  recon: ReconData;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const popularSites = [
    { name: 'Flipkart', url: 'flipkart.com' },
    { name: 'Vercel', url: 'vercel.com' },
    { name: 'WordPress', url: 'wordpress.org' },
    { name: 'Shopify', url: 'shopify.com' },
    { name: 'Netflix', url: 'netflix.com' }
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
        <section className="max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Binary className="w-3.5 h-3.5 text-indigo-400" />
            <span>Military-Grade Web Reconnaissance & Tech Inspection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Hackers-Grade <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Tech Stack</span> Inspector
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Deconstruct any website's architecture — headers, cookies, CSP policies, frontend engines, backend APIs, CDNs, and security posture in seconds.
          </p>

          {/* SEARCH BAR */}
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
                placeholder="Enter domain (e.g., flipkart.com, netflix.com, shopify.com)"
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
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="max-w-2xl mx-auto mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-xs text-left">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* RESULTS SECTION */}
        {result && (
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
