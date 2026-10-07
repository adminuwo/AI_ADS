import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { CinematicBackground } from './CinematicBackground';

export const FinalCTA = () => {
  const { setActiveModule } = useWorkspace();

  const handleStartTrial = () => {
    setActiveModule('login');
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-950 text-slate-100 border-b border-slate-800/60 relative overflow-hidden">
      {/* Cinematic video-like background */}
      <CinematicBackground startIndex={2} interval={5500} overlayClassName="bg-slate-950/75">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/25 rounded-full blur-[140px]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </CinematicBackground>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight text-white leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
          Ready to run your marketing at the speed of AI?
        </h2>

        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
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
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold text-white bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white/20 shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Talk to Our Team</span>
          </button>
        </div>
      </div>
    </section>
  );
};
