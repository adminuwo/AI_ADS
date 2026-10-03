import React from 'react';
import { 
  Globe, 
  Layers, 
  Cpu, 
  Share2, 
  Search, 
  Send, 
  Bot,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const TrustStrip = () => {
  const integrationPillars = [
    { name: 'Google Cloud Vertex AI', tagline: 'Multi-Agent Foundation', icon: Cpu, color: 'from-blue-500 to-cyan-500' },
    { name: 'LinkedIn Professional', tagline: 'Long-Form & B2B Posts', icon: Share2, color: 'from-blue-600 to-indigo-600' },
    { name: 'Meta Ad Studio', tagline: '1:1, 9:16 & 16:9 Visuals', icon: Layers, color: 'from-purple-500 to-pink-500' },
    { name: 'Google SEO Intelligence', tagline: 'Intent & Brief Generator', icon: Search, color: 'from-emerald-500 to-teal-500' },
    { name: 'X / Twitter Threads', tagline: 'Viral Copy Engine', icon: Zap, color: 'from-amber-500 to-orange-500' },
    { name: 'Website & Landing Pages', tagline: 'Responsive HTML Builder', icon: Globe, color: 'from-pink-500 to-rose-500' },
    { name: 'Email Sequences', tagline: 'Multi-Touch Nurture Copy', icon: Send, color: 'from-violet-500 to-purple-600' },
    { name: 'Brand DNA Memory', tagline: 'URL & Guideline Vault', icon: ShieldCheck, color: 'from-teal-500 to-emerald-600' }
  ];

  const marqueeList = [...integrationPillars, ...integrationPillars, ...integrationPillars];

  return (
    <section className="py-10 bg-slate-100/60 dark:bg-[#070b19] border-b border-slate-200/80 dark:border-slate-800/60 transition-colors duration-300 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 pb-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/60 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 shadow-xs">
            <Bot className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>INTEGRATED CHANNEL ENGINE & INFRASTRUCTURE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white">
            One AI Workspace. Every Channel & Output.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Powered by Google Cloud Vertex AI to auto-generate strategies, SEO content, visual ad creatives, and landing pages.
          </p>
        </div>

      </div>

      {/* Infinite Marquee Ticker of Channel & AI Pillars */}
      <div className="relative mt-4 w-full overflow-hidden pause-on-hover py-2">
        {/* Left & Right Gradient Mask Shadows */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-100/90 via-slate-100/70 to-transparent dark:from-[#070b19] dark:via-[#070b19]/80 dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-100/90 via-slate-100/70 to-transparent dark:from-[#070b19] dark:via-[#070b19]/80 dark:to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-slow flex gap-5 px-4">
          {marqueeList.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={`${item.name}-${idx}`}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group shrink-0"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black font-['Outfit'] tracking-wide text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500">
                    {item.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
