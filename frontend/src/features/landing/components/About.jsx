import React from 'react';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  Shield,
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Cpu, 
  Layers, 
  Users, 
  Clock,
  Compass,
  Quote,
  Briefcase,
  Share2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const About = ({ onSelectTab }) => {
  const { setActiveModule } = useWorkspace();

  const handleTabClick = (tabId) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      window.location.hash = tabId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const adoptionStack = [
    {
      id: 'aiads',
      badge: 'Autonomous AdTech (Active)',
      name: 'AI Ads™ | Autonomous Creative Advertising',
      tagline: 'The Creative & Performance Engine of the UWO™ Ecosystem',
      desc: 'Transforms fragmented marketing tools into an autonomous creative pipeline: 8K brand-locked product renders, multi-angle scenes, high-converting copy variations, and 30-day cross-channel roadmaps deployed in seconds.',
      isCurrent: true,
      color: 'from-indigo-600 to-purple-600',
      icon: Sparkles
    },
    {
      id: 'aisa',
      badge: 'Unified Command Center',
      name: 'AISA™ | AI Super Assistant',
      tagline: 'The Interface Layer of the UWO™ Ecosystem',
      desc: 'Transforms fragmented enterprise tools into a unified intelligence system with multi-session context memory, multi-modal utility (search, content, code, doc conversion), and intent-based agent routing, reducing operational friction by up to 70%.',
      url: 'https://aisa24.com/',
      color: 'from-blue-600 to-indigo-600',
      icon: Cpu
    },
    {
      id: 'ailegal',
      badge: 'Sovereign Vertical OS',
      name: 'AI LEGAL™ | Legal Intelligence',
      tagline: 'Precision Grounding for Indian Jurisprudence',
      desc: 'Built specifically for Indian advocates, law firms, and judiciary researchers. Grounded in 75+ years of Supreme Court, High Court, and Bare Act databases with zero hallucination and Section 65B cryptographic evidence hashing.',
      url: 'https://ailegal.aisa24.com/',
      color: 'from-amber-500 to-amber-700',
      icon: Award
    },
    {
      id: 'aimall',
      badge: 'Discovery & Distribution',
      name: 'AI Mall™ | Tools & Workflow Marketplace',
      tagline: 'Structured Marketplace Connecting Developers to Enterprise',
      desc: 'Eliminates AI adoption confusion for SMBs with curated app catalogs, secure sandbox testing, and ecosystem bundles—reducing custom AI deployment cycles from months to mere minutes.',
      url: 'https://ai-mall.in/',
      color: 'from-purple-600 to-pink-600',
      icon: Compass
    },
    {
      id: 'connect',
      badge: 'Enterprise Automation',
      name: 'AISA Connect™ | Omnichannel Infrastructure',
      tagline: 'Connecting Communication Directly into Corporate Conversion',
      desc: 'Natively links WhatsApp, website chat, and emails directly into internal CRMs, ERPs, and secure databases with automated qualification workflows, team approvals, and live task handoffs.',
      url: 'https://uwoconnect.aisa24.com/',
      color: 'from-emerald-500 to-teal-600',
      icon: Share2
    },
    {
      id: 'efv',
      badge: 'Human Operating System',
      name: 'EFV™ Framework | Energy, Frequency & Vibration',
      tagline: '9-Level Consciousness & Workforce Execution Discipline',
      desc: 'Spiritual self-improvement series authored by Gurumukh P. Ahuja connecting science, spirituality, and AI across 175 countries. Available worldwide across Amazon, Google Play Books, Barnes & Noble, Ingram, and quick-commerce platforms.',
      url: 'https://efvframework.com/',
      color: 'from-rose-500 to-amber-600',
      icon: BookOpen
    },
    {
      id: 'uwo_os',
      badge: 'Institutional Governance',
      name: 'UWO Institutional OS™',
      tagline: 'Evidence-Driven Governance & SOP Architecture',
      desc: 'Enterprise-grade operational compliance tracking, rigorous role-based access control, complete audit trails, and strict data governance policies designed for institutional durability.',
      url: 'https://education.uwo24.com/',
      color: 'from-slate-700 to-slate-900',
      icon: Lock
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#090D16] text-[#0F172A] dark:text-slate-100 font-sans selection:bg-fuchsia-500 selection:text-white transition-colors duration-300">
      
      {/* ──────── 1. CORPORATE PROFILE & HERITAGE ──────── */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#070A12] dark:via-[#090D16] dark:to-[#090D16] overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/15 to-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-3.5 relative z-10">
          
          {/* Government & Institutional Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-slate-800 text-[10px] font-bold border border-slate-700 shadow-2xs">
              <Award className="w-3 h-3 text-amber-300" />
              <span>DPIIT Recognized Startup</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-amber-400/10 border border-fuchsia-500/30 text-fuchsia-700 dark:text-fuchsia-300 text-[10px] font-extrabold shadow-2xs">
              <ShieldCheck className="w-3 h-3" />
              <span>DUNS Registered</span>
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <div className="inline-block text-[10px] uppercase tracking-widest font-black bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent">
              Corporate Profile &amp; Heritage
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight leading-snug">
              Unified Web Options &amp; <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-600 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent">Services Pvt. Ltd.</span>
            </h1>
            <p className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-normal">
              Building an Integrated AI Adoption Infrastructure Stack that transitions organizations from fragmented tools to measurable, AI-powered execution.
            </p>
          </div>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Founded in 2020 and headquartered in Jabalpur, Madhya Pradesh, UWO™ architects sovereign, enterprise-grade AI systems. Through its unified technology stack combining <strong>AI Ads™</strong>, <strong>AISA™</strong>, <strong>AI LEGAL™</strong>, <strong>AI Mall™</strong>, <strong>AISA Connect™</strong>, and the <strong>EFV™ Framework</strong>, UWO provides end-to-end intelligence, workflow automation, and execution discipline for enterprises and creative teams worldwide.
          </p>

          {/* 4 Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto pt-2">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-2xs text-center hover:border-fuchsia-500/30 transition-colors">
              <div className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white">2020</div>
              <div className="text-[10px] font-semibold text-slate-500">Year Founded</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-2xs text-center hover:border-fuchsia-500/30 transition-colors">
              <div className="text-lg sm:text-xl font-black bg-gradient-to-r from-indigo-500 to-fuchsia-500 dark:from-indigo-300 dark:to-fuchsia-300 bg-clip-text text-transparent">175+</div>
              <div className="text-[10px] font-semibold text-slate-500">Countries Reached</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-2xs text-center hover:border-fuchsia-500/30 transition-colors">
              <div className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white">3 / 100+</div>
              <div className="text-[10px] font-semibold text-slate-500">Patents &amp; Trademarks</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-2xs text-center hover:border-fuchsia-500/30 transition-colors">
              <div className="text-lg sm:text-xl font-black bg-gradient-to-r from-fuchsia-500 to-amber-500 dark:from-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent">30+</div>
              <div className="text-[10px] font-semibold text-slate-500">Core Team Strength</div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────── 2. FOUNDER & ECOSYSTEM LEADERSHIP ──────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Official Founder Portrait Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-xs group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-amber-300 rounded-2xl opacity-80 blur-md group-hover:opacity-100 transition duration-300" />
              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#101726] border-2 border-fuchsia-400/40 shadow-xl">
                <img 
                  src="/assets/company/founder_gurumukh_ahuja.jpg" 
                  alt="Gurumukh P. Ahuja - Founder & CEO" 
                  className="w-full h-auto aspect-square object-cover object-top filter contrast-105" 
                />
                <div className="p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white absolute bottom-0 inset-x-0">
                  <div className="text-base font-black tracking-tight">Gurumukh P. Ahuja</div>
                  <div className="text-[11px] font-semibold text-fuchsia-200 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>Founder &amp; Chief Executive Officer</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    Unified Web Options &amp; Services Pvt. Ltd. (UWO™)
                  </div>
                </div>
              </div>
            </div>

            {/* Badges below portrait */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-center">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                20+ Yrs High-Stakes Entrepreneur
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-amber-400/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/30 shadow-2xs">
                Rotary Leadership
              </span>
            </div>
          </div>

          {/* Right Column: Founder Vision & Story */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-amber-400/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/30 text-[10.5px] font-extrabold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-fuchsia-500 dark:text-fuchsia-300" />
                <span>Founder &amp; Ecosystem Leadership</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Architecting Human &amp; <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-600 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent">Machine Consciousness</span>
              </h2>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                Leading the convergence of sovereign AI infrastructure, human alignment, and autonomous creative advertising from India to the world.
              </p>
            </div>

            <p className="text-xs sm:text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              <strong>Gurumukh P. Ahuja</strong> brings over 20 years of high-stakes entrepreneurship, large-scale infrastructure development, and institutional governance to the helm of UWO™. With deep exposure across public institutions, high-level Rotary leadership, and nationwide commercial ventures, he champions technology that serves tangible, measurable execution rather than speculative hype.
            </p>

            {/* 2x2 Grid of 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Card 1: System Architect & Author */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-[#101726]/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 hover:border-indigo-400/40 transition-colors">
                <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>System Architect &amp; Author</span>
                </div>
                <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Creator of the proprietary <strong>EFV™ Framework</strong> and the globally published <em>EFV Master Series™</em>, connecting science, spirituality, and workforce readiness across 175 countries.
                </p>
              </div>

              {/* Card 2: Multi-Agent Ecosystem Builder */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-[#101726]/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 hover:border-fuchsia-400/40 transition-colors">
                <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                  <Layers className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                  <span>Multi-Agent Ecosystem Builder</span>
                </div>
                <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Visionary architect behind UWO’s sovereign AI adoption stack, integrating <strong>AI Ads™</strong>, <strong>AISA™</strong>, <strong>AI LEGAL™</strong>, <strong>AISA Connect™</strong>, and <strong>AI Mall™</strong>.
                </p>
              </div>

              {/* Card 3: Institutional Credibility */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-[#101726]/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 hover:border-amber-400/40 transition-colors">
                <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                  <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Institutional Credibility</span>
                </div>
                <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Backed by high-level Rotary leadership, public institutional engagements, and startup incubation at premier institutions.
                </p>
              </div>

              {/* Card 4: 30+ Engineering Strength */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-[#101726]/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 hover:border-fuchsia-400/40 transition-colors">
                <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                  <Users className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                  <span>30+ Engineering Strength</span>
                </div>
                <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Steering a dedicated product and AI engineering workforce headquartered in Jabalpur, proving that world-class deep tech thrives from India's rising hubs.
                </p>
              </div>
            </div>

            {/* Founder Quote Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/5 to-amber-400/10 dark:from-indigo-950/20 dark:via-fuchsia-950/20 dark:to-amber-950/10 border-l-4 border-fuchsia-400 text-xs sm:text-[12.5px] text-slate-700 dark:text-slate-300 italic leading-relaxed">
              “The future belongs to companies that combine artificial intelligence &amp; automation with consciousness, human understanding, and sovereign execution discipline.”
              <div className="mt-1 font-bold not-italic bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-600 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent text-[11px]">
                — Gurumukh P. Ahuja, Founder &amp; CEO
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────── 3. THE UWO ADOPTION STACK ──────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-8">
          <div className="inline-block text-[10px] uppercase tracking-widest font-black bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent">
            Proprietary Architecture
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            The UWO™ <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-600 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent">Adoption Stack</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
            A cohesive multi-layer ecosystem connecting interaction, sovereign vertical intelligence, automation, and human readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adoptionStack.map((item) => {
            const IconComp = item.icon;
            return (
              <div 
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 hover:border-fuchsia-500/40 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-300 border border-slate-200 dark:border-slate-700">
                      {item.badge}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-fuchsia-500 dark:text-fuchsia-400 flex items-center justify-center shadow-2xs">
                      <IconComp size={16} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                      {item.name}
                    </h3>
                    <div className="text-[11px] font-semibold mt-0.5 text-fuchsia-600 dark:text-fuchsia-400">
                      {item.tagline}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-1.5">
                  {item.isCurrent ? (
                    <button
                      type="button"
                      onClick={() => handleTabClick('features')}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 hover:underline cursor-pointer"
                    >
                      <span>Explore Features</span>
                      <ArrowRight size={11} />
                    </button>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 hover:underline"
                    >
                      <span>Visit Platform</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────── 4. HEADQUARTERS & CORPORATE OFFICE ──────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column (7 cols): Address & Details */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-block text-[10px] uppercase tracking-widest font-black bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent">
                Headquarters &amp; Corporate Office
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Unified Web Options &amp; Services Pvt. Ltd.
              </h3>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-amber-400/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/30">
                  DPIIT Recognized
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  DUNS Registered
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect directly with our corporate leadership, institutional partnership division, or AI Ads™ enterprise onboarding desk.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Headquarters Address */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/15 to-amber-400/15 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">Corporate Headquarters</div>
                    <div className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-tight">
                      4th Floor, SG Square, near PNB Bank, Rampur Chowk, Jabalpur, MP – 482008
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/15 to-amber-400/15 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center shrink-0">
                    <Mail size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">Official Correspondence</div>
                    <a href="mailto:admin@uwo24.com" className="text-[10.5px] text-fuchsia-600 dark:text-fuchsia-400 hover:underline font-semibold">
                      admin@uwo24.com
                    </a>
                  </div>
                </div>

                {/* Corporate Helpdesk */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/15 to-amber-400/15 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">Corporate Helpdesk</div>
                    <div className="text-[10.5px] text-slate-600 dark:text-slate-400 font-medium">
                      +91 7389999999 / 8871190020
                    </div>
                  </div>
                </div>

                {/* Global Ecosystem Presence */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/15 to-amber-400/15 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center shrink-0">
                    <Globe size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">Global Ecosystem Presence</div>
                    <div className="text-[10.5px] text-slate-600 dark:text-slate-400">
                      Live across 175+ Countries
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Embedded Google Map with Directions */}
            <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/15 to-amber-400/15 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center shrink-0">
                    <Building2 size={13} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      Unified Web Options &amp; Services Pvt. Ltd.
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      SG Square, Rampur Chowk, Jabalpur
                    </div>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=SG+Square+Rampur+Chowk+Jabalpur+Madhya+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-fuchsia-500 dark:hover:text-fuchsia-300 text-[10px] font-bold border border-slate-200 dark:border-slate-600 transition-colors shadow-2xs cursor-pointer"
                >
                  <span>Directions</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* Exact Google Map Iframe */}
              <div className="relative w-full h-56 sm:h-64 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <iframe
                  title="UWO Headquarters Location - SG Square, Rampur Chowk, Jabalpur"
                  src="https://maps.google.com/maps?q=SG%20Square,%20Rampur%20Chowk,%20Jabalpur,%20Madhya%20Pradesh%20482008&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter saturate-105 contrast-105"
                  loading="lazy"
                  allowFullScreen={true}
                />
              </div>

              {/* Working Hours Bar */}
              <div className="px-4 py-2 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10.5px]">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Mon – Sat (9:30 AM – 6:30 PM IST)
                </span>
                <span className="font-bold bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-600 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-amber-200 bg-clip-text text-transparent">
                  MP – 482008
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────── 5. FINAL CALL TO ACTION ──────── */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white text-center px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            Accelerate Your Marketing Execution with AI Ads™
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience the autonomous creative power engineered by Unified Web Options &amp; Services Pvt. Ltd. (UWO™).
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveModule('login')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 hover:from-indigo-400 hover:via-fuchsia-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-fuchsia-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => handleTabClick('home')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
