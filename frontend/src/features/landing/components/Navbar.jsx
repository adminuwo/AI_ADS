import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight, 
  Sun, 
  Moon, 
  ChevronDown, 
  ExternalLink,
  Cpu,
  Compass,
  ShieldCheck,
  Share2,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { useWorkspace } from '../../../context/WorkspaceContext';

const ECOSYSTEM_PRODUCTS = [
  { 
    name: 'AISA™', 
    url: 'https://aisa24.com/',
    logoImg: '/logos/aisa.svg'
  },
  { 
    name: 'AI Mall™', 
    url: 'https://ai-mall.in/',
    logoImg: '/logos/aimall.ico'
  },
  { 
    name: 'AI LEGAL™', 
    url: 'https://ailegal.aisa24.com/',
    logoImg: '/logos/ailegal.ico'
  },
  { 
    name: 'UWO Connect™', 
    url: 'https://uwoconnect.aisa24.com/',
    logoImg: '/logos/uwoconnect.png'
  },
  { 
    name: 'AI Ads™', 
    url: '#home', 
    isCurrent: true,
    logoImg: '/logo_icon_only.png?v=10'
  },
  { 
    name: 'AI-Education™', 
    url: 'https://education.uwo24.com/',
    logoImg: '/logos/aieducation.ico'
  },
  { 
    name: 'EFV™', 
    url: 'https://efvframework.com/',
    logoImg: '/logos/efv.ico'
  }
];

export const Navbar = ({ currentTab = 'home', onSelectTab }) => {
  const { setActiveModule, user, theme, toggleTheme } = useWorkspace();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const productsMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target)) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tabId) => {
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAuthClick = (targetModule = 'login') => {
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);
    if (user && targetModule === 'login') {
      setActiveModule('dashboard');
    } else {
      setActiveModule(targetModule);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About Us' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleTabClick('home')}
        >
          <img 
            src="/logo_icon_only.png?v=10" 
            alt="AI Ads™ Logo" 
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" 
          />
          <div className="flex items-center font-black text-2xl tracking-tight leading-none text-slate-900 dark:text-white">
            <span className="font-['Outfit'] bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent">
              AI Ads
            </span>
            <sup className="text-xs font-bold text-amber-500 dark:text-amber-400 ml-1 select-none">TM</sup>
          </div>
        </div>

        {/* Desktop Nav Links (Multi-Page Tabs + Our Products Dropdown) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`transition-all duration-200 cursor-pointer relative py-1 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-sm shadow-indigo-500/50" />
                )}
              </button>
            );
          })}

          {/* Our Products Dropdown */}
          <div 
            ref={productsMenuRef} 
            className="relative"
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsProductsOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 transition-all duration-200 cursor-pointer py-1 ${
                isProductsOpen
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'
              }`}
              aria-expanded={isProductsOpen}
              aria-haspopup="true"
            >
              <span>Our Products</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProductsOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} />
            </button>

            {/* Floating Dropdown Card */}
            {isProductsOpen && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="w-60 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-1.5 space-y-0.5">
                  {ECOSYSTEM_PRODUCTS.map((prod) => (
                    prod.isCurrent ? (
                      <button
                        key={prod.name}
                        type="button"
                        onClick={() => {
                          setIsProductsOpen(false);
                          handleTabClick('home');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden p-0.5 shadow-2xs">
                            <img src={prod.logoImg} alt={prod.name} className="w-full h-full object-contain" />
                          </div>
                          <span>{prod.name}</span>
                        </div>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                          Active
                        </span>
                      </button>
                    ) : (
                      <a
                        key={prod.name}
                        href={prod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsProductsOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 group-hover:translate-x-0.5 transition-transform">
                          <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden p-0.5 shadow-2xs">
                            <img src={prod.logoImg} alt={prod.name} className="w-full h-full object-contain" />
                          </div>
                          <span>{prod.name}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 opacity-60 group-hover:opacity-100 transition-all" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light Mode Toggle Button (Icon Only) */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark / Light Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            )}
          </button>

          <button
            onClick={() => handleAuthClick('login')}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
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
          className="md:hidden p-2 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`block w-full text-left py-2 text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 pl-2 border-l-2 border-indigo-600'
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {/* Mobile Our Products Accordion */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white cursor-pointer"
            >
              <span>Our Products</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} />
            </button>

            {isMobileProductsOpen && (
              <div className="pl-2 pr-1 py-1.5 space-y-1 bg-slate-50 dark:bg-slate-900/60 rounded-xl my-1 border border-slate-200/80 dark:border-slate-800/80 animate-in fade-in">
                {ECOSYSTEM_PRODUCTS.map((prod) => (
                  prod.isCurrent ? (
                    <button
                      key={prod.name}
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleTabClick('home');
                      }}
                      className="w-full text-left py-1.5 px-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden p-0.5 shadow-2xs">
                          <img src={prod.logoImg} alt={prod.name} className="w-full h-full object-contain" />
                        </div>
                        <span>{prod.name}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">Active</span>
                    </button>
                  ) : (
                    <a
                      key={prod.name}
                      href={prod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1.5 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden p-0.5 shadow-2xs">
                          <img src={prod.logoImg} alt={prod.name} className="w-full h-full object-contain" />
                        </div>
                        <span>{prod.name}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleAuthClick('login')}
              className="w-full py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-center cursor-pointer"
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

export default Navbar;
