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
  FileText,
  Clock,
  TrendingUp,
  DollarSign,
  Cpu,
  Lock,
  Share2,
  ExternalLink,
  Users,
  CheckCircle,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const LandingPage = () => {
  const { setActiveModule, user } = useWorkspace();
  const [activeTab, setActiveTab] = useState('brandDna');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [roiPostsCount, setRoiPostsCount] = useState(30);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchApp = (targetModule = 'dashboard') => {
    if (!user) {
      setActiveModule('login');
      return;
    }
    setActiveModule(targetModule);
  };

  const waterfallModules = [
    {
      id: 'brandDna',
      targetModule: 'brands',
      name: 'Brand DNA Memory',
      num: '01',
      badge: 'AUTOMATED DNA SCRAPER',
      icon: ShieldCheck,
      color: 'from-indigo-500 to-violet-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      descLine1: 'Auto-scrape your brand website URL to ingest logos, hex color palettes, positioning, and verified claims.',
      descLine2: 'Locks immutable brand guidelines into single-source AI memory for 100% brand voice alignment.'
    },
    {
      id: 'strategy',
      targetModule: 'strategy',
      name: '30-Day Strategy Roadmap',
      num: '02',
      badge: 'CAMPAIGN ROADMAP ENGINE',
      icon: Layers,
      color: 'from-purple-500 to-pink-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      descLine1: 'Synthesizes 30 daily non-repeating campaign post directives across Instagram, LinkedIn, X, and Facebook.',
      descLine2: 'Integrates user reference product image briefs to craft customized commercial photoshoot directives.'
    },
    {
      id: 'creative',
      targetModule: 'creative',
      name: 'Creative Studio & Image Editing Agent',
      num: '03',
      badge: '8K PHOTOREALISTIC AD VISUALS',
      icon: ImageIcon,
      color: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      descLine1: 'Render photorealistic 8K commercial ad visuals powered by Gemini 3.1 Flash Image AI vision models.',
      descLine2: 'Places product hero assets into studio scenes with automatic logo watermarking and V4 GCS bucket exports.'
    },
    {
      id: 'contentStudio',
      targetModule: 'studio',
      name: 'Content Studio & Carousel Builder',
      num: '04',
      badge: 'MULTI-CHANNEL COPYWRITER',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      descLine1: 'Draft Instagram carousels, LinkedIn slide decks, viral X threads, Facebook ads, and long-form blog articles.',
      descLine2: 'Generates clean, no-asterisk formatting with 1-click multi-channel copy repurposing.'
    },
    {
      id: 'websiteBuilder',
      targetModule: 'websiteBuilder',
      name: 'AI Website & Landing Page Builder',
      num: '05',
      badge: 'PROMPT-DRIVEN SITE GENERATOR',
      icon: Globe,
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      descLine1: 'Generate full responsive landing pages with prompt-driven real-time code & visual previews.',
      descLine2: 'Export production-ready responsive HTML/CSS code packages and downloadable ZIP source packages.'
    },
    {
      id: 'seo',
      targetModule: 'seo',
      name: 'SEO Intelligence & JSON-LD Briefs',
      num: '06',
      badge: 'SERP & SCHEMA AUDIT ENGINE',
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      descLine1: 'Perform SEO search intent keyword analysis and generate structured JSON-LD schema markup outlines.',
      descLine2: 'Build comprehensive SEO content briefs and competitive SERP audits for top search engine rankings.'
    },
    {
      id: 'calendar',
      targetModule: 'calendar',
      name: 'Omnichannel Publishing Calendar',
      num: '07',
      badge: 'DRAG-AND-DROP PUBLISHER',
      icon: Calendar,
      color: 'from-pink-500 to-rose-600',
      badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
      descLine1: 'Interactive drag-and-drop calendar grid to schedule and automate multi-channel publishing.',
      descLine2: 'Smart auto-scheduling at peak audience engagement times with live social media post previews.'
    },
    {
      id: 'approvals',
      targetModule: 'approvals',
      name: 'Approvals Desk Governance',
      num: '08',
      badge: 'HUMAN-IN-THE-LOOP GATE',
      icon: ShieldCheck,
      color: 'from-teal-500 to-cyan-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      descLine1: 'Human-in-the-loop governance review queue for digital agencies and clients to edit or approve content.',
      descLine2: 'Enforces brand claim verification checks, audit log trails, and multi-user RBAC role permissions.'
    },
    {
      id: 'aisaAssistant',
      targetModule: 'dashboard',
      name: 'Embedded AISA™ AI Copilot',
      num: '09',
      badge: 'PLATFORM INTELLIGENCE COPILOT',
      icon: Bot,
      color: 'from-violet-500 to-purple-600',
      badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
      descLine1: 'Embedded multi-model AI assistant trained specifically on platform content marketing workflows.',
      descLine2: 'Real-time interactive chat copilot for campaign strategy advice, prompt refining, and instant navigation.'
    }
  ];

  const currentModule = waterfallModules.find(m => m.id === activeTab) || waterfallModules[0];

  const faqs = [
    {
      q: 'What is AI ADS™ and how does it scale content operations?',
      a: 'AI ADS™ is an all-in-one autonomous content intelligence and ad creation platform. By unifying Brand DNA memory, 30-day strategy generation, photorealistic image creation (gemini-3.1-flash-image), and multi-channel publishing, marketing teams achieve up to 400% production velocity without sacrificing brand consistency.'
    },
    {
      q: 'How does the 2-Agent pipeline work with reference product photos?',
      a: 'When creating custom campaign strategies, you can upload a reference photo of your product. Agent 1 (Prompt Crafting Agent) analyzes the product details (colors, form factor, positioning) using Gemini Vision AI and crafts a commercial photoshoot prompt. Agent 2 (Image Generation Agent) takes that prompt and renders photorealistic ad visuals using gemini-3.1-flash-image.'
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
    },
    {
      q: 'Is my brand data secure?',
      a: 'Yes. All brand DNA data, reference images, and generated assets are secured via enterprise V4 signed URL Google Cloud Storage (GCS) buckets with strict multi-tenant isolation.'
    }
  ];

  const filteredFaqs = faqs.filter(
    f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="landing-root min-h-screen">

      {/* ─── BACKGROUND AMBIENT GLOW MESH ─── */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-brand-500/15 via-purple-400/10 to-transparent blur-[140px] pointer-events-none z-0 animate-float-orb-1" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-cyan-400/15 via-indigo-400/10 to-transparent blur-[140px] pointer-events-none z-0 animate-float-orb-2" />

      {/* ─── TOP NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
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
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="hover:text-brand-600 transition-colors cursor-pointer">Key Features</a>
            <a href="#modules" onClick={(e) => { e.preventDefault(); scrollToSection('modules'); }} className="hover:text-brand-600 transition-colors cursor-pointer">Module Suite</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="hover:text-brand-600 transition-colors cursor-pointer">Pricing & Topups</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="hover:text-brand-600 transition-colors cursor-pointer">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunchApp('login')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all hidden sm:block shadow-xs cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => handleLaunchApp('login')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden group"
            >
              <span className="relative z-10">Launch Workspace</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            </button>
          </div>

        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section id="features" className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Pulsing Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-white/90 border border-brand-500/30 text-brand-600 shadow-md shadow-brand-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span>Powered by Gemini 3.1 Flash Image & Immutable Brand DNA Memory</span>
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
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-3 transition-all hover:scale-105 cursor-pointer relative overflow-hidden group"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>Start Free Enterprise Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            </button>

            <button
              onClick={() => scrollToSection('modules')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Play className="w-4 h-4 text-brand-600 fill-brand-600" />
              <span>Explore Module Suite</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-600 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> Immutable Brand DNA Memory</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> Direct GCS Bucket Export</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> Billed in INR ₹</span>
          </div>
        </div>

        {/* Waterfall Modules Cascade Showcase */}
        <div id="modules" className="mt-16 relative mx-auto max-w-7xl pt-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-brand-600 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" /> COMPLETE PLATFORM SUITE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our Autonomous AI Modules
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-2xl mx-auto">
              Explore our 9 specialized modules arranged in a waterfall flow. Click any module card to launch its workspace directly.
            </p>
          </div>

          <div className="waterfall-grid pb-8">
            {waterfallModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => handleLaunchApp(mod.targetModule)}
                  className="waterfall-card p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:border-brand-500/50 space-y-4 relative overflow-hidden group cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Header Row */}
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-3xl font-black text-slate-200 group-hover:text-brand-500/30 transition-colors font-mono">
                        {mod.num}
                      </span>
                    </div>

                    {/* Badge & Title */}
                    <div className="space-y-1.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${mod.badgeBg}`}>
                        {mod.badge}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">
                        {mod.name}
                      </h3>
                    </div>

                    {/* 2-Line Description */}
                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-medium">
                      <p className="text-slate-800 font-semibold">{mod.descLine1}</p>
                      <p className="text-slate-500">{mod.descLine2}</p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-brand-600 group-hover:text-brand-700 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <span>Launch Module</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      Interactive
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>





      {/* ─── METRICS & SOCIAL PROOF ─── */}
      <section className="py-16 border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-cyan-50 z-10 relative">
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
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 z-10 relative">
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
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
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
          <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-brand-500/40">
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
          <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-brand-500/40">
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
          <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-brand-500/40">
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
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Priority SLA Account Manager</li>
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

      {/* ─── FAQ ACCORDION WITH LIVE SEARCH ─── */}
      <section id="faq" className="py-24 border-t border-slate-200 bg-slate-50 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 z-10 relative">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-600 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Got Questions? We've Got Answers
          </h2>
        </div>

        {/* FAQ Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. credits, product photo, GCS export)..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 shadow-xs"
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 transition-all hover:border-slate-300 shadow-xs">
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
            })
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-bold bg-white rounded-2xl border border-slate-200">
              No matching FAQs found for "{faqSearch}". Please contact our support team.
            </div>
          )}
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
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
      <footer className="py-12 border-t border-slate-200 text-xs bg-white text-slate-600 z-10 relative">
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
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="hover:text-brand-600 transition-colors cursor-pointer">Features</a>
            <a href="#modules" onClick={(e) => { e.preventDefault(); scrollToSection('modules'); }} className="hover:text-brand-600 transition-colors cursor-pointer">Modules</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="hover:text-brand-600 transition-colors cursor-pointer">Pricing</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="hover:text-brand-600 transition-colors cursor-pointer">Support & FAQ</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
