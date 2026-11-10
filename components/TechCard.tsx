import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, ChevronDown, ChevronUp, SearchCode } from 'lucide-react';
import { DetectedTech } from '@/lib/technologies';

interface TechCardProps {
  tech: DetectedTech;
}

export default function TechCard({ tech }: TechCardProps) {
  const [showEvidence, setShowEvidence] = useState(false);

  const categoryLabels: Record<string, { label: string; badge: string }> = {
    frontend: { label: 'Frontend UI', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    backend: { label: 'Backend / Server', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    styling: { label: 'CSS / Styling', badge: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
    cms: { label: 'CMS Platform', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    ecommerce: { label: 'E-Commerce', badge: 'bg-lime-500/10 text-lime-400 border-lime-500/30' },
    hosting: { label: 'Hosting & CDN', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    server: { label: 'Web Server', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    analytics: { label: 'Analytics & Tools', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  };

  const cat = categoryLabels[tech.category] || { label: tech.category, badge: 'bg-zinc-800 text-zinc-300 border-zinc-700' };

  return (
    <div className="group rounded-2xl bg-zinc-900/70 border border-zinc-800/80 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 glow-card flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-xl shrink-0">
              {tech.icon}
            </div>
            <div>
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                {tech.name}
                <a
                  href={tech.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-indigo-400 transition-colors"
                  title="Visit official website"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </h4>
              <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full border mt-1 ${cat.badge}`}>
                {cat.label}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {tech.confidence}%
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Confidence</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
          {tech.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/60">
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="w-full flex items-center justify-between text-xs text-zinc-400 hover:text-indigo-300 py-1 font-medium transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <SearchCode className="w-3.5 h-3.5 text-indigo-400" />
            Detection Evidence ({tech.evidence.length})
          </span>
          {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showEvidence && (
          <div className="mt-2.5 space-y-1.5 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
            {tech.evidence.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                <span className="text-indigo-400 shrink-0 font-bold">•</span>
                <span className="font-mono text-zinc-400">{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
