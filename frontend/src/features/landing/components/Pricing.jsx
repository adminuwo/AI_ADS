import React, { useState, useEffect, useRef } from 'react';
import { Check, X, ArrowRight, Sparkles, Zap, Shield, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

/* ─────────────────── animated number (count‑up) ─────────────────── */
const AnimatedPrice = ({ value, duration = 600 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const target = parseInt(value.replace(/,/g, ''), 10);
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <>{display.toLocaleString('en-IN')}</>;
};

/* ─────────────────── plan data ─────────────────── */
const PLANS = [
  {
    id: 'starter',
    label: 'Starter Suite',
    accent: 'indigo',
    icon: Zap,
    monthly: '499',
    yearly: '399',
    description: 'Essential AI copy (1,000 words) & 30 visual credits for solopreneurs starting out.',
    cta: 'Get Started',
    ctaStyle: 'secondary',
    badge: null,
  },
  {
    id: 'agency',
    label: 'Pro / Growth',
    accent: 'amber',
    icon: Sparkles,
    monthly: '999',
    yearly: '799',
    description: 'Unlocked Storytelling, Problem Solving, Image Briefs & 7 Brand Workspaces + 120 credits.',
    cta: 'Start Free Trial',
    ctaStyle: 'primary',
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    label: 'Agency / Scale',
    accent: 'purple',
    icon: Shield,
    monthly: '1,299',
    yearly: '999',
    description: '300 visual credits, 50,000 words limit, 10 brand workspaces and full suite access.',
    cta: 'Contact Sales',
    ctaStyle: 'secondary',
    badge: null,
  },
];

const ALL_FEATURES = [
  'Visual AI Credits / mo',
  'Brand DNA Workspaces',
  '30‑Day Campaign Strategy',
  '8K Photorealistic Renders',
  'Content Studio (Copy & Blogs)',
  'AISA Copilot',
  null, // divider
  'AI Website & Landing Page Builder',
  'Multi-Brand Workspaces',
  'Client Access & Governance',
  'Dedicated Account Manager',
];

const PLAN_FEATURE_VALUES = {
  starter:    ['30 credits', '1 workspace', true, false, true, 'Basic', null, false, false, false, false],
  agency:     ['120 credits', '7 workspaces', true, true, true, 'Full', null, true, true, true, false],
  enterprise: ['300 credits', '10 workspaces', true, true, true, 'Priority', null, true, true, true, true],
};

/* per-plan accent tokens */
const ACCENT = {
  indigo: {
    glow:       'shadow-indigo-500/10',
    glowHover:  'hover:shadow-indigo-500/25',
    border:     'border-slate-200 dark:border-indigo-500/20',
    borderHov:  'hover:border-indigo-400 dark:hover:border-indigo-500/50',
    iconBg:     'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    label:      'text-indigo-600 dark:text-indigo-400',
    check:      'text-indigo-600 dark:text-indigo-400',
    badge:      'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
    orb:        'bg-indigo-500/5 dark:bg-indigo-500/10',
  },
  amber: {
    glow:       'shadow-amber-500/15',
    glowHover:  'hover:shadow-amber-500/30',
    border:     'border-amber-300 dark:border-amber-500/40',
    borderHov:  'hover:border-amber-400 dark:hover:border-amber-400/70',
    iconBg:     'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
    label:      'text-amber-700 dark:text-amber-400',
    check:      'text-emerald-600 dark:text-emerald-400',
    badge:      'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30',
    orb:        'bg-amber-500/5 dark:bg-amber-500/10',
  },
  purple: {
    glow:       'shadow-purple-500/10',
    glowHover:  'hover:shadow-purple-500/25',
    border:     'border-slate-200 dark:border-purple-500/20',
    borderHov:  'hover:border-purple-400 dark:hover:border-purple-500/50',
    iconBg:     'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
    label:      'text-purple-600 dark:text-purple-400',
    check:      'text-purple-600 dark:text-purple-400',
    badge:      'bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    orb:        'bg-purple-500/5 dark:bg-purple-500/10',
  },
};

/* ─────────────────── comparison rows ─────────────────── */
const COMPARISON_ROWS = [
  { label: 'Visual AI Credits / mo', values: ['30',  '120',       '300'] },
  { label: 'Word Generation Limit',  values: ['1,000 words', '15,000 words', '50,000 words'] },
  { label: 'Brand DNA Workspaces',   values: ['1',   '7',         '10'] },
  { label: 'Storytelling & Problem Solving', values: [false, true, true] },
  { label: 'Strategy Image Briefs',  values: [false, true,        true] },
  { label: 'AI Web Builder',         values: [false, '5 Sites',    '20+ Sites'] },
  { label: 'AISA Copilot',           values: ['Basic', 'Full', 'Priority'] },
];

/* ─────────────────── card ─────────────────── */
const PricingCard = ({ plan, billingCycle, isHovered, onHover, onLeave, onSelect, index }) => {
  const a = ACCENT[plan.accent];
  const price = billingCycle === 'yearly' ? plan.yearly : plan.monthly;
  const PlanIcon = plan.icon;
  const isPopular = plan.badge === 'Most Popular';
  const vals = PLAN_FEATURE_VALUES[plan.id];

  return (
    <div
      className={`relative flex flex-col h-full transition-all duration-500
        ${isHovered && !isPopular ? '-translate-y-1' : ''}
        ${isPopular ? 'md:scale-[1.02] z-10' : ''}
      `}
      style={{ transitionDelay: `${index * 60}ms` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* popular glow ring */}
      {isPopular && (
        <div className="absolute -inset-[1.5px] rounded-[20px] bg-gradient-to-b from-amber-400 via-fuchsia-500 to-indigo-600 opacity-90 -z-10 blur-[1px]" />
      )}

      {/* card body */}
      <div
        className={`relative flex flex-col justify-between h-full rounded-[18px]
          bg-white dark:bg-[#0d0d0f] border backdrop-blur-md
          transition-all duration-400
          ${isPopular
            ? 'border-amber-300/80 dark:border-transparent ring-1 ring-amber-400/50 dark:ring-0 shadow-2xl'
            : `border-slate-200/90 dark:border-slate-800 ${a.borderHov} shadow-lg hover:shadow-xl`
          }
          ${a.glow} ${a.glowHover}
          p-5 space-y-4
        `}
      >
        {/* subtle inner orb */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${a.orb} blur-2xl opacity-60 pointer-events-none`} />

        {/* header */}
        <div className="space-y-3 relative">
          {/* label + badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${a.iconBg}`}>
                <PlanIcon className="w-3.5 h-3.5" />
              </span>
              <span className={`text-[11px] font-extrabold uppercase tracking-widest ${a.label}`}>
                {plan.label}
              </span>
            </div>
            {plan.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border shadow-sm ${a.badge} animate-pulse-slow`}>
                {plan.badge}
              </span>
            )}
          </div>

          {/* price */}
          <div className="flex items-baseline gap-0.5 pt-1">
            <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">₹</span>
            <span className="text-3xl sm:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white tabular-nums leading-none">
              <AnimatedPrice value={price} key={`${plan.id}-${billingCycle}`} />
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-500 ml-0.5">/ mo</span>
          </div>

          {billingCycle === 'yearly' && (
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 -mt-1 flex items-center gap-1">
              <Check className="w-3 h-3" /> Save 20% with yearly billing
            </p>
          )}

          {/* desc */}
          <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-2.5">
            {plan.description}
          </p>

          {/* feature list */}
          <ul className="space-y-1.5 pt-1">
            {ALL_FEATURES.map((feature, i) => {
              if (feature === null) return (
                <li key={`div-${i}`} className="border-t border-slate-100 dark:border-white/5 pt-2 mt-1" />
              );
              const val = vals[i];
              const included = val !== false;
              return (
                <li key={i} className={`flex items-center gap-2 text-[11px] ${included ? '' : 'opacity-40'}`}>
                  {included
                    ? <Check className={`w-3.5 h-3.5 shrink-0 ${a.check}`} />
                    : <X className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-zinc-600" />
                  }
                  <span className={included ? 'text-slate-800 dark:text-zinc-200 font-medium' : 'text-slate-400 dark:text-zinc-600 line-through'}>
                    {typeof val === 'string' ? `${feature} — ${val}` : feature}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={onSelect}
          className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer group shadow-sm
            ${plan.ctaStyle === 'primary'
              ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98]'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 active:scale-[0.98]'
            }
          `}
        >
          <span>{plan.cta}</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────── main export ─────────────────── */
export const Pricing = () => {
  const { setActiveModule } = useWorkspace();
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSelectPlan = () => setActiveModule('login');

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative pt-8 pb-14 sm:pt-10 sm:pb-16 bg-slate-50/80 dark:bg-[#080809] text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/5 scroll-mt-6 overflow-hidden transition-colors duration-300"
    >
      {/* ── ambient orbs ── */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/3 w-96 h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-600/8 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 dark:bg-amber-500/6 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-0 w-64 h-64 rounded-full bg-fuchsia-500/5 dark:bg-fuchsia-600/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ── header ── */}
        <div
          className={`text-center max-w-2xl mx-auto space-y-2 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
            Simple Billing.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              Zero Hidden Fees.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            All plans billed in Indian Rupees (₹). Unused credits roll over automatically.
          </p>

          {/* billing toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 shadow-inner">
            {['monthly', 'yearly'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`relative px-4 py-1.5 rounded-lg text-[11px] font-extrabold transition-all duration-300 flex items-center gap-1.5 cursor-pointer
                  ${billingCycle === cycle
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300'
                  }`}
              >
                {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                {cycle === 'yearly' && (
                  <span className={`px-1 py-0.5 rounded text-[8px] font-black border transition-all duration-300
                    ${billingCycle === 'yearly'
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-zinc-600 border-transparent'
                    }`}
                  >
                    -20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3 cards ── */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '150ms' }}
        >
          {PLANS.map((plan, i) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              isHovered={hoveredCard === plan.id}
              onHover={() => setHoveredCard(plan.id)}
              onLeave={() => setHoveredCard(null)}
              onSelect={handleSelectPlan}
              index={i}
            />
          ))}
        </div>

        {/* ── fine print ── */}
        <p className={`text-center text-[11px] font-semibold text-slate-500 dark:text-zinc-500 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          Unused credits roll over. Cancel anytime. No setup fees.
        </p>

        {/* ── compare all features ── */}
        <div
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="text-center">
            <button
              onClick={() => setShowComparison(v => !v)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25 bg-indigo-50 dark:bg-indigo-500/8 hover:bg-indigo-100 dark:hover:bg-indigo-500/15 transition-all duration-200 cursor-pointer shadow-sm"
              aria-expanded={showComparison}
            >
              {showComparison
                ? <><ChevronUp className="w-3.5 h-3.5" /> Hide Comparison</>
                : <><ChevronDown className="w-3.5 h-3.5" /> Compare All Features</>
              }
            </button>
          </div>

          {/* table */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showComparison ? 'max-h-[900px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden bg-white dark:bg-[#0d0d0f] shadow-lg">
              {/* header */}
              <div className="grid grid-cols-4 border-b border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/3">
                <div className="py-3 px-4 text-[10px] font-extrabold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Feature</div>
                {PLANS.map(plan => {
                  const a = ACCENT[plan.accent];
                  return (
                    <div key={plan.id} className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${a.label}`}>{plan.label}</span>
                    </div>
                  );
                })}
              </div>
              {/* rows */}
              {COMPARISON_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-4 border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors hover:bg-slate-50 dark:hover:bg-white/3 ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50 dark:bg-white/2'}`}
                >
                  <div className="py-2.5 px-4 text-[10px] font-semibold text-slate-700 dark:text-zinc-400 flex items-center">{row.label}</div>
                  {row.values.map((val, vi) => {
                    const a = ACCENT[PLANS[vi].accent];
                    return (
                      <div key={vi} className="py-2.5 px-4 flex items-center justify-center">
                        {typeof val === 'boolean'
                          ? val
                            ? <Check className={`w-3.5 h-3.5 ${a.check}`} />
                            : <X className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-700" />
                          : <span className={`text-[10px] font-bold ${a.label}`}>{val}</span>
                        }
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── trust strip ── */}
        <div
          className={`flex flex-wrap justify-center gap-4 sm:gap-6 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '500ms' }}
        >
          {[
            { icon: Shield, text: 'SOC 2 Compliant',        color: 'text-indigo-600 dark:text-indigo-400' },
            { icon: Check,  text: 'No credit card required', color: 'text-emerald-600 dark:text-emerald-400' },
            { icon: Zap,    text: 'Instant activation',      color: 'text-amber-600 dark:text-amber-400' },
            { icon: Users,  text: 'Cancel anytime',          color: 'text-fuchsia-600 dark:text-fuchsia-400' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-zinc-500">
              <Icon className={`w-3 h-3 ${color}`} />
              {text}
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
};
