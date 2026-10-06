import React, { useEffect, useRef, useState } from 'react';
import {
  XCircle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  FolderOpen,
  Mail,
  Palette,
  MessageCircle,
  Lock
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

/* ---------------- Live mini-visuals (old way vs AI Ads) ---------------- */

const OLD_TILES = [
  { bg: 'bg-red-400', rot: '-rotate-6', font: 'font-serif', tx: 'Sale!!' },
  { bg: 'bg-lime-400', rot: 'rotate-3', font: 'font-mono', tx: 'NEW' },
  { bg: 'bg-sky-300', rot: 'rotate-6', font: 'italic', tx: 'buy now' },
  { bg: 'bg-orange-300', rot: '-rotate-3', font: 'font-black', tx: 'OFFER' }
];

const BrandVisual = ({ ai }) => (
  <div className="relative h-28 flex items-center justify-center gap-2.5">
    {OLD_TILES.map((t, i) => (
      <div
        key={i}
        className={`relative w-14 h-16 rounded-lg flex flex-col items-center justify-end pb-1.5 shadow-md transition-all duration-700 ease-out ${
          ai
            ? 'bg-gradient-to-br from-indigo-500 to-fuchsia-500 rotate-0 translate-y-0'
            : `${t.bg} ${t.rot} ${i % 2 ? 'translate-y-2' : '-translate-y-1'} ps-jitter`
        }`}
        style={{ transitionDelay: `${i * 90}ms`, animationDelay: `${i * 0.3}s` }}
      >
        <span className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full transition-colors duration-700 ${ai ? 'bg-white' : 'bg-black/30'}`} />
        <span className={`text-[9px] text-white transition-all duration-700 ${ai ? 'font-bold tracking-wide' : t.font}`}>
          {ai ? 'GLOW' : t.tx}
        </span>
      </div>
    ))}
    <span
      className={`absolute -bottom-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold transition-all duration-500 ${
        ai
          ? 'opacity-100 translate-y-0 bg-indigo-600 text-white'
          : 'opacity-0 translate-y-2 bg-indigo-600 text-white'
      }`}
    >
      <Lock className="w-2.5 h-2.5" /> Brand DNA locked
    </span>
  </div>
);

const SpeedVisual = ({ ai }) => {
  const [day, setDay] = useState(1);
  useEffect(() => {
    if (ai) return undefined;
    setDay(1);
    const t = setInterval(() => setDay((d) => (d >= 14 ? 1 : d + 1)), 260);
    return () => clearInterval(t);
  }, [ai]);

  return (
    <div className="h-28 flex flex-col justify-center gap-2.5 px-1">
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 30 }).map((_, i) => {
          const filled = ai ? true : i < Math.floor(day / 3);
          return (
            <span
              key={i}
              className={`h-3 rounded-sm transition-all duration-300 ${
                filled
                  ? ai
                    ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 scale-100'
                    : 'bg-rose-300 dark:bg-rose-500/60'
                  : 'bg-slate-200 dark:bg-slate-800 scale-90'
              }`}
              style={{ transitionDelay: ai ? `${i * 25}ms` : '0ms' }}
            />
          );
        })}
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${ai ? 'duration-[900ms] bg-emerald-500' : 'duration-200 bg-rose-400'}`}
          style={{ width: ai ? '100%' : `${(day / 14) * 100}%` }}
        />
      </div>
      <p className={`text-[10.5px] font-bold transition-colors ${ai ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
        {ai ? '30-day plan + visuals ready in seconds' : `Day ${day} of 14 · waiting on revisions…`}
      </p>
    </div>
  );
};

const TOOLS = [
  { icon: FileSpreadsheet, tone: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300', old: { left: '4%', top: '8%' } },
  { icon: FolderOpen, tone: 'text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300', old: { left: '70%', top: '4%' } },
  { icon: Mail, tone: 'text-rose-600 bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300', old: { left: '38%', top: '58%' } },
  { icon: Palette, tone: 'text-sky-600 bg-sky-100 dark:bg-sky-500/20 dark:text-sky-300', old: { left: '80%', top: '60%' } },
  { icon: MessageCircle, tone: 'text-violet-600 bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300', old: { left: '10%', top: '62%' } }
];

const ToolsVisual = ({ ai }) => (
  <div className="relative h-28">
    {/* Unified hub */}
    <div
      className={`absolute inset-x-6 top-1/2 -translate-y-1/2 h-14 rounded-xl border-2 border-dashed transition-all duration-700 flex items-end justify-center pb-1 ${
        ai
          ? 'opacity-100 scale-100 border-indigo-400 bg-indigo-50/80 dark:bg-indigo-500/10'
          : 'opacity-0 scale-90 border-slate-300'
      }`}
    >
      <span className="text-[9px] font-black tracking-wider text-indigo-600 dark:text-indigo-300">ONE AI ADS WORKSPACE</span>
    </div>
    {TOOLS.map(({ icon: Icon, tone, old }, i) => (
      <span
        key={i}
        className={`absolute w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all duration-700 ease-out ${tone} ${ai ? '' : 'ps-jitter'}`}
        style={{
          left: ai ? `calc(50% - 98px + ${i * 40}px)` : old.left,
          top: ai ? 'calc(50% - 26px)' : old.top,
          transitionDelay: `${i * 70}ms`,
          animationDelay: `${i * 0.25}s`
        }}
      >
        <Icon className="w-4 h-4" />
      </span>
    ))}
  </div>
);

/* ---------------- Data ---------------- */

const PAIRS = [
  {
    id: 'brand',
    num: '01',
    targetModule: 'brands',
    painTitle: 'Inconsistent brand voice',
    painDesc: 'Freelancers & basic AI tools lose context, causing off-brand visuals and tone drift.',
    solutionTitle: 'Brand DNA Memory keeps every post on-brand',
    solutionDesc: 'Auto-ingests logos, color hex codes, personas, and claim rules into permanent AI memory.',
    metricOld: 'Random styles',
    metricNew: '100% on-brand',
    icon: ShieldCheck,
    Visual: BrandVisual
  },
  {
    id: 'velocity',
    num: '02',
    targetModule: 'strategy',
    painTitle: 'Slow content production',
    painDesc: 'Planning 30 days of posts takes weeks of manual brief writing and designer delays.',
    solutionTitle: '30-day strategy & 8K ad visuals in seconds',
    solutionDesc: 'Generates non-repeating daily directives, photorealistic 8K ad renders, and copy in 1 click.',
    metricOld: 'Weeks',
    metricNew: 'Seconds',
    icon: Zap,
    Visual: SpeedVisual
  },
  {
    id: 'workspace',
    num: '03',
    targetModule: 'assetLibrary',
    painTitle: 'Scattered tools & lost assets',
    painDesc: 'Managing content across split sheets, disconnected folders, and email chains causes lost files.',
    solutionTitle: 'One unified platform with central Asset Library',
    solutionDesc: 'Store, tag, organize and access all brand creatives, campaigns, and ad copy in one searchable AI hub.',
    metricOld: '10 tools',
    metricNew: '1 workspace',
    icon: Layers,
    Visual: ToolsVisual
  }
];

const TABS = [
  { id: 'compare', label: '⚖️ Live Compare', active: 'text-indigo-700 dark:text-white' },
  { id: 'old', label: '❌ The Old Way', active: 'text-white' },
  { id: 'aiads', label: '⚡ AI Ads™ Way', active: 'text-white' }
];
const TAB_INDICATOR = {
  compare: 'bg-white dark:bg-indigo-600',
  old: 'bg-rose-500',
  aiads: 'bg-emerald-600'
};

/* ---------------- Card ---------------- */

const PainCard = ({ pair, index, mode, tick, onOpen }) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  // compare mode: auto-alternate (staggered per card); hover forces AI view
  const ai = mode === 'aiads' ? true : mode === 'old' ? false : hovered || (tick + index) % 2 === 1;

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const { Visual, icon: IconComp } = pair;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(pair.targetModule)}
      className="pipeline-pop group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 p-4 lg:p-5 flex flex-col gap-3 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-indigo-300 dark:hover:border-indigo-500/60 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Mouse-follow spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(99,102,241,0.12), transparent 70%)' }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <span className="text-xl font-black font-mono text-indigo-500/80 dark:text-indigo-400/80">{pair.num}</span>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all duration-500 ${
              ai
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
            }`}
          >
            {ai ? pair.metricNew : pair.metricOld}
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200/60 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 group-hover:scale-110 transition-transform">
            <IconComp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Live visual */}
      <div
        className={`relative rounded-xl border p-2 transition-colors duration-700 ${
          ai
            ? 'bg-emerald-50/60 border-emerald-200/70 dark:bg-emerald-500/5 dark:border-emerald-500/20'
            : 'bg-rose-50/60 border-rose-200/70 dark:bg-rose-500/5 dark:border-rose-500/20'
        }`}
      >
        <Visual ai={ai} />
      </div>

      {/* Text: swaps between pain & solution */}
      <div className="relative min-h-[92px]">
        <div
          className={`absolute inset-0 space-y-1 transition-all duration-500 ${
            ai ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-black text-[10.5px]">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>THE OLD FRAGMENTED WAY</span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{pair.painTitle}</h4>
          <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-snug">{pair.painDesc}</p>
        </div>
        <div
          className={`absolute inset-0 space-y-1 transition-all duration-500 ${
            ai ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-[10.5px]">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>WITH AI ADS™ AUTOMATION</span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{pair.solutionTitle}</h4>
          <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-snug">{pair.solutionDesc}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
        <span>{mode === 'compare' ? 'Hover to see the fix' : 'See How It Works'}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

/* ---------------- Section ---------------- */

export const ProblemSolution = () => {
  const { setActiveModule } = useWorkspace();
  const [activeTab, setActiveTab] = useState('compare'); // 'compare' | 'old' | 'aiads'
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (activeTab !== 'compare') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setTick((n) => n + 1), 3200);
    return () => clearInterval(t);
  }, [activeTab]);

  const tabIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <section className="py-10 lg:py-14 bg-slate-50/90 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>THE MARKETING CHALLENGE &amp; SOLUTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
            Marketing Shouldn't Mean Juggling Ten Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Long production cycles, scattered tools, and brand drift slow you down. See how AI Ads™ replaces the chaos.
          </p>

          {/* Segmented toggle with sliding indicator */}
          <div className="pt-2 flex items-center justify-center">
            <div className="relative inline-grid grid-cols-3 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 shadow-inner">
              <span
                className={`absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg shadow-sm transition-all duration-300 ease-out ${TAB_INDICATOR[activeTab]}`}
                style={{ transform: `translateX(${tabIndex * 100}%)` }}
              />
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  id={`problem-tab-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-extrabold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                    activeTab === tab.id ? tab.active : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {PAIRS.map((pair, i) => (
            <PainCard
              key={pair.id}
              pair={pair}
              index={i}
              mode={activeTab}
              tick={tick}
              onOpen={setActiveModule}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
