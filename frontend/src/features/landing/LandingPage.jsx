import React, { useState } from 'react';
import './LandingPage.css';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Layers,
  Globe,
  ImageIcon,
  Calendar,
  Search,
  CheckCircle2,
  ChevronDown,
  Play,
  Award,
  Bot,
  Check,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const LandingPage = () => {
  const { setActiveModule, user } = useWorkspace();
  const [activeTab, setActiveTab] = useState('brandDna');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(null);

  const handleLaunchApp = (targetModule = 'dashboard') => {
    if (!user) {
      setActiveModule('login');
      return;
    }
    setActiveModule(targetModule);
  };

  const modulesList = [
    {
      id: 'brandDna',
      name: 'Brand DNA Memory',
      tagline: 'Single-Source Brand Voice & Approved Claims',
      desc: 'Automatically scrape your brand URL to ingest logo, brand colors, positioning summary, verified claims, target audience personas, and style rules into immutable AI memory.',
      icon: ShieldCheck,
      softBg: 'bg-gradient-to-r from-indigo-50/90 via-violet-50/60 to-slate-50',
      activeBorder: 'border-indigo-400 ring-2 ring-indigo-400/30 shadow-indigo-500/10',
      iconColor: 'text-indigo-600',
      previewBadge: 'AUTOMATED BRAND SCRAPER & DNA MEMORY',
      highlights: ['URL Auto-Scraper', 'Approved & Restricted Claims', 'Persona Target Alignment', 'Immutable Brand Color Palette']
    },
    {
      id: 'strategy',
      name: '30-Day Strategy Roadmap',
      tagline: 'Autonomous Campaign & Roadmap Synthesizer',
      desc: 'Generate complete 30-day multi-platform social media and advertising roadmaps. Upload reference product images for custom visual guidance and localized campaign themes.',
      icon: Layers,
      softBg: 'bg-gradient-to-r from-purple-50/90 via-pink-50/60 to-slate-50',
      activeBorder: 'border-purple-400 ring-2 ring-purple-400/30 shadow-purple-500/10',
      iconColor: 'text-purple-600',
      previewBadge: '30-DAY CUSTOM VISUAL STRATEGY',
      highlights: ['30 Daily Post Directives', 'Reference Image Brief Integration', 'Multi-Platform Guidance', 'Custom Regeneration Engine']
    },
    {
      id: 'creative',
      name: 'Creative Studio & Image Editing Agent',
      tagline: 'Photorealistic Ad Visuals via Gemini 3.1 Flash Image',
      desc: 'Transform reference product photos into high-converting magazine-editorial advertising visuals. Powered by Gemini 3.1 Flash Image and direct Google Cloud Storage bucket export.',
      icon: ImageIcon,
      softBg: 'bg-gradient-to-r from-cyan-50/90 via-blue-50/60 to-slate-50',
      activeBorder: 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-500/10',
      iconColor: 'text-cyan-600',
      previewBadge: 'IMAGE EDITING AGENT & GCS BUCKET EXPORT',
      highlights: ['gemini-3.1-flash-image Model', 'Hero Product Placement', 'Automatic Brand Logo Overlay', 'V4 Signed URL GCS Export']
    },
    {
      id: 'contentStudio',
      name: 'Content Studio',
      tagline: 'Multi-Channel Copy & Carousel Synthesizer',
      desc: 'Draft Instagram carousels, LinkedIn slide decks, viral X threads, Facebook ads, and long-form blog articles perfectly tuned to your brand voice.',
      icon: FileText,
      softBg: 'bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-slate-50',
      activeBorder: 'border-amber-400 ring-2 ring-amber-400/30 shadow-amber-500/10',
      iconColor: 'text-amber-600',
      previewBadge: 'MULTI-CHANNEL COPYWRITING & CAROUSEL BUILDER',
      highlights: ['Single Post & Carousel Slides', '1-Click Multi-Channel Repurposing', 'No-Asterisk Clean Formatting', 'SEO Keyword Integration']
    },
    {
      id: 'websiteBuilder',
      name: 'AI Website & Landing Page Builder',
      tagline: 'Prompt-Driven Full Landing Page Generator',
      desc: 'Generate, customize, and edit full responsive landing pages with instant live previews, custom HTML/CSS exports, and AI prompt refinement.',
      icon: Globe,
      softBg: 'bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-slate-50',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-emerald-500/10',
      iconColor: 'text-emerald-600',
      previewBadge: 'AI WEBSITE & LANDING PAGE BUILDER',
      highlights: ['Full Landing Page Generation', 'Live Code & Visual Preview', 'ZIP / HTML Package Export', 'Prompt Element Editor']
    },
    {
      id: 'seo',
      name: 'SEO Intelligence',
      tagline: 'Search Intent & JSON-LD Brief Generator',
      desc: 'Perform SEO keyword intent analysis, generate structured JSON-LD schema briefs, and draft search-optimized content briefs for content writers.',
      icon: Search,
      softBg: 'bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-slate-50',
      activeBorder: 'border-blue-400 ring-2 ring-blue-400/30 shadow-blue-500/10',
      iconColor: 'text-blue-600',
      previewBadge: 'SEO INTENT & JSON-LD BRIEF ENGINE',
      highlights: ['Search Intent Analysis', 'Structured JSON-LD Outlines', 'Keyword Density Optimization', 'Competitive SERP Audits']
    },
    {
      id: 'contentCalendar',
      name: 'Content Calendar',
      tagline: 'Omnichannel Publishing & Drag-and-Drop Planner',
      desc: 'Plan, schedule, and automate publishing across Instagram, LinkedIn, X (Twitter), Facebook, and Pinterest with an intuitive interactive calendar.',
      icon: Calendar,
      softBg: 'bg-gradient-to-r from-pink-50/90 via-rose-50/60 to-slate-50',
      activeBorder: 'border-pink-400 ring-2 ring-pink-400/30 shadow-pink-500/10',
      iconColor: 'text-pink-600',
      previewBadge: 'OMNICHANNEL PUBLISHING CALENDAR',
      highlights: ['Multi-Channel Publishing', 'Drag-and-Drop Rescheduling', 'Best-Time Auto Scheduling', 'Live Post Previews']
    },
    {
      id: 'approvalsDesk',
      name: 'Approvals Desk',
      tagline: 'Enterprise Governance & Human-in-the-Loop Gate',
      desc: 'Review, edit, reject, or approve generated posts before publishing. Multi-tenant RBAC permissions ensure agency team alignment.',
      icon: ShieldCheck,
      softBg: 'bg-gradient-to-r from-teal-50/90 via-cyan-50/60 to-slate-50',
      activeBorder: 'border-teal-400 ring-2 ring-teal-400/30 shadow-teal-500/10',
      iconColor: 'text-teal-600',
      previewBadge: 'GOVERNANCE & APPROVAL WORKFLOW',
      highlights: ['Client & Agency Review Desk', 'Audit Log History', 'Claim Verification Check', 'Multi-User Permissions']
    },
    {
      id: 'aisaAssistant',
      name: 'AISA™ AI Copilot Assistant',
      tagline: 'Embedded Multi-Model Intelligence Assistant',
      desc: 'Interactive AI copilot trained specifically on the AI ADS platform to assist with strategy queries, copywriting, and instant module navigation.',
      icon: Bot,
      softBg: 'bg-gradient-to-r from-violet-50/90 via-purple-50/60 to-slate-50',
      activeBorder: 'border-violet-400 ring-2 ring-violet-400/30 shadow-violet-500/10',
      iconColor: 'text-violet-600',
      previewBadge: 'EMBEDDED AISA™ AI COPILOT',
      highlights: ['Direct Platform Integration', 'Multi-Model Fallback Engine', 'Brand Context Memory', 'Instant Module Navigation']
    }
  ];

  const currentModule = modulesList.find(m => m.id === activeTab) || modulesList[0];

  const faqs = [
    {
      q: 'What is AI ADS™ and how does it scale content operations?',
      a: 'AI ADS™ is an all-in-one autonomous content intelligence and ad creation platform. By unifying Brand DNA memory, 30-day strategy generation, photorealistic image creation (gemini-3.1-flash-image), and multi-channel publishing, marketing teams achieve up to 400% production velocity without sacrificing brand consistency.'
    },
    {
      q: 'How does the Image Editing Agent work with reference product photos?',
      a: 'When creating custom campaign strategies, you can upload a reference photo of your product. Our two-stage Image Editing Agent first analyzes the product details (colors, materials, form factor) using Gemini vision AI, then crafts a magazine-quality commercial scene prompt and renders photorealistic ad images using gemini-3.1-flash-image.'
    },
    {
      q: 'Can I connect my client websites and social media handles?',
      a: 'Yes! AI ADS™ is built for enterprise marketing teams and growth agencies. You can manage multiple brand workspaces, scrape brand DNA from client URLs, connect social media accounts, and invite clients to the Approvals Desk.'
    },
    {
      q: 'How are credits calculated and managed in INR (₹)?',
      a: 'Credits are used for AI operations such as strategy generation, photorealistic visual rendering, and SEO brief creation. All subscription plans are billed transparently in Indian Rupees (INR ₹), starting at ₹799/month. Unused credits rollover automatically.'
    },
    {
      q: 'Can I export full responsive landing pages?',
      a: 'Absolutely. The built-in AI Website Builder allows you to generate full landing pages with responsive HTML/CSS code, live visual previews, and 1-click ZIP package exports.'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-brand-500 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full blur-[140px] pointer-events-none bg-gradient-to-tr from-indigo-200/60 via-purple-200/50 to-cyan-200/40" />
      <div className="absolute top-[1200px] right-0 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none bg-purple-200/40" />

      {/* ─── TOP NAVIGATION BAR ─── */}
      <header className="relative z-50 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Official Project Logo & Brand Identity */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/logo.png"
              alt="AI Ads™ Official Logo"
              className="w-11 h-11 object-contain shrink-0 transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.jpg';
              }}
            />
            <div className="flex items-center font-black text-2xl tracking-tight leading-none">
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Ads
              </span>
              <sup className="text-xs font-extrabold text-cyan-500 ml-1 font-sans -mt-3 select-none">TM</sup>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-extrabold text-slate-700">
            <a href="#features" className="hover:text-brand-600 transition-colors">Key Features</a>
            <a href="#modules" className="hover:text-brand-600 transition-colors">Module Suite</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-brand-600 transition-colors">Pricing & Topups</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunchApp('login')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all hidden sm:block shadow-sm cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => handleLaunchApp('login')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-white border border-brand-500/30 text-brand-600 shadow-md shadow-brand-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span>Next-Gen Autonomous Brand Memory & Ad Creative Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
            Scale Multi-Channel Campaigns <br className="hidden sm:block" />
            <span className="landing-gradient-text">10x Faster with AI ADS™</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl font-medium max-w-3xl mx-auto leading-relaxed text-slate-600">
            Lock immutable <strong className="text-slate-900">Brand DNA memory</strong>, synthesize 30-day visual strategy roadmaps, and generate photorealistic commercial advertising visuals using <strong className="text-brand-600">gemini-3.1-flash-image</strong>.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleLaunchApp('login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-3 transition-all hover:scale-105 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>Start Free Enterprise Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#modules"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Play className="w-4 h-4 text-brand-600 fill-brand-600" />
              <span>Explore Module Suite</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-600 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Immutable Brand Memory</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Direct GCS Bucket Export</span>
          </div>
        </div>

        {/* Hero Interactive App Mockup Showcase */}
        <div className="mt-14 relative mx-auto max-w-5xl">
          <div className="landing-gradient-border shadow-2xl shadow-brand-500/10">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
              
              {/* Window Topbar */}
              <div className="h-11 bg-slate-100 px-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="px-4 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-700 flex items-center gap-2 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>https://app.aiads.com/dashboard/strategy-roadmap</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span>LIVE PROD API</span>
                </div>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="p-6 md:p-8 space-y-6 landing-hero-grid-light text-slate-900 bg-slate-50/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="Brand Logo"
                      className="w-10 h-10 object-contain shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/logo.jpg'; }}
                    />
                    <div>
                      <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-600" /> ACTIVE BRAND DNA WORKSPACE
                      </span>
                      <h3 className="text-lg font-black text-slate-900">GUCCI — Digital Avatar & Commercial Campaign</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">30 Posts Generated</span>
                    <span className="px-3 py-1 rounded-xl bg-cyan-100 text-cyan-700 text-xs font-bold border border-cyan-200">gemini-3.1-flash-image</span>
                  </div>
                </div>

                {/* Grid Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Brand Awareness Spotlight', platform: 'INSTAGRAM', aspect: '1:1', tag: 'Week 1: Hook' },
                    { title: 'Product Value & Feature Deep Dive', platform: 'LINKEDIN', aspect: '16:9', tag: 'Week 2: Value' },
                    { title: 'Exclusive Campaign Offer & CTA', platform: 'REELS / STORIES', aspect: '9:16', tag: 'Week 4: Conversion' }
                  ].map((card, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-brand-500/50 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span className="text-brand-600 font-extrabold">{card.platform} · {card.aspect}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">{card.tag}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{card.title}</h4>
                      <div className="h-28 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-purple-500/10 opacity-40 group-hover:opacity-80 transition-opacity" />
                        <ImageIcon className="w-8 h-8 text-indigo-400 group-hover:text-cyan-600 transition-colors" />
                        <span className="absolute bottom-2 right-2 text-[9px] font-extrabold px-2 py-0.5 rounded bg-white/90 text-slate-800 border border-slate-200 shadow-xs">8K Render</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MODULE SUITE INTERACTIVE SHOWCASE ─── */}
      <section id="modules" className="py-24 border-y border-slate-200 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-brand-600 flex items-center justify-center gap-2">
              <Layers className="w-4 h-4" /> UNIFIED ENTERPRISE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Specialized AI Modules in One Workspace
            </h2>
            <p className="text-base font-medium text-slate-600">
              Eliminate fragmented marketing tools. AI ADS™ provides end-to-end execution from brand memory lock to multi-platform publishing.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
            {modulesList.map(mod => {
              const Icon = mod.icon;
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer group ${mod.softBg} ${
                    isActive
                      ? `${mod.activeBorder} shadow-md bg-white`
                      : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110 ${mod.iconColor}`} />
                  <h3 className={`text-xs font-extrabold leading-tight transition-colors ${isActive ? 'text-slate-900 font-black' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {mod.name}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Active Module Detail Box */}
          <div className="p-8 sm:p-10 rounded-3xl border border-slate-200 bg-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-extrabold text-brand-600">
                  <span>{currentModule.previewBadge}</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black leading-tight text-slate-900">
                  {currentModule.name}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  {currentModule.desc}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {currentModule.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleLaunchApp('login')}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 text-white font-black text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>Try {currentModule.name} Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Demo Card */}
              <div className="lg:col-span-6">
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 shadow-sm relative">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs text-slate-500 font-bold">
                    <span>LIVE MODULE INTERFACE</span>
                    <span className="text-emerald-600 font-extrabold">READY</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                      <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">Directive Input</span>
                      <p className="text-xs text-slate-800 font-semibold italic">"{currentModule.tagline}"</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-black text-cyan-700 uppercase tracking-wider block">Automated Output SLA</span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        Executed with immutable Brand DNA memory and verified claims validation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── HOW IT WORKS (3-STEP PROCESS) ─── */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-600 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> SIMPLE 3-STEP WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            From URL to Full Campaign in Minutes
          </h2>
          <p className="text-base font-medium text-slate-600">
            No complex setup or prompt engineering required. AI ADS™ automates research, strategy, visual creation, and publishing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Lock Brand DNA Memory',
              desc: 'Input your brand website URL. Our automated scraper extracts your logo, brand hex palette, tone of voice, verified claims, and audience personas.',
              icon: Globe,
              badge: 'Step 1: Scrape & Lock'
            },
            {
              step: '02',
              title: 'Generate Strategy & Visuals',
              desc: 'Select campaign goals or upload a reference product image. AI ADS synthesizes a 30-day roadmap and renders photorealistic ad visuals using gemini-3.1-flash-image.',
              icon: Sparkles,
              badge: 'Step 2: Synthesize'
            },
            {
              step: '03',
              title: 'Review, Publish & Track ROI',
              desc: 'Approve assets at the Approvals Desk, auto-publish across Instagram, LinkedIn, X, and Facebook, and track production SLA velocity.',
              icon: BarChart3,
              badge: 'Step 3: Publish & Scale'
            }
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-5 relative overflow-hidden group hover:border-brand-500/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-indigo-400 group-hover:text-brand-600 transition-colors">{s.step}</span>
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest block">{s.badge}</span>
                  <h3 className="text-xl font-extrabold text-slate-900">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── METRICS & SOCIAL PROOF ─── */}
      <section className="py-16 border-y border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">400%</span>
              <p className="text-xs font-extrabold uppercase tracking-wider mt-1 text-slate-600">Production Velocity</p>
            </div>
            <div>
              <span className="text-3xl sm:text-5xl font-black text-cyan-600 tracking-tight">10M+</span>
              <p className="text-xs font-extrabold uppercase tracking-wider mt-1 text-slate-600">Creatives Generated</p>
            </div>
            <div>
              <span className="text-3xl sm:text-5xl font-black text-purple-600 tracking-tight">99.8%</span>
              <p className="text-xs font-extrabold uppercase tracking-wider mt-1 text-slate-600">Brand Voice Alignment</p>
            </div>
            <div>
              <span className="text-3xl sm:text-5xl font-black text-emerald-600 tracking-tight">500+</span>
              <p className="text-xs font-extrabold uppercase tracking-wider mt-1 text-slate-600">Growth Agencies</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING & TOPUPS MATRIX (EXACT WEBSITE PLANS IN INR ₹) ─── */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 flex items-center justify-center gap-2">
            <Award className="w-4 h-4" /> TRANSPARENT PRICING & CREDITS (INR ₹)
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Official Platform Subscription Plans
          </h2>
          <p className="text-base font-medium text-slate-600">
            Simple transparent pricing in Indian Rupees (INR ₹). Every plan includes full Brand DNA memory and automatic rollover.
          </p>

          {/* Billing Cycle Switch */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase">Save 20%</span>
            </button>
          </div>
        </div>

        {/* 4 Official Website Pricing Cards (In Indian Rupees ₹) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Plan 1: Starter (base) */}
          <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-brand-500/40">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Solo Creators</span>
                <h3 className="text-xl font-black mt-1 text-slate-900">Starter Plan</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {billingCycle === 'yearly' ? '₹639' : '₹799'}
                </span>
                <span className="text-xs text-slate-500 font-bold">/ month</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">Core AI text generation & 150 monthly visual credits for solo creators.</p>
              
              <ul className="space-y-2.5 pt-4 border-t border-slate-200 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> <strong>150</strong> Monthly Visual Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> <strong>1,000</strong> Text Generations / mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 3 Brand DNA Workspaces</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 30-Day Strategy Generator</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> SEO Intelligence & Content Briefs</li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchApp('login')}
              className="w-full py-3.5 rounded-xl font-extrabold text-xs transition-all bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer"
            >
              Get Started (₹799/mo)
            </button>
          </div>

          {/* Plan 2: Pro / Growth (professional) */}
          <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-brand-500/40">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-brand-600 uppercase tracking-widest">Growth Tier</span>
                <h3 className="text-xl font-black mt-1 text-slate-900">Pro / Growth</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {billingCycle === 'yearly' ? '₹1,919' : '₹2,399'}
                </span>
                <span className="text-xs text-slate-500 font-bold">/ month</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">Multi-brand DNA, 450 visual credits, Campaign Builder & Approvals Desk.</p>
              
              <ul className="space-y-2.5 pt-4 border-t border-slate-200 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> <strong>450</strong> Monthly Visual Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> <strong>3,000</strong> Text Generations / mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> 10 Brand DNA Workspaces</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> AI Website Builder & HTML Export</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> Approvals Desk Review Queue</li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchApp('login')}
              className="w-full py-3.5 rounded-xl font-extrabold text-xs transition-all bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer"
            >
              Get Pro (₹2,399/mo)
            </button>
          </div>

          {/* Plan 3: Agency / Scale (agency_pro) — MOST POPULAR */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-indigo-50/90 via-white to-white border-2 border-brand-500 space-y-6 flex flex-col justify-between relative shadow-xl shadow-brand-500/15 text-slate-900">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-600 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
              MOST POPULAR
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-brand-600 uppercase tracking-widest">Agency Tier</span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Agency / Scale</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {billingCycle === 'yearly' ? '₹5,119' : '₹6,399'}
                </span>
                <span className="text-xs text-slate-500 font-bold">/ month</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">Unlimited multi-client workspaces & 1,200 visual credits included monthly.</p>
              
              <ul className="space-y-2.5 pt-4 border-t border-slate-200 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> <strong>1,200</strong> Monthly Visual Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> <strong>8,000</strong> Text Generations / mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> <strong>Unlimited</strong> Multi-Client Workspaces</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> 4x Visual Variation Engine</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0" /> Cloud Media Asset Library</li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchApp('login')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Start 14-Day Trial (₹6,399/mo)
            </button>
          </div>

          {/* Plan 4: Enterprise (enterprise) */}
          <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-brand-500/40">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">Enterprise</span>
                <h3 className="text-xl font-black mt-1 text-slate-900">Enterprise</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {billingCycle === 'yearly' ? '₹12,799' : '₹15,999'}
                </span>
                <span className="text-xs text-slate-500 font-bold">/ month</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">High-volume generation, 3,000 visual credits & unlimited text generation.</p>
              
              <ul className="space-y-2.5 pt-4 border-t border-slate-200 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>3,000</strong> Monthly Visual Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>UNLIMITED</strong> Text Generations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Corporate Workspaces</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Real-Time AI Chat Code Tweaker</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Priority SLA SLA Account Manager</li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchApp('login')}
              className="w-full py-3.5 rounded-xl font-extrabold text-xs transition-all bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer"
            >
              Contact Enterprise (₹15,999/mo)
            </button>
          </div>

        </div>
      </section>

      {/* ─── FAQ ACCORDION ─── */}
      <section id="faq" className="py-24 border-t border-slate-200 bg-slate-50 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-600 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Got Questions? We've Got Answers
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 transition-all hover:border-slate-300">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <h3 className="text-base font-extrabold text-slate-900">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <p className="text-sm leading-relaxed pt-2 border-t border-slate-200 font-medium text-slate-600 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-600 border border-brand-400 relative overflow-hidden text-center space-y-8 shadow-2xl text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 max-w-3xl mx-auto relative">
            <span className="text-xs font-black uppercase tracking-widest text-brand-100">TRANSFORM YOUR CONTENT OPERATIONS</span>
            <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to Scale Your Brand Velocity?
            </h2>
            <p className="text-base sm:text-lg text-indigo-100">
              Join hundreds of high-growth brands and digital agencies leveraging AI ADS™ to build brand memory and publish 10x faster.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
            <button
              onClick={() => handleLaunchApp('login')}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-105 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-brand-600 fill-brand-600" />
              <span>Launch AI ADS Workspace Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 border-t border-slate-200 text-xs bg-slate-100 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="AI ADS™ Logo"
              className="w-9 h-9 object-contain shrink-0"
              onError={(e) => { e.target.onerror = null; e.target.src = '/logo.jpg'; }}
            />
            <div>
              <div className="flex items-center font-extrabold text-sm tracking-tight leading-none">
                <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Ads
                </span>
                <sup className="text-[9px] font-extrabold text-cyan-500 ml-0.5 font-sans -mt-2 select-none">TM</sup>
                <span className="text-slate-900 ml-1.5 font-bold">Platform</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">© 2026 AI ADS Inc. All rights reserved.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#modules" className="hover:text-brand-600 transition-colors">Modules</a>
            <a href="#pricing" className="hover:text-brand-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">Support & FAQ</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
