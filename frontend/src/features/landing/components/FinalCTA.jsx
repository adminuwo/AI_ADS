import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const FinalCTA = () => {
  const { setActiveModule } = useWorkspace();

  const handleStartTrial = () => {
    setActiveModule('login');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50/80 via-slate-50 to-indigo-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/60 relative overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/90 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/40 text-xs font-extrabold text-indigo-800 dark:text-indigo-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>READY TO SCALE CONTENT VELOCITY?</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
          Ready to run your marketing at the speed of AI?
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Join the teams replacing fragmented workflows with one intelligent platform.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartTrial}
            className="w-full sm:w-auto btn-primary px-9 py-4 rounded-xl text-base font-extrabold inline-flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleStartTrial}
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Talk to Our Team</span>
          </button>
        </div>
      </div>
    </section>
  );
};
