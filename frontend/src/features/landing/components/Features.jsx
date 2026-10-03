import React from 'react';
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
  MousePointer
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const Features = () => {
  const { setActiveModule } = useWorkspace();

  const featureCards = [
    {
      id: 'brandDna',
      targetModule: 'brands',
      title: 'Brand DNA Engine',
      desc: 'A persistent memory of your identity. It extracts your USPs, personas, and differentiators, and enforces your voice and tone on everything it creates.',
      icon: ShieldCheck,
      badge: 'PERSISTENT BRAND MEMORY',
      accentColor: 'from-amber-500 to-orange-500'
    },
    {
      id: 'seo',
      targetModule: 'seo',
      title: 'SEO Intelligence Suite',
      desc: 'Find high-value keyword clusters by search intent, spot gaps in competitor content, and get structured content briefs automatically.',
      icon: Search,
      badge: 'KEYWORD & BRIEF ENGINE',
      accentColor: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'strategy',
      targetModule: 'strategy',
      title: 'Strategy Hub',
      desc: 'Turn business goals into balanced 30-day roadmaps across channels and funnel stages, and regenerate any single card without redoing the plan.',
      icon: Layers,
      badge: '30-DAY ROADMAPS',
      accentColor: 'from-violet-500 to-purple-500'
    },
    {
      id: 'campaigns',
      targetModule: 'campaigns',
      title: 'Campaign Builder',
      desc: 'Bundle copy, visuals, audiences, and channels into cohesive multi-touch campaigns with consistent messaging.',
      icon: CheckSquare,
      badge: 'MULTI-TOUCH BLUEPRINTS',
      accentColor: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'contentStudio',
      targetModule: 'studio',
      title: 'Content Studio',
      desc: 'Write platform-ready posts for LinkedIn, Meta, X, and Instagram, plus 1,500+ word SEO blog drafts, email sequences, and PPC ad copy.',
      icon: FileText,
      badge: 'MULTI-FORMAT COPYWRITER',
      accentColor: 'from-rose-500 to-pink-500'
    },
    {
      id: 'creative',
      targetModule: 'creative',
      title: 'Creative Studio',
      desc: 'Create photorealistic and vector ad visuals in 1:1, 16:9, and 9:16, with 4 variations per idea to choose from.',
      icon: ImageIcon,
      badge: '8K VISUAL GENERATOR',
      accentColor: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'calendar',
      targetModule: 'calendar',
      title: 'Content Calendar',
      desc: 'Plan visually with drag-and-drop weekly and monthly views, with status, channel, and priority tracking.',
      icon: Calendar,
      badge: 'VISUAL TIMELINE PLANNER',
      accentColor: 'from-green-500 to-emerald-600'
    },
    {
      id: 'assetLibrary',
      targetModule: 'assets',
      title: 'Asset Library',
      desc: 'Store, tag, search, and securely share all your brand media in one cloud repository.',
      icon: Users,
      badge: 'SECURE CLOUD STORAGE',
      accentColor: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'websiteBuilder',
      targetModule: 'websiteBuilder',
      title: 'AI Website Builder',
      desc: 'Describe your page, get responsive HTML/CSS with hero sections, feature grids, and CTAs, then refine it by chatting. No developers needed.',
      icon: Globe,
      badge: 'PROMPT-TO-PAGE GENERATOR',
      accentColor: 'from-pink-500 to-rose-500'
    }
  ];

  // Quadruple cards array for ultra-seamless infinite marquee loop
  const marqueeList = [...featureCards, ...featureCards, ...featureCards, ...featureCards];

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/60 scroll-mt-20 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 shadow-sm">
            <span>UNIFIED PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
            Features Built for Complete Marketing Execution
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            9 integrated modules working in harmony from a single source of truth.
          </p>
          
          {/* Pause on hover helper hint */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/50 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 animate-pulse">
            <MousePointer className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hover to pause — Click card to explore module</span>
          </div>
        </div>

      </div>

      {/* Infinite Moving Marquee Track */}
      <div className="relative mt-8 w-full overflow-hidden pause-on-hover py-4">
        {/* Left & Right Gradient Shadows Fade Overlays */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-slow flex gap-6 px-4">
          {marqueeList.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <div
                key={`${feat.id}-${idx}`}
                onClick={() => setActiveModule(feat.targetModule)}
                className="w-[310px] sm:w-[350px] shrink-0 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 p-6 flex flex-col justify-between space-y-5 hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group shadow-md relative overflow-hidden"
              >
                {/* Top Subtle Ribbon */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.accentColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200/60 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[9.5px] font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 font-mono shrink-0">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[48px]">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-extrabold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
