import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Zap, 
  CreditCard, 
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

// Reusable Section Components (Modular Architecture)
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { ProblemSolution } from './components/ProblemSolution';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { PipelineSpotlight } from './components/PipelineSpotlight';
import { StatsBar } from './components/StatsBar';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { About } from './components/About';
import { CookiePolicyModal } from '../../components/modals/CookiePolicyModal';
import { CookieConsentBanner } from '../../components/modals/CookieConsentBanner';

const VALID_TABS = ['home', 'features', 'how-it-works', 'pricing', 'faq', 'about'];

export const LandingPage = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Handle URL hash routing (e.g. #pricing, #features, #how-it-works, #faq, #about, #home)
  useEffect(() => {
    const syncFromHash = () => {
      if (typeof window === 'undefined') return;
      const rawHash = (window.location.hash || '').replace('#', '').toLowerCase();
      
      // Match aliases if needed
      let matchedTab = rawHash;
      if (rawHash === 'why-ai-ads' || rawHash === 'spotlight') matchedTab = 'features';
      if (rawHash === 'steps' || rawHash === 'workflow') matchedTab = 'how-it-works';
      if (rawHash === 'plans' || rawHash === 'billing') matchedTab = 'pricing';
      if (rawHash === 'about' || rawHash === 'about-us' || rawHash === 'company') matchedTab = 'about';
      if (rawHash === '' || rawHash === 'hero') matchedTab = 'home';

      if (VALID_TABS.includes(matchedTab)) {
        setCurrentTab(matchedTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  // Programmatic tab switch
  const handleSelectTab = (tabId) => {
    const valid = VALID_TABS.includes(tabId) ? tabId : 'home';
    setCurrentTab(valid);
    if (typeof window !== 'undefined') {
      window.location.hash = valid;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-root min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white relative transition-colors duration-300">
      {/* 1. Sticky Navbar with Multi-Page Tabs */}
      <Navbar currentTab={currentTab} onSelectTab={handleSelectTab} />

      {/* Main Page Body (Dynamic Sub-Page Rendering) */}
      <main className="relative z-10">
        
        {/* ────────────────── PAGE 1: HOME (Main Overview) ────────────────── */}
        {currentTab === 'home' && (
          <div className="animate-in fade-in duration-300">
            {/* 1. Hero Section */}
            <Hero />

            {/* 2. Trust Strip */}
            <TrustStrip />

            {/* 3. Problem -> Solution */}
            <ProblemSolution />

            {/* 4. Stats Bar (Velocity & Engine Metrics) */}
            <StatsBar />

            {/* 5. Quick Explore Hub: Discover Dedicated Sub-Pages */}
            <section className="py-10 sm:py-14 bg-white/70 dark:bg-slate-950/70 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                    Explore Deep Product Suites
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Dive into our dedicated sub-pages for in-depth architecture, workflow steps, pricing calculators, and security FAQs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Features */}
                  <div 
                    onClick={() => handleSelectTab('features')}
                    className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                        Features Suite
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        12 multi-agent modules, 8K photoreal renders, autonomous A/B copy generation &amp; AI website builder.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <span>Open Features Page</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card 2: How It Works */}
                  <div 
                    onClick={() => handleSelectTab('how-it-works')}
                    className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                        How It Works
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Follow the 4-step autonomous marketing pipeline from Brand DNA extraction to multi-channel deployment.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                      <span>Explore Workflow</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card 3: Pricing */}
                  <div 
                    onClick={() => handleSelectTab('pricing')}
                    className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                        Pricing &amp; Plans
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Starter, Growth Agency &amp; Enterprise plans with visual AI credits, rollovers, and multi-tenant access.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>View Pricing Tiers</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card 4: FAQ */}
                  <div 
                    onClick={() => handleSelectTab('faq')}
                    className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                        FAQ &amp; Support
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Instant search, interactive AISA AI assistant, security guidelines, and 24/7 technical customer support.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>Open Knowledge Base</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Final CTA */}
            <FinalCTA />
          </div>
        )}

        {/* ────────────────── PAGE 2: FEATURES (Dedicated Page) ────────────────── */}
        {currentTab === 'features' && (
          <div className="animate-in fade-in duration-300">
            {/* 12 Features Grid */}
            <Features />

            {/* 2-Agent Vision Pipeline Spotlight */}
            <PipelineSpotlight />

            {/* Final CTA */}
            <FinalCTA />
          </div>
        )}

        {/* ────────────────── PAGE 3: HOW IT WORKS (Dedicated Page) ────────────────── */}
        {currentTab === 'how-it-works' && (
          <div className="animate-in fade-in duration-300">
            {/* 4-Step Interactive Walkthrough */}
            <HowItWorks />

            {/* Pipeline Spotlight */}
            <PipelineSpotlight />

            {/* Velocity Stats */}
            <StatsBar />

            {/* Final CTA */}
            <FinalCTA />
          </div>
        )}

        {/* ────────────────── PAGE 4: PRICING (Dedicated Page) ────────────────── */}
        {currentTab === 'pricing' && (
          <div className="animate-in fade-in duration-300">
            {/* Pricing Section (Forced Black Theme) */}
            <Pricing />

            {/* Final CTA */}
            <FinalCTA />
          </div>
        )}

        {/* ────────────────── PAGE 5: FAQ & SUPPORT (Dedicated Page) ────────────────── */}
        {currentTab === 'faq' && (
          <div className="animate-in fade-in duration-300">
            {/* FAQ Engine */}
            <FAQ />

            {/* Final CTA */}
            <FinalCTA />
          </div>
        )}

        {/* ────────────────── PAGE 6: ABOUT US (Corporate Profile & Ecosystem) ────────────────── */}
        {currentTab === 'about' && (
          <div className="animate-in fade-in duration-300">
            <About onSelectTab={handleSelectTab} />
          </div>
        )}

      </main>

      {/* 14. Footer with Multi-Page Navigation & Cookie Policy */}
      <Footer onSelectTab={handleSelectTab} onOpenCookiePolicy={() => setIsCookieModalOpen(true)} />

      {/* Floating Cookie Consent & Full Legal Policy Modal */}
      <CookiePolicyModal 
        isOpen={isCookieModalOpen} 
        onClose={() => setIsCookieModalOpen(false)} 
      />
      <CookieConsentBanner 
        onOpenPolicy={() => setIsCookieModalOpen(true)} 
      />
    </div>
  );
};

export default LandingPage;
