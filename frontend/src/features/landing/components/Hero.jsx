import React, { useState } from 'react';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const Hero = () => {
  const { setActiveModule } = useWorkspace();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleStartTrial = () => {
    setActiveModule('login');
  };

  return (
    <section className="relative overflow-hidden bg-slate-50/90 dark:bg-[#030712] text-slate-900 dark:text-slate-100 pt-4 pb-14 lg:pt-8 lg:pb-20 border-b border-slate-200/80 dark:border-slate-800/60 transition-colors duration-300">
      
      {/* Dot Grid Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none z-0" />

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Hero Column: Moved slightly upward and shifted right */}
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left -mt-2 lg:-mt-4 lg:pl-5">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.1] font-['Outfit'] text-slate-900 dark:text-white">
              One Brand.<br className="hidden sm:inline" /> One Platform.<br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Every Marketing Asset.
              </span>
            </h1>

            {/* Primary Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              Replace fragmented tools with a single AI-powered platform that centralizes strategies, SEO content, ad creatives, and landing pages.
            </p>

            {/* Secondary Bold Tagline & Value Prop */}
            <div className="space-y-1 pt-0.5">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                All-in-one AI marketing suite & visual campaign engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Govern multi-brand DNA, auto-generate 30-day strategy roadmaps, high-converting copy, and 8K visual ad renders in seconds. Built for growth brands and marketing teams.
              </p>
            </div>

            {/* CTA Buttons & Trust Line */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={handleStartTrial}
                  className="w-full sm:w-auto btn-primary px-8 py-3.5 rounded-xl text-base font-extrabold flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/20"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Footnote Line */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Free Trial Included</span>
                </span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <span>No Credit Card Required</span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <span>Instant Setup</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Preview Card enlarged for maximum clarity, kept on right side */}
          <div className="lg:col-span-7 relative flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[720px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-950">
              <img 
                src="/dashboard_preview.png" 
                alt="AI Ads Live Dashboard Preview" 
                className="w-full h-auto object-contain block rounded-2xl sm:rounded-3xl hover:scale-[1.005] transition-transform duration-300"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Optional Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">AI ADS™ Overview Demo</h3>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800 text-center p-6 space-y-3">
              <Play className="w-12 h-12 text-indigo-400 fill-indigo-400 animate-bounce" />
              <p className="text-sm font-bold text-white">AI ADS™ Platform Interactive Walkthrough</p>
              <p className="text-xs text-slate-400 max-w-md">Learn how Brand DNA memory, 30-day strategy roadmaps, and 8K visual ad renders automate content production.</p>
              <button
                onClick={() => { setIsVideoModalOpen(false); handleStartTrial(); }}
                className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Start Free Trial Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
