import React from 'react';
import { ShieldCheck, CheckSquare, Users, Lock, ShieldAlert } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const Governance = () => {
  const pillars = [
    {
      title: 'One Source of Truth',
      desc: 'Every output comes directly from your Brand DNA memory, eliminating silos across copy, graphics, and web pages.',
      icon: ShieldCheck,
      color: 'text-indigo-400'
    },
    {
      title: 'Speed to Market',
      desc: 'Work that historically took weeks of brief creation, designer wait times, and coding now takes hours.',
      icon: CheckSquare,
      color: 'text-amber-400'
    },
    {
      title: 'Brand Consistency',
      desc: 'Built-in stylistic guardrails keep every piece of content, copy asset, and ad graphic on-brand as you scale.',
      icon: Lock,
      color: 'text-purple-400'
    },
    {
      title: 'Enterprise Power, Lean Team',
      desc: 'Get agency-level strategy, creative design, and landing page execution without the agency costs or headcount overhead.',
      icon: Users,
      color: 'text-emerald-400'
    }
  ];

  return (
    <section id="why-ai-ads" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 text-xs font-extrabold text-indigo-800 dark:text-indigo-400 shadow-sm">
            <span>THE UNFAIR ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
            Why AI Ads™
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Replace fragmented tools with a single intelligent platform designed for speed, scale, and brand governance.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <div 
                key={idx}
                className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-8 space-y-4 hover:border-indigo-400 dark:hover:border-indigo-500/30 transition-all shadow-lg flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                  <IconComp className={`w-6 h-6 ${p.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
