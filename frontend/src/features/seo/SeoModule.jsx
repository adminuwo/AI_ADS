import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { seoAPI } from '../../services/api';
import {
  Search, Layers, FileText, Code2, Sparkles, Send, ShieldAlert,
  TrendingUp, BarChart3, Tag, Hash, ChevronRight, Copy, Check,
  RefreshCw, Globe, CheckCircle2, Loader2, AlertCircle, Bot,
  ExternalLink, ArrowUpRight, Zap, Target, Users, ShieldCheck,
  Layers3, Compass, CheckCircle, HelpCircle, ArrowRight
} from 'lucide-react';

const getIntentStyle = (intent) => {
  if (intent === 'Informational') return { char: 'I', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' };
  if (intent === 'Commercial') return { char: 'C', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' };
  if (intent === 'Transactional') return { char: 'T', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' };
  if (intent === 'Navigational') return { char: 'N', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' };
  return { char: 'I', class: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300' };
};

// Toast notification component
const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold animate-in slide-in-from-bottom-4 ${
      type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
    }`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
      {message}
    </div>
  );
};

export const SeoModule = () => {
  const { activeWorkspace, setActiveModule, seoSearchData, setSeoSearchData, t } = useWorkspace();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [seedKeyword, setSeedKeyword] = useState('');
  const [intent, setIntent] = useState('Commercial');
  const [loading, setLoading] = useState(false);
  const [clusterLoading, setClusterLoading] = useState(false);
  const [regenLoadingIdx, setRegenLoadingIdx] = useState(null);
  const [brief, setBrief] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [toast, setToast] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Tab View Controls
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'onSite' | 'rankings' | 'competitors' | 'opportunities' | 'clusters'

  // Data Stores
  const [onSiteKeywords, setOnSiteKeywords] = useState([]);
  const [rankingKeywords, setRankingKeywords] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [competitorGaps, setCompetitorGaps] = useState([]);
  const [opportunityKeywords, setOpportunityKeywords] = useState([]);
  const [quickWins, setQuickWins] = useState([]);
  const [keywordClusters, setKeywordClusters] = useState([]);
  const [agentSummary, setAgentSummary] = useState(null);

  const briefGeneratingRef = useRef(false);
  const showToast = (message, type = 'error') => setToast({ message, type });

  // Build brand context params from workspace
  const getBrandContext = useCallback(() => ({
    brandName: activeWorkspace.brandName || 'Brand',
    industry: activeWorkspace.industryCategory || 'General',
    websiteUrl: websiteUrl || activeWorkspace.domainUrl || activeWorkspace.website || '',
    domainUrl: websiteUrl || activeWorkspace.domainUrl || activeWorkspace.website || '',
    contentPillars: activeWorkspace.contentPillars || [],
    existingBrandKeywords: activeWorkspace.priorityKeywords || activeWorkspace.contentPillars || [],
    competitorLandscape: activeWorkspace.competitorLandscape || [],
    positioningSummary: activeWorkspace.positioningSummary || activeWorkspace.tagline || activeWorkspace.missionStatement || '',
    targetAudience: activeWorkspace.targetAudience?.[0] || 'General Audience',
    brandVoice: activeWorkspace.brandVoice || activeWorkspace.toneOfVoice || ''
  }), [activeWorkspace, websiteUrl]);

  const getDefaultSeed = useCallback(() => {
    const ws = activeWorkspace;
    if (ws.priorityKeywords?.[0]) return ws.priorityKeywords[0];
    if (ws.contentPillars?.[0]) return ws.contentPillars[0].split('&')[0].trim();
    const name = ws.brandName || 'Brand';
    const cat = ws.industryCategory || '';
    const GENERIC_DEFAULTS = ['technology & e-commerce', 'e-commerce', 'general', 'technology', 'consumer & enterprise', ''];
    const isGeneric = !cat || GENERIC_DEFAULTS.includes(cat.toLowerCase().trim());
    if (!isGeneric) return `${name} ${cat}`;
    return `${name} SEO Strategy`;
  }, [activeWorkspace]);

  const handleCopy = (text, idx, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const saveSeoData = useCallback((dataObj) => {
    const wsId = activeWorkspace._id || activeWorkspace.id || activeWorkspace.brandName;
    const storageKey = `aisa_seo_${wsId}`;
    if (setSeoSearchData) setSeoSearchData(dataObj);
    try { localStorage.setItem(storageKey, JSON.stringify(dataObj)); } catch (e) { }
  }, [activeWorkspace, setSeoSearchData]);

  // Generate Technical SEO Blueprint for selected keyword
  const handleGenerateBrief = async (targetKw, targetIntent) => {
    const kw = targetKw || seedKeyword;
    const it = targetIntent || intent;

    if (!kw || briefGeneratingRef.current) return;

    briefGeneratingRef.current = true;
    setLoading(true);
    setSelectedKeyword(kw);
    try {
      const ctx = getBrandContext();
      const res = await seoAPI.generateBrief({
        primaryKeyword: kw,
        intent: it,
        ...ctx,
        workspaceId: activeWorkspace.id || activeWorkspace._id
      });

      if (res.success && res.brief) {
        setBrief(res.brief);
        showToast(`Technical SEO Blueprint synthesized for "${kw}"`, 'success');
      } else {
        throw new Error(res.error || 'Blueprint generation failed');
      }
    } catch (e) {
      console.error('SEO Blueprint failed:', e);
      showToast(`Blueprint error: ${e.message}`);
    } finally {
      setLoading(false);
      briefGeneratingRef.current = false;
    }
  };

  // Run full Multi-Agent Live Audit
  const handleRunMultiAgentAudit = async (seed) => {
    const kw = seed || seedKeyword || getDefaultSeed();
    setClusterLoading(true);

    try {
      const ctx = getBrandContext();
      const result = await seoAPI.clusterKeywords({
        seedKeyword: kw,
        websiteUrl: websiteUrl || activeWorkspace.domainUrl || activeWorkspace.website || '',
        ...ctx,
        count: 12
      });

      if (result.success) {
        const onSite = result.onSiteKeywords || [];
        const rankings = result.rankingKeywords || [];
        const comps = result.competitors || [];
        const gaps = result.competitorGaps || [];
        const opps = result.opportunityKeywords || [];
        const qWins = result.quickWins || [];
        const clusters = result.keywordClusters || [];

        setOnSiteKeywords(onSite);
        setRankingKeywords(rankings);
        setCompetitors(comps);
        setCompetitorGaps(gaps);
        setOpportunityKeywords(opps);
        setQuickWins(qWins);
        setKeywordClusters(clusters);
        setSeedKeyword(kw);
        setAgentSummary(result.agentsExecutionSummary || null);
        setInitialized(true);

        const storagePayload = {
          websiteUrl: websiteUrl || activeWorkspace.domainUrl || '',
          seedKeyword: kw,
          onSiteKeywords: onSite,
          rankingKeywords: rankings,
          competitors: comps,
          competitorGaps: gaps,
          opportunityKeywords: opps,
          quickWins: qWins,
          keywordClusters: clusters,
          brief
        };
        saveSeoData(storagePayload);

        showToast(`Audit Complete: ${onSite.length} On-Page, ${rankings.length} SERP, ${gaps.length} Gaps, ${opps.length} Opportunities`, 'success');

        // Auto-generate brief for first top opportunity or seed
        const firstKw = opps[0]?.term || onSite[0]?.term || kw;
        handleGenerateBrief(firstKw, intent);
      } else {
        throw new Error('Pipeline returned no data');
      }
    } catch (err) {
      console.error('Multi-Agent audit failed:', err);
      showToast(`Audit failed: ${err.message}`);
    } finally {
      setClusterLoading(false);
    }
  };

  // Load from workspace / cache on mount
  useEffect(() => {
    const ws = activeWorkspace;
    const initialUrl = ws.domainUrl || ws.website || '';
    setWebsiteUrl(initialUrl);

    const wsId = ws._id || ws.id || ws.brandName;
    const storageKey = `aisa_seo_${wsId}`;
    let cached = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) cached = JSON.parse(raw);
    } catch (e) { }

    if (cached && (cached.onSiteKeywords?.length > 0 || cached.keywordsList?.length > 0)) {
      setSeedKeyword(cached.seedKeyword || getDefaultSeed());
      setOnSiteKeywords(cached.onSiteKeywords || []);
      setRankingKeywords(cached.rankingKeywords || []);
      setCompetitors(cached.competitors || []);
      setCompetitorGaps(cached.competitorGaps || []);
      setOpportunityKeywords(cached.opportunityKeywords || []);
      setQuickWins(cached.quickWins || []);
      setKeywordClusters(cached.keywordClusters || []);
      if (cached.brief) setBrief(cached.brief);
      setInitialized(true);
    } else {
      const defaultSeed = getDefaultSeed();
      setSeedKeyword(defaultSeed);
    }
  }, [activeWorkspace._id || activeWorkspace.id || activeWorkspace.brandName]);

  const totalAnalyzedKeywords = onSiteKeywords.length + rankingKeywords.length + competitorGaps.length + opportunityKeywords.length;

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-brand-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              SEO Keyword Intelligence & Competitor Gap Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-10">
            Real-time verified on-page scraping, Google SERP rankings, and dynamic competitor keyword gap analysis.
          </p>
        </div>

        {/* Trust & Provenance Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            VERIFIED ON-PAGE
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            VERIFIED SERP
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            COMPETITOR GAP
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            SEO OPPORTUNITY
          </span>
        </div>
      </div>

      {/* Top Input Control Bar */}
      <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Target Website URL */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              Target Website URL
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full glass-input text-xs font-semibold"
            />
          </div>

          {/* Target Focus Topic */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              Target Focus Topic
            </label>
            <input
              type="text"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              placeholder="e.g. Activewear Workout Gear"
              className="w-full glass-input text-xs font-semibold"
            />
          </div>

          {/* Search Intent */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Search Intent
            </label>
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full glass-input text-xs font-semibold"
            >
              <option value="Commercial">Commercial (Compare)</option>
              <option value="Transactional">Transactional (Buy / Convert)</option>
              <option value="Informational">Informational (Learn)</option>
              <option value="Navigational">Navigational (Find)</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="md:col-span-1 flex">
            <button
              onClick={() => handleRunMultiAgentAudit(seedKeyword)}
              disabled={clusterLoading}
              className="w-full btn-primary px-3 py-2.5 text-xs font-bold whitespace-nowrap shadow-lg shadow-brand-500/20 flex items-center justify-center gap-1.5"
              title="Crawl live URL and analyze SERP rankings"
            >
              {clusterLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{clusterLoading ? '...' : 'Audit'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        {initialized && (
          <div className="flex flex-wrap items-center gap-1 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-extrabold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Overview Matrix ({totalAnalyzedKeywords})
            </button>

            <button
              onClick={() => setActiveTab('onSite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'onSite'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              1. On-Page Scraped ({onSiteKeywords.length})
            </button>

            <button
              onClick={() => setActiveTab('rankings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'rankings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              2. Verified SERP ({rankingKeywords.length})
            </button>

            <button
              onClick={() => setActiveTab('competitors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'competitors'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-500 hover:text-purple-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              3. Competitor Gaps ({competitorGaps.length})
            </button>

            <button
              onClick={() => setActiveTab('opportunities')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'opportunities'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-500 hover:text-amber-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              4. SEO Opportunities ({opportunityKeywords.length})
            </button>

            {keywordClusters.length > 0 && (
              <button
                onClick={() => setActiveTab('clusters')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'clusters'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-500 hover:text-cyan-600'
                }`}
              >
                <Layers3 className="w-3 h-3" />
                Topic Clusters ({keywordClusters.length})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Empty / Launch Screen */}
      {!initialized ? (
        <div className="text-center py-16 px-6 rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-800 max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center mx-auto text-cyan-500 border border-cyan-500/20 shadow-lg">
            {clusterLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Search className="w-8 h-8" />}
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {clusterLoading ? 'Autonomous SEO Agents Crawling...' : 'Enter Website URL to Launch Intelligence Audit'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Crawls live HTML tags, discovers verified Google SERP rankings, detects real competitors, and calculates exact keyword gaps.
            </p>
          </div>
          <button
            onClick={() => handleRunMultiAgentAudit(seedKeyword || getDefaultSeed())}
            disabled={clusterLoading}
            className="btn-primary text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20"
          >
            {clusterLoading ? 'Orchestrating Audit...' : 'Run Verified SEO Analysis'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">

          {/* ⚡ QUICK WINS BANNER (If available) */}
          {quickWins.length > 0 && (activeTab === 'all' || activeTab === 'opportunities') && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    ⚡ Quick Wins (Realistic Top 3 Ranking Opportunities)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {quickWins.length} Fast Rank Gains Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {quickWins.map((qw, i) => (
                  <div
                    key={i}
                    onClick={() => handleGenerateBrief(qw.term)}
                    className="p-3 bg-white dark:bg-slate-900/90 rounded-xl border border-amber-500/20 hover:border-amber-500/60 cursor-pointer transition-all space-y-1.5 group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                        {qw.term}
                      </span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                        {qw.currentPosition}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                      <span>Best Competitor: <strong>{qw.bestCompetitorPosition}</strong></span>
                      <span>•</span>
                      <span className="truncate">Path: {qw.existingRankingPage}</span>
                    </div>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-snug">
                      👉 {qw.recommendedOptimization}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════ 3-COLUMN SECTIONS (ON-PAGE, SERP RANKINGS, COMPETITOR GAPS) ═════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            
            {/* 🟢 COLUMN 1: ON-PAGE KEYWORDS (VERIFIED ON-PAGE) */}
            {(activeTab === 'all' || activeTab === 'onSite') && (
              <div className="p-5 rounded-3xl glass-card border border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.02] to-transparent flex flex-col h-full shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                      1
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        On-Page Keywords
                      </h2>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                        Verified from live HTML tags & body
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                    {onSiteKeywords.length} Verified
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  {onSiteKeywords.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No on-page keywords extracted yet. Click Audit to crawl live HTML.
                    </div>
                  ) : (
                    onSiteKeywords.map((kw, idx) => (
                      <div
                        key={`onsite-${idx}`}
                        onClick={() => handleGenerateBrief(kw.term, kw.intent)}
                        className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-500/60 hover:shadow-md cursor-pointer transition-all group ${
                          selectedKeyword === kw.term ? 'ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded font-black text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              VERIFIED ON-PAGE
                            </span>
                            <span className="px-1.5 py-0.5 rounded font-bold text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {kw.source}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleCopy(kw.term, `onsite-${idx}`, e)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                            title="Copy Keyword"
                          >
                            {copiedIdx === `onsite-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors flex items-center justify-between">
                          <span>{kw.term}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {kw.evidenceSnippet && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1 bg-slate-50 dark:bg-slate-950/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800/80 line-clamp-2">
                            📄 Evidence: {kw.evidenceSnippet}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span className="truncate">URL: {kw.pageUrl}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 🔵 COLUMN 2: CURRENT RANKING KEYWORDS (VERIFIED SERP) */}
            {(activeTab === 'all' || activeTab === 'rankings') && (
              <div className="p-5 rounded-3xl glass-card border border-blue-500/30 dark:border-blue-500/20 bg-gradient-to-b from-blue-500/[0.02] to-transparent flex flex-col h-full shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                      2
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Current SERP Rankings
                      </h2>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">
                        Verified search engine positions
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 border border-blue-500/30">
                    {rankingKeywords.length} Ranked
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  {rankingKeywords.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs space-y-1">
                      <p className="font-bold">Ranking data unavailable</p>
                      <p className="text-[11px]">Domain has no verified Top 100 search visibility in current query index.</p>
                    </div>
                  ) : (
                    rankingKeywords.map((kw, idx) => (
                      <div
                        key={`rank-${idx}`}
                        onClick={() => handleGenerateBrief(kw.term, kw.searchIntent)}
                        className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-blue-500/20 hover:border-blue-500/60 hover:shadow-md cursor-pointer transition-all group ${
                          selectedKeyword === kw.term ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded font-black text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                              VERIFIED SERP
                            </span>
                            <span className="px-1.5 py-0.5 rounded font-black text-[9px] bg-blue-600 text-white">
                              {kw.rankingPosition}
                            </span>
                            {kw.searchIntent && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-extrabold text-[9px] ${getIntentStyle(kw.searchIntent).class}`}>
                                {kw.searchIntent}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleCopy(kw.term, `rank-${idx}`, e)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                            title="Copy Keyword"
                          >
                            {copiedIdx === `rank-${idx}` ? <Check className="w-3.5 h-3.5 text-blue-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors flex items-center justify-between">
                          <span>{kw.term}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {kw.rankingUrl && (
                          <p className="text-[10px] text-blue-500 font-mono mt-1 truncate">
                            🔗 {kw.rankingUrl}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span>Vol: {kw.searchVolume || 'Medium'}</span>
                          <span>KD: {kw.keywordDifficulty || 'Medium'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 🟣 COLUMN 3: COMPETITOR KEYWORD GAPS (COMPETITOR GAP) */}
            {(activeTab === 'all' || activeTab === 'competitors') && (
              <div className="p-5 rounded-3xl glass-card border border-purple-500/30 dark:border-purple-500/20 bg-gradient-to-b from-purple-500/[0.02] to-transparent flex flex-col h-full shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xs">
                      3
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Competitor Keyword Gaps
                      </h2>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">
                        Where competitors outrank you
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-600 border border-purple-500/30">
                    {competitorGaps.length} Gaps
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  {competitorGaps.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No competitor gaps discovered yet. Click Audit to analyze market rivals.
                    </div>
                  ) : (
                    competitorGaps.map((kw, idx) => (
                      <div
                        key={`gap-${idx}`}
                        onClick={() => handleGenerateBrief(kw.term, kw.searchIntent)}
                        className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-purple-500/20 hover:border-purple-500/60 hover:shadow-md cursor-pointer transition-all group ${
                          selectedKeyword === kw.term ? 'ring-2 ring-purple-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded font-black text-[9px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                              COMPETITOR GAP
                            </span>
                            <span className="px-1.5 py-0.5 rounded font-bold text-[9px] bg-rose-500/10 text-rose-600 border border-rose-500/20">
                              {kw.gapType || 'Missing keyword'}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleCopy(kw.term, `gap-${idx}`, e)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                            title="Copy Keyword"
                          >
                            {copiedIdx === `gap-${idx}` ? <Check className="w-3.5 h-3.5 text-purple-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors flex items-center justify-between">
                          <span>{kw.term}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-1">
                          <span>You: <strong className="text-rose-500">{kw.userPosition || 'Not Ranking'}</strong></span>
                          <span>Competitor: <strong className="text-emerald-500">{kw.competitor} ({kw.competitorPosition || 'Pos 1-3'})</strong></span>
                        </div>

                        {kw.gapReason && (
                          <p className="text-[10px] text-purple-600 dark:text-purple-300 mt-1 leading-snug font-medium">
                            🎯 Gap: {kw.gapReason}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ═════════ SECTION 4: SEO OPPORTUNITY KEYWORDS & ACTION ITEMS ═════════ */}
          {(activeTab === 'all' || activeTab === 'opportunities') && opportunityKeywords.length > 0 && (
            <div className="p-6 rounded-3xl glass-card border border-amber-500/30 dark:border-amber-500/20 bg-gradient-to-b from-amber-500/[0.02] to-transparent space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      SEO Opportunity Keywords & Recommended Actions
                    </h3>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                      Targeted recommendations derived from competitor gaps & search intent
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/30">
                  {opportunityKeywords.length} High-ROI Targets
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {opportunityKeywords.map((opp, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleGenerateBrief(opp.term)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/60 hover:shadow-lg cursor-pointer transition-all space-y-2 group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-black text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        SEO OPPORTUNITY
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {opp.difficulty || 'Medium'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors flex items-center justify-between">
                      <span>{opp.term}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>

                    {opp.whyOpportunity && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {opp.whyOpportunity}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400">Action:</span>
                      <span className="font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        👉 {opp.recommendedAction || 'Create new landing page'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════ SECTION 5: DISCOVERED COMPETITORS OVERVIEW ═════════ */}
          {(activeTab === 'all' || activeTab === 'competitors') && competitors.length > 0 && (
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Users className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Discovered SEO Search Competitors
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {competitors.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-purple-600 dark:text-purple-400">
                        🌐 {comp.competitorDomain}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                        SERP Rival
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      {comp.whyCompetitor}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800 space-y-0.5">
                      <div>Overlap: <strong>{comp.keywordOverlap}</strong></div>
                      <div>Advantage: <strong className="text-purple-500">{comp.rankingAdvantage}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════ SECTION 6: DYNAMIC KEYWORD TOPIC CLUSTERS ═════════ */}
          {(activeTab === 'all' || activeTab === 'clusters') && keywordClusters.length > 0 && (
            <div className="p-6 rounded-3xl glass-card border border-cyan-500/30 dark:border-cyan-500/20 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-cyan-500/20">
                <Layers3 className="w-4 h-4 text-cyan-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Dynamic Topic Clusters & Keyword Mapping
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keywordClusters.map((cluster, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-cyan-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-cyan-600 dark:text-cyan-400">
                        📌 Pillar: {cluster.primaryTopic}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Page: {cluster.existingPage || '/'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(cluster.relatedKeywords || []).map((rk, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {rk}
                        </span>
                      ))}
                    </div>

                    <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold pt-1 border-t border-cyan-500/10">
                      Action Plan: {cluster.recommendedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════ TECHNICAL ON-PAGE STRATEGY & RICH SCHEMA BLUEPRINT ═════════ */}
          {brief && (
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Technical Strategy & Google Rich Schema Blueprint
                    </h3>
                    <p className="text-xs text-slate-500">
                      Optimized for target entity: <strong className="text-brand-600 dark:text-brand-400">{brief.primaryKeyword}</strong> ({brief.searchIntent} Intent)
                    </p>
                  </div>
                </div>

                {brief.jsonLdSchema && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(brief.jsonLdSchema);
                      showToast('Schema.org JSON-LD copied to clipboard!', 'success');
                    }}
                    className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2 rounded-xl"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Schema.org JSON-LD</span>
                  </button>
                )}
              </div>

              {/* Title & Meta Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Suggested High-CTR Title Tags</span>
                  <ul className="space-y-1.5">
                    {(brief.suggestedTitles || []).map((tItem, i) => (
                      <li key={i} className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center text-[10px] shrink-0 mt-0.5">{i + 1}</span>
                        <span>{tItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Meta Description (155 Chars)</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {brief.metaDescription}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Google SERP CTR Optimized
                    </span>
                  </div>
                </div>
              </div>

              {/* Headings & Internal Links */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">H2 / H3 Editorial Hierarchy</span>
                  <div className="space-y-2">
                    {(brief.headingOutline || []).map((sec, i) => (
                      <div key={i} className="pl-3 border-l-2 border-brand-500 space-y-0.5">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <ChevronRight className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                          <span>H2: {sec.h2}</span>
                        </div>
                        {sec.h3s && sec.h3s.length > 0 && (
                          <ul className="pl-5 space-y-0.5">
                            {sec.h3s.map((h3, j) => (
                              <li key={j} className="text-[11px] text-slate-500 dark:text-slate-400">
                                • H3: {h3}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Internal Linking Blueprint</span>
                  <div className="flex flex-col gap-1.5">
                    {(brief.internalLinkingSuggestions || []).map((link, i) => (
                      <span key={i} className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 truncate">
                        🔗 {typeof link === 'string' ? link : `${link.anchorText || 'Link'} → ${link.targetPage || '/features'}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={() => setActiveModule('strategy')}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-full font-extrabold text-xs shadow-2xl hover:bg-brand-500 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Proceed to Strategy Studio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
