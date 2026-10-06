import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Image as ImageIcon,
  Stamp,
  CheckCircle2,
  Download,
  Sparkles,
  Pause,
  Play,
  ArrowRight,
  PenLine
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

/* ------------------------------------------------------------------ */
/* Mini live previews — one per pipeline step                          */
/* ------------------------------------------------------------------ */

const BrandDnaPreview = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
      <span>brand_memory.lock</span>
      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Synced</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        ['Tone', 'Premium • Warm'],
        ['Audience', 'D2C Shoppers'],
        ['USP', 'Handcrafted'],
        ['Logo', 'Locked ✓']
      ].map(([k, v], i) => (
        <div
          key={k}
          className="pipeline-pop rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2.5 shadow-sm"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">{k}</p>
          <p className="text-xs font-bold text-slate-900 dark:text-white">{v}</p>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Palette</span>
      {['bg-indigo-500', 'bg-amber-400', 'bg-rose-500', 'bg-slate-900 dark:bg-slate-100'].map((c, i) => (
        <span key={c} className={`pipeline-pop w-5 h-5 rounded-full ${c} ring-2 ring-slate-200 dark:ring-white/10 shadow-sm`} style={{ animationDelay: `${500 + i * 100}ms` }} />
      ))}
    </div>
  </div>
);

const PromptAgentPreview = () => {
  const full = 'Hero shot of handcrafted leather bag on rustic wood, warm tungsten light, shallow depth of field, premium boutique mood…';
  const [text, setText] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setText(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex gap-3">
      <div className="relative w-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
        <img src="/hero-bg/boutique.jpg" alt="" className="w-full h-full object-cover" />
        <div className="pipeline-scan absolute inset-x-0 h-0.5 bg-purple-500 shadow-[0_0_12px_#c084fc]" />
        <span className="absolute bottom-1 left-1 text-[9px] font-mono bg-slate-900/80 text-purple-200 px-1.5 rounded">ref.jpg</span>
      </div>
      <div className="flex-1 rounded-xl bg-purple-50/70 dark:bg-black/30 border border-purple-200 dark:border-purple-500/20 p-3 shadow-sm">
        <p className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold mb-1">→ synthesized_prompt</p>
        <p className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed min-h-[60px]">
          {text}
          <span className="inline-block w-1.5 h-3 bg-purple-600 dark:bg-purple-400 ml-0.5 animate-pulse align-middle" />
        </p>
      </div>
    </div>
  );
};

const ImageGenPreview = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 4)), 60);
    return () => clearInterval(t);
  }, []);
  const tiles = ['/hero-bg/boutique.jpg', '/hero-bg/marketer.jpg', '/hero-bg/bakery.jpg', '/hero-bg/agency.jpg'];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {tiles.map((src, i) => {
          const revealed = progress > 25 * (i + 1) - 10;
          return (
            <div key={src} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 shadow-sm">
              <img
                src={src}
                alt=""
                className={`w-full h-full object-cover transition-all duration-700 ${revealed ? 'opacity-100 blur-0 scale-100' : 'opacity-40 blur-md scale-110'}`}
              />
              {!revealed && <div className="absolute inset-0 pipeline-shimmer" />}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 w-24 text-right">
          {progress < 100 ? `Rendering ${progress}%` : '4 variations ✓'}
        </span>
      </div>
    </div>
  );
};

const WatermarkPreview = () => (
  <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
    <img src="/hero-bg/bakery.jpg" alt="" className="w-full h-full object-cover" />
    <div className="pipeline-stamp absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 text-slate-900 text-[11px] font-black shadow-lg border border-slate-200">
      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
      YOUR LOGO
    </div>
    <span className="absolute top-2 left-2 text-[10px] font-mono bg-slate-900/80 text-amber-200 px-2 py-0.5 rounded shadow">
      auto-placed • safe zone
    </span>
  </div>
);

const CopywritingPreview = () => {
  const [activeHook, setActiveHook] = useState(0);
  const hooks = [
    { tag: 'High CTR', headline: 'Pure Luxury. Handcrafted For Everyday Living ✨', cta: 'Shop 40% Off' },
    { tag: 'Story Hook', headline: 'Tired of generic leather? Meet timeless artisan elegance.', cta: 'Explore Collection' },
    { tag: 'Urgency', headline: 'Limited Festive Drop: Only 50 Pieces Handcrafted.', cta: 'Claim Yours Now' }
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveHook((h) => (h + 1) % hooks.length);
    }, 2200);
    return () => clearInterval(t);
  }, [hooks.length]);

  const current = hooks[activeHook];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Copywriter
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/30">
          {current.tag}
        </span>
      </div>

      <div className="pipeline-pop rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 space-y-2 shadow-sm">
        <p className="text-[10px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-wider font-bold">Generated Headline</p>
        <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug min-h-[32px]">
          "{current.headline}"
        </p>

        <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Tone: Premium D2C</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-500/40">
            CTA: {current.cta} →
          </span>
        </div>
      </div>
    </div>
  );
};

