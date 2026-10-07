import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Palette,
  FileText,
  Search,
  Globe,
  Sliders,
  Check
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

/* ================================================================== */
/* Interactive Widget 1: One Source of Truth (Interactive Spoke Hub)  */
/* ================================================================== */
const SourceOfTruthWidget = () => {
  const [selectedAsset, setSelectedAsset] = useState(0);

  const assets = [
    {
      name: 'Ad Creatives',
      icon: Palette,
      rule: 'Hex #6366F1 & #D946EF locked',
      tag: '8K Render Engine',
      tone: 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30'
    },
    {
      name: 'Copy & Hooks',
      icon: FileText,
      rule: 'Persona: D2C Luxury • Voice: Direct',
      tag: 'Viral Hook Generator',
      tone: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30'
    },
    {
      name: 'SEO Intelligence',
      icon: Search,
      rule: 'Target keywords & search intent',
      tag: 'Semantic Ranker',
      tone: 'text-sky-500 bg-sky-500/10 border-sky-500/30'
    },
    {
      name: 'Web Pages',
      icon: Globe,
      rule: 'Brand typography & visual tokens',
      tag: 'Page Architecture',
      tone: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
    }
  ];

  const current = assets[selectedAsset];

  return (
    <div className="space-y-3 pt-1">
      {/* Central DNA Core pill */}
      <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-none">
              Brand DNA Memory Core
            </p>
            <p className="text-[9.5px] font-mono text-indigo-600 dark:text-indigo-400">
              immutable_source.json · Synced
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      </div>

      {/* 4 Connected Asset Pills (Interactive selection) */}
      <div className="grid grid-cols-2 gap-1.5">
        {assets.map((a, i) => {
          const IconComp = a.icon;
          const isSelected = i === selectedAsset;
          return (
            <button
              key={a.name}
              type="button"
              onClick={() => setSelectedAsset(i)}
              className={`p-2 rounded-xl text-left border transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-500 shadow-sm scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-75'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${a.tone}`}>
                <IconComp className="w-3 h-3" />
              </span>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                {a.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live inherited rule preview */}
      <div className="p-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-mono space-y-1 border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span>INHERITED TO {current.name.toUpperCase()}</span>
          <span className="text-emerald-400">100% MATCH</span>
        </div>
        <p className="text-indigo-300 font-semibold truncate">
          &gt; {current.rule}
        </p>
      </div>
    </div>
  );
};

/* ================================================================== */
/* Interactive Widget 2: Speed to Market (Simulate 60s Launch)        */
/* ================================================================== */
const SpeedToMarketWidget = () => {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(3); // 0, 1, 2, 3 (3 = finished)
  const [viewMode, setViewMode] = useState('aiads'); // 'old' | 'aiads'

  const simulate = () => {
    if (running) return;
    setRunning(true);
    setStep(0);
    setTimeout(() => setStep(1), 350);
    setTimeout(() => setStep(2), 700);
    setTimeout(() => {
      setStep(3);
      setRunning(false);
    }, 1100);
  };

  const stepsList = [
    { label: '30-Day Campaign Blueprint', time: '0.3s' },
    { label: '4x 8K Photorealistic Ads', time: '0.7s' },
    { label: 'High-Converting Copy & Hooks', time: '1.1s' }
  ];

  return (
    <div className="space-y-3 pt-1">
      {/* Mode toggle */}
      <div className="flex items-center justify-between">
        <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-extrabold">
          <button
            type="button"
            onClick={() => setViewMode('old')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMode === 'old'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Traditional Agency
          </button>
          <button
            type="button"
            onClick={() => setViewMode('aiads')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMode === 'aiads'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            AI Ads Engine
          </button>
        </div>

        {viewMode === 'aiads' && (
          <button
            type="button"
            onClick={simulate}
            disabled={running}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition cursor-pointer"
          >
            <RotateCcw className={`w-3 h-3 ${running ? 'animate-spin' : ''}`} />
            <span>Re-run Test</span>
          </button>
        )}
      </div>

      {viewMode === 'aiads' ? (
        <div className="space-y-2">
          {/* Timeline steps */}
          <div className="space-y-1.5">
            {stepsList.map((s, i) => {
              const done = step >= i + 1;
              const active = step === i;
              return (
                <div
                  key={s.label}
                  className={`p-2 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                    done
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30'
                      : active
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-500/50 animate-pulse'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400/60 inline-block animate-spin" />
                    )}
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      {s.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    {done ? s.time : 'waiting'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
            <span>Production Benchmark</span>
            <span className="font-mono">1.1s total (100x speedup)</span>
          </div>
        </div>
      ) : (
        /* Traditional Agency wait */
        <div className="space-y-2 p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-500/30">
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-600 dark:text-rose-400">
            <span>Manual Production Lag</span>
            <span className="font-mono">14–21 Days</span>
          </div>
          <div className="space-y-1 text-[10.5px] text-slate-600 dark:text-slate-400">
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Brief drafting &amp; email back-and-forth: 4 days
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Designer queue &amp; mockup revisions: 8 days
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Format resizing across Meta &amp; Web: 3 days
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================================== */
/* Interactive Widget 3: Brand Consistency (Guardrail Inspector)      */
/* ================================================================== */
const BrandConsistencyWidget = () => {
  const [guardrailActive, setGuardrailActive] = useState(true);

  return (
    <div className="space-y-3 pt-1">
      {/* Interactive Switch */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
          Brand Guardrails Engine
        </span>
        <button
          type="button"
          onClick={() => setGuardrailActive((g) => !g)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            guardrailActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
          role="switch"
          aria-checked={guardrailActive}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              guardrailActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Visual Creative Comparison */}
      <div
        className={`p-3 rounded-2xl border transition-all duration-300 ${
          guardrailActive
            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-500/40'
            : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300/80 dark:border-rose-500/40'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              guardrailActive
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {guardrailActive ? 'Protected By Brand DNA' : 'Uncontrolled AI Drift'}
          </span>
          <span className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400">
            {guardrailActive ? 'Score: 99.8%' : 'Score: 42%'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
          <div className="flex items-center gap-1.5">
            {guardrailActive ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="text-slate-700 dark:text-slate-300 truncate">
              {guardrailActive ? 'Palette Strictly Locked' : 'Random Hallucinated Colors'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {guardrailActive ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="text-slate-700 dark:text-slate-300 truncate">
              {guardrailActive ? 'Safe-Zone Logo Overlay' : 'Distorted / Missing Logo'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {guardrailActive ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="text-slate-700 dark:text-slate-300 truncate">
              {guardrailActive ? 'Tone Persona Enforced' : 'Off-Tone Generic Copy'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {guardrailActive ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="text-slate-700 dark:text-slate-300 truncate">
              {guardrailActive ? 'Font Hierarchy Kept' : 'Clashing Typestyles'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================================================================== */
/* Interactive Widget 4: Enterprise Power (Virtual Specialist Team)   */
/* ================================================================== */
const EnterprisePowerWidget = () => {
  const [activeRole, setActiveRole] = useState(0);

  const team = [
    {
      role: 'Campaign Strategist AI',
      task: 'Synthesizing 30-day non-repeating roadmap',
      stat: '100% Autonomous',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    },
    {
      role: 'Commercial Art Director AI',
      task: '8K photorealistic product scene rendering',
      stat: 'Studio Grade',
      color: 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30'
    },
    {
      role: 'Senior Copywriter AI',
      task: 'Crafting high-converting ad hooks & CTAs',
      stat: 'Persona-Anchored',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30'
    },
    {
      role: 'Growth & SEO Lead AI',
      task: 'Keyword clusters & high-intent briefs',
      stat: 'Search Optimized',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
    }
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveRole((r) => (r + 1) % team.length);
    }, 2500);
    return () => clearInterval(t);
  }, [team.length]);

  const current = team[activeRole];

  return (
    <div className="space-y-3 pt-1">
      {/* Agent Selector Badges */}
      <div className="flex gap-1 overflow-x-auto pb-0.5 no-scrollbar">
        {team.map((m, i) => {
          const isSelected = i === activeRole;
          return (
            <button
              key={m.role}
              type="button"
              onClick={() => setActiveRole(i)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m.role.replace(' AI', '')}
            </button>
          );
        })}
      </div>

      {/* Active Agent Live Status Card */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {current.role}
          </span>
          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border ${current.color}`}>
            {current.stat}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
          Current Directive: <span className="text-slate-900 dark:text-slate-200 font-semibold">{current.task}</span>
        </p>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span>Cost comparison:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
            $0 Agency Overhead · Infinite Scale
          </span>
        </div>
      </div>
    </div>
  );
};

/* ================================================================== */
/* Main Governance Component with 4 Interactive Pillars               */
/* ================================================================== */
export const Governance = () => {
  const { setActiveModule } = useWorkspace();

  const pillars = [
    {
      id: 'source-of-truth',
      title: 'One Source of Truth',
      desc: 'Every output comes directly from your Brand DNA memory, eliminating silos across copy, graphics, and web pages.',
      icon: ShieldCheck,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      targetModule: 'brandDna',
      Widget: SourceOfTruthWidget
    },
    {
      id: 'speed-to-market',
      title: 'Speed to Market',
      desc: 'Work that historically took weeks of brief creation, designer wait times, and coding now takes hours.',
      icon: Zap,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      targetModule: 'strategy',
      Widget: SpeedToMarketWidget
    },
    {
      id: 'brand-consistency',
      title: 'Brand Consistency',
      desc: 'Built-in stylistic guardrails keep every piece of content, copy asset, and ad graphic on-brand as you scale.',
      icon: Lock,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      targetModule: 'creativeStudio',
      Widget: BrandConsistencyWidget
    },
    {
      id: 'enterprise-power',
      title: 'Enterprise Power, Lean Team',
      desc: 'Get agency-level strategy, creative design, and landing page execution without the agency costs or headcount overhead.',
      icon: Users,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      targetModule: 'dashboard',
      Widget: EnterprisePowerWidget
    }
  ];

  return (
    <section id="why-ai-ads" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 text-xs font-extrabold text-indigo-800 dark:text-indigo-400 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-600 dark:text-indigo-400" />
            <span>THE UNFAIR ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
            Why AI Ads™
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Replace fragmented tools with a single intelligent platform designed for speed, scale, and brand governance.
          </p>
        </div>

        {/* 4 Pillars Grid with Interactive Live Demonstrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((p) => {
            const IconComp = p.icon;
            const WidgetComp = p.Widget;
            return (
              <div 
                key={p.id}
                className="group relative rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 space-y-5 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top: Header with Icon and Title */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${p.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Micro-Widget */}
                  <div className="pt-1">
                    <WidgetComp />
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  <button
                    type="button"
                    onClick={() => setActiveModule(p.targetModule)}
                    className="inline-flex items-center gap-1.5 hover:underline cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>Launch in Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">Interactive Demo</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Governance;
