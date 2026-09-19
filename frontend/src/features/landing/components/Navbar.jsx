import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, Shield } from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const Navbar = () => {
  const { setActiveModule, user } = useWorkspace();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (targetId) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthClick = (targetModule = 'login') => {
    setIsMobileMenuOpen(false);
    if (user && targetModule === 'login') {
      setActiveModule('dashboard');
    } else {
      setActiveModule(targetModule);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex items-center font-black text-2xl tracking-tight leading-none text-white">
            <span className="font-['Outfit'] bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              AI ADS
            </span>
            <sup className="text-xs font-bold text-amber-400 ml-1 select-none">TM</sup>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <button 
            onClick={() => handleNavClick('features')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => handleNavClick('how-it-works')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            How it Works
          </button>
          <button 
            onClick={() => handleNavClick('pricing')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button 
            onClick={() => handleNavClick('faq')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => handleAuthClick('login')}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => handleAuthClick('login')}
            className="px-5 py-2.5 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('features')}
            className="block w-full text-left py-2 text-sm font-bold text-slate-300 hover:text-white"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="block w-full text-left py-2 text-sm font-bold text-slate-300 hover:text-white"
          >
            How it Works
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="block w-full text-left py-2 text-sm font-bold text-slate-300 hover:text-white"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="block w-full text-left py-2 text-sm font-bold text-slate-300 hover:text-white"
          >
            FAQ
          </button>
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => handleAuthClick('login')}
              className="w-full py-3 rounded-xl text-sm font-bold text-slate-300 bg-slate-900 border border-slate-800 text-center cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => handleAuthClick('login')}
              className="w-full py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
