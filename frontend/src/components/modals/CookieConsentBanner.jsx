import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck, ArrowRight } from 'lucide-react';

export const CookieConsentBanner = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('aiads_cookie_consent');
      if (!consent) {
        // Small delay so it smoothly slides in after page loads
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('aiads_cookie_consent', JSON.stringify({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('aiads_cookie_consent', JSON.stringify({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl space-y-3.5">
        
        {/* Banner Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                Cookie &amp; Privacy Choices
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                UNIFIED WEB OPTIONS &amp; SERVICES
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Banner Text */}
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          We use cookies and local storage to secure your Brand DNA memory, remember workspace settings, and diagnose platform performance.{' '}
          <button
            type="button"
            onClick={onOpenPolicy}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5"
          >
            <span>Read Cookie Policy</span>
            <ArrowRight className="w-2.5 h-2.5 inline" />
          </button>
        </p>

        {/* Buttons Row */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={handleEssentialOnly}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-all text-center cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 rounded-xl btn-primary text-white text-[11px] font-extrabold transition-all text-center cursor-pointer shadow-xs"
          >
            Accept All
          </button>
        </div>

      </div>
    </div>
  );
};

export default CookieConsentBanner;
