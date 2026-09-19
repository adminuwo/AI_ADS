import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const FinalCTA = () => {
  const { setActiveModule } = useWorkspace();

  const handleStartTrial = () => {
    setActiveModule('login');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-b border-slate-800/60 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-xs font-extrabold text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>READY TO SCALE CONTENT VELOCITY?</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight text-white leading-tight">
          Stop juggling tools. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Start shipping on-brand content.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Join forward-thinking marketing teams and growth agencies using AI ADS™ to eliminate brand voice drift and scale campaign velocity.
        </p>

        <div className="pt-2">
          <button
            onClick={handleStartTrial}
            className="px-9 py-4 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-xl shadow-indigo-500/25 inline-flex items-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
