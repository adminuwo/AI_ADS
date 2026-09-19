import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  LayoutGrid, 
  Dna, 
  Search, 
  Target, 
  Layers, 
  Calendar, 
  PenTool, 
  CheckCircle2, 
  Palette, 
  FolderKanban, 
  Globe, 
  Settings, 
  Crown,
  CreditCard,
  Sliders,
  X,
  Sun,
  Moon,
  LogOut,
  User,
  ChevronUp,
  Lock,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isMobileMenuOpen: propIsMobile, setIsMobileMenuOpen: propSetIsMobile }) => {
  const { 
    activeModule, 
    setActiveModule, 
    setIsSettingsModalOpen, 
    activeSettingsTab,
    setActiveSettingsTab,
    isMobileMenuOpen: contextIsMobile,
    setIsMobileMenuOpen: contextSetIsMobile,
    user,
    userAvatar,
    activeWorkspace,
    theme,
    toggleTheme,
    logout,
    t 
  } = useWorkspace();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileCardRef = useRef(null);

  const isMobileMenuOpen = propIsMobile !== undefined ? propIsMobile : contextIsMobile;
  const setIsMobileMenuOpen = propSetIsMobile || contextSetIsMobile;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileCardRef.current && !profileCardRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const modules = [
    { 
      id: 'dashboard', 
      label: t('dashboard', '1. Dashboard'), 
      icon: LayoutGrid, 
      color: '#EF4444', 
      gradient: 'from-rose-500 to-red-600 shadow-rose-500/30',
      iconBg: 'bg-rose-500/15 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400'
    },
    { 
      id: 'brands', 
      label: t('brands', '2. Brand DNA'), 
      icon: Dna, 
      color: '#F59E0B', 
      gradient: 'from-amber-500 to-orange-600 shadow-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
    },
    { 
      id: 'seo', 
      label: t('seo', '3. SEO Intelligence'), 
      icon: Search, 
      color: '#10B981', 
      gradient: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
    },
    { 
      id: 'campaigns', 
      label: t('campaigns', '4. Campaigns'), 
      icon: Layers, 
      color: '#3B82F6', 
      gradient: 'from-blue-500 to-indigo-600 shadow-blue-500/30',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
    },
    { 
      id: 'strategy', 
      label: t('strategy', '5. Strategy'), 
      icon: Target, 
      color: '#8B5CF6', 
      gradient: 'from-violet-500 to-purple-600 shadow-violet-500/30',
      iconBg: 'bg-violet-500/15 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400'
    },
    { 
      id: 'calendar', 
      label: t('calendar', '6. Calendar'), 
      icon: Calendar, 
      color: '#22C55E', 
      gradient: 'from-green-500 to-emerald-600 shadow-green-500/30',
      iconBg: 'bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400'
    },
    { 
      id: 'studio', 
      label: t('studio', '7. Content Studio'), 
      icon: PenTool, 
      color: '#F97316', 
      gradient: 'from-orange-500 to-rose-600 shadow-orange-500/30',
      iconBg: 'bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
    },
    { 
      id: 'approvals', 
      label: t('approvals', '8. Approvals Desk'), 
      icon: CheckCircle2, 
      color: '#EAB308', 
      gradient: 'from-yellow-500 to-amber-600 shadow-yellow-500/30',
      iconBg: 'bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
    },
    { 
      id: 'creative', 
      label: t('creative', '9. Creative Studio'), 
      icon: Palette, 
      color: '#6366F1', 
      gradient: 'from-indigo-500 to-purple-600 shadow-indigo-500/30',
      iconBg: 'bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
    },
    { 
      id: 'assets', 
      label: t('assets', '10. Asset Library'), 
      icon: FolderKanban, 
      color: '#06B6D4', 
      gradient: 'from-cyan-500 to-blue-600 shadow-cyan-500/30',
      iconBg: 'bg-cyan-500/15 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400'
    },
    { 
      id: 'websiteBuilder', 
      label: t('websiteBuilder', '11. AI Website Builder'), 
      icon: Globe, 
      color: 'spectrum', 
      gradient: 'from-pink-500 via-purple-500 to-indigo-500 shadow-purple-500/30',
      iconBg: 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-purple-600 dark:text-pink-400'
    },
  ];

  const handleNavClick = (id) => {
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
    if (id === 'settings') {
      setActiveModule('settings');
      if (setActiveSettingsTab) setActiveSettingsTab('account');
      setIsSettingsModalOpen(true);
    } else if (id === 'plan') {
      setActiveModule('settings');
      if (setActiveSettingsTab) setActiveSettingsTab('billing');
      setIsSettingsModalOpen(true);
    } else if (id === 'connectors') {
      setActiveModule('settings');
      if (setActiveSettingsTab) setActiveSettingsTab('personalization');
      setIsSettingsModalOpen(true);
    } else {
      setActiveModule(id);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in transition-opacity"
        />
      )}

      <aside className={`h-screen bg-gradient-to-b from-slate-50/95 via-purple-50/40 to-slate-50/95 dark:from-[#0b0f19] dark:via-[#131127] dark:to-[#0b0f19] backdrop-blur-xl border-r border-purple-200/50 dark:border-slate-800/80 shadow-[8px_0_30px_rgba(139,92,246,0.08)] dark:shadow-[8px_0_30px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300 z-50 fixed lg:sticky top-0 left-0 w-64 select-none ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header / Logo */}
          <div className="h-20 flex items-center justify-between px-3.5 sm:px-4 shrink-0 border-b border-purple-100/50 dark:border-slate-800/60 bg-white/70 dark:bg-[#070b19]/80 backdrop-blur-xl relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] panch-tattva-ribbon z-40" />
            <div className="flex items-center gap-2.5 min-w-0 pt-1.5 sm:pt-2">
              <img 
                src="/logo_transparent.png?v=9" 
                alt="AI ADS™ Logo" 
                className="w-16 h-16 sm:w-[68px] sm:h-[68px] 2xl:w-[72px] 2xl:h-[72px] object-contain shrink-0 drop-shadow-md dark:drop-shadow-[0_0_14px_rgba(255,255,255,0.3)] transition-transform hover:scale-105" 
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png?v=9'; }}
              />
              <div className="flex items-center font-black text-xl sm:text-2xl tracking-tight leading-none min-w-0">
                <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-xs truncate">
                  AI Ads
                </span>
                <sup className="text-[9px] sm:text-[9.5px] font-extrabold text-amber-500 ml-1 font-sans -mt-2.5 select-none bg-amber-400/15 border border-amber-400/30 px-1 rounded-md shrink-0">TM</sup>
              </div>
            </div>

            {/* Mobile close button */}
            {isMobileMenuOpen && (
              <button 
                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all"
                title="Close Navigation Menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Clean Navigation Item List (Seamless vertical flow, no lower empty gaps) */}
          <nav className="px-3 pt-2.5 pb-2 flex-1 flex flex-col justify-start overflow-y-auto lg:overflow-hidden hover:lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="space-y-1.5 2xl:space-y-2">
              {modules.map((m) => {
                const Icon = m.icon;
                const isActive = activeModule === m.id;
                const userPlanNorm = (user?.plan || 'starter').toLowerCase();
                const isStarterUser = userPlanNorm === 'starter' || userPlanNorm === 'base' || userPlanNorm === 'free';
                const isModuleLocked = isStarterUser && ['campaigns', 'approvals', 'websiteBuilder', 'websitebuilder', 'builder'].includes(m.id);

                return (
                  <button
                    key={m.id}
                    onClick={() => handleNavClick(m.id)}
                    className={`w-full relative flex items-center justify-between px-3 py-1.5 2xl:py-2 rounded-xl text-[12.5px] 2xl:text-[13px] transition-all duration-200 text-left group ${
                      isActive 
                        ? `bg-gradient-to-r ${m.gradient} text-white font-bold shadow-md scale-[1.01]` 
                        : 'bg-white/70 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800/90 border border-slate-200/50 dark:border-slate-800/60 shadow-2xs hover:shadow-sm hover:border-purple-200 dark:hover:border-purple-800/50 hover:translate-x-0.5 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isActive 
                          ? 'bg-white/20 text-white shadow-inner backdrop-blur-xs' 
                          : m.iconBg
                      }`}>
                        <Icon className="w-4 h-4" style={!isActive && m.color !== 'spectrum' ? { color: m.color } : {}} />
                      </div>
                      <span className="truncate">{m.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isModuleLocked && (
                        <span className={`flex items-center gap-0.5 text-[8.5px] 2xl:text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ml-1 shadow-2xs ${
                          isActive
                            ? 'bg-white/25 text-white border border-white/40 backdrop-blur-xs'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        }`}>
                          <Lock className="w-2.5 h-2.5" />
                          <span>PRO</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Horizontal Action Buttons: PLAN & SETTINGS (Flows seamlessly below 11th module) */}
            <div className="mt-2.5 2xl:mt-3.5 pt-2 pb-0.5 px-0.5 flex items-center gap-2.5 shrink-0 border-t border-purple-100/50 dark:border-slate-800/50">
              {/* PLAN */}
              <button
                key="plan_btn"
                onClick={() => handleNavClick('plan')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all duration-200 shadow-2xs cursor-pointer ${
                  activeModule === 'settings' && activeSettingsTab === 'billing'
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-500/30 font-extrabold'
                    : 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30'
                }`}
                title={t('plan', 'Subscription & Billing Plan')}
              >
                <Crown className="w-3.5 h-3.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>PLAN</span>
              </button>

              {/* SETTINGS */}
              <button
                key="settings_btn"
                onClick={() => handleNavClick('settings')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all duration-200 shadow-2xs cursor-pointer ${
                  activeModule === 'settings' && activeSettingsTab === 'account'
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-cyan-500/30 font-extrabold'
                    : 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 dark:border-cyan-500/30'
                }`}
                title={t('settings', 'Account Settings')}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0 text-cyan-500 dark:text-cyan-400" />
                <span>SETTINGS</span>
              </button>
            </div>
          </nav>

          {/* Bottom Sidebar Container: User Profile Card */}
          <div className="p-2.5 bg-gradient-to-r from-white/90 via-purple-50/50 to-white/90 dark:from-slate-900/90 dark:via-purple-950/40 dark:to-slate-900/90 border-t border-purple-100/60 dark:border-slate-800/80 shrink-0 relative" ref={profileCardRef}>
            {/* Floating Profile & Account Dropdown Popover */}
            {showProfileMenu && (
              <div className="absolute bottom-full left-2 right-2 mb-2 bg-white/95 dark:bg-[#0b0f19]/95 rounded-2xl shadow-2xl border border-purple-200/80 dark:border-slate-800/80 p-3 z-50 animate-in fade-in slide-in-from-bottom-2 space-y-2.5 backdrop-blur-xl">
                <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
                  <p className="text-[9.5px] text-purple-600 dark:text-purple-400 font-extrabold uppercase tracking-wider">{t('signedInAs', 'Signed In As')}</p>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                    {user?.name || user?.fullName || user?.email?.split('@')[0] || 'Agency Admin'}
                  </p>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email || 'admin@agency.ai'}</p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="inline-block text-[9px] bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
                      {user?.plan ? `${user.plan} Tier` : 'Enterprise Suite'}
                    </span>
                    <span className="inline-block text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/25">
                      {t('activeAccount', 'Active')}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      if (setActiveSettingsTab) setActiveSettingsTab('account');
                      setIsSettingsModalOpen(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left py-1.5 px-2 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 group/item"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-purple-500 transition-colors" />
                    {t('accountSettings', 'Account Settings')}
                  </button>

                  {logout && (
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-1.5 px-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all text-xs font-bold flex items-center gap-2 mt-0.5"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      {t('signOut', 'Sign Out')}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Active User / Workspace Footer Card (Clickable to trigger popover) */}
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 shadow-2xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700/50 transition-all cursor-pointer select-none group"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7.5 h-7.5 2xl:w-8 2xl:h-8 rounded-lg p-0.5 bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-400 shadow-xs shadow-purple-500/20 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[6px] bg-slate-950 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user?.name || user?.email || 'A').charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] 2xl:text-xs font-bold text-slate-900 dark:text-white truncate leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {user?.name || user?.email?.split('@')[0] || 'Agency Admin'}
                  </p>
                  <p className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.plan || 'Enterprise'}
                  </p>
                </div>
              </div>

              {/* Direct Theme Switcher Button (Sun / Moon) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTheme();
                }}
                className="p-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/15 dark:from-violet-500/20 dark:to-indigo-500/20 border border-amber-400/30 dark:border-violet-500/30 text-amber-500 dark:text-violet-300 hover:scale-110 transition-all shrink-0 ml-1 cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 hover:scale-110 transition-transform" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-300 hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};



