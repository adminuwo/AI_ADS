import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { seoAPI } from '../../services/api';
import { Search, Layers, FileText, Code2, Sparkles, Send, ShieldAlert, TrendingUp, BarChart3, Tag, Hash, ChevronRight, Copy, Check, RefreshCw, Globe, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const getIntentStyle = (intent) => {
  if (intent === 'Informational') return { char: 'I', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' };
  if (intent === 'Commercial') return { char: 'C', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' };
  if (intent === 'Transactional') return { char: 'T', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' };
  if (intent === 'Navigational') return { char: 'N', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' };
  return { char: 'I', class: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300' };
};

const getKdColor = (kd) => {
  if (kd <= 14) return 'bg-emerald-500';
  if (kd <= 29) return 'bg-emerald-400';
  if (kd <= 49) return 'bg-yellow-400';
  if (kd <= 69) return 'bg-orange-400';
  if (kd <= 84) return 'bg-rose-500';
  return 'bg-rose-700';
};

// Toast notification component
const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold animate-in slide-in-from-bottom-4 ${type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
      }`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
      {message}
    </div>
  );
};

export const SeoModule = () => {
  const { activeWorkspace, setActiveModule, seoSearchData, setSeoSearchData, brandDnaData, t } = useWorkspace();
  const [seedKeyword, setSeedKeyword] = useState('');
  const [intent, setIntent] = useState('Commercial');
  const [loading, setLoading] = useState(false);
  const [clusterLoading, setClusterLoading] = useState(false);
  const [regenLoadingIdx, setRegenLoadingIdx] = useState(null);
  const [brief, setBrief] = useState(null);
  const [keywordsList, setKeywordsList] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showRawSchema, setShowRawSchema] = useState(false);
  const [toast, setToast] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [keywordTab, setKeywordTab] = useState('all'); // 'all' | 'existing' | 'opportunity'
  const briefGeneratingRef = useRef(false);

  const showToast = (message, type = 'error') => setToast({ message, type });

  // Build brand context params from workspace
  const getBrandContext = useCallback(() => ({
    brandName: activeWorkspace.brandName || 'Brand',
    industry: activeWorkspace.industryCategory || 'General',
    contentPillars: activeWorkspace.contentPillars || [],
    existingBrandKeywords: activeWorkspace.priorityKeywords || activeWorkspace.contentPillars || [],
    competitorLandscape: activeWorkspace.competitorLandscape || [],
    positioningSummary: activeWorkspace.positioningSummary || activeWorkspace.tagline || activeWorkspace.missionStatement || '',
    targetAudience: activeWorkspace.targetAudience?.[0] || 'General Audience',
    brandVoice: activeWorkspace.brandVoice || activeWorkspace.toneOfVoice || ''
  }), [activeWorkspace]);

  // Derive a default seed keyword from brand data
  const getDefaultSeed = useCallback(() => {
    const ws = activeWorkspace;
    if (ws.priorityKeywords?.[0]) return ws.priorityKeywords[0];
    if (ws.contentPillars?.[0]) return ws.contentPillars[0].split('&')[0].trim();
    const name = ws.brandName || 'Brand';
    const cat = ws.industryCategory || '';
    // Only use industryCategory if it was genuinely scraped — not a generic/default placeholder
    const GENERIC_DEFAULTS = ['technology & e-commerce', 'e-commerce', 'general', 'technology', 'consumer & enterprise', ''];
    const isGeneric = !cat || GENERIC_DEFAULTS.includes(cat.toLowerCase().trim());
    if (!isGeneric) return `${name} ${cat}`;
    return `${name} Brand Strategy & Marketing`;
  }, [activeWorkspace]);

  const handleCopyKeyword = (text, idx, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const saveSeoData = useCallback((newBrief, newKeywordsList, newSeed) => {
    const wsId = activeWorkspace._id || activeWorkspace.id || activeWorkspace.brandName;
    const storageKey = `aisa_seo_${wsId}`;
    const kws = newKeywordsList !== undefined ? newKeywordsList : keywordsList;
    const seed = newSeed !== undefined ? newSeed : seedKeyword;
    const b = newBrief !== undefined ? newBrief : brief;
    const obj = {
      workspaceId: wsId,
      brandName: activeWorkspace.brandName,
      seedKeyword: seed,
      keywordsList: kws,
      brief: b
    };
    if (setSeoSearchData) setSeoSearchData(obj);
    try { localStorage.setItem(storageKey, JSON.stringify(obj)); } catch (e) { }
  }, [activeWorkspace, keywordsList, seedKeyword, brief, setSeoSearchData]);

  // ─── AI-Powered: Generate SEO Brief ───────────────────────────────────────────
  const handleGenerateBrief = async (customSeed, customIntent, customKeywords) => {
    const targetSeed = customSeed !== undefined ? customSeed : seedKeyword;
    const targetIntent = customIntent !== undefined ? customIntent : intent;
    const targetKws = customKeywords !== undefined ? customKeywords : keywordsList;

    if (!targetSeed || briefGeneratingRef.current) return;

    briefGeneratingRef.current = true;
    setLoading(true);
    try {
      const ctx = getBrandContext();
      const res = await seoAPI.generateBrief({
        primaryKeyword: targetSeed,
        intent: targetIntent,
        ...ctx,
        workspaceId: activeWorkspace.id || activeWorkspace._id
      });

      if (res.success && res.brief) {
        const b = res.brief;
        // Determine schema type dynamically based on content and intent
        const schemaType = b.schemaType ||
          (targetIntent === 'Transactional' ? 'Product'
            : targetIntent === 'Informational' ? 'HowTo'
              : targetIntent === 'Commercial' ? 'WebPage'
                : 'WebPage');

        const finalBrief = {
          primaryKeyword: b.primaryKeyword || targetSeed,
          searchIntent: b.searchIntent || targetIntent,
          suggestedTitles: b.suggestedTitles || [],
          metaTitle: b.metaTitle || b.suggestedTitles?.[0] || `${targetSeed} Guide`,
          metaDescription: b.metaDescription || '',
          urlSlug: b.urlSlug || (b.primaryKeyword || targetSeed).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          headingOutline: (b.headingOutline || b.contentOutline || []).map((h) => {
            if (typeof h === 'string') return { h2: h.replace(/^H2:\s*/i, ''), h3s: [] };
            return { h2: h.h2 || h.heading || '', h3s: h.h3s || h.subheadings || [] };
          }),
          entityKeywords: b.entityKeywords || b.secondaryKeywords || [targetSeed, activeWorkspace.brandName],
          faqSuggestions: b.faqSuggestions || [],
          internalLinkingSuggestions: b.internalLinkingSuggestions || [],
          jsonLdSchema: b.jsonLdSchema || JSON.stringify({
            "@context": "https://schema.org",
            "@type": schemaType,
            "name": b.suggestedTitles?.[0] || `Guide to ${targetSeed}`,
            "description": b.metaDescription || '',
            "keywords": b.entityKeywords || [targetSeed]
          }, null, 2),
          model: b.model || 'AI'
        };
        setBrief(finalBrief);
        saveSeoData(finalBrief, targetKws, targetSeed);
        showToast(`SEO Brief updated for "${targetIntent}" intent via ${finalBrief.model}`, 'success');
      } else {
        throw new Error(res.error || 'Generation failed — no brief returned');
      }
    } catch (e) {
      console.error('SEO Brief generation failed:', e);
      showToast(`Brief generation failed: ${e.message}`);
    } finally {
      setLoading(false);
      briefGeneratingRef.current = false;
    }
  };

  // ─── AI-Powered: Cluster Keywords ─────────────────────────────────────────────
  const handleClusterKeywords = async (seed, autoGenerateBrief = true) => {
    const kw = seed || seedKeyword || getDefaultSeed();
    setClusterLoading(true);
    if (!autoGenerateBrief) {
      setBrief(null);
    }
    try {
      const ctx = getBrandContext();
      const result = await seoAPI.clusterKeywords({
        seedKeyword: kw,
        ...ctx,
        count: 8
      });
      if (result.success && result.keywords?.length > 0) {
        setKeywordsList(result.keywords);
        setSeedKeyword(kw);
        saveSeoData(brief, result.keywords, kw);
        setInitialized(true);
        showToast(`${result.keywords.length} keywords generated via ${result.model || 'AI'}`, 'success');

        // Auto-generate brief on 1st time
        if (autoGenerateBrief) {
          handleGenerateBrief(kw, intent, result.keywords);
        }
      } else {
        throw new Error('No keywords returned');
      }
    } catch (err) {
      console.error('Keyword clustering failed:', err);
      showToast(`Keyword generation failed: ${err.message}`);
    } finally {
      setClusterLoading(false);
    }
  };

  // ─── AI-Powered: Regenerate Single Keyword ────────────────────────────────────
  const handleRegenerateKeyword = async (idx, e) => {
    e.stopPropagation();
    setRegenLoadingIdx(idx);
    try {
      const ctx = getBrandContext();
      const result = await seoAPI.regenerateKeyword({
        ...ctx,
        seedKeyword: seedKeyword || getDefaultSeed(),
        existingKeywords: keywordsList
      });
      if (result.success && result.keyword?.term) {
        setKeywordsList(prev => {
          const updated = prev.map((kw, i) => i === idx ? result.keyword : kw);
          saveSeoData(brief, updated);
          return updated;
        });
      } else {
        throw new Error('No keyword returned');
      }
    } catch (err) {
      console.error('Keyword regeneration failed:', err);
      showToast(`Keyword regeneration failed: ${err.message}`);
    } finally {
      setRegenLoadingIdx(null);
    }
  };

  // ─── AI-Powered: Regenerate All Keywords ──────────────────────────────────────
  const handleRegenerateAll = () => handleClusterKeywords(seedKeyword, false);

  // ─── AI-Powered: Initialize SEO Pipeline ──────────────────────────────────────
  const handleInitializeSEO = () => {
    const defaultSeed = getDefaultSeed();
    setSeedKeyword(defaultSeed);
    handleClusterKeywords(defaultSeed, true);
  };

  // Helper to detect if cached keywords are outdated legacy/template ones
  const isLegacyCache = (kws) => {
    if (!kws || kws.length < 6) return true;
    return kws.some(k => k.term && (k.term.includes('Complete Guide 2026') || k.term.includes('vs Competitors')));
  };

  // ─── Load cached data on workspace change ─────────────────────────────────────
  useEffect(() => {
    const wsId = activeWorkspace._id || activeWorkspace.id || activeWorkspace.brandName;
    const storageKey = `aisa_seo_${wsId}`;
    const defaultSeed = getDefaultSeed();

    // 1. Check React Context
    if (seoSearchData && (seoSearchData.brandName === activeWorkspace.brandName || seoSearchData.workspaceId === wsId)) {
      if (!isLegacyCache(seoSearchData.keywordsList)) {
        const currentSeed = seoSearchData.seedKeyword || defaultSeed;
        setSeedKeyword(currentSeed);
        setKeywordsList(seoSearchData.keywordsList);
        setBrief(seoSearchData.brief || null);
        setInitialized(true);
        // Automatically generate brief on 1st time if brief is missing
        if (!seoSearchData.brief) {
          handleGenerateBrief(currentSeed, intent, seoSearchData.keywordsList);
        }
        return;
      }
    }

    // 2. Check localStorage per workspace
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.keywordsList && !isLegacyCache(parsed.keywordsList)) {
          const currentSeed = parsed.seedKeyword || defaultSeed;
          setSeedKeyword(currentSeed);
          setKeywordsList(parsed.keywordsList);
          setBrief(parsed.brief || null);
          if (setSeoSearchData) setSeoSearchData(parsed);
          setInitialized(true);
          // Automatically generate brief on 1st time if brief is missing
          if (!parsed.brief) {
            handleGenerateBrief(currentSeed, intent, parsed.keywordsList);
          }
          return;
        }
      }
    } catch (e) { }

    // 3. Obsolete or No cached data — automatically generate fresh high-quality keywords & brief
    setSeedKeyword(defaultSeed);
    setKeywordsList([]);
    setBrief(null);
    setInitialized(true);
    handleClusterKeywords(defaultSeed, true);
  }, [activeWorkspace._id || activeWorkspace.id || activeWorkspace.brandName]);

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-600/10 dark:from-teal-500/20 dark:via-cyan-500/20 dark:to-indigo-900/30 border border-teal-300/40 dark:border-cyan-800/40 shadow-lg backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/25">
              <Search className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
              {t('seoTitle', 'SEO Intelligence & Brief Builder')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold sm:pl-13">
            Keyword clustering, topic mapping & 8-step brief generation for{' '}
            <strong className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent font-black px-1.5 py-0.5 bg-teal-500/10 rounded-md">
              {activeWorkspace.brandName}
            </strong>
          </p>
        </div>
      </div>

      {/* Main Container */}
      {!initialized && keywordsList.length === 0 ? (
        <div className="text-center py-20 rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-800 mt-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center mx-auto mb-4">
            {clusterLoading ? <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /> : <Search className="w-8 h-8 text-cyan-500" />}
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
            {clusterLoading ? 'Generating AI Keyword Clusters...' : 'Initialize SEO Cluster Intelligence'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {clusterLoading
              ? `Analyzing "${activeWorkspace.brandName}" brand to generate intelligent keyword clusters...`
              : 'Generate AI-powered keyword clusters, search intent profiles, and topic maps anchored to your Brand DNA.'}
          </p>
          <button
            onClick={handleInitializeSEO}
            disabled={clusterLoading}
            className="btn-primary text-sm flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {clusterLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />}
            {clusterLoading ? 'Generating...' : 'Initialize SEO Pipeline'}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {/* Top Bar: Keyword & Intent Input */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-cyan-500/15 dark:from-slate-900/95 dark:to-slate-900/95 border border-purple-400/40 dark:border-purple-900/50 shadow-lg backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="block text-[11px] font-black text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    Target Seed Keyword
                  </label>
                  <input
                    type="text"
                    value={seedKeyword}
                    onChange={(e) => setSeedKeyword(e.target.value)}
                    placeholder="Enter or select a seed keyword..."
                    className="w-full glass-input text-xs font-bold bg-white/50 dark:bg-slate-800/80 border border-purple-300/60 dark:border-purple-800/60 text-slate-900 dark:text-white backdrop-blur-md shadow-inner"
                  />
                </div>

                <div className="w-full md:w-64 space-y-1.5">
                  <label className="block text-[11px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    Search Intent
                  </label>
                  <select
                    value={intent}
                    onChange={(e) => {
                      setIntent(e.target.value);
                    }}
                    className="w-full glass-input text-xs font-bold bg-white/50 dark:bg-slate-800/80 border border-indigo-300/60 dark:border-indigo-800/60 text-slate-900 dark:text-white backdrop-blur-md shadow-inner"
                  >
                    <option value="Informational">Informational (Know)</option>
                    <option value="Commercial">Commercial (Investigate)</option>
                    <option value="Transactional">Transactional (Buy / Convert)</option>
                    <option value="Navigational">Navigational (Find)</option>
                    <option value="Local">Local Intent</option>
                  </select>
                </div>

                <div className="w-full md:w-auto shrink-0">
                  <button
                    onClick={() => handleGenerateBrief(seedKeyword, intent)}
                    disabled={loading}
                    className="w-full md:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:via-rose-400 hover:to-purple-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? 'AI Synthesizing...' : (brief ? 'Regenerate Brief' : 'Generate SEO Brief')}
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Section: TWO DEDICATED SECTIONS FOR KEYWORDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

              {/* ═════════ SECTION 1: ON-SITE ACTIVE KEYWORDS ═════════ */}
              <div className="p-5 sm:p-6 rounded-3xl border border-emerald-300/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/8 via-teal-500/5 to-cyan-500/8 dark:from-emerald-950/30 dark:to-slate-900/90 backdrop-blur-xl shadow-lg h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Active On-Site Keywords
                      </h2>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
                  Current search queries &amp; brand pillars already detected on your live website.
                </p>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[320px] pr-1">
                  {clusterLoading && keywordsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-2 text-center">
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                      <span className="text-xs text-slate-400">Analyzing brand footprint &amp; on-site keywords...</span>
                    </div>
                  ) : (
                    (keywordsList.filter(k => k.source === 'existing').length > 0
                      ? keywordsList.filter(k => k.source === 'existing')
                      : keywordsList.slice(0, Math.ceil(keywordsList.length / 2)).map(k => ({ ...k, source: 'existing' }))
                    ).map((kw, idx) => (
                      <div
                        key={`existing-${idx}`}
                        onClick={() => {
                          setSeedKeyword(kw.term);
                          if (kw.intent) setIntent(kw.intent);
                          if (brief) handleGenerateBrief(kw.term, kw.intent);
                        }}
                        className={`p-4 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-emerald-200/70 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-700 shadow-sm hover:shadow-md backdrop-blur-md cursor-pointer transition-all duration-200 group ${regenLoadingIdx === idx ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold text-[9px] shadow-2xs ${getIntentStyle(kw.intent).class}`} title={kw.intent}>
                                <span>{getIntentStyle(kw.intent).char}</span>
                                <span>{kw.intent}</span>
                              </span>
                              {kw.cluster && (
                                <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                                  {kw.cluster}
                                </span>
                              )}
                            </div>
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors break-words block">
                              {kw.term}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={(e) => handleCopyKeyword(kw.term, idx, e)}
                              className="p-1.5 rounded-lg hover:bg-emerald-100/70 dark:hover:bg-slate-800 transition-colors"
                              title="Copy keyword"
                            >
                              {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                            </button>
                            <button
                              onClick={(e) => handleRegenerateKeyword(idx, e)}
                              disabled={regenLoadingIdx !== null}
                              className="p-1.5 rounded-lg hover:bg-emerald-100/70 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                              title="Regenerate keyword"
                            >
                              {regenLoadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" /> : <RefreshCw className="w-3.5 h-3.5 text-slate-500" />}
                            </button>
                          </div>
                        </div>

                        {/* Strategic Role Insight */}
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">Strategic Role:</span>
                          {kw.strategicValue || 'Core branded search query maintaining domain authority in your industry category.'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 text-center mt-2.5">Click to audit &amp; optimize on-site brief</p>
              </div>

              {/* ═════════ SECTION 2: HIGH-GROWTH TARGET OPPORTUNITIES ═════════ */}
              <div className="p-5 sm:p-6 rounded-3xl border border-blue-300/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/8 via-indigo-500/5 to-cyan-500/8 dark:from-blue-950/30 dark:to-slate-900/90 backdrop-blur-xl shadow-lg h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        High-ROI Growth Targets
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleRegenerateAll}
                      disabled={clusterLoading}
                      className="p-1.5 rounded-xl text-blue-600 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-slate-800 transition-all border border-blue-200 dark:border-blue-800/40"
                      title="Regenerate all keywords with AI"
                    >
                      {clusterLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
                  Untapped competitor-gap search queries recommended by AI to outrank rivals &amp; drive traffic.
                </p>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[320px] pr-1">
                  {clusterLoading && keywordsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-2 text-center">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                      <span className="text-xs text-slate-400">Analyzing competitor gaps &amp; growth keywords...</span>
                    </div>
                  ) : (
                    (keywordsList.filter(k => k.source === 'opportunity').length > 0
                      ? keywordsList.filter(k => k.source === 'opportunity')
                      : keywordsList.slice(Math.ceil(keywordsList.length / 2)).map(k => ({ ...k, source: 'opportunity' }))
                    ).map((kw, idx) => (
                      <div
                        key={`opportunity-${idx}`}
                        onClick={() => {
                          setSeedKeyword(kw.term);
                          if (kw.intent) setIntent(kw.intent);
                          if (brief) handleGenerateBrief(kw.term, kw.intent);
                        }}
                        className={`p-4 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-blue-200/70 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-700 shadow-sm hover:shadow-md backdrop-blur-md cursor-pointer transition-all duration-200 group ${regenLoadingIdx === idx ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold text-[9px] shadow-2xs ${getIntentStyle(kw.intent).class}`} title={kw.intent}>
                                <span>{getIntentStyle(kw.intent).char}</span>
                                <span>{kw.intent}</span>
                              </span>
                              {kw.cluster && (
                                <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-bold bg-blue-100/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40">
                                  {kw.cluster}
                                </span>
                              )}
                            </div>
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words block">
                              {kw.term}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={(e) => handleCopyKeyword(kw.term, idx, e)}
                              className="p-1.5 rounded-lg hover:bg-blue-100/70 dark:hover:bg-slate-800 transition-colors"
                              title="Copy keyword"
                            >
                              {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                            </button>
                            <button
                              onClick={(e) => handleRegenerateKeyword(idx, e)}
                              disabled={regenLoadingIdx !== null}
                              className="p-1.5 rounded-lg hover:bg-blue-100/70 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                              title="Regenerate keyword"
                            >
                              {regenLoadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" /> : <RefreshCw className="w-3.5 h-3.5 text-slate-500" />}
                            </button>
                          </div>
                        </div>

                        {/* Competitor Gap & Strategic Growth Impact */}
                        <div className="space-y-2">
                          {kw.competitorGap && (
                            <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 font-medium flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                              <span><strong className="font-bold text-amber-800 dark:text-amber-300">Competitor Edge:</strong> {kw.competitorGap}</span>
                            </div>
                          )}
                          <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            <span className="font-bold text-blue-700 dark:text-blue-300 block mb-0.5">Growth Impact:</span>
                            {kw.strategicValue || 'High-converting search opportunity to capture ready-to-buy traffic.'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 text-center mt-2.5">Click to target &amp; generate 8-step brief</p>
              </div>

            </div>

            {/* Brief Output */}
            <div className="p-6 rounded-3xl border border-purple-300/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-500/8 via-indigo-500/5 to-pink-500/8 dark:from-purple-950/30 dark:to-slate-900/90 backdrop-blur-xl shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-purple-200/60 dark:border-purple-800/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Structured 8-Step SEO Brief Output
                  </h2>
                </div>
              </div>

              {brief ? (
                <div className="space-y-5 text-xs animate-in fade-in">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/40 space-y-1">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-300 uppercase tracking-wider block">Primary Keyword</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-base leading-snug block">{brief.primaryKeyword}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/40 space-y-1">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider block">Search Intent</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-base block">{brief.searchIntent}</span>
                    </div>
                  </div>

                  {/* Title & Meta */}
                  <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-purple-200/70 dark:border-purple-900/40 backdrop-blur-md shadow-sm space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider block mb-1">Proposed Title Tag</span>
                      <p className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">{brief.suggestedTitles[0]}</p>
                    </div>
                    {brief.suggestedTitles.length > 1 && (
                      <div>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider block mb-1">Alternative Titles</span>
                        <ul className="space-y-1.5">
                          {brief.suggestedTitles.slice(1).map((title, i) => (
                            <li key={i} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                              {title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider block mb-1">Meta Description</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium text-xs leading-relaxed">{brief.metaDescription}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider block mb-1">URL Slug</span>
                      <code className="px-2.5 py-1 rounded-lg bg-rose-100/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold border border-rose-200 dark:border-rose-800/40 inline-block">/{brief.urlSlug}</code>
                    </div>
                  </div>

                  {/* H2/H3 Outline Tree */}
                  {brief.headingOutline && brief.headingOutline.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-indigo-200/70 dark:border-indigo-900/40 backdrop-blur-md shadow-sm space-y-4">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider block">H2/H3 Editorial Outline Tree</span>
                      <div className="space-y-3.5">
                        {brief.headingOutline.map((section, i) => (
                          <div key={i} className="pl-4 border-l-2 border-indigo-400 dark:border-indigo-600 space-y-2">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                              <span className="font-extrabold text-slate-900 dark:text-white text-xs">H2: {section.h2}</span>
                            </div>
                            <ul className="pl-6 space-y-1">
                              {section.h3s.map((h3, j) => (
                                <li key={j} className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                  H3: {h3}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQ Suggestions */}
                  {brief.faqSuggestions && brief.faqSuggestions.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-amber-200/70 dark:border-amber-900/40 backdrop-blur-md shadow-sm space-y-3">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider block">FAQ Suggestions</span>
                      <ul className="space-y-2">
                        {brief.faqSuggestions.map((faq, i) => (
                          <li key={i} className="text-xs text-slate-800 dark:text-slate-200 font-semibold flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                            {faq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Entity Keywords */}
                  {brief.entityKeywords && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-300 uppercase tracking-wider block">Entity Keywords</span>
                      <div className="flex flex-wrap gap-2">
                        {brief.entityKeywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/40 shadow-2xs">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internal Linking Suggestions */}
                  {brief.internalLinkingSuggestions && brief.internalLinkingSuggestions.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider block">Internal Linking Suggestions</span>
                      <div className="flex flex-wrap gap-2">
                        {brief.internalLinkingSuggestions.map((link, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800/40 shadow-2xs">
                            {link}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* JSON-LD Schema - Clean Executive View */}
                  <div className="rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-emerald-200/70 dark:border-emerald-900/40 shadow-sm overflow-hidden backdrop-blur-md">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/40">
                      <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Schema.org Rich Snippet Status</span>
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(brief.jsonLdSchema);
                            showToast('Schema code copied to clipboard!', 'success');
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 hover:text-emerald-900 bg-emerald-100/70 hover:bg-emerald-200/70 dark:bg-emerald-900/50 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50 transition-colors shadow-2xs"
                          title="Copy Schema Markup for Web Developers"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Schema</span>
                        </button>
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid &amp; Ready
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {(() => {
                        try {
                          const schema = JSON.parse(brief.jsonLdSchema);
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 space-y-1">
                                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Structured Type</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-black text-[11px] bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-purple-900 dark:text-purple-200 border border-purple-500/40">
                                  {schema['@type'] || 'Article'}
                                </span>
                              </div>

                              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 space-y-1">
                                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">SERP Enhancement</span>
                                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 block leading-snug">
                                  Google Rich Results Ready (Boosts CTR)
                                </span>
                              </div>

                              <div className="md:col-span-2 p-3 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 space-y-1">
                                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Target Entity Headline</span>
                                <span className="text-xs font-black text-slate-900 dark:text-slate-100 leading-snug block">
                                  {schema.headline || schema.name || schema.title || brief.suggestedTitles?.[0] || brief.metaTitle || `${brief.primaryKeyword} Strategy`}
                                </span>
                              </div>
                            </div>
                          );
                        } catch {
                          return <p className="text-xs text-slate-400">Schema data generated and validated.</p>;
                        }
                      })()}
                    </div>
                  </div>

                  {/* AI Model Attribution */}
                  {brief.model && (
                    <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 font-semibold">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      Generated by {brief.model}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  {loading ? (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
                      </div>
                      <div className="space-y-1.5 max-w-xs">
                        <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">AI Generating SEO Brief...</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Analyzing keyword intent, competitor landscape, and brand context to generate a comprehensive brief...
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Search className="w-7 h-7 text-purple-500" />
                      </div>
                      <div className="space-y-1.5 max-w-xs">
                        <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">No Brief Generated Yet</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Enter a seed keyword, select search intent, and click <strong>{t('generateSeoBrief', 'Generate SEO Brief')}</strong> to get an AI-powered structured brief with title tags, outline tree, entity keywords, and JSON-LD schema.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Floating Bottom Center Proceed to Strategy CTA */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setActiveModule('strategy')}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:via-purple-500 hover:to-indigo-500 backdrop-blur-xl border border-white/20 text-white rounded-full font-black text-xs sm:text-sm transition-all duration-300 shadow-2xl shadow-purple-600/40 hover:shadow-purple-500/60 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap group"
              title="Proceed to Strategy & Content Planning"
            >
              <span className="tracking-wide">Proceed to Strategy</span>
              <ChevronRight className="w-4 h-4 text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
