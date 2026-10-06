import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Award, 
  BarChart3, 
  Users, 
  ExternalLink,
  X,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

/* ─────────────────── Case Studies & Testimonial Data ─────────────────── */
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Vikramaditya Singhania',
    role: 'Head of Performance Marketing',
    company: 'HyperScale Digital',
    category: 'Performance Agencies',
    avatar: 'VS',
    avatarBg: 'from-indigo-600 to-blue-500',
    accent: 'indigo',
    rating: 5,
    metricsPill: '+340% ROAS in 30 Days',
    metricHighlight: '4.6x Avg ROAS',
    quote: 'AI ADS completely dissolved our creative bottleneck. Before, our design team took 4 to 5 days to turn around ad variations for 8 client accounts. With the Brand DNA engine, we generated 60+ compliant, high-converting creatives in under 25 minutes.',
    highlightedPhrase: 'generated 60+ compliant creatives in under 25 minutes',
    caseDetails: {
      clientType: '8 Multi-Category Client Brands',
      monthlyAdSpend: '$450K+ Monthly Ad Spend',
      before: '4–5 days per creative cycle, constant brand drift complaints',
      after: '25 min deployment, zero compliance revisions, +340% blended ROAS',
      topFeature: 'Brand DNA Engine & Autonomous A/B Variation Suite'
    },
    tags: ['Brand DNA Engine', 'Autonomous A/B Testing', 'Meta & TikTok']
  },
  {
    id: 2,
    name: 'Elena Rostova',
    role: 'Creative & Brand Identity Director',
    company: 'Aura Commerce Lab',
    category: 'D2C Brands',
    avatar: 'ER',
    avatarBg: 'from-purple-600 to-pink-500',
    accent: 'purple',
    rating: 5,
    metricsPill: '5 Days → 20 Mins Workflow',
    metricHighlight: '85% Time Saved',
    quote: 'The biggest fear with AI is brand drift—hallucinated colors, inconsistent logos, off-key copy. AI ADS is the first platform that strictly honors our typography, tone, and visual guidelines. We replaced our entire 3D photoshoot budget with 8K photoreal renders.',
    highlightedPhrase: 'strictly honors our typography, tone, and visual guidelines',
    caseDetails: {
      clientType: 'Omnichannel D2C Skincare & Wellness',
      monthlyAdSpend: '$280K+ Monthly Ad Spend',
      before: '$15K/month on 3D studio photographers, slow campaign refreshes',
      after: 'Instant 8K photorealistic product scene generation, 85% cost drop',
      topFeature: '8K Photoreal Renders & Visual Governance Guardrails'
    },
    tags: ['8K Photoreal Renders', 'Zero Brand Drift', 'Multi-Store D2C']
  },
  {
    id: 3,
    name: 'Marcus Vance',
    role: 'Managing Partner & Media Buyer',
    company: 'Velocity Growth Partners',
    category: 'Performance Agencies',
    avatar: 'MV',
    avatarBg: 'from-emerald-600 to-teal-500',
    accent: 'emerald',
    rating: 5,
    metricsPill: '42% Lower Blended CAC',
    metricHighlight: '$1.8M Scaled',
    quote: 'We scaled from $40K to $180K/month ad spend across 4 accounts without hiring extra designers. The autonomous angle detection discovered winning hooks we never would have tested manually. It literally paid for itself within the first 48 hours.',
    highlightedPhrase: 'paid for itself within the first 48 hours',
    caseDetails: {
      clientType: 'High-Growth E-Commerce Accelerator',
      monthlyAdSpend: '$1.8M Managed Ad Spend',
      before: 'High fatigue on Meta ads, creative stagnation after day 10',
      after: 'Weekly algorithmic refreshes, 42% CAC reduction on PMax & Meta',
      topFeature: 'Autonomous Angle Discovery & Multi-Tenant Workspaces'
    },
    tags: ['Google PMax', 'Creative Angle Discovery', 'Scale Acceleration']
  },
  {
    id: 4,
    name: 'Priya Patel',
    role: 'Founder & Head of Growth',
    company: 'Kaira Beauty Collective',
    category: 'D2C Brands',
    avatar: 'PP',
    avatarBg: 'from-pink-600 to-rose-500',
    accent: 'pink',
    rating: 5,
    metricsPill: '4.8x Higher CTR on Meta',
    metricHighlight: '120+ Assets / Mo',
    quote: 'Our customer acquisition cost on Instagram dropped by 38% after deploying AI ADS dynamic ad variations. The product studio renders are so realistic that our audience thought we did a high-budget studio photoshoot in Paris.',
    highlightedPhrase: 'customer acquisition cost dropped by 38%',
    caseDetails: {
      clientType: 'Premium Direct-to-Consumer Cosmetics',
      monthlyAdSpend: '$120K Monthly Ad Spend',
      before: 'High creative production costs, inability to test seasonal angles',
      after: '120+ on-brand assets monthly, 4.8x increase in click-through-rates',
      topFeature: 'Virtual Product Studio & Social Video Variations'
    },
    tags: ['Virtual Product Studio', 'Beauty & Cosmetics', 'Meta Ads']
  },
  {
    id: 5,
    name: 'David Thorne',
    role: 'Executive Creative Director',
    company: 'Nexus Media Lab',
    category: 'Creative Studios',
    avatar: 'DT',
    avatarBg: 'from-amber-600 to-orange-500',
    accent: 'amber',
    rating: 5,
    metricsPill: '60+ Brand Assets / Hour',
    metricHighlight: '10x Creative Velocity',
    quote: 'Our agency delivers high-tempo performance creative for tier-1 SaaS startups. AI ADS gave our art directors superpowers—they focus on high-level narrative while the engine handles resizing, translations, and multi-format variants in seconds.',
    highlightedPhrase: 'art directors focus on high-level strategy while the engine handles variants',
    caseDetails: {
      clientType: 'Tier-1 SaaS & Enterprise Tech Studio',
      monthlyAdSpend: '$650K+ Monthly Ad Spend',
      before: 'Burnout from resizing banners and formatting 1:1, 9:16, 16:9 specs',
      after: 'One-click multi-aspect ratio generation with intact composition',
      topFeature: 'Omnichannel Aspect Ratio Engine & Vector Asset Exporter'
    },
    tags: ['Creative Studio', 'SaaS Performance', 'Omnichannel']
  },
  {
    id: 6,
    name: 'Maya Lin',
    role: 'VP of Omnichannel Marketing',
    company: 'PulseScale Ventures',
    category: 'Enterprise Marketing',
    avatar: 'ML',
    avatarBg: 'from-cyan-600 to-blue-500',
    accent: 'cyan',
    rating: 5,
    metricsPill: '$2.4M Ad Spend Managed',
    metricHighlight: '99.4% Compliance',
    quote: 'Managing 12 brand properties across 3 continents used to require endless approval chains and compliance reviews. AI ADS governance layer enforces rules automatically before anything goes live. It is our central operating system.',
    highlightedPhrase: 'enforces brand rules automatically before anything goes live',
    caseDetails: {
      clientType: 'Global Multi-Brand Enterprise Holdings',
      monthlyAdSpend: '$2.4M Global Ad Spend',
      before: 'Complex manual legal/brand sign-offs taking 10+ business days',
      after: 'Automated policy checks and governance with instant audit logs',
      topFeature: 'Enterprise Governance & Brand Protection Suite'
    },
    tags: ['Enterprise Governance', 'Global Localization', 'Automated QA']
  }
];

