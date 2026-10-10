import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Search,
  Image as ImageIcon,
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

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-14 sm:pt-12 sm:pb-16 text-center flex flex-col items-center">

        {/* Headline */}
        <h1
          className="pipeline-pop font-['Outfit'] font-extrabold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl"
          style={{ animationDelay: '120ms' }}
        >
          <span className="block text-white">One brief.</span>
          <span className="block bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent pb-1">
            Every marketing asset.
          </span>
        </h1>

        <p
          className="pipeline-pop mt-4 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed"
          style={{ animationDelay: '220ms' }}
        >
          Describe your goal. AI Ads turns it into strategy, SEO content, ad creatives and landing pages — all locked to your Brand DNA.
        </p>

        {/* Live composer demo */}
        <div className="pipeline-pop mt-7 w-full flex justify-center" style={{ animationDelay: '340ms' }}>
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
