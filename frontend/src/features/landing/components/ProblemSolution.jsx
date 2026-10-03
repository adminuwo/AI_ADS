import React, { useState } from 'react';
import { XCircle, CheckCircle2, ShieldCheck, Zap, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const ProblemSolution = () => {
  const { setActiveModule } = useWorkspace();
  const [activeTab, setActiveTab] = useState('compare'); // 'compare' | 'old' | 'aiads'

  const painSolutionPairs = [
    {
      id: 'brand',
      num: '01',
      targetModule: 'brands',
      painTitle: 'Inconsistent brand voice',
      painDesc: 'Freelancers & basic AI tools lose context, causing off-brand visuals and tone drift.',
      solutionTitle: 'Brand DNA Memory keeps every post on-brand',
      solutionDesc: 'Auto-ingests logos, color hex codes, personas, and claim rules into permanent AI memory.',
      icon: ShieldCheck,
      color: 'indigo'
    },
    {
      id: 'velocity',
      num: '02',
      targetModule: 'strategy',
      painTitle: 'Slow content production',
      painDesc: 'Planning 30 days of posts takes weeks of manual brief writing and designer delays.',
      solutionTitle: '30-day strategy & 8K ad visuals in seconds',
      solutionDesc: 'Generates non-repeating daily directives, photorealistic 8K ad renders, and copy in 1 click.',
      icon: Zap,
      color: 'purple'
    },
    {
      id: 'governance',
      num: '03',
      targetModule: 'campaigns',
      painTitle: 'Scattered tools & messy approvals',
      painDesc: 'Managing content across split sheets, folders, and email chains leads to errors.',
      solutionTitle: 'One unified platform with team roles & governance',
      solutionDesc: 'Human-in-the-loop review queue for agencies and clients with claim verification & RBAC.',
      icon: Layers,
      color: 'cyan'
    }
  ];

  return (
    <section className="py-8 lg:py-12 bg-slate-50/90 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>THE MARKETING CHALLENGE & SOLUTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
            Marketing Shouldn't Mean Juggling Ten Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Long production cycles, scattered tools, and brand drift slow you down. See how AI Ads™ replaces the chaos.
          </p>

          {/* Interactive View Toggle Switch */}
          <div className="pt-1 flex items-center justify-center">
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('compare')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'compare'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>⚖️ Side-by-Side</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('old')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'old'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>❌ The Old Way</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('aiads')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'aiads'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>⚡ AI Ads™ Solution</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Interactive Cards Grid (Compact Single Viewport Fit) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 pt-1">
          {painSolutionPairs.map((pair) => {
            const IconComp = pair.icon;
            return (
              <div 
                key={pair.id}
                onClick={() => setActiveModule(pair.targetModule)}
                className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 p-4 lg:p-5 space-y-3 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Card Header: Step & Icon */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-xl font-black font-mono text-indigo-500/80 dark:text-indigo-400/80">
                      {pair.num}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200/60 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Pain Block (Old Way) */}
                  {(activeTab === 'compare' || activeTab === 'old') && (
                    <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-500/20 space-y-1 transition-all">
                      <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-black text-[10.5px]">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>THE OLD FRAGMENTED WAY</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {pair.painTitle}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                        {pair.painDesc}
                      </p>
                    </div>
                  )}

                  {/* Solution Block (AI Ads Way) */}
                  {(activeTab === 'compare' || activeTab === 'aiads') && (
                    <div className="p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-500/20 space-y-1 transition-all group-hover:border-emerald-400 dark:group-hover:border-emerald-500/50">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-[10.5px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>WITH AI ADS™ AUTOMATION</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {pair.solutionTitle}
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                        {pair.solutionDesc}
                      </p>
                    </div>
                  )}
                </div>

                {/* Explore Action Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>See How It Works</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