const CATEGORIES = [
  'All Stories',
  'Performance Agencies',
  'D2C Brands',
  'Creative Studios',
  'Enterprise Marketing'
];

/* ─────────────────── Accent Colors ─────────────────── */
const ACCENT_STYLES = {
  indigo: {
    badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    glow: 'hover:shadow-indigo-500/15 hover:border-indigo-500/40',
    pill: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    dot: 'bg-indigo-500'
  },
  purple: {
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    glow: 'hover:shadow-purple-500/15 hover:border-purple-500/40',
    pill: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    dot: 'bg-purple-500'
  },
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    glow: 'hover:shadow-emerald-500/15 hover:border-emerald-500/40',
    pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    dot: 'bg-emerald-500'
  },
  pink: {
    badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    glow: 'hover:shadow-pink-500/15 hover:border-pink-500/40',
    pill: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20',
    dot: 'bg-pink-500'
  },
  amber: {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    glow: 'hover:shadow-amber-500/15 hover:border-amber-500/40',
    pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    dot: 'bg-amber-500'
  },
  cyan: {
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    glow: 'hover:shadow-cyan-500/15 hover:border-cyan-500/40',
    pill: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
    dot: 'bg-cyan-500'
  }
};

export const Testimonials = () => {
  const { setActiveModule } = useWorkspace();
  const [selectedCategory, setSelectedCategory] = useState('All Stories');
  const [activeModalCase, setActiveModalCase] = useState(null);

  const filteredStories = selectedCategory === 'All Stories'
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.category === selectedCategory);

  const handleStartTrial = () => {
    setActiveModule('login');
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-slate-50/80 dark:bg-[#070913] text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
      {/* Ambient decorative glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* ──────── 1. Section Header ──────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/25 text-xs font-black tracking-wide text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>PROVEN AGENCY IMPACT & PILOT STORIES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Loved by Modern Agencies &amp; <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              High-Velocity Brands
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            See how performance marketers, creative studios, and D2C brands eliminate creative fatigue, cut turnaround times by 85%, and scale ROAS with AI ADS™.
          </p>
        </div>

        {/* ──────── 2. Trust Metrics Highlight Strip ──────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white">4.9 / 5.0</span>
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              98% Satisfaction rating across 140+ early agency cohort members
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-emerald-600 dark:text-emerald-400">+340%</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Average ROAS lift measured across 500+ active pilot campaigns
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm hover:border-purple-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-purple-600 dark:text-purple-400">85% Faster</span>
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Production turnaround cut from 4 days down to under 25 minutes
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-cyan-600 dark:text-cyan-400">100% On-Brand</span>
              <ShieldCheck className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Zero brand drift with automated Brand DNA guardrails
            </p>
          </div>
        </div>

        {/* ──────── 3. Interactive Filter Tabs ──────── */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* ──────── 4. Testimonial Cards Grid (Ultra Attractive) ──────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStories.map((item) => {
            const styles = ACCENT_STYLES[item.accent] || ACCENT_STYLES.indigo;

            return (
              <div
                key={item.id}
                className={`group relative rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden ${styles.glow}`}
              >
                {/* Decorative background watermark quote */}
                <Quote className="absolute -top-3 -right-3 w-28 h-28 text-slate-200/40 dark:text-slate-800/30 pointer-events-none -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0" />

                <div className="relative z-10 space-y-5">
                  {/* Card Header: Category & Metric Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${styles.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                      {item.category}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${styles.pill}`}>
                      <TrendingUp className="w-3 h-3" />
                      {item.metricsPill}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 ml-1">
                      5.0
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 ml-auto">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Verified Result
                    </span>
                  </div>

                  {/* Quote Body with Highlight */}
                  <div className="relative">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Author Profile & Modal Trigger */}
                <div className="relative z-10 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.avatarBg} text-white font-extrabold text-sm flex items-center justify-center shadow-md flex-shrink-0 ring-2 ring-white dark:ring-slate-800`}>
                      {item.avatar}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.role}
                      </p>
                      <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                        {item.company}
                      </p>
                    </div>
                  </div>

                  {/* View Impact Trigger Button */}
                  <button
                    onClick={() => setActiveModalCase(item)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all cursor-pointer"
                    title="View case study details"
                    aria-label={`View case study details for ${item.company}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ──────── 5. Interactive Case Study Modal ──────── */}
        {activeModalCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c0f1d] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Close Button */}
              <button
                onClick={() => setActiveModalCase(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeModalCase.avatarBg} text-white font-black text-base flex items-center justify-center shadow-lg`}>
                  {activeModalCase.avatar}
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-1">
                    {activeModalCase.category} Case Study
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">
                    {activeModalCase.company}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeModalCase.name} • {activeModalCase.role}
                  </p>
                </div>
              </div>

              {/* Impact Stat Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Primary Result
                  </span>
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                    {activeModalCase.metricsPill}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Active Scale
                  </span>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    {activeModalCase.caseDetails.monthlyAdSpend}
                  </p>
                </div>
              </div>

              {/* Before vs After Comparison */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Transformation Snapshot
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                    <span className="font-extrabold uppercase mr-2">[Before AI ADS]:</span>
                    {activeModalCase.caseDetails.before}
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    <span className="font-extrabold uppercase mr-2">[After AI ADS]:</span>
                    {activeModalCase.caseDetails.after}
                  </div>
                </div>
              </div>

              {/* Full Quote */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed">
                "{activeModalCase.quote}"
              </div>

              {/* Modal Action CTA */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                  Feature: {activeModalCase.caseDetails.topFeature}
                </span>
                <button
                  onClick={() => {
                    setActiveModalCase(null);
                    handleStartTrial();
                  }}
                  className="btn-primary w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ml-auto"
                >
                  <span>Experience Similar Velocity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ──────── 6. Bottom Social Proof & Agency Pilot CTA Bar ──────── */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-slate-900/30 border border-indigo-500/30 p-8 sm:p-10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-3 text-center md:text-left relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">AK</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">RM</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">SL</div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-black text-indigo-300">+140</div>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
                Join 140+ Scaled Agency Partners
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
              Ready to unlock 10x creative velocity for your clients?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Get full Brand DNA configuration, autonomous A/B testing variations, and multi-tenant client governance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
            <button
              onClick={handleStartTrial}
              className="w-full sm:w-auto btn-primary px-7 py-3 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Request Agency Pilot Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#pricing"
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-slate-200 dark:border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Plans</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
