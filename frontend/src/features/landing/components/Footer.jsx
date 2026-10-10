import React from 'react';
import { 
  ArrowUp, 
  FileText, 
  Globe 
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

export const Footer = ({ onSelectTab, onOpenCookiePolicy }) => {
  const { setActiveModule, setIsSettingsModalOpen, setActiveSettingsTab } = useWorkspace();

  const handleNavClick = (targetId) => {
    if (onSelectTab) {
      onSelectTab(targetId);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 pt-16 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-10">
        
        {/* ──────── TOP GRID: Brand + 3 Navigation Columns ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand Info & App Store Badges (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick('home')}
            >
              <img 
                src="/logo_icon_only.png?v=10" 
                alt="AI Ads™ Logo" 
                className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
              />
              <div className="flex items-center font-black text-2xl tracking-tight leading-none text-slate-900 dark:text-white">
                <span className="font-['Outfit']">AI</span>
                <span className="font-['Outfit'] text-indigo-600 dark:text-amber-400 ml-1">Ads</span>
                <sup className="text-xs font-bold text-amber-500 dark:text-amber-400 ml-0.5 select-none">TM</sup>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              India's first autonomous AI advertising &amp; creative platform for brands, growth marketers, and performance agencies.
            </p>

            {/* Platform Badges: Web & Cloud Architecture */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Web App &amp; Cloud Studio</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>v3.5 Enterprise Live</span>
              </div>
            </div>
          </div>

          {/* Column 2: Product (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide relative inline-block">
              Product
              <span className="absolute -bottom-1 left-0 w-4 h-0.5 bg-amber-500 rounded-full" />
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('features')} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('how-it-works')} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium">
                  How it Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('pricing')} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModule('creative')} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium">
                  Creative Studio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModule('brandDna')} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium">
                  Brand DNA Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModule('dashboard')} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium">
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide relative inline-block">
              Legal
              <span className="absolute -bottom-1 left-0 w-4 h-0.5 bg-indigo-500 rounded-full" />
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => {
                    if (setActiveSettingsTab) setActiveSettingsTab('privacy');
                    if (setIsSettingsModalOpen) setIsSettingsModalOpen(true);
                  }}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (setActiveSettingsTab) setActiveSettingsTab('terms');
                    if (setIsSettingsModalOpen) setIsSettingsModalOpen(true);
                  }}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (onOpenCookiePolicy) {
                      onOpenCookiePolicy();
                    } else {
                      if (setActiveSettingsTab) setActiveSettingsTab('cookies');
                      if (setIsSettingsModalOpen) setIsSettingsModalOpen(true);
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('faq')} 
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium"
                >
                  Disclaimer &amp; QA
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-4 h-0.5 bg-emerald-500 rounded-full" />
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium">
                  About Us
                </button>
              </li>
              <li>
                <a 
                  href="/AI_ADS_Platform_Documentation.pdf" 
                  download="AI_ADS_Platform_Documentation.pdf"
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1.5 font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Documentation (PDF)</span>
                </a>
              </li>
              <li>
                <a 
                  href="/AI_ADS_Platform_Documentation.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors font-medium"
                >
                  Platform Docs (HTML)
                </a>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (setActiveSettingsTab) setActiveSettingsTab('help');
                    if (setIsSettingsModalOpen) setIsSettingsModalOpen(true);
                  }}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer text-left font-medium"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ──────── BOTTOM BAR (Cream Strip with Company & Scroll to Top) ──────── */}
      <div className="bg-[#fbf7ee] dark:bg-slate-900 py-3.5 px-4 sm:px-6 lg:px-8 border-t border-amber-200/50 dark:border-slate-800 text-slate-800 dark:text-slate-200">
        <div className="max-w-7xl mx-auto relative flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
          
          {/* Center: Brand pill + Company Name */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center text-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black tracking-wider">
              AI <span className="text-amber-400">Ads</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-300 text-[11px] sm:text-xs text-center">
              &copy; 2026 by <strong className="font-bold text-slate-900 dark:text-white">UNIFIED WEB OPTIONS &amp; SERVICES PRIVATE LIMITED</strong>, India
            </span>
          </div>

          {/* Right: Scroll to Top Circular Button */}
          <button
            onClick={scrollToTop}
            className="sm:absolute sm:right-0 w-8 h-8 rounded-full bg-[#e86014] hover:bg-[#d0500d] text-white flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            title="Scroll to Top"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
