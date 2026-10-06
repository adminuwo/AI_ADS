import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Image as ImageIcon, 
  FileText, 
  Globe, 
  Search, 
  Calendar, 
  CheckSquare, 
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  Star,
  Maximize2,
  Pause,
  Grid,
  Film,
  Zap,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Lock,
  Code
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

/* ========================================================================= */
/* 🎨 TAILORED MINI ANIMATIONS FOR EACH FEATURE CARD                         */
/* ========================================================================= */

// 1. Brand DNA Engine (Real Extraction & Profile Creation Workflow)
const BrandDnaAnimation = ({ isActive }) => (
  <div className="relative w-full h-full flex items-center justify-center p-3">
    <div className="w-60 bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3 space-y-2.5 shadow-2xl backdrop-blur-md">
      {/* Input URL Bar */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/20 text-[9px] font-mono text-amber-200/90">
        <span className="text-amber-400 font-bold">URL:</span>
        <span className="truncate">https://mybrand.com</span>
        <span className="ml-auto text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded animate-pulse">Extracting</span>
      </div>

      {/* Extracted Brand Profile Card */}
      <div className="space-y-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-[9px] font-bold text-white">
          <span>Brand Voice & Identity</span>
          <span className="text-emerald-400 text-[8px]">100% Synced</span>
        </div>
        
        {/* USPs Extracted */}
        <div className="flex flex-wrap gap-1">
          <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">USP: Zero Lag AI</span>
          <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300">Tone: Premium</span>
        </div>

        {/* Brand Palette Dots */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[8px] font-mono text-slate-400">Palette:</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_6px_#6366f1]" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 2. Creative Studio Animation (Prompt to 4-Variation Grid Workflow)
const CreativeStudioAnimation = ({ isActive }) => (
  <div className="relative w-full h-full flex items-center justify-center p-3">
    <div className="w-60 bg-slate-950/90 border border-fuchsia-500/30 rounded-2xl p-2.5 space-y-2 shadow-2xl backdrop-blur-md">
      {/* Prompt Input Line */}
      <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-900 border border-fuchsia-500/20 text-[8.5px] font-mono text-fuchsia-200">
        <span className="truncate">"Luxury Sneaker in Neon Snow"</span>
        <span className="text-[7.5px] bg-fuchsia-500 text-white px-1.5 py-0.5 rounded font-bold shrink-0">8K</span>
      </div>

      {/* 4 Image Variations Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: 'Var 1', style: 'from-fuchsia-600/40 via-purple-900/50 to-slate-950', ratio: '1:1' },
          { label: 'Var 2 (Active)', style: 'from-pink-500/50 via-fuchsia-800/60 to-slate-950 border-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.5)]', ratio: '1:1', active: true },
          { label: 'Var 3', style: 'from-purple-600/40 via-indigo-900/50 to-slate-950', ratio: '16:9' },
          { label: 'Var 4', style: 'from-rose-600/40 via-purple-900/50 to-slate-950', ratio: '9:16' }
        ].map((item, i) => (
          <div 
            key={i}
            className={`h-11 rounded-lg bg-gradient-to-br ${item.style} border p-1 flex flex-col justify-between relative overflow-hidden`}
          >
            <span className="text-[7px] font-mono text-white font-bold">{item.label}</span>
            <span className="text-[6.5px] font-mono text-slate-300 self-end bg-slate-950/80 px-1 rounded">{item.ratio}</span>
            {item.active && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 3. Content Studio Animation (Multi-Format Copywriting & Live Stream)
const ContentStudioAnimation = ({ isActive }) => {
  const [tab, setTab] = useState(0);
  const platforms = [
    { name: 'LinkedIn', text: '🔥 3 secrets to 10x your ad ROI using AI memory...' },
    { name: 'Meta Ad', text: '⚡ Stop wasting ad spend! Get high-converting visuals...' },
    { name: 'SEO Blog', text: '📖 Complete Guide: How AI Automation scales brands in 2026...' }
  ];

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => setTab((t) => (t + 1) % platforms.length), 3000);
    return () => clearInterval(timer);
  }, [isActive]);

  const current = platforms[tab];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3">
      <div className="w-60 bg-slate-950/90 border border-rose-500/30 rounded-2xl p-3 space-y-2 shadow-2xl backdrop-blur-md">
        {/* Channel Selector Tabs */}
        <div className="flex gap-1 border-b border-rose-500/20 pb-1.5">
          {platforms.map((p, i) => (
            <span 
              key={p.name}
              className={`text-[8px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                i === tab 
                  ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]' 
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              {p.name}
            </span>
          ))}
        </div>

        {/* Live Generating Copy Output */}
        <div className="min-h-[44px] bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-[8.5px] font-mono text-rose-100 leading-snug flex items-center">
          <p className="line-clamp-2">{current.text}</p>
          <span className="w-1 h-3 bg-rose-400 ml-1 animate-pulse shrink-0" />
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between text-[7.5px] font-mono text-slate-400 pt-0.5">
          <span className="text-emerald-400 font-bold">✓ Copy Ready</span>
          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-300 font-bold border border-rose-500/20">Regenerate</span>
        </div>
      </div>
    </div>
  );
};

// 4. Strategy Hub Animation (30-Day 4-Week Roadmap Generator)
const StrategyAnimation = ({ isActive }) => (
  <div className="relative w-full h-full flex items-center justify-center p-3">
    <div className="w-60 bg-slate-950/90 border border-violet-500/30 rounded-2xl p-2.5 space-y-2 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-1 text-[8.5px] font-mono font-bold text-violet-300">
        <span>30-DAY AUTOMATED ROADMAP</span>
        <span className="text-emerald-400">Regenerative</span>
      </div>

      {/* 4 Week Strategy Cards */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { week: 'W1', title: 'Brand Awareness', channel: 'Meta & X' },
          { week: 'W2', title: 'Lead Gen Funnel', channel: 'LinkedIn' },
          { week: 'W3', title: 'SEO Keyword Push', channel: 'Google' },
          { week: 'W4', title: 'Retargeting Ads', channel: 'Omni' }
        ].map((w, i) => (
          <div key={w.week} className="p-1.5 rounded-xl bg-slate-900/80 border border-violet-500/20 space-y-0.5">
            <div className="flex items-center justify-between text-[7.5px] font-mono">
              <span className="font-extrabold text-violet-400">{w.week}</span>
              <span className="text-slate-400">{w.channel}</span>
            </div>
            <p className="text-[8px] font-bold text-slate-200 truncate">{w.title}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 5. SEO Intelligence Suite Animation (Keyword Intelligence Table & Intent Gaps)
const SeoAnimation = ({ isActive }) => (
  <div className="relative w-full h-full flex items-center justify-center p-3">
    <div className="w-60 bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-2.5 space-y-2 shadow-2xl backdrop-blur-md">
      {/* Search Query Input */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-emerald-500/30 text-[8.5px] font-mono text-emerald-300">
        <Search className="w-3 h-3 text-emerald-400" />
        <span className="truncate">"ai marketing platform"</span>
        <span className="ml-auto text-[7.5px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold">Search</span>
      </div>

      {/* Live Keyword Metrics Table */}
      <div className="space-y-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 text-[8px] font-mono">
        <div className="flex justify-between text-slate-400 font-bold border-b border-slate-800 pb-0.5">
          <span>KEYWORD</span>
          <span>VOL</span>
          <span>KD%</span>
        </div>
        <div className="flex justify-between text-emerald-300 font-bold">
          <span className="truncate max-w-[90px]">ai ad generator</span>
          <span>45K</span>
          <span className="text-emerald-400">24% Easy</span>
        </div>
        <div className="flex justify-between text-teal-300">
          <span className="truncate max-w-[90px]">ad copy suite</span>
          <span>18K</span>
          <span className="text-amber-400">38% Med</span>
        </div>
      </div>
    </div>
  </div>
);

// 6. Campaign Builder Animation (Multi-Channel Wizard & Asset Bundling)
const CampaignAnimation = ({ isActive }) => (
  <div className="relative w-full h-full flex items-center justify-center p-3">
    <div className="w-60 bg-slate-950/90 border border-blue-500/30 rounded-2xl p-2.5 space-y-2 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between text-[8.5px] font-mono text-blue-300 font-bold border-b border-blue-500/20 pb-1">
        <span>CAMPAIGN WIZARD</span>
        <span className="text-blue-400">Step 3 of 3</span>
      </div>

      {/* Bundled Asset Stack */}
      <div className="space-y-1.5">
        <div className="p-1.5 rounded-lg bg-slate-900 border border-blue-500/30 flex items-center justify-between text-[8px] font-mono">
          <span className="text-slate-300">🎨 Visual: 8K Neon Graphic</span>
          <span className="text-emerald-400">✓ Linked</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-900 border border-indigo-500/30 flex items-center justify-between text-[8px] font-mono">
          <span className="text-slate-300">✍️ Copy: Meta + LinkedIn</span>
          <span className="text-emerald-400">✓ Linked</span>
        </div>
      </div>

      {/* Multi-Channel Distribution Badges */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex gap-1">
          <span className="text-[7.5px] font-bold px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40">Meta</span>
          <span className="text-[7.5px] font-bold px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40">Google</span>
        </div>
        <span className="text-[8px] font-mono bg-blue-500 text-white px-2 py-0.5 rounded font-extrabold animate-pulse">Launch 🚀</span>
      </div>
    </div>
  </div>
);

// 7. Content Calendar Animation (Drag & Drop Visual Timeline Planner)
const CalendarAnimation = ({ isActive }) => (
  <div className="relative w-full h-full flex items-center justify-center p-3">
    <div className="w-60 bg-slate-950/90 border border-green-500/30 rounded-2xl p-2.5 space-y-2 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between text-[8.5px] font-mono font-bold text-green-400 border-b border-green-500/20 pb-1">
        <span>VISUAL TIMELINE PLANNER</span>
        <span className="text-slate-400">Drag & Drop</span>
      </div>

      {/* Days & Planned Content Cards */}
      <div className="space-y-1.5 text-[8px] font-mono">
        <div className="p-1.5 rounded-lg bg-slate-900 border border-green-500/40 flex items-center justify-between">
          <span className="font-bold text-white">Mon: Reel Concept 🎥</span>
          <span className="text-emerald-400 font-extrabold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">Approved ✨</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <span className="font-bold text-slate-300">Wed: Blog Draft 📝</span>
          <span className="text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/30">In Review ⏳</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-slate-300">
          <span>Fri: Campaign Asset 🧵</span>
          <span className="text-indigo-300 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-500/30">Planned 📅</span>
        </div>
      </div>
    </div>
  </div>
);

// 8. Asset Library Animation (Tagged Cloud Storage Vault)
const AssetLibraryAnimation = ({ isActive }) => (
  <div className="relative w-full h-full flex items-center justify-center p-3">
    <div className="w-60 bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-2.5 space-y-2 shadow-2xl backdrop-blur-md">
      {/* Search & Storage Meter */}
      <div className="flex items-center justify-between text-[8.5px] font-mono text-cyan-300 font-bold border-b border-cyan-500/20 pb-1">
        <span>MEDIA VAULT</span>
        <span className="text-slate-400">Cloud Storage: 1.2GB</span>
      </div>

      {/* Media Items Matrix with Tags */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="p-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
          <div className="h-7 rounded bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-[10px]">🖼️ Product_Ad.jpg</div>
          <span className="text-[7px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300 font-bold">#1:1 Square</span>
        </div>
        <div className="p-1.5 rounded-xl bg-slate-900 border border-blue-500/30 space-y-1">
          <div className="h-7 rounded bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-[10px]">🎥 Hero_Video.mp4</div>
          <span className="text-[7px] font-mono px-1 rounded bg-blue-500/20 text-blue-300 font-bold">#9:16 Reel</span>
        </div>
      </div>
    </div>
  </div>
);

// 9. AI Website Builder Animation (Prompt Chat to Live Page Generation)
const WebsiteBuilderAnimation = ({ isActive }) => (
  <div className="relative w-full h-full flex items-center justify-center p-3">
    <div className="w-60 bg-slate-950/90 border border-pink-500/30 rounded-2xl p-2.5 space-y-2 shadow-2xl backdrop-blur-md">
      {/* Interactive Chat Prompt */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900 border border-pink-500/30 text-[8px] font-mono text-pink-200">
        <span className="text-pink-400 font-bold">Prompt:</span>
        <span className="truncate">"Dark mode SaaS hero section with CTA"</span>
      </div>

      {/* Generated Wireframe Preview */}
      <div className="bg-slate-900/80 p-2 rounded-xl border border-pink-500/20 space-y-1.5">
        {/* Navbar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-1">
          <div className="w-8 h-1.5 rounded bg-pink-400 font-bold" />
          <div className="w-6 h-2 rounded bg-pink-500 text-[6px] font-bold text-white flex items-center justify-center">Login</div>
        </div>

        {/* Hero Headline & CTA */}
        <div className="space-y-1 py-0.5">
          <div className="w-28 h-2 rounded bg-gradient-to-r from-pink-400 to-rose-400" />
          <div className="w-20 h-1.5 rounded bg-slate-700" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-1 pt-0.5">
          <div className="h-4 rounded bg-slate-800 border border-slate-700" />
          <div className="h-4 rounded bg-slate-800 border border-slate-700" />
        </div>
      </div>
    </div>
  </div>
);

export const Features = () => {
  const { setActiveModule, user } = useWorkspace();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  
  // Touch / Mouse Drag support state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  // Helper handler to redirect to login page/modal smoothly
  const handleLaunchLogin = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (user) {
      setActiveModule('dashboard');
    } else {
      setActiveModule('login');
    }
  };

  const featureCards = [
    {
      id: 'brandDna',
      targetModule: 'brands',
      title: 'Brand DNA Engine',
      desc: 'A persistent memory of your identity. It extracts your USPs, personas, and differentiators, enforcing your brand voice across all assets.',
      icon: ShieldCheck,
      badge: 'PERSISTENT BRAND MEMORY',
      subtitle: '2026 Edition • AI Memory Core',
      gradient: 'from-amber-600 via-rose-700 to-indigo-950',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      bgPattern: 'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.3) 0%, transparent 60%)',
      renderAnimation: (active) => <BrandDnaAnimation isActive={active} />
    },
    {
      id: 'creative',
      targetModule: 'creative',
      title: 'Creative Studio',
      desc: 'Create photorealistic and vector ad visuals in 1:1, 16:9, and 9:16 aspect ratios with 4 variations per concept in high resolution.',
      icon: ImageIcon,
      badge: '8K VISUAL GENERATOR',
      subtitle: '4 Variations • Multi-Format',
      gradient: 'from-fuchsia-600 via-purple-700 to-slate-950',
      glowColor: 'rgba(217, 70, 239, 0.4)',
      bgPattern: 'radial-gradient(circle at 30% 20%, rgba(192,38,211,0.35) 0%, transparent 60%)',
      renderAnimation: (active) => <CreativeStudioAnimation isActive={active} />
    },
    {
      id: 'contentStudio',
      targetModule: 'studio',
      title: 'Content Studio',
      desc: 'Generate platform-ready posts for LinkedIn, Meta, X, and Instagram, plus 1,500+ word SEO blog drafts, email sequences, and PPC ad copy.',
      icon: FileText,
      badge: 'MULTI-FORMAT COPYWRITER',
      subtitle: 'GPT-4o Engine • Multi-Channel',
      gradient: 'from-rose-600 via-pink-700 to-indigo-950',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      bgPattern: 'radial-gradient(circle at 60% 80%, rgba(244,63,94,0.35) 0%, transparent 60%)',
      renderAnimation: (active) => <ContentStudioAnimation isActive={active} />
    },
    {
      id: 'strategy',
      targetModule: 'strategy',
      title: 'Strategy Hub',
      desc: 'Turn business goals into balanced 30-day roadmaps across channels and funnel stages, with instant single-card regeneration.',
      icon: Layers,
      badge: '30-DAY ROADMAPS',
      subtitle: '30-Day Automated Funnels',
      gradient: 'from-violet-600 via-purple-800 to-slate-950',
      glowColor: 'rgba(139, 92, 246, 0.4)',
      bgPattern: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.35) 0%, transparent 65%)',
      renderAnimation: (active) => <StrategyAnimation isActive={active} />
    },
    {
      id: 'seo',
      targetModule: 'seo',
      title: 'SEO Intelligence Suite',
      desc: 'Discover high-value keyword clusters by search intent, analyze competitor content gaps, and build structured content briefs automatically.',
      icon: Search,
      badge: 'KEYWORD & BRIEF ENGINE',
      subtitle: 'Search Intent Analytics',
      gradient: 'from-emerald-600 via-teal-700 to-slate-950',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      bgPattern: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.35) 0%, transparent 60%)',
      renderAnimation: (active) => <SeoAnimation isActive={active} />
    },
    {
      id: 'campaigns',
      targetModule: 'campaigns',
      title: 'Campaign Builder',
      desc: 'Bundle copy, visuals, audiences, and channels into cohesive multi-touch campaigns with unified messaging.',
      icon: CheckSquare,
      badge: 'MULTI-TOUCH BLUEPRINTS',
      subtitle: 'End-to-End Orchestration',
      gradient: 'from-blue-600 via-indigo-700 to-slate-950',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      bgPattern: 'radial-gradient(circle at 20% 70%, rgba(59,130,246,0.35) 0%, transparent 60%)',
      renderAnimation: (active) => <CampaignAnimation isActive={active} />
    },
    {
      id: 'calendar',
      targetModule: 'calendar',
      title: 'Content Calendar',
      desc: 'Plan visually with drag-and-drop weekly and monthly views, real-time status tracking, channel filtering, and priority tags.',
      icon: Calendar,
      badge: 'VISUAL TIMELINE PLANNER',
      subtitle: 'Drag-and-Drop Visual Planning',
      gradient: 'from-green-600 via-emerald-800 to-slate-950',
      glowColor: 'rgba(34, 197, 94, 0.4)',
      bgPattern: 'radial-gradient(circle at 70% 50%, rgba(34,197,94,0.3) 0%, transparent 60%)',
      renderAnimation: (active) => <CalendarAnimation isActive={active} />
    },
    {
      id: 'assetLibrary',
      targetModule: 'assets',
      title: 'Asset Library',
      desc: 'Store, tag, search, and securely share all your brand media, visuals, and templates in one centralized cloud repository.',
      icon: Users,
      badge: 'SECURE CLOUD STORAGE',
      subtitle: 'Centralized Media Vault',
      gradient: 'from-cyan-600 via-blue-800 to-slate-950',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      bgPattern: 'radial-gradient(circle at 40% 30%, rgba(6,182,212,0.35) 0%, transparent 60%)',
      renderAnimation: (active) => <AssetLibraryAnimation isActive={active} />
    },
    {
      id: 'websiteBuilder',
      targetModule: 'websiteBuilder',
      title: 'AI Website Builder',
      desc: 'Describe your page vision, receive responsive HTML/CSS layouts with hero sections and CTAs, then refine via interactive chat.',
      icon: Globe,
      badge: 'PROMPT-TO-PAGE GENERATOR',
      subtitle: 'Zero-Code Landing Pages',
      gradient: 'from-pink-600 via-rose-700 to-slate-950',
      glowColor: 'rgba(236, 72, 153, 0.4)',
      bgPattern: 'radial-gradient(circle at 80% 80%, rgba(236,72,153,0.35) 0%, transparent 60%)',
      renderAnimation: (active) => <WebsiteBuilderAnimation isActive={active} />
    }
  ];

  const total = featureCards.length;

  // Auto play logic
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, total]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Drag / Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const currentFeature = featureCards[activeIndex];


  return (
    <section 
      id="features" 
      className="py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800/80 scroll-mt-20 transition-all duration-700 select-none"
    >
      {/* Dynamic Ambient Background Glow based on active card */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out opacity-40 blur-[120px]"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${currentFeature.glowColor} 0%, rgba(15,23,42,0) 70%)`
        }}
      />

      {/* Cinematic Top Spotlight Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-extrabold text-indigo-400 shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>UNIFIED PLATFORM CAPABILITIES</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] tracking-tight text-white leading-tight">
            Features Built for Complete Marketing Execution
          </h2>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            9 integrated modules working in harmony from a single source of truth.
          </p>
        </div>

        {/* 🎬 3D COVERFLOW SHOWCASE MODE */}
        <div className="relative pt-4 pb-8">
          
          {/* 3D Carousel Stage */}
          <div 
            className="relative h-[430px] sm:h-[480px] w-full flex items-center justify-center overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
            style={{ perspective: '1200px' }}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsAutoPlay(false)}
          >
            {featureCards.map((feat, index) => {
              const IconComp = feat.icon;

              // Calculate relative offset circular index
              let offset = index - activeIndex;
              const half = Math.floor(total / 2);
              if (offset > half) offset -= total;
              if (offset < -half) offset += total;

              const isActive = offset === 0;
              const absOffset = Math.abs(offset);
              
              // Show 5 cards maximum (-2, -1, 0, 1, 2)
              if (absOffset > 2) return null;

              // 3D positioning math
              const translateX = offset * (window.innerWidth < 640 ? 150 : 250);
              const translateZ = -absOffset * 130;
              const rotateY = offset * -28; // angle towards center
              const scale = isActive ? 1.08 : Math.max(0.82 - absOffset * 0.08, 0.7);
              const opacity = isActive ? 1 : absOffset === 1 ? 0.75 : 0.4;
              const zIndex = 30 - absOffset * 10;

              return (
                <div
                  key={feat.id}
                  onClick={(e) => {
                    if (isActive) {
                      handleLaunchLogin(e);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                  className="absolute top-1/2 left-1/2 w-[270px] sm:w-[330px] h-[370px] sm:h-[420px] rounded-3xl transition-all duration-700 ease-out cursor-pointer group shadow-2xl overflow-hidden border"
                  style={{
                    transform: `translate3d(calc(-50% + ${translateX}px), -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    borderColor: isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isActive 
                      ? `0 25px 60px -15px ${feat.glowColor}, 0 0 30px rgba(0,0,0,0.8)` 
                      : '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  {/* Visual Card Artwork Gradient & Texture */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-b ${feat.gradient}`}
                    style={{ backgroundImage: feat.bgPattern }}
                  />

                  {/* Dark gradient overlay for bottom typography readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Card Header Info (Provider / Badge top-left) */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    {/* Badge with Icon */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <IconComp className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-black tracking-wider text-slate-200 uppercase font-mono">
                        {feat.badge}
                      </span>
                    </div>
                  </div>

                  {/* Tailored Animated Visual Component for each Feature */}
                  <div className="absolute top-14 left-0 right-0 bottom-36 z-10 pointer-events-none">
                    {feat.renderAnimation && feat.renderAnimation(isActive)}
                  </div>

                  {/* Card Bottom Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20 space-y-2">
                    <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
                      {feat.subtitle}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-300 transition-colors tracking-tight">
                      {feat.title}
                    </h3>

                    <p className={`text-xs text-slate-300/90 leading-relaxed line-clamp-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                      {feat.desc}
                    </p>

                    {isActive && (
                      <div 
                        onClick={(e) => handleLaunchLogin(e)}
                        className="pt-2 flex items-center justify-between text-xs font-extrabold text-indigo-400 hover:text-indigo-300 cursor-pointer group/cta"
                      >
                        <span className="underline decoration-indigo-500/50 underline-offset-4 group-hover/cta:decoration-indigo-400">
                          Launch Module
                        </span>
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center group-hover/cta:translate-x-1 transition-transform">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Glossy Navigation Controls Left & Right */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all"
            aria-label="Next feature"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Thumbnail Bar / Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {featureCards.map((feat, idx) => (
              <button
                key={feat.id}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === activeIndex
                    ? 'w-8 h-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/50'
                    : 'w-2.5 h-2.5 bg-slate-800 hover:bg-slate-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Active Module Banner Card below Carousel */}
          <div className="max-w-3xl mx-auto mt-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                {React.createElement(currentFeature.icon, { className: 'w-7 h-7' })}
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
                  <span>{currentFeature.badge}</span>
                </div>
                <h4 className="text-lg font-extrabold text-white">
                  {currentFeature.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {currentFeature.desc}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => handleLaunchLogin(e)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Explore {currentFeature.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

