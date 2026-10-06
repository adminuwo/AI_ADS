import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  Image as ImageIcon,
  TrendingUp,
  CalendarDays,
  PenLine,
  Target,
  Globe,
  Check,
  Loader2,
  Wand2
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { CinematicBackground } from './CinematicBackground';

const HERO_IMAGES = [
  '/hero-bg/dm-social.jpg',
  '/hero-bg/dm-analytics.jpg',
  '/hero-bg/dm-studio.jpg',
  '/hero-bg/dm-strategy.jpg'
];

// Example briefs typed into the hero composer
const BRIEFS = [
  'Launch our new vitamin-C serum for the festive season',
  'Grow footfall for my bakery\u2019s weekend brunch menu',
  'Promote our agency\u2019s free SEO audit to startups'
];

// Assets the platform generates from one brief (mapped to real modules)
const OUTPUTS = [
  { label: 'Strategy', icon: Target, tone: 'text-amber-300 bg-amber-400/15 border-amber-400/30' },
  { label: 'SEO Blog', icon: Search, tone: 'text-sky-300 bg-sky-400/15 border-sky-400/30' },
  { label: 'Ad Creative', icon: ImageIcon, tone: 'text-fuchsia-300 bg-fuchsia-400/15 border-fuchsia-400/30' },
  { label: 'Captions', icon: PenLine, tone: 'text-rose-300 bg-rose-400/15 border-rose-400/30' },
  { label: 'Calendar', icon: CalendarDays, tone: 'text-violet-300 bg-violet-400/15 border-violet-400/30' },
  { label: 'Landing Page', icon: Globe, tone: 'text-emerald-300 bg-emerald-400/15 border-emerald-400/30' }
];

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);
  return reduced;
};

/* ---------- Floating feature cards (each animates what the module does) ---------- */

const FloatCard = ({ className = '', delay = 0, floatDelay = 0, children }) => (
  <div
    className={`hidden xl:block absolute w-[210px] ${className}`}
    style={{ animation: `heroCardIn 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` }}
  >
    <div
      className="hero-float rounded-2xl bg-slate-900/55 border border-white/15 backdrop-blur-xl p-3.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] hover:border-white/30 hover:bg-slate-900/70 transition-colors pointer-events-auto"
      style={{ animationDelay: `${floatDelay}s` }}
    >
      {children}
    </div>
  </div>
);

