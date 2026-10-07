import React from 'react';
import { Layers, MoveRight, Rocket, UserCheck, Sparkles } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const HowItWorks = () => {
  const { setActiveModule } = useWorkspace();

  const steps = [
    {
      num: '01',
      title: 'Create Account & Connect Brand',
      desc: 'Sign up in 30 seconds and enter your website URL or brand guidelines to initialize your Brand DNA memory.',
      icon: UserCheck,
      targetModule: 'brands',
      gradient: 'from-amber-400 via-orange-500 to-amber-600 shadow-amber-500/30',
      glowColor: 'bg-amber-500/20 dark:bg-amber-500/30',
      hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      arrowColor: 'text-amber-500'
    },
    {
      num: '02',
      title: 'Select AI Tool or Strategy Goal',
      desc: 'Choose from 30-day strategy roadmaps, SEO intelligence briefs, copy generators, or 8K visual ad studios.',
      icon: Layers,
      targetModule: 'strategy',
      gradient: 'from-indigo-500 via-purple-600 to-pink-500 shadow-purple-500/30',
      glowColor: 'bg-purple-500/20 dark:bg-purple-500/30',
      hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      arrowColor: 'text-purple-500'
    },
    {
      num: '03',
      title: 'Generate, Review & Launch',
      desc: 'Auto-create platform-ready copy, photorealistic visual ads, and AI landing pages ready for instant campaign execution.',
      icon: Rocket,
      targetModule: 'campaigns',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500 shadow-emerald-500/30',
      glowColor: 'bg-emerald-500/20 dark:bg-emerald-500/30',
      hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      arrowColor: 'text-emerald-500'
    }
  ];

  return (
    <section id="how-it-works" className="pt-8 pb-14 sm:pt-10 sm:pb-16 bg-slate-50/90 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800/60 scroll-mt-6 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white">
            How AI Ads™ Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            From brand identity ingestion to full campaign execution in three simple steps.
          </p>
        </div>

        {/* 3 Step Horizontal Process Flow with Animations & Brand Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div 
                key={step.num} 
                onClick={() => setActiveModule(step.targetModule)}
                className="flex flex-col items-center text-center space-y-4 relative group cursor-pointer"
              >
                {/* Outer Animated Glow Ring & Badge Container */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full ${step.glowColor} blur-xl opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300`} />
                  
                  {/* Step Number Pill */}
                  <span className={`absolute -top-2 -right-2 z-20 text-[10px] font-black font-mono px-2 py-0.5 rounded-full border shadow-xs ${step.badgeBg} group-hover:scale-110 transition-transform`}>
                    {step.num}
                  </span>

                  {/* Circular Gradient Icon Badge with Hover Float */}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${step.gradient} flex items-center justify-center text-white shadow-xl relative z-10 group-hover:-translate-y-1.5 group-hover:scale-105 transition-all duration-300`}>
                    <IconComp className="w-9 h-9 drop-shadow-sm group-hover:rotate-6 transition-transform" />
                  </div>
                </div>

                {/* Step Content */}
                <div className="space-y-2 max-w-xs pt-1">
                  <h3 className={`text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight ${step.hoverText} transition-colors`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                {/* Connecting Animated Arrow between steps for Desktop */}
                {idx < steps.length - 1 && (
                  <div className={`hidden md:flex absolute top-8 left-[calc(100%-1.25rem)] w-10 items-center justify-center ${step.arrowColor} z-20 pointer-events-none group-hover:translate-x-1.5 transition-transform`}>
                    <MoveRight className="w-7 h-7 stroke-[2] animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
