import React, { useState } from 'react';
import { 
  Cookie, 
  X, 
  ShieldCheck, 
  Check, 
  Lock, 
  Sliders, 
  ExternalLink,
  Info
} from 'lucide-react';

export const CookiePolicyModal = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    functional: true,
    analytics: true,
    marketing: false
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('aiads_cookie_consent', JSON.stringify({
        ...preferences,
        timestamp: new Date().toISOString()
      }));
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 800);
    } catch (e) {
      onClose();
    }
  };

  const handleAcceptAll = () => {
    const all = { essential: true, functional: true, analytics: true, marketing: true };
    setPreferences(all);
    try {
      localStorage.setItem('aiads_cookie_consent', JSON.stringify({
        ...all,
        timestamp: new Date().toISOString()
      }));
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 800);
    } catch (e) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0c101d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-policy-title"
      >
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="cookie-policy-title" className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">
                  Cookie &amp; Tracking Policy
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                  v3.5.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last Updated: October 2026 • Unified Web Options &amp; Services Private Limited
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Cookie Policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          {/* Summary Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-500/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-normal">
              AI ADS™ uses essential cookies, local web storage, and telemetry to deliver our autonomous advertising platform, secure your Brand DNA memory vaults, and analyze system performance. We do not sell your personal data or creative briefs.
            </p>
          </div>

          {/* Section 1: What Are Cookies */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              1. What Are Cookies &amp; Local Web Storage?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cookies are small text data files placed on your browser or device when visiting websites. Along with cookies, AI ADS™ utilizes modern HTML5 Local Storage and Session Storage to cache active workspace settings, brand memory tokens, and user theme preferences without requiring repeated network roundtrips.
            </p>
          </div>

          {/* Section 2: Categories & Interactive Preferences */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center justify-between">
              <span>2. Cookie Categories &amp; Your Preferences</span>
              <span className="text-xs font-normal text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-mono">
                <Sliders className="w-3.5 h-3.5" /> Manage Below
              </span>
            </h3>

            <div className="space-y-3">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Strictly Necessary &amp; Security Cookies
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Essential for secure authentication, token verification, CSRF defense, and workspace isolation. Without these, the platform cannot function.
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    Cookies: <code className="text-indigo-600 dark:text-indigo-400">aiads_auth_token</code>, <code className="text-indigo-600 dark:text-indigo-400">aiads_session</code>
                  </p>
                </div>
                <div className="shrink-0 pt-1">
                  <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-xl cursor-not-allowed">
                    Locked
                  </span>
                </div>
              </div>

              {/* Category 2: Functional & Workspace */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Functional &amp; Workspace Persistence
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Remembers your UI theme (Light/Dark), active Brand DNA workspace, sidebar state, and language selection across browser sessions.
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    Keys: <code className="text-indigo-600 dark:text-indigo-400">aiads_theme</code>, <code className="text-indigo-600 dark:text-indigo-400">aiads_active_brand</code>
                  </p>
                </div>
                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      preferences.functional ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    role="switch"
                    aria-checked={preferences.functional}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        preferences.functional ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Category 3: Analytics & Diagnostics */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Performance &amp; Diagnostic Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Anonymous telemetry used to monitor API response latency, 8K render pipelines, error stack traces, and feature popularity.
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    Analytics: <code className="text-indigo-600 dark:text-indigo-400">_aiads_perf</code>, <code className="text-indigo-600 dark:text-indigo-400">_ga_telemetry</code>
                  </p>
                </div>
                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      preferences.analytics ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    role="switch"
                    aria-checked={preferences.analytics}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Category 4: Marketing & Conversion */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Marketing &amp; Attribution Cookies
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tracks affiliate referral sources, pilot onboarding attribution, and conversion performance across Meta and Google campaigns.
                  </p>
                </div>
                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      preferences.marketing ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    role="switch"
                    aria-checked={preferences.marketing}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        preferences.marketing ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Browser Controls */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              3. Managing Cookies via Browser Settings
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Most web browsers automatically accept cookies, but you can configure your browser preferences to reject or prompt before accepting cookies. Please note that disabling strictly necessary cookies will prevent login and workspace operation.
            </p>
          </div>

          {/* Section 4: Contact & Entity */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Data Controller &amp; Legal Inquiries
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              UNIFIED WEB OPTIONS &amp; SERVICES PRIVATE LIMITED, India
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
              Email: privacy@aiads.io • support@unifiedweboptions.com
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleSavePreferences}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}
            </button>
            <button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto btn-primary px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Accepted!</span>
                </>
              ) : (
                <span>Accept All Cookies</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyModal;