const ExportPreview = () => (
  <div className="space-y-2">
    {[
      ['1:1', 'Instagram Feed', 'w-6 h-6'],
      ['9:16', 'Reels / Stories', 'w-4 h-7'],
      ['16:9', 'YouTube / Web', 'w-8 h-5']
    ].map(([ratio, label, box], i) => (
      <div
        key={ratio}
        className="pipeline-pop flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2 shadow-sm"
        style={{ animationDelay: `${i * 150}ms` }}
      >
        <div className="w-9 flex justify-center">
          <span className={`${box} rounded-sm border-2 border-indigo-500 dark:border-blue-400/70`} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-900 dark:text-white">{ratio}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        </div>
        <Download className="w-4 h-4 text-indigo-600 dark:text-blue-300" />
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Pipeline data                                                       */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    name: 'Brand DNA',
    tag: 'Locked Memory',
    icon: ShieldCheck,
    accent: 'indigo',
    chip: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-500/40',
    ring: 'ring-indigo-500 shadow-indigo-500/20',
    title: 'Your brand rules load first',
    text: 'Tone, audience, USPs, palette and logo are pulled from persistent Brand DNA memory, so every creative starts on-brand.',
    Preview: BrandDnaPreview
  },
  {
    name: 'Prompt Crafting Agent',
    tag: 'Agent 1 · Vision AI',
    icon: Cpu,
    accent: 'purple',
    chip: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/15 border-purple-200 dark:border-purple-500/40',
    ring: 'ring-purple-500 shadow-purple-500/20',
    title: 'Agent 1 reads your product photo',
    text: 'Analyzes form factor, lighting, positioning and campaign goal from your reference photo, then writes a pro ad-photography prompt.',
    Preview: PromptAgentPreview
  },
  {
    name: 'Image Generation Agent',
    tag: 'Agent 2 · 8K Render',
    icon: ImageIcon,
    accent: 'cyan',
    chip: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/15 border-cyan-200 dark:border-cyan-500/40',
    ring: 'ring-cyan-500 shadow-cyan-500/20',
    title: 'Agent 2 renders 4 variations',
    text: 'Photorealistic 8K commercial renders are generated in parallel so you can pick the strongest concept.',
    Preview: ImageGenPreview
  },
  {
    name: 'Auto Logo Watermark',
    tag: 'Brand Overlay',
    icon: Stamp,
    accent: 'amber',
    chip: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/40',
    ring: 'ring-amber-500 shadow-amber-500/20',
    title: 'Logo placed automatically',
    text: 'Your logo is overlaid in a safe zone on every variation, sized and positioned to stay clean and readable.',
    Preview: WatermarkPreview
  },
  {
    name: 'AI Copy & Hooks',
    tag: 'Headlines & CTAs',
    icon: PenLine,
    accent: 'emerald',
    chip: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/40',
    ring: 'ring-emerald-500 shadow-emerald-500/20',
    title: 'AI crafts high-converting copy',
    text: 'Auto-synthesizes viral-tested headlines, engaging ad copy, and high-CTR calls to action tailored to your Brand DNA tone.',
    Preview: CopywritingPreview
  },
  {
    name: 'Export',
    tag: 'Download & Share',
    icon: Download,
    accent: 'blue',
    chip: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/40',
    ring: 'ring-blue-500 shadow-blue-500/20',
    title: 'Ready-to-use ad assets',
    text: 'Download generated creatives in every format you need (1:1, 9:16, 16:9), or share secure links with your team.',
    Preview: ExportPreview
  }
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export const PipelineSpotlight = () => {
  const { setActiveModule } = useWorkspace();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!playing || hovering) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 4000);
    return () => clearInterval(t);
  }, [playing, hovering]);

  const step = STEPS[active];
  const ActiveIcon = step.icon;
  const progressPct = (active / (STEPS.length - 1)) * 100;

  return (
    <section className="py-20 bg-slate-50/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 text-xs font-extrabold text-cyan-800 dark:text-cyan-300 shadow-sm">
            <span>SPOTLIGHT: 2-AGENT VISION ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
            Two AI agents. One on-brand creative.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Our 2-Agent Vision Architecture pairs product reference photos with autonomous prompt synthesis and 8K commercial rendering.
          </p>
        </div>

        {/* Interactive Pipeline */}
        <div
          className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 shadow-xl relative overflow-hidden transition-colors duration-300"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Ambient glow following active step */}
          <div
            className="absolute -top-24 w-[420px] h-[260px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-[110px] pointer-events-none transition-all duration-700"
            style={{ left: `calc(${progressPct}% - 210px)` }}
          />

          {/* Top bar */}
          <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
              Pipeline Flow · Step {active + 1}/{STEPS.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold border border-emerald-200 dark:border-emerald-500/30 shadow-sm">
                Autonomous 6-Step Engine
              </span>
              <button
                id="pipeline-play-toggle"
                onClick={() => setPlaying((p) => !p)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition shadow-sm"
                aria-label={playing ? 'Pause pipeline animation' : 'Play pipeline animation'}
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Steps row with animated connector */}
          <div className="relative">
            {/* Track */}
            <div className="hidden lg:block absolute top-9 left-[8%] right-[8%] h-0.5 bg-slate-200 dark:bg-slate-800 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
              <div
                className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-white border border-indigo-500 shadow-[0_0_14px_4px_rgba(129,140,248,0.8)] transition-all duration-700"
                style={{ left: `calc(${progressPct}% - 5px)` }}
              />
            </div>

            <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {STEPS.map((s, idx) => {
                const Icon = s.icon;
                const isActive = idx === active;
                const isDone = idx < active;
                return (
                  <button
                    key={s.name}
                    id={`pipeline-step-${idx}`}
                    onClick={() => setActive(idx)}
                    className={`group relative p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? `bg-white dark:bg-slate-900 border-indigo-200 dark:border-transparent ring-2 ${s.ring} shadow-lg -translate-y-1`
                        : 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-900 hover:-translate-y-0.5'
                    }`}
                  >
                    <div
                      className={`relative w-11 h-11 rounded-xl border flex items-center justify-center transition-transform duration-300 ${s.chip} ${
                        isActive ? 'scale-110 shadow-sm' : 'group-hover:scale-105'
                      }`}
                    >
                      {isActive && <span className={`absolute inset-0 rounded-xl border ${s.chip} animate-ping opacity-40`} />}
                      <Icon className="w-5 h-5 relative" />
                      {isDone && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-extrabold leading-tight ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{s.name}</p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{s.tag}</p>

                    {/* per-step timer bar */}
                    {isActive && playing && !hovering && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <span className="block h-full bg-indigo-500 dark:bg-white/70 pipeline-timer" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div key={active} className="pipeline-panel relative grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-extrabold uppercase tracking-wider ${step.chip} shadow-sm`}>
                <ActiveIcon className="w-3.5 h-3.5" />
                Step {active + 1} · {step.tag}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.text}</p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="pipeline-next-step"
                  onClick={() => setActive((a) => (a + 1) % STEPS.length)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/15 transition flex items-center gap-2 shadow-sm"
                >
                  {active === STEPS.length - 1 ? 'Restart flow' : 'Next step'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id="pipeline-try-it"
                  onClick={() => setActiveModule('login')}
                  className="px-4 py-2 rounded-xl btn-primary text-xs shadow-md"
                >
                  Try it free
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 min-h-[170px] flex flex-col justify-center shadow-sm">
              <step.Preview />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