const CardHeader = ({ icon: Icon, label, tone }) => (
  <div className="flex items-center gap-2 mb-2.5">
    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${tone}`}>
      <Icon className="w-4 h-4" />
    </span>
    <span className="text-[11px] font-bold text-white/85 tracking-wide">{label}</span>
  </div>
);

const BrandDnaCard = () => (
  <>
    <CardHeader icon={ShieldCheck} label="Brand DNA" tone="bg-indigo-500/25 text-indigo-300" />
    <div className="flex gap-1.5 mb-2">
      {['bg-indigo-500', 'bg-fuchsia-500', 'bg-amber-400', 'bg-slate-100'].map((c, i) => (
        <span
          key={c}
          className={`hero-swatch w-6 h-6 rounded-full ${c} ring-2 ring-white/10`}
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </div>
    <p className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Tone, colors &amp; fonts locked
    </p>
  </>
);

const SeoCard = () => {
  const [score, setScore] = useState(0);
  useEffect(() => {
    let v = 0;
    let t;
    const tick = () => {
      v += 2;
      if (v > 94) {
        t = setTimeout(() => { v = 0; setScore(0); tick(); }, 2500);
        return;
      }
      setScore(v);
      t = setTimeout(tick, 30);
    };
    tick();
    return () => clearTimeout(t);
  }, []);
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <>
      <CardHeader icon={Search} label="SEO Intelligence" tone="bg-sky-500/25 text-sky-300" />
      <div className="flex items-center gap-3">
        <svg width="48" height="48" className="-rotate-90">
          <circle cx="24" cy="24" r={r} stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="none" />
          <circle
            cx="24" cy="24" r={r} stroke="#38bdf8" strokeWidth="5" fill="none" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
          />
        </svg>
        <div>
          <p className="text-xl font-black text-white leading-none">{score}</p>
          <p className="text-[10px] text-white/60 mt-1">Keyword score</p>
        </div>
      </div>
    </>
  );
};

const CreativeCard = () => (
  <>
    <CardHeader icon={ImageIcon} label="Creative Studio" tone="bg-fuchsia-500/25 text-fuchsia-300" />
    <div className="relative h-20 rounded-lg overflow-hidden">
      <img src="/hero-bg/dm-social.jpg" alt="" className="w-full h-full object-cover hero-reveal" />
      <div className="absolute inset-0 pipeline-shimmer" />
      <span className="absolute bottom-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded bg-white/90 text-slate-900">8K</span>
    </div>
    <p className="text-[10px] text-white/60 mt-2">Ad creative rendering…</p>
  </>
);

const CampaignCard = () => (
  <>
    <CardHeader icon={TrendingUp} label="Campaigns" tone="bg-amber-500/25 text-amber-300" />
    <div className="flex items-end gap-1.5 h-14">
      {[35, 55, 45, 70, 60, 90].map((h, i) => (
        <span
          key={i}
          className="hero-bar flex-1 rounded-t bg-gradient-to-t from-amber-500/60 to-amber-300"
          style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
    <p className="text-[10px] text-white/60 mt-2">Multi-channel plan in motion</p>
  </>
);

const CAPTION = 'Fresh drop ✨ Glow like never before. Shop the new serum today!';
const ContentCard = ({ reduced }) => {
  const [n, setN] = useState(reduced ? CAPTION.length : 0);
  useEffect(() => {
    if (reduced) return;
    let i = 0;
    let t;
    const tick = () => {
      i += 1;
      if (i > CAPTION.length) {
        t = setTimeout(() => { i = 0; setN(0); tick(); }, 2200);
        return;
      }
      setN(i);
      t = setTimeout(tick, 45);
    };
    tick();
    return () => clearTimeout(t);
  }, [reduced]);
  return (
    <>
      <CardHeader icon={PenLine} label="Content Studio" tone="bg-rose-500/25 text-rose-300" />
      <p className="text-[11px] text-white/85 leading-snug min-h-[44px]">
        {CAPTION.slice(0, n)}
        <span className="inline-block w-[2px] h-3 bg-rose-300 align-middle ml-0.5 animate-pulse" />
      </p>
    </>
  );
};

const CalendarCard = () => (
  <>
    <CardHeader icon={CalendarDays} label="Content Calendar" tone="bg-violet-500/25 text-violet-300" />
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 21 }).map((_, i) => {
        const filled = [1, 3, 5, 8, 10, 12, 15, 17, 19].includes(i);
        return (
          <span
            key={i}
            className={`h-3.5 rounded-sm ${filled ? 'hero-cell bg-violet-400' : 'bg-white/10'}`}
            style={filled ? { animationDelay: `${i * 0.12}s` } : undefined}
          />
        );
      })}
    </div>
    <p className="text-[10px] text-white/60 mt-2">30-day plan scheduled</p>
  </>
);

/* ---------- Live brief composer: type one brief -> get every asset ---------- */

const BriefComposer = ({ reduced }) => {
  const [briefIndex, setBriefIndex] = useState(0);
  const [chars, setChars] = useState(reduced ? BRIEFS[0].length : 0);
  const [phase, setPhase] = useState(reduced ? 'done' : 'typing'); // typing | generating | done
  const [shown, setShown] = useState(reduced ? OUTPUTS.length : 0);

  const brief = BRIEFS[briefIndex];

  useEffect(() => {
    if (reduced) return undefined;
    let t;
    if (phase === 'typing') {
      if (chars < brief.length) {
        t = setTimeout(() => setChars((c) => c + 1), 38);
      } else {
        t = setTimeout(() => setPhase('generating'), 450);
      }
    } else if (phase === 'generating') {
      t = setTimeout(() => setPhase('done'), 1100);
    } else if (phase === 'done') {
      if (shown < OUTPUTS.length) {
        t = setTimeout(() => setShown((s) => s + 1), 260);
      } else {
        t = setTimeout(() => {
          setBriefIndex((i) => (i + 1) % BRIEFS.length);
          setChars(0);
          setShown(0);
          setPhase('typing');
        }, 2800);
      }
    }
    return () => clearTimeout(t);
  }, [phase, chars, shown, brief.length, reduced]);

  return (
    <div className="w-full max-w-2xl">
      {/* Input bar */}
      <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-r from-indigo-500/70 via-fuchsia-500/60 to-amber-400/60 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.45)]">
        <div className="flex items-center gap-3 rounded-[15px] bg-slate-950/85 backdrop-blur-xl pl-4 pr-2 py-2">
          <Wand2 className="w-5 h-5 text-violet-300 shrink-0" />
          <p className="flex-1 text-left text-sm sm:text-base text-white/90 truncate min-h-[24px]">
            {brief.slice(0, chars)}
            {phase === 'typing' && (
              <span className="inline-block w-[2px] h-4 bg-violet-300 align-middle ml-0.5 animate-pulse" />
            )}
          </p>
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              phase === 'generating'
                ? 'bg-violet-500 text-white'
                : phase === 'done'
                ? 'bg-emerald-500/90 text-white'
                : 'bg-white/10 text-white/70'
            }`}
          >
            {phase === 'generating' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating</>
            ) : phase === 'done' ? (
              <><Check className="w-4 h-4" /> Ready</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate</>
            )}
          </span>
        </div>
      </div>

      {/* Generated assets */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 min-h-[76px] sm:min-h-[36px]">
        {OUTPUTS.map(({ label, icon: Icon, tone }, i) => {
          const visible = phase === 'done' && i < shown;
          return (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-500 ${tone} ${
                visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              <Check className="w-3 h-3 opacity-80" />
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Hero ---------- */

export const Hero = () => {
  const { setActiveModule } = useWorkspace();
  const reduced = usePrefersReducedMotion();

  const handleStartTrial = () => {
    setActiveModule('login');
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[calc(100vh-72px)] flex items-center border-b border-slate-800/60">

      {/* Digital-marketing cinematic background */}
      <CinematicBackground images={HERO_IMAGES} startIndex={0} overlayClassName="bg-slate-950/70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.55)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
      </CinematicBackground>

      {/* Floating feature cards */}
      <div className="absolute inset-0 z-[5] pointer-events-none max-w-[1440px] mx-auto">
        <FloatCard className="left-8 2xl:left-16 top-[12%]" delay={500} floatDelay={0}><BrandDnaCard /></FloatCard>
        <FloatCard className="left-14 2xl:left-28 top-[42%]" delay={700} floatDelay={1.2}><ContentCard reduced={reduced} /></FloatCard>
        <FloatCard className="left-8 2xl:left-16 bottom-[10%]" delay={900} floatDelay={2.1}><CalendarCard /></FloatCard>
        <FloatCard className="right-8 2xl:right-16 top-[12%]" delay={600} floatDelay={0.6}><CreativeCard /></FloatCard>
        <FloatCard className="right-14 2xl:right-28 top-[42%]" delay={800} floatDelay={1.6}><SeoCard /></FloatCard>
        <FloatCard className="right-8 2xl:right-16 bottom-[10%]" delay={1000} floatDelay={2.4}><CampaignCard /></FloatCard>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center flex flex-col items-center">

        {/* Eyebrow */}
        <div className="pipeline-pop inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-wide text-white/80">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
          </span>
          AI marketing suite for brands &amp; agencies
        </div>

        {/* Headline */}
        <h1
          className="pipeline-pop mt-6 font-['Outfit'] font-extrabold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl"
          style={{ animationDelay: '120ms' }}
        >
          <span className="block text-white">One brief.</span>
          <span className="block bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent pb-1">
            Every marketing asset.
          </span>
        </h1>

        <p
          className="pipeline-pop mt-5 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed"
          style={{ animationDelay: '220ms' }}
        >
          Describe your goal. AI Ads turns it into strategy, SEO content, ad creatives and landing pages — all locked to your Brand DNA.
        </p>

        {/* Live composer demo */}
        <div className="pipeline-pop mt-9 w-full flex justify-center" style={{ animationDelay: '340ms' }}>
          <BriefComposer reduced={reduced} />
        </div>

        {/* CTA */}
        <div
          className="pipeline-pop mt-6 flex flex-col sm:flex-row items-center gap-3"
          style={{ animationDelay: '460ms' }}
        >
          <button
            id="hero-start-trial"
            onClick={handleStartTrial}
            className="group px-8 py-3.5 rounded-xl bg-white text-slate-950 text-base font-bold flex items-center gap-2 shadow-xl shadow-white/10 hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-xs sm:text-sm text-white/55">Free trial · No credit card required</span>
        </div>
      </div>
    </section>
  );
};
