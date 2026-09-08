import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { strategyAPI } from '../../services/api';
import { resolveBrandVisualAsset } from '../../services/brandVisualResolver';
import {
  Target, Layers, Zap, CheckCircle2, ArrowRight, TrendingUp, Users, BarChart3,
  Globe, Mail, Instagram, Linkedin, Loader2, Save, Crosshair, Gift,
  MousePointerClick, Edit3, Sparkles, PieChart, Calendar, DollarSign,
  Megaphone, BookOpen, Clock, ChevronRight, Star, Lightbulb, Rocket,
  Hash, Video, FileText, MessageSquare, Filter, Play, Award, BarChart2,
  ArrowUpRight, Flame, X, RefreshCw, UploadCloud, Image as ImageIcon, Trash2, Plus
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const deriveGoal = (ws) => {
  const name = ws.brandName || 'Brand';
  const category = ws.industryCategory || '';
  if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('lifestyle'))
    return `Scale ${name}'s Organic Fashion Traffic by 300% & Drive Seasonal Revenue Growth`;
  if (category.toLowerCase().includes('e-commerce') || category.toLowerCase().includes('retail'))
    return `Grow ${name}'s Organic Buyer Traffic by 250% & Maximize Conversion Rate Across All Categories`;
  if (category.toLowerCase().includes('footwear'))
    return `Drive ${name}'s Brand Awareness in Comfort Footwear Segment & Grow DTC Revenue by 40%`;
  if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('tech'))
    return `Scale ${name}'s Enterprise Pipeline by 250% Through Governed AI Content Operations`;
  return `Scale ${name}'s Organic Lead Pipeline by 200% & Strengthen Market Positioning`;
};

const deriveLeadMagnet = (ws) => {
  const name = ws.brandName || 'Brand';
  const category = ws.industryCategory || '';
  if (category.toLowerCase().includes('fashion'))
    return `${name}'s Ultimate 2026 Style & Trend Forecast Report`;
  if (category.toLowerCase().includes('e-commerce') || category.toLowerCase().includes('retail'))
    return `The ${name} Smart Shopper's Guide: Best Deals & Product Selection Playbook`;
  if (category.toLowerCase().includes('footwear'))
    return `${name} Comfort Footwear Buyer's Guide: Finding Your Perfect Pair`;
  if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('tech'))
    return `The 2026 Enterprise AI Content Operations Playbook (PDF)`;
  return `${name}'s Expert Guide to Maximum Value & Brand Experience`;
};

const deriveCta = (ws) => {
  const category = ws.industryCategory || '';
  if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('lifestyle'))
    return `Shop the Latest Collection & Get 20% Off Your First Order`;
  if (category.toLowerCase().includes('e-commerce') || category.toLowerCase().includes('retail'))
    return `Explore Best Deals & Shop Now for Unbeatable Prices`;
  if (category.toLowerCase().includes('footwear'))
    return `Find Your Perfect Pair — Free Shipping on Orders Over ₹999`;
  if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('tech'))
    return `Book Your Enterprise Strategy Demo Today`;
  return `Get Started Free — No Credit Card Required`;
};

// Channel icon/color mapping
const channelColors = {
  Globe:     { gradient: 'from-violet-500 to-indigo-600', bg: 'bg-violet-500/10', text: 'text-brand-600 dark:text-violet-400', bar: 'from-violet-500 to-indigo-500', ring: 'ring-violet-500/20' },
  Linkedin:  { gradient: 'from-blue-500 to-cyan-500',     bg: 'bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400',    bar: 'from-blue-500 to-cyan-500',   ring: 'ring-blue-500/20' },
  Mail:      { gradient: 'from-amber-500 to-orange-500',  bg: 'bg-amber-500/10',  text: 'text-amber-600 dark:text-amber-400',  bar: 'from-amber-500 to-orange-500', ring: 'ring-amber-500/20' },
  Instagram: { gradient: 'from-pink-500 to-rose-500',     bg: 'bg-pink-500/10',   text: 'text-pink-600 dark:text-pink-400',   bar: 'from-pink-500 to-rose-500',    ring: 'ring-pink-500/20' },
};

// Platform icon helper
const getPlatformIcon = (platform = '') => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('instagram') || p.includes('reels')) return Instagram;
  if (p.includes('email') || p.includes('newsletter')) return Mail;
  if (p.includes('blog') || p.includes('seo') || p.includes('article')) return FileText;
  if (p.includes('twitter') || p.includes('x.com')) return MessageSquare;
  if (p.includes('youtube') || p.includes('video')) return Video;
  return Globe;
};

const getPlatformColor = (platform = '') => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/20';
  if (p.includes('instagram') || p.includes('reels')) return 'bg-pink-500/15 text-pink-600 dark:text-pink-400 ring-pink-500/20';
  if (p.includes('email') || p.includes('newsletter')) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20';
  if (p.includes('blog') || p.includes('seo')) return 'bg-violet-500/15 text-brand-600 dark:text-violet-400 ring-violet-500/20';
  if (p.includes('twitter') || p.includes('x.com')) return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 ring-sky-500/20';
  if (p.includes('youtube') || p.includes('video')) return 'bg-red-500/15 text-red-600 dark:text-red-400 ring-red-500/20';
  return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 ring-slate-500/20';
};

// Week label helper
const getWeekLabel = (day) => {
  if (day <= 7)  return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
};

// Helper to sanitize & format post titles cleanly without trailing '...' or redundant prefixes
const formatPostTitle = (title, directive) => {
  if (!title) return '';
  let text = title;
  // Remove redundant 'Day X (Platform): ' prefix
  text = text.replace(/^Day\s+\d+\s*\([^)]+\):\s*/i, '');
  // Replace trailing '...' or truncated directives with full text
  if (text.includes('...')) {
    if (directive) {
      text = text.replace(/—\s*.*?\.\.\.$/, `— ${directive}`);
      text = text.replace(/:\s*.*?\.\.\.$/, `: ${directive}`);
      text = text.replace(/\.\.\.$/, ` — ${directive}`);
    } else {
      text = text.replace(/\.\.\.$/, '');
    }
  }
  return text.trim();
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const StrategyModule = () => {
  const {
    activeWorkspace,
    setActiveModule,
    updateWorkspace,
    bulkAddCalendarEvents,
    calendarEvents,
    setGeneratedStrategy,
    setStudioTarget,
    showCustomAlert,
    setGeneratedContent,
    t
  } = useWorkspace();


  // Core strategy fields
  const [businessGoal,      setBusinessGoal]      = useState('');
  const [leadMagnet,        setLeadMagnet]         = useState('');
  const [primaryCta,        setPrimaryCta]         = useState('');
  const [channelMix,        setChannelMix]         = useState([]);
  const [postingFrequency,  setPostingFrequency]   = useState('Daily');
  const [budgetSuggestions, setBudgetSuggestions]  = useState('');
  const [bestPlatforms,     setBestPlatforms]      = useState([]);
  const [contentPillars,    setContentPillars]     = useState([]);
  const [campaignIdeas,     setCampaignIdeas]      = useState([]);
  const [thirtyDayPlan,     setThirtyDayPlan]      = useState([]);
  const [funnel,            setFunnel]             = useState({ awareness: '', nurturing: '', conversion: '' });
  const [audience,          setAudience]           = useState([]);

  // UI state
  const [selectedWeek,  setSelectedWeek]  = useState('ALL');
  const [generatedDoc,  setGeneratedDoc]  = useState(false);
  const [isGenerating,  setIsGenerating]  = useState(false);
  const [isSaving,      setIsSaving]      = useState(false);
  const [editingField,  setEditingField]  = useState(null);
  const [activeTab,     setActiveTab]     = useState(() => sessionStorage.getItem('strategyActiveTab') || 'overview'); // overview | plan | campaigns
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showRegenToast, setShowRegenToast] = useState(false);
  const [isSavedState,  setIsSavedState]  = useState(false);

  useEffect(() => {
    const targetTab = sessionStorage.getItem('strategyActiveTab');
    if (targetTab) {
      setActiveTab(targetTab);
      sessionStorage.removeItem('strategyActiveTab');
    }
  }, []);

  // Build Campaign Modal State
  const [buildCampaignModal, setBuildCampaignModal] = useState(false);
  const [selectedCampaignIdea, setSelectedCampaignIdea] = useState(null);
  const [campaignDuration, setCampaignDuration] = useState('30');

  // Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDays, setScheduleDays] = useState('30');

  // Image Upload Guidance Modal State
  const [showImageBriefModal, setShowImageBriefModal] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageDirective, setImageDirective] = useState('');
  const [isSubmittingImageBrief, setIsSubmittingImageBrief] = useState(false);
  const [customImageBriefs, setCustomImageBriefs] = useState([]);
  const [customStrategy, setCustomStrategy] = useState(null);
  const [showImageBriefToast, setShowImageBriefToast] = useState(false);
  const [imageBriefToastMsg, setImageBriefToastMsg] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showCustomAlert({ title: 'Invalid File Format', message: 'Please select a valid image file (PNG, JPG, WebP, SVG, GIF).', type: 'error' });
        return;
      }
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDropImage = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        showCustomAlert({ title: 'Invalid File Format', message: 'Please select a valid image file (PNG, JPG, WebP, SVG, GIF).', type: 'error' });
        return;
      }
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [selectedCustomWeek, setSelectedCustomWeek] = useState('ALL');
  const [selectedCustomPlatform, setSelectedCustomPlatform] = useState('ALL');

  const handleGenerateCustomStrategy = async () => {
    if (!uploadedImageFile && !imagePreviewUrl && !imageDirective.trim()) {
      showCustomAlert({
        title: 'Missing Information',
        message: 'Please upload an image or enter instructions for what AI should do with the image.',
        type: 'warning'
      });
      return;
    }

    setIsSubmittingImageBrief(true);
    try {
      const brandName = activeWorkspace?.brandName || 'Brand';
      const industry = activeWorkspace?.industryCategory || activeWorkspace?.industry || 'Consumer Products';
      const directive = imageDirective.trim() || 'Promote core product features and scale social media engagement with reference image';

      const platformsList = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter / X', 'YouTube Shorts', 'Pinterest'];

      const weekThemes = [
        { week: 1, name: 'Brand Awareness & Visual Hook (Days 1–7)', tag: 'Week 1: Awareness' },
        { week: 2, name: 'Product Value & Feature Deep Dive (Days 8–14)', tag: 'Week 2: Value' },
        { week: 3, name: 'Social Proof & Community Engagement (Days 15–21)', tag: 'Week 3: Engagement' },
        { week: 4, name: 'Conversion Sprint & Direct Response CTA (Days 22–30)', tag: 'Week 4: Conversion' }
      ];

      const generated30DayPosts = Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const weekNum = day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4;
        const weekThemeObj = weekThemes[weekNum - 1];
        const platform = platformsList[i % platformsList.length];

        let format = 'Single Image Banner Post';
        if (platform === 'Instagram') format = 'Carousel Slide / Reel Concept';
        if (platform === 'Facebook') format = 'High-Engagement Ad Graphic';
        if (platform === 'LinkedIn') format = 'Executive Slide Briefing';
        if (platform === 'Twitter / X') format = '16:9 Viral Thread Graphic';
        if (platform === 'YouTube Shorts') format = '9:16 Short Video Motion Hook';
        if (platform === 'Pinterest') format = 'Shoppable Vertical Moodboard Pin';

        let title = ``;
        let hook = ``;
        let caption = ``;
        let cta = ``;

        if (weekNum === 1) {
          title = `${brandName} Visual Spotlight: ${directive || 'Brand & Product Showcase'}`;
          hook = `✨ Stop scrolling! Day ${day} focus: Discover how ${brandName} is defining the new standard in ${industry}.`;
          caption = `Day ${day} of our 30-Day custom visual strategy.\n\nDirective Focus: "${directive}".\n\nWe're bringing high-converting visual storytelling straight to your feed. Whether you're looking for peak quality or modern design, ${brandName} delivers.`;
          cta = `Explore ${brandName}'s latest collection today! 👇`;
        } else if (weekNum === 2) {
          title = `${brandName} Deep Dive Feature: ${directive || 'Core Product Value'}`;
          hook = `💡 Day ${day} Feature Breakdown: Why ${brandName} outperforms standard options in ${industry}.`;
          caption = `Day ${day} Value Focus.\n\nCustom Directive: "${directive}".\n\nOur team engineered every detail with intent. Learn how this feature solves everyday challenges for users like you.`;
          cta = `Click to read full specs & shop now 🔗`;
        } else if (weekNum === 3) {
          title = `${brandName} Customer Proof & Community Spotlight`;
          hook = `🔥 Day ${day} Community Highlight: Here's what real users are saying about ${brandName}!`;
          caption = `Day ${day} Proof Sprint.\n\nVisual Directives: "${directive}".\n\nJoin thousands of verified customers who upgraded their workflow with ${brandName}. Drop a comment with your thoughts!`;
          cta = `Leave a comment & tap link in bio 💬`;
        } else {
          title = `${brandName} Conversion Push: Exclusive Campaign Offer`;
          hook = `⚡ Day ${day} Special Offer: Limited-time access to ${brandName}'s primary collection!`;
          caption = `Day ${day} Final Sprint.\n\nDirective: "${directive}".\n\nDon't miss out on seasonal savings and exclusive bonuses. Claim your spot before offer expires!`;
          cta = `Claim Exclusive Offer Now 🛍️`;
        }

        const hashtags = `#${brandName.replace(/\s+/g,'')} #Day${day} #${industry.replace(/\s+/g,'')} #VisualStrategy #${platform.replace(/[\s\/]+/g,'')}`;

        const visualDirective = `[Day ${day} - ${platform}] Format reference image for ${format}. Integrate ${brandName} official logo in top right, apply dynamic gradient framing, and add overlay directive: "${directive}".`;

        return {
          day,
          week: weekNum,
          weekTag: weekThemeObj.tag,
          weekName: weekThemeObj.name,
          platform,
          format,
          title,
          visualDirective,
          hook,
          caption,
          cta,
          hashtags
        };
      });

      const newBrief = {
        id: 'brief_' + Date.now(),
        imageUrl: imagePreviewUrl || null,
        fileName: uploadedImageFile ? uploadedImageFile.name : 'Reference Image',
        fileSize: uploadedImageFile ? `${(uploadedImageFile.size / 1024).toFixed(1)} KB` : 'N/A',
        directive,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      const updatedBriefs = [newBrief, ...customImageBriefs];
      setCustomImageBriefs(updatedBriefs);

      const newCustomStrat = {
        id: 'custom_strat_' + Date.now(),
        imagePreviewUrl: imagePreviewUrl || null,
        fileName: uploadedImageFile ? uploadedImageFile.name : 'Reference Image',
        directive,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        posts: generated30DayPosts
      };

      setCustomStrategy(newCustomStrat);

      const updatedStrategy = {
        ...(activeWorkspace.currentStrategy || {}),
        customImageBriefs: updatedBriefs,
        customStrategy: newCustomStrat
      };

      if (updateWorkspace && (activeWorkspace.id || activeWorkspace._id)) {
        await updateWorkspace(activeWorkspace.id || activeWorkspace._id, { currentStrategy: updatedStrategy });
      }

      setImageBriefToastMsg('Custom Social Media Strategy generated successfully for all platforms!');
      setShowImageBriefToast(true);
      setTimeout(() => setShowImageBriefToast(false), 4500);

      // Reset modal and switch active tab to 'custom'
      setShowImageBriefModal(false);
      setActiveTab('custom');
    } catch (err) {
      console.error('Failed to generate custom strategy:', err);
      showCustomAlert({ title: 'Error', message: 'Failed to generate custom strategy. Please try again.', type: 'error' });
    } finally {
      setIsSubmittingImageBrief(false);
    }
  };

  const handleDeleteImageBrief = async (briefId) => {
    const updatedBriefs = customImageBriefs.filter(b => b.id !== briefId);
    setCustomImageBriefs(updatedBriefs);
    const updatedStrategy = {
      ...(activeWorkspace.currentStrategy || {}),
      customImageBriefs: updatedBriefs
    };
    if (updateWorkspace && (activeWorkspace.id || activeWorkspace._id)) {
      await updateWorkspace(activeWorkspace.id || activeWorkspace._id, { currentStrategy: updatedStrategy });
    }
  };

  // Card Regeneration State
  const [openRegenDays, setOpenRegenDays] = useState({});
  const [regenInputs, setRegenInputs] = useState({});
  const [loadingRegenDays, setLoadingRegenDays] = useState({});

  const handleRegenerateCardItem = async (item, e) => {
    if (e) e.stopPropagation();
    const day = item.day;
    const userDirective = (regenInputs[day] || '').trim();

    setLoadingRegenDays(prev => ({ ...prev, [day]: true }));

    try {
      const wsId = activeWorkspace.id || activeWorkspace._id || 'default_ws';
      const data = await strategyAPI.regenerateCard(wsId, {
        day: item.day,
        currentTopic: item.topic,
        currentActionItem: item.actionItem,
        platform: item.platform,
        pillar: item.pillar,
        userDirective
      });

      if (data && data.updatedCard) {
        const updated = data.updatedCard;
        setThirtyDayPlan(prevPlan => {
          const newPlan = prevPlan.map(card => {
            if (card.day === item.day) {
              return {
                ...card,
                topic: updated.topic || card.topic,
                actionItem: updated.actionItem || card.actionItem,
                pillar: updated.pillar || card.pillar
              };
            }
            return card;
          });

          const updatedStrategy = {
            ...(activeWorkspace.currentStrategy || {}),
            thirtyDayPlan: newPlan
          };
          updateWorkspace(activeWorkspace.id || activeWorkspace._id, { currentStrategy: updatedStrategy }).catch(() => {});

          return newPlan;
        });
      }
    } catch (err) {
      console.error('Failed to regenerate strategy card:', err);
    } finally {
      setLoadingRegenDays(prev => ({ ...prev, [day]: false }));
      setOpenRegenDays(prev => ({ ...prev, [day]: false }));
    }
  };

  const isLegacyStrategy = (strat) => {
    if (!strat || !strat.thirtyDayPlan || strat.thirtyDayPlan.length < 10) return true;
    if (strat.campaignIdeas && strat.campaignIdeas.some(c => c.title === 'The Authority Series' || c.title === 'DNA Lead Magnet Launch')) return true;
    if (strat.thirtyDayPlan.some(d => d.title && (d.title.includes('Key Insights for') || d.title.includes('Day 1: Pillar')))) return true;
    return false;
  };

  // ─── Init from workspace ─────────────────────────────────────────────────
  useEffect(() => {
    const strat = activeWorkspace.currentStrategy;
    
    if (strat && !isLegacyStrategy(strat)) {
      setBusinessGoal(strat.businessGoal || '');
      setLeadMagnet(strat.leadMagnet || '');
      setPrimaryCta(strat.primaryCta || '');
      setPostingFrequency(strat.postingFrequency || 'Daily');
      setBudgetSuggestions(strat.budgetSuggestions || '');
      setBestPlatforms(strat.bestPlatforms || []);
      setContentPillars(strat.contentPillars || activeWorkspace.contentPillars || []);
      setCampaignIdeas(strat.campaignIdeas || []);
      setThirtyDayPlan(strat.thirtyDayPlan || []);
      setFunnel(strat.funnel || { awareness: '', nurturing: '', conversion: '' });
      setAudience(strat.audience || (activeWorkspace.targetAudience || []).slice(0, 4));
      if (strat.channelMix && strat.channelMix.length > 0) setChannelMix(strat.channelMix);
      if (strat.customImageBriefs && Array.isArray(strat.customImageBriefs)) setCustomImageBriefs(strat.customImageBriefs);
      if (strat.customStrategy) setCustomStrategy(strat.customStrategy);
      setGeneratedDoc(true);
      return;
    }

    // Otherwise automatically trigger fresh AI Strategy generation
    if (activeWorkspace.id || activeWorkspace._id) {
      handleGenerate();
    }
  }, [activeWorkspace.id || activeWorkspace._id]);

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const updatedStrategy = {
      ...(activeWorkspace.currentStrategy || {}),
      businessGoal, leadMagnet, primaryCta, channelMix,
      postingFrequency, budgetSuggestions, bestPlatforms,
      contentPillars, campaignIdeas, thirtyDayPlan, funnel, audience,
      customImageBriefs, customStrategy,
    };
    await updateWorkspace(activeWorkspace.id || activeWorkspace._id, { currentStrategy: updatedStrategy });
    setIsSaving(false);
    setEditingField(null);
    setIsSavedState(true);
    setShowSaveToast(true);
    setTimeout(() => {
      setIsSavedState(false);
      setShowSaveToast(false);
    }, 3000);
  }, [activeWorkspace, businessGoal, leadMagnet, primaryCta, channelMix,
      postingFrequency, budgetSuggestions, bestPlatforms, contentPillars,
      campaignIdeas, thirtyDayPlan, funnel, audience, updateWorkspace]);

  // ─── Generate AI Strategy ─────────────────────────────────────────────────
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const id = activeWorkspace.id || activeWorkspace._id || 'default_ws';
      let strategy = null;
      try {
        const data = await strategyAPI.generate(id);
        if (data && data.strategy) {
          strategy = data.strategy.data || (typeof data.strategy === 'object' && !data.strategy.data ? data.strategy : null);
        }
      } catch (apiErr) {
        console.log('Strategy API notice:', apiErr.message);
      }

      if (!strategy) {
        const brandName = activeWorkspace.brandName || 'Brand';
        const industry = activeWorkspace.industryCategory || activeWorkspace.industry || 'Consumer Products';
        const topics = (activeWorkspace.contentPillars && activeWorkspace.contentPillars.length > 0)
          ? activeWorkspace.contentPillars
          : [`${brandName} Product Value`, `Industry Trends in ${industry}`, `Customer Proof & Reviews`, `How-to Guides`];
        const platforms = ['SEO Blog', 'LinkedIn', 'Instagram', 'Email Newsletter'];

        const fallbackPlan = Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const pillar = topics[i % topics.length];
          const platform = platforms[i % platforms.length];
          return {
            day,
            title: `Day ${day}: ${pillar} - Key Insights for ${brandName}`,
            topic: `${pillar} Focus: Essential Strategies & Tips`,
            platform,
            pillar,
            status: 'PLANNED',
            action: `Publish ${platform} content highlighting ${brandName}'s core value in ${industry}.`
          };
        });

        strategy = {
          businessGoal: deriveGoal(activeWorkspace),
          leadMagnet: deriveLeadMagnet(activeWorkspace),
          primaryCta: deriveCta(activeWorkspace),
          postingFrequency: 'Daily',
          budgetSuggestions: '60% Organic content marketing & SEO / 40% Paid micro-targeting & retargeting.',
          bestPlatforms: ['LinkedIn', 'Google SEO Blog', 'Email Newsletter', 'Instagram & Reels'],
          contentPillars: topics,
          campaignIdeas: [
            { title: `${brandName} Authority Series`, desc: `Long-form thought leadership posts demonstrating domain mastery.` },
            { title: `Lead Magnet Opt-In Push`, desc: `Direct-response opt-in push using landing page & email funnel.` },
            { title: `Social Proof Sprint`, desc: `Customer testimonials & case-study carousel posts for trust.` }
          ],
          thirtyDayPlan: fallbackPlan,
          funnel: {
            awareness: `Pillar-driven content, SEO optimization, and educational hooks to drive top-of-funnel reach for ${brandName}.`,
            nurturing: `Interactive guides, how-to value-bombs, and lead magnet resources to capture email subscribers.`,
            conversion: `Direct sales copy, verified client testimonials, case studies, and primary product benefit pushes.`
          },
          audience: Array.isArray(activeWorkspace.targetAudience) ? activeWorkspace.targetAudience : [activeWorkspace.targetAudience || `Target consumers in ${industry}`]
        };
      }

      setBusinessGoal(strategy.businessGoal || '');
      setLeadMagnet(strategy.leadMagnet || '');
      setPrimaryCta(strategy.primaryCta || '');
      setPostingFrequency(strategy.postingFrequency || 'Daily');
      setBudgetSuggestions(strategy.budgetSuggestions || '');
      setBestPlatforms(strategy.bestPlatforms || []);
      setContentPillars(strategy.contentPillars || []);
      setCampaignIdeas(strategy.campaignIdeas || []);
      setThirtyDayPlan(strategy.thirtyDayPlan || []);
      setFunnel(strategy.funnel || { awareness: '', nurturing: '', conversion: '' });
      setAudience(strategy.audience || []);
      if (strategy.channelMix) setChannelMix(strategy.channelMix);

      if (updateWorkspace && id) {
        await updateWorkspace(id, { currentStrategy: strategy });
      }
      if (setGeneratedStrategy) setGeneratedStrategy(strategy);
      setGeneratedDoc(true);
      setShowRegenToast(true);
      setTimeout(() => setShowRegenToast(false), 4000);
    } catch (err) {
      console.log('Strategy generation error:', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Generate Strategy for Campaign Duration ─────────────────────────────
  const handleGenerateForCampaign = async (numDays, campaignGoal) => {
    setIsGenerating(true);
    try {
      const days = Number(numDays) || 30;
      const brandName = activeWorkspace.brandName || 'Brand';
      const industry = activeWorkspace.industryCategory || activeWorkspace.industry || 'Consumer Products';
      const topics = (activeWorkspace.contentPillars && activeWorkspace.contentPillars.length > 0)
        ? activeWorkspace.contentPillars
        : [`${brandName} Product Value`, `Industry Trends in ${industry}`, `Customer Proof & Reviews`, `How-to Guides`];
      const platforms = ['SEO Blog', 'LinkedIn', 'Instagram', 'Email Newsletter'];

      const generatedPlan = Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        const pillar = topics[i % topics.length];
        const platform = platforms[i % platforms.length];
        return {
          day,
          title: `Day ${day}: ${pillar} - ${campaignGoal || `Key Insights for ${brandName}`}`,
          topic: `${pillar} Focus: ${campaignGoal || 'Essential Strategies & Tips'}`,
          platform,
          pillar,
          status: 'PLANNED',
          action: `Publish ${platform} content highlighting ${brandName}'s core value in ${industry}.`
        };
      });

      setThirtyDayPlan(generatedPlan);
      setGeneratedDoc(true);
      setActiveTab('plan');
    } catch (err) {
      console.log('Campaign strategy generation error:', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Generate Calendar Events ─────────────────────────────────────────────
  const handleGenerateCalendar = () => {
    if (!thirtyDayPlan || thirtyDayPlan.length === 0) {
      showCustomAlert({ title: 'No Strategy Generated', message: 'Please generate a brand strategy plan first before scheduling calendar entries.', type: 'warning' });
      return;
    }
    setScheduleDays(String(Math.min(30, thirtyDayPlan.length)));
    setShowScheduleModal(true);
  };

  const [isCreatingCalendarCampaign, setIsCreatingCalendarCampaign] = useState(false);

  const confirmGenerateCalendar = async (numDays) => {
    const daysToGen = Math.min(Number(numDays) || 30, Math.max(30, thirtyDayPlan.length || 30));
    localStorage.setItem('aisa_selected_schedule_days', String(daysToGen));
    setIsCreatingCalendarCampaign(true);

    try {
      const today = new Date();
      const end = new Date(today);
      end.setDate(today.getDate() + (daysToGen - 1));

      // Filter plan to only generate up to daysToGen
      const planToUse = (thirtyDayPlan.length >= daysToGen)
        ? thirtyDayPlan.filter(item => item.day <= daysToGen)
        : Array.from({ length: daysToGen }, (_, i) => {
            const day = i + 1;
            const existing = thirtyDayPlan.find(d => d.day === day);
            if (existing) return existing;
            const pillar = contentPillars[i % (contentPillars.length || 1)] || 'Product Value';
            return {
              day,
              platform: bestPlatforms[i % (bestPlatforms.length || 1)] || 'Instagram',
              topic: `Day ${day}: Strategic ${pillar} for ${activeWorkspace?.brandName || 'Brand'}`,
              pillar,
              actionItem: `Publish content showcasing ${pillar} benefits and drive engagement.`
            };
          });

      const brandName = activeWorkspace?.brandName || 'Brand';
      const wsId = activeWorkspace?.id || activeWorkspace?._id || 'ws_001';

      // Extract unique platforms
      const platformsToUse = [...new Set(planToUse.map(d => {
        const raw = (d.platform || '').toLowerCase();
        if (raw.includes('linkedin')) return 'LinkedIn';
        if (raw.includes('instagram') || raw.includes('reels')) return 'Instagram';
        if (raw.includes('email') || raw.includes('newsletter')) return 'Email';
        if (raw.includes('youtube') || raw.includes('video')) return 'YouTube';
        if (raw.includes('blog') || raw.includes('seo')) return 'Blog';
        return 'Instagram';
      }))];

      const payload = {
        workspaceId: wsId,
        campaignName: `${brandName} ${daysToGen}-Day Strategy Campaign`,
        campaignGoal: businessGoal || activeWorkspace?.currentStrategy?.businessGoal || 'Comprehensive Growth Roadmap',
        startDate: today.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        postingFrequency: postingFrequency || 'Daily',
        platforms: platformsToUse.length > 0 ? platformsToUse : ['Instagram', 'LinkedIn', 'YouTube'],
      };

      const res = await campaignAPI.create(payload);
      if (res.success && res.campaign) {
        await campaignAPI.generatePlan(res.campaign._id, { strategyPlan: planToUse });
        localStorage.setItem('aisa_selected_campaign_id', res.campaign._id);
      }

      const eventsToCreate = planToUse.map(item => {
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + (item.day - 1));
        
        return {
          title: item.topic || `Day ${item.day} Content`,
          date: eventDate.toISOString().split('T')[0],
          platform: item.platform || 'Blog',
          pillar: activeWorkspace?.brandName || 'Brand Strategy',
          status: 'SCHEDULED',
          owner: 'Content Strategist'
        };
      });

      bulkAddCalendarEvents(eventsToCreate);
    } catch (e) {
      console.warn('Calendar campaign generation notice:', e.message);
    } finally {
      setIsCreatingCalendarCampaign(false);
      setShowScheduleModal(false);
      setActiveModule('calendar'); // Transition to calendar view
    }
  };

  // ─── Derived data ─────────────────────────────────────────────────────────
  const totalPct = channelMix.reduce((s, c) => s + c.pct, 0);

  const filteredPlan = selectedWeek === 'ALL'
    ? thirtyDayPlan
    : thirtyDayPlan.filter(d => getWeekLabel(d.day) === Number(selectedWeek));

  const objectiveCards = [
    { key: 'businessGoal', label: t('primaryBusinessGoal', 'Primary Business Goal'), sublabel: t('primaryBusinessGoalSub', 'North-star metric for all content strategy'), value: businessGoal, setter: setBusinessGoal, icon: Crosshair, iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600', tag: 'GOAL', tagColor: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
    { key: 'leadMagnet',   label: t('leadMagnetOffer', 'Lead Magnet / Offer'),   sublabel: t('leadMagnetOfferSub', 'High-value asset to capture qualified leads'),  value: leadMagnet,   setter: setLeadMagnet,   icon: Gift,           iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',  tag: 'OFFER', tagColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
    { key: 'primaryCta',   label: t('primaryCtaTitle', 'Primary CTA'),           sublabel: t('primaryCtaSub', 'Main call-to-action across all touchpoints'),    value: primaryCta,   setter: setPrimaryCta,   icon: MousePointerClick, iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500', tag: 'CTA',   tagColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
  ];

  const funnelStages = [
    { label: t('brandAwareness', 'Brand Awareness'), mix: '50%', desc: funnel.awareness,  goal: t('organicTrafficReach', 'Organic Traffic & Reach'), border: 'border-brand-500/40',   bg: 'bg-brand-500/5 dark:bg-brand-500/10',   badge: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',   text: 'text-brand-600 dark:text-brand-400',   bar: 'bg-brand-500',   barW: 'w-[50%]' },
    { label: t('leadNurturing', 'Lead Nurturing'),  mix: '30%', desc: funnel.nurturing,  goal: t('leadCaptures', 'Lead Captures'),           border: 'border-purple-500/40',  bg: 'bg-purple-500/5 dark:bg-brand-500/10', badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300', text: 'text-brand-600 dark:text-brand-400', bar: 'bg-purple-500', barW: 'w-[30%]' },
    { label: t('conversion', 'Conversion'),      mix: '20%', desc: funnel.conversion, goal: t('salesRevenue', 'Sales & Revenue'),         border: 'border-emerald-500/40', bg: 'bg-emerald-500/5 dark:bg-emerald-500/10', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500', barW: 'w-[20%]' },
  ];

  const weekStats = [1,2,3,4].map(w => {
    const days = thirtyDayPlan.filter(d => getWeekLabel(d.day) === w);
    const fullTheme = days[0]?.topic || days[0]?.theme || days[0]?.title || `Week ${w} Strategy Focus`;
    return { week: w, count: days.length, theme: fullTheme };
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in relative">

      {/* ── SAVE SUCCESS FLOATING NOTIFICATION ── */}
      {showSaveToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 text-white p-3.5 px-4 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Strategy Saved Successfully</span>
                <button
                  onClick={() => setShowSaveToast(false)}
                  className="text-slate-400 hover:text-white transition-colors ml-2 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Your growth roadmap & campaign settings are updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── REGENERATE SUCCESS FLOATING NOTIFICATION ── */}
      {showRegenToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-brand-500/40 text-white p-3.5 px-4 rounded-2xl shadow-2xl shadow-brand-500/20 flex items-center gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Strategy Regenerated!</span>
                <button
                  onClick={() => setShowRegenToast(false)}
                  className="text-slate-400 hover:text-white transition-colors ml-2 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Deep Brand DNA analysis complete for <strong className="text-brand-300">{activeWorkspace.brandName}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE BRIEF SUCCESS FLOATING NOTIFICATION ── */}
      {showImageBriefToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-purple-500/40 text-white p-3.5 px-4 rounded-2xl shadow-2xl shadow-purple-500/20 flex items-center gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <UploadCloud className="w-4.5 h-4.5 text-purple-300" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Visual Guidance Saved</span>
                <button
                  onClick={() => setShowImageBriefToast(false)}
                  className="text-slate-400 hover:text-white transition-colors ml-2 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {imageBriefToastMsg}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ HEADER ══════════ */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-slate-200 dark:border-slate-800 glass-card">
        {/* Decorative background orbs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br from-brand-500/10 to-purple-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/10 to-blue-500/5 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          {/* Left: Title block */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
                  {t('strategyTitle', 'Marketing Strategy & Roadmap')}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  AI-generated 30-day growth blueprint for{' '}
                  <span className="font-bold text-slate-800 dark:text-white">{activeWorkspace.brandName}</span>
                </p>
                {activeWorkspace.currentStrategy?.campaignName && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold mt-1">
                    <Target className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Campaign Focus: <strong>{activeWorkspace.currentStrategy.campaignName}</strong></span>
                    <button
                      onClick={() => setActiveModule('campaigns')}
                      className="ml-1 text-[10.5px] underline hover:text-emerald-900 dark:hover:text-emerald-100 font-semibold"
                    >
                      Back to Campaign →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            {generatedDoc && (
              <div className="flex items-center gap-1 mt-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl p-1 w-fit flex-wrap">
                {[
                  { id: 'overview',   label: t('overviewTab', 'Overview'),   icon: BarChart2 },
                  { id: 'campaigns',  label: t('campaignsTab', 'Campaigns'),  icon: Megaphone },
                  { id: 'plan',       label: t('masterStrategyTab', '30 Day Strategy'), icon: Calendar  },
                  ...(customStrategy ? [{ id: 'custom', label: 'Custom Strategy', icon: Sparkles, isCustom: true }] : []),
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    } ${tab.isCustom ? 'text-purple-600 dark:text-purple-400' : ''}`}
                  >
                    <tab.icon className={`w-3.5 h-3.5 ${tab.isCustom ? 'text-purple-500' : ''}`} />
                    {tab.label}
                    {tab.isCustom && (
                      <span className="px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 text-[8px] font-black uppercase ml-0.5">AI</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end flex-wrap">
            <button
              onClick={() => setShowImageBriefModal(true)}
              className="group relative px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-extrabold text-xs tracking-wider border border-slate-200 dark:border-slate-700 hover:border-brand-500/50 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              title="Upload reference image and specify custom visual instructions for AI strategy"
            >
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm text-white">
                <UploadCloud className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Upload Image Brief</span>
            </button>

            {activeTab !== 'custom' && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="group relative px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                title={`Perform a deep AI Brand DNA re-analysis for ${activeWorkspace.brandName}`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Re-Analyzing Brand DNA...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-white transition-transform group-hover:rotate-180 duration-500" />
                    <span>Regenerate Strategy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ EMPTY STATE (NOT GENERATED) ══════════ */}
      {!generatedDoc && (
        <div className="text-center py-20 rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-700 mt-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-500/20 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-brand-500" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">Generate Your Master Strategy</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Click "Generate Master Strategy" to get an AI-powered growth blueprint, channel mix, and 30-day content calendar.
          </p>
          <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary text-sm flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl disabled:opacity-50 shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all">
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Strategy...</>
              : <><Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> Generate Master Strategy</>
            }
          </button>
        </div>
      )}

      {/* ══════════ TAB: OVERVIEW ══════════ */}
      {generatedDoc && activeTab === 'overview' && (
        <div className="space-y-6">

          {/* ROW 1: Objectives + Channel Mix */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left: 3 Objective Cards */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  {t('objectivesPathTitle', 'Objectives & Conversion Path')}
                </h2>
              </div>

              <div className="space-y-3">
                {objectiveCards.map(card => {
                  const IconComp  = card.icon;
                  const isEditing = editingField === card.key;
                  return (
                    <div key={card.key} className="group relative p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex gap-4">
                      <div className={`shrink-0 w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shadow-md ring-4 ring-slate-50 dark:ring-slate-900`}>
                        <IconComp className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${card.tagColor}`}>{card.tag}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{card.label}</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text" value={card.value}
                            onChange={e => card.setter(e.target.value)}
                            onBlur={() => { handleSave(); setEditingField(null); }}
                            onKeyDown={e => { if (e.key === 'Enter') { handleSave(); setEditingField(null); }}}
                            autoFocus className="flex-1 glass-input text-sm font-semibold py-2.5 w-full"
                          />
                        ) : (
                          <div onClick={() => setEditingField(card.key)} className="cursor-pointer flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors -ml-3">
                            <p className="text-[13px] font-semibold text-slate-800 dark:text-white leading-relaxed">{card.value}</p>
                            <Edit3 className="w-3.5 h-3.5 text-slate-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 pl-3 border-l-2 border-slate-100 dark:border-slate-800 font-medium">{card.sublabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Channel Mix */}
            <div className="lg:col-span-2">
              <div className="h-full p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <PieChart className="w-3 h-3 text-white" />
                    </div>
                    Channel Mix
                  </h2>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded-full">{totalPct}% Total</span>
                </div>

                {/* Donut */}
                <div className="flex justify-center mb-5">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      {(() => {
                        let offset = 0;
                        const r = 48;
                        const circ = 2 * Math.PI * r;
                        const grads = [['#8B5CF6','#6366F1'],['#3B82F6','#06B6D4'],['#F59E0B','#F97316'],['#EC4899','#F43F5E']];
                        return channelMix.map((ch, i) => {
                          const pct = ch.pct / totalPct;
                          const dash = pct * circ;
                          const gap  = circ - dash;
                          const cur  = offset;
                          offset += pct * circ;
                          const gid = `g${i}`;
                          return (
                            <React.Fragment key={ch.label}>
                              <defs><linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor={grads[i]?.[0] || '#6366F1'} />
                                <stop offset="100%" stopColor={grads[i]?.[1] || '#8B5CF6'} />
                              </linearGradient></defs>
                              <circle cx="60" cy="60" r={r} fill="none" stroke={`url(#${gid})`} strokeWidth="12"
                                strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-cur} strokeLinecap="round"
                                className="transition-all duration-1000 ease-out" />
                            </React.Fragment>
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{channelMix.length}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Channels</span>
                    </div>
                  </div>
                </div>

                {/* Channel list */}
                <div className="flex-1 space-y-3">
                  {channelMix.map(ch => {
                    let Icon = Globe;
                    if (ch.icon === 'Linkedin')  Icon = Linkedin;
                    if (ch.icon === 'Mail')       Icon = Mail;
                    if (ch.icon === 'Instagram')  Icon = Instagram;
                    const colors = channelColors[ch.icon] || channelColors.Globe;
                    return (
                      <div key={ch.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className={`shrink-0 w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center ring-2 ${colors.ring}`}>
                          <Icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{ch.label}</span>
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white ml-2">{ch.pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-1000`} style={{ width: `${ch.pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: AI Suggestions Row — Platforms | Frequency | Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Best Platforms */}
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Best Platforms</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {bestPlatforms.map((p, i) => {
                  const PIcon = getPlatformIcon(p);
                  return (
                    <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold ring-1 ${getPlatformColor(p)}`}>
                      <PIcon className="w-3 h-3" /> {p}
                    </span>
                  );
                })}
              </div>
              {bestPlatforms.length === 0 && (
                <p className="text-xs text-slate-400 italic">Generate strategy to get AI platform recommendations</p>
              )}
            </div>

            {/* Posting Frequency */}
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Posting Frequency</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{postingFrequency}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">AI Recommended</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Consistent publishing schedule optimized for {activeWorkspace.brandName}'s growth targets.
              </p>
            </div>

            {/* Budget */}
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Budget Strategy</h3>
              </div>
              <div className="space-y-2">
                {budgetSuggestions.split('/').map((part, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-brand-500' : 'bg-amber-500'}`} />
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">{part.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: Content Pillars + Target Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Content Pillars */}
            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-500" /> Content Pillars
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {contentPillars.map((pillar, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 text-[10px] font-extrabold shrink-0">{i + 1}</div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-500" /> Target Audience
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {(audience.length > 0 ? audience : (activeWorkspace.targetAudience || []).slice(0, 4)).map((persona, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 text-[10px] font-extrabold shrink-0">{i + 1}</div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{persona}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3.5: Custom Visual Directives & Uploaded Images */}
          <div className="p-6 rounded-2xl glass-card border border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-slate-900/5 to-transparent space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <ImageIcon className="w-3 h-3 text-white" />
                  </div>
                  Custom Visual Directives &amp; Uploaded Assets
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Reference images and specific visual instructions provided for strategy and visual asset creation
                </p>
              </div>
              <button
                onClick={() => setShowImageBriefModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Image Brief</span>
              </button>
            </div>

            {customImageBriefs && customImageBriefs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {customImageBriefs.map((brief) => (
                  <div key={brief.id} className="group relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex items-start gap-4 hover:border-purple-500/40 transition-all">
                    {brief.imageUrl ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                        <img src={brief.imageUrl} alt={brief.fileName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-8 h-8 text-purple-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{brief.fileName}</span>
                        <button
                          onClick={() => handleDeleteImageBrief(brief.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                          title="Delete image brief"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic leading-snug">
                        "{brief.directive || 'No specific text instruction provided.'}"
                      </p>
                      <span className="inline-block text-[10px] text-slate-400 font-semibold">{brief.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2 bg-slate-50/40 dark:bg-slate-800/20">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  No image reference briefs uploaded yet. Click <strong>Upload Image Brief</strong> to upload product photos or layout reference images and tell AI how to use them.
                </p>
              </div>
            )}
          </div>

          {/* ROW 4: Funnel Architecture */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-500" /> Marketing Funnel Architecture
              </h2>
              <span className="text-[10px] text-slate-400">Auto-mapped from {activeWorkspace.brandName}'s brand pillars</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {funnelStages.map((stage, i) => (
                <div key={stage.label} className={`p-5 rounded-2xl border ${stage.border} ${stage.bg} space-y-3 relative overflow-hidden`}>
                  <span className="absolute top-3 right-4 text-[40px] font-extrabold leading-none text-slate-200 dark:text-slate-800/60 select-none">{i+1}</span>
                  <div className="relative space-y-1.5">
                    <span className={`text-xs font-extrabold ${stage.text} block`}>{stage.label}</span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badge}`}>{stage.mix} Content Mix</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed relative">{stage.desc}</p>
                  <div className="space-y-1">
                    <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${stage.bar} ${stage.barW}`} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">Goal: {stage.goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ TAB: 30-DAY PLAN ══════════ */}
      {generatedDoc && activeTab === 'plan' && (
        <div className="space-y-5">

          {/* Week Summary Cards */}
          {thirtyDayPlan.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekStats.map(ws => (
                  <div
                    key={ws.week}
                    onClick={() => setSelectedWeek(selectedWeek === String(ws.week) ? 'ALL' : String(ws.week))}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                      selectedWeek === String(ws.week)
                        ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                        : 'border-slate-200 dark:border-slate-800 glass-card hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Week {ws.week}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${selectedWeek === String(ws.week) ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{ws.count} days</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">{ws.theme}</p>
                  </div>
                ))}
              </div>

              {/* Filter Bar */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  {selectedWeek === 'ALL' ? '30-Day Marketing Calendar' : `Week ${selectedWeek} Plan`}
                  <span className="text-[10px] bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full">{filteredPlan.length} days</span>
                </h2>
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  {['ALL','1','2','3','4'].map(w => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeek(w)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all duration-150 ${
                        selectedWeek === w
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {w === 'ALL' ? 'All' : `W${w}`}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 30-Day Plan Grid */}
          {filteredPlan.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPlan.map(item => {
                const PIcon = getPlatformIcon(item.platform);
                const week = getWeekLabel(item.day);
                const weekColors = ['from-violet-500 to-indigo-600','from-blue-500 to-cyan-500','from-emerald-500 to-teal-500','from-amber-500 to-orange-500'];
                return (
                  <div
                    key={item.day}
                    onClick={() => {
                      const platformRaw = (item.platform || 'instagram').toLowerCase();
                      const isEmail = platformRaw.includes('email') || platformRaw.includes('newsletter');
                      const isBlog = platformRaw.includes('blog') || platformRaw.includes('seo') || platformRaw.includes('article');
                      const type = isEmail ? 'EMAIL' : isBlog ? 'BLOG' : 'SOCIAL';
                      const platform = isEmail ? 'email' : isBlog ? 'blog' : platformRaw.includes('linkedin') ? 'linkedin' : platformRaw.includes('twitter') ? 'twitter' : 'instagram';

                      const brandName = activeWorkspace?.brandName || 'Brand';
                      const aspect = platform === 'instagram' ? '1:1' : '16:9';
                      const fullStrategyPrompt = item.actionItem ? `${item.topic}: ${item.actionItem}` : item.topic;
                      const imagePrompt = isEmail ? null : `${fullStrategyPrompt} — ${brandName} commercial marketing campaign photography, professional studio lighting, 8k resolution`;
                      const initialImageUrl = isEmail ? null : resolveBrandVisualAsset({
                        prompt: imagePrompt,
                        brandName: brandName,
                        topic: fullStrategyPrompt,
                        style: 'Photorealistic Commercial',
                        aspect: aspect,
                        variationIndex: item.day || 0
                      });

                      const payload = {
                        platform,
                        type,
                        postType: isEmail ? 'email' : 'image',
                        topic: item.topic,
                        hook: item.topic,
                        caption: item.actionItem || '',
                        customPrompt: item.actionItem || '',
                        strategyPillar: item.topic,
                        strategyDescription: item.actionItem || '',
                        calendarDay: item.day,
                        campaignStage: week === 1 ? 'Awareness' : week === 2 ? 'Consideration' : week === 3 ? 'Engagement' : 'Conversion',
                        imageUrl: isEmail ? null : initialImageUrl,
                        imagePrompt: isEmail ? null : imagePrompt,
                        imageStyle: isEmail ? null : 'Photorealistic Commercial',
                        imageAspect: isEmail ? null : aspect,
                      };

                      if (setGeneratedContent) {
                        setGeneratedContent(payload);
                      }

                      if (setStudioTarget) {
                        setStudioTarget({
                          platform,
                          topic: item.topic,
                          customPrompt: item.actionItem || '',
                          actionItem: item.actionItem || '',
                          postType: isEmail ? 'email' : 'image',
                          type,
                          autoGenerate: true,
                          generateVisual: !isEmail,
                          strategyPillar: item.topic,
                          strategyDescription: item.actionItem || '',
                          imageUrl: isEmail ? null : initialImageUrl,
                          imagePrompt: isEmail ? null : imagePrompt,
                          imageStyle: isEmail ? null : 'Photorealistic Commercial',
                          imageAspect: isEmail ? null : aspect,
                        });
                      }

                      setActiveModule('creativeStudio');
                    }}
                    className="group relative p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-xl transition-all duration-300 space-y-3 cursor-pointer"
                  >
                    {/* Day badge & Action Buttons */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${weekColors[week-1]} flex items-center justify-center shadow-sm text-white text-xs font-extrabold shrink-0`}>
                          {item.day}
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Day {item.day} · Week {week}</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${getPlatformColor(item.platform)}`}>
                            <PIcon className="w-2.5 h-2.5" />
                            {item.platform?.split('/')[0]?.trim() || 'Content'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action buttons: Regenerate & Draft Post */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenRegenDays(prev => ({ ...prev, [item.day]: !prev[item.day] }));
                          }}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all flex items-center gap-1 border ${
                            openRegenDays[item.day]
                              ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                              : 'text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 border-brand-500/20'
                          }`}
                          title="Regenerate strategy content for this card"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Regenerate</span>
                        </button>
                        <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Draft Post <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Topic */}
                    <div>
                      {loadingRegenDays[item.day] ? (
                        <div className="flex items-center gap-2 py-1 text-brand-600 dark:text-brand-400">
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          <span className="text-xs font-semibold animate-pulse">Regenerating strategy content...</span>
                        </div>
                      ) : (
                        <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{item.topic}</p>
                      )}
                    </div>

                    {/* Action item */}
                    {item.actionItem && !loadingRegenDays[item.day] && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <Play className="w-3 h-3 text-brand-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{item.actionItem}</p>
                      </div>
                    )}

                    {/* Inline Regenerate Input Box */}
                    {openRegenDays[item.day] && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900/95 border border-brand-500/30 shadow-lg space-y-2 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-brand-500" />
                            Strategy Content Directives
                          </label>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenRegenDays(prev => ({ ...prev, [item.day]: false }));
                            }}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={regenInputs[item.day] || ''}
                            onChange={(e) => {
                              e.stopPropagation();
                              setRegenInputs(prev => ({ ...prev, [item.day]: e.target.value }));
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleRegenerateCardItem(item, e);
                              }
                            }}
                            placeholder="Enter strategy content input (e.g. Focus on family recipe, vintage photo story)..."
                            className="flex-1 min-w-0 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                            autoFocus
                          />
                          <button
                            type="button"
                            disabled={loadingRegenDays[item.day]}
                            onClick={(e) => handleRegenerateCardItem(item, e)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-1 shrink-0 disabled:opacity-50"
                          >
                            {loadingRegenDays[item.day] ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3 h-3 fill-white" />
                                <span>Regenerate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}


        </div>
      )}

      {/* ══════════ TAB: CAMPAIGNS ══════════ */}
      {activeTab === 'campaigns' && (
        <div className="space-y-5">

          {/* Campaign Ideas */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-500" /> Campaign Ideas
              <span className="text-[10px] bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full">{campaignIdeas.length}</span>
            </h2>
            {campaignIdeas.length === 0 && (
              <div className="text-center py-16 rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-700">
                <Lightbulb className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">No Campaign Ideas Yet</h3>
                <p className="text-sm text-slate-500 mb-4">Generate your master strategy to get AI-powered campaign concepts.</p>
                <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary text-sm flex items-center gap-2 mx-auto px-5 py-2 rounded-xl disabled:opacity-50">
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> Generate Strategy
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignIdeas.map((idea, i) => {
                const gradients = [
                  'from-violet-500 to-indigo-600',
                  'from-emerald-500 to-teal-500',
                  'from-amber-500 to-orange-500',
                  'from-pink-500 to-rose-500',
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                ];
                return (
                  <div key={i} className="group relative p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center shadow-md shrink-0`}>
                        <Megaphone className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Campaign {i+1}</span>
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{idea.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-14">{idea.desc}</p>
                    <div className="pl-14 flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedCampaignIdea(idea); setCampaignDuration('30'); setBuildCampaignModal(true); }}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline transition-all hover:gap-2"
                      >
                        <ArrowUpRight className="w-3 h-3" /> Build Campaign
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Funnel (repeated here for campaign context) */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-500" /> Campaign Funnel Strategy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {funnelStages.map((stage, i) => (
                <div key={stage.label} className={`p-5 rounded-2xl border ${stage.border} ${stage.bg} space-y-3`}>
                  <div>
                    <span className={`text-xs font-extrabold ${stage.text} block`}>{stage.label}</span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${stage.badge}`}>{stage.mix} Content Mix</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ TAB: CUSTOM STRATEGY (30-DAY SOCIAL MEDIA POST GENERATION) ══════════ */}
      {activeTab === 'custom' && customStrategy && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Top Summary Banner */}
          <div className="p-6 rounded-3xl glass-card border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-slate-900/10 to-indigo-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                {customStrategy.imagePreviewUrl ? (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 border-2 border-purple-500/40 shadow-xl shrink-0">
                    <img src={customStrategy.imagePreviewUrl} alt="Uploaded Brief" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-10 h-10 text-purple-400" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" /> 30-Day Custom Strategy
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                      30 Posts Generated
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{customStrategy.timestamp}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    30-Day Custom Social Media Post Roadmap
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic max-w-xl">
                    Directive: "{customStrategy.directive}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                <button
                  onClick={() => {
                    if (customStrategy?.imagePreviewUrl && !imagePreviewUrl) {
                      setImagePreviewUrl(customStrategy.imagePreviewUrl);
                    }
                    if (customStrategy?.directive && !imageDirective) {
                      setImageDirective(customStrategy.directive);
                    }
                    handleGenerateCustomStrategy();
                  }}
                  disabled={isSubmittingImageBrief}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 disabled:opacity-60 disabled:pointer-events-none"
                  title="Regenerate dynamic 30-day post concepts for this custom strategy"
                >
                  {isSubmittingImageBrief ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Regenerating Custom Strategy...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-white transition-transform hover:rotate-180 duration-500" />
                      <span>Regenerate Custom Strategy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 30-Day Navigation & Filter Controls */}
          <div className="space-y-3 p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            {/* Week Filter Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-500" /> Filter By Week:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'ALL', label: 'All 30 Days (30 Posts)' },
                  { id: '1', label: 'Week 1: Awareness (Days 1–7)' },
                  { id: '2', label: 'Week 2: Value (Days 8–14)' },
                  { id: '3', label: 'Week 3: Engagement (Days 15–21)' },
                  { id: '4', label: 'Week 4: Conversion (Days 22–30)' },
                ].map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedCustomWeek(w.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCustomWeek === w.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-brand-500" /> Platform Filter:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['ALL', 'Instagram', 'Facebook', 'LinkedIn', 'Twitter / X', 'YouTube Shorts', 'Pinterest'].map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedCustomPlatform(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedCustomPlatform === p
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600'
                    }`}
                  >
                    {p === 'ALL' ? 'All Platforms' : p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-500" />
                30-Day Generated Posts ({
                  (customStrategy.posts || []).filter(post => {
                    const matchesWeek = selectedCustomWeek === 'ALL' || String(post.week) === selectedCustomWeek;
                    const matchesPlatform = selectedCustomPlatform === 'ALL' || post.platform.toLowerCase().includes(selectedCustomPlatform.toLowerCase());
                    return matchesWeek && matchesPlatform;
                  }).length
                } Posts Displayed)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Custom daily posts tailored to your uploaded reference image and instructions across 30 days
              </p>
            </div>
          </div>

          {/* 30 Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(customStrategy.posts || [])
              .filter(post => {
                const matchesWeek = selectedCustomWeek === 'ALL' || String(post.week) === selectedCustomWeek;
                const matchesPlatform = selectedCustomPlatform === 'ALL' || post.platform.toLowerCase().includes(selectedCustomPlatform.toLowerCase());
                return matchesWeek && matchesPlatform;
              })
              .map((post, idx) => {
                const PIcon = getPlatformIcon(post.platform);
                return (
                  <div
                    key={post.day || idx}
                    className="group relative p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Header: Day Badge, Platform & Week Tag */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md">
                            Day {post.day}
                          </div>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${getPlatformColor(post.platform)}`}>
                            <PIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{post.platform}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold">{post.format}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold border border-purple-500/20">
                          {post.weekTag}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug break-words">
                        {formatPostTitle(post.title, customStrategy?.directive)}
                      </h3>

                      {/* Visual Directive Box */}
                      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-1.5 shadow-sm">
                        <span className="text-[11px] font-black text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Visual Guidance &amp; Image Layout:
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
                          {post.visualDirective}
                        </p>
                      </div>

                      {/* Hook & Copy */}
                      <div className="space-y-3 p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div>
                          <span className="text-[10.5px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hook Line</span>
                          <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug break-words">{post.hook}</p>
                        </div>
                        <div>
                          <span className="text-[10.5px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Caption / Copywriting</span>
                          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mt-0.5 break-words">
                            {post.caption}
                          </p>
                        </div>
                      </div>

                      {/* CTA & Hashtags */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs pt-1">
                        <span className="font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                          CTA: {post.cta}
                        </span>
                        <span className="text-purple-700 dark:text-purple-300 font-extrabold break-words">
                          {post.hashtags}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`Day ${post.day} - ${post.platform}\n\n${post.hook}\n\n${post.caption}\n\n${post.cta}\n${post.hashtags}`);
                          showCustomAlert({ title: 'Copied to Clipboard!', message: `Day ${post.day} (${post.platform}) post copy copied successfully.`, type: 'success' });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Copy Copy</span>
                      </button>

                      <button
                        onClick={() => {
                          const cleanTitle = formatPostTitle(post.title, customStrategy?.directive);
                          const studioPayload = {
                            platform: post.platform,
                            type: 'SOCIAL',
                            postType: 'image',
                            topic: cleanTitle,
                            headline: cleanTitle,
                            hook: post.hook || cleanTitle,
                            caption: post.caption,
                            shortCaption: post.caption,
                            longCaption: post.caption,
                            visualDirective: post.visualDirective,
                            imagePrompt: post.visualDirective,
                            imageUrl: customStrategy?.imagePreviewUrl || null,
                            referenceImage: customStrategy?.imagePreviewUrl || null,
                            cta: post.cta,
                            hashtags: post.hashtags ? post.hashtags.split(' ') : [],
                            autoGenerate: true
                          };
                          if (setStudioTarget) {
                            setStudioTarget(studioPayload);
                          }
                          if (setGeneratedContent) {
                            setGeneratedContent({
                              data: studioPayload,
                              ...studioPayload
                            });
                          }
                          setActiveModule('creativeStudio');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Create in Studio →</span>
                      </button>
                    </div>

                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* ══════════ WORKFLOW ACTION BANNER ══════════ */}
        {/* ══════════ SCHEDULE CONTENT CALENDAR MODAL ══════════ */}
      {showScheduleModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto text-slate-900 dark:text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-500 dark:text-brand-400 shrink-0" />
                <span>Schedule Content Calendar</span>
              </h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 py-1">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter the number of days you would like to generate and populate in your Content Calendar from your Strategy Hub.
              </p>
              
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  How many days to schedule?
                </label>

                {/* Input with side suffix badge */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={thirtyDayPlan.length || 30}
                    value={scheduleDays}
                    onChange={(e) => setScheduleDays(e.target.value)}
                    className="flex-1 min-w-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm sm:text-base focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm transition-all"
                    placeholder="Enter days (e.g. 30)"
                  />
                  <span className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 font-black text-xs uppercase tracking-wider shrink-0">
                    Days
                  </span>
                </div>

                {/* Preset Quick Select Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Select:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[7, 14, 21, 30].map(d => {
                      const maxPlan = thirtyDayPlan.length || 30;
                      if (d > maxPlan) return null;
                      const isSelected = String(scheduleDays) === String(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setScheduleDays(String(d))}
                          className={`py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                            isSelected
                              ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {d} Days
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  Maximum available days from your strategy: <span className="font-extrabold text-brand-600 dark:text-brand-400">{thirtyDayPlan.length || 30} Days</span>.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmGenerateCalendar(scheduleDays)}
                disabled={isCreatingCalendarCampaign || !scheduleDays || Number(scheduleDays) < 1 || Number(scheduleDays) > (thirtyDayPlan.length || 30)}
                className="w-full sm:w-auto btn-primary text-xs flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed bg-brand-600 hover:bg-brand-500 text-white"
              >
                {isCreatingCalendarCampaign ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ══════════ BUILD CAMPAIGN MODAL ══════════ */}
      {buildCampaignModal && selectedCampaignIdea && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto">

            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shrink-0">
                  <Megaphone className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">Build Campaign</h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug break-words">{selectedCampaignIdea.title}</p>
                </div>
              </div>
              <button
                onClick={() => setBuildCampaignModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5">

              {/* Campaign Goal Preview */}
              <div className="p-3.5 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-0.5">Campaign Goal</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white leading-snug">{selectedCampaignIdea.desc}</p>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  Campaign Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={campaignDuration}
                    onChange={(e) => setCampaignDuration(e.target.value)}
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    placeholder="e.g. 30"
                  />
                  <span className="px-3.5 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 font-black text-xs uppercase tracking-wider shrink-0">Days</span>
                </div>
                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Quick:</span>
                  {[7, 14, 21, 30, 60, 90].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCampaignDuration(String(d))}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        campaignDuration === String(d)
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider with Optional label */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white dark:bg-slate-900 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    Or Choose Action
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Optional</span>
                  </span>
                </div>
              </div>

              {/* Action Options */}
              <div className="space-y-3">

                {/* Option 1: Enter Manually */}
                <button
                  onClick={() => {
                    setBuildCampaignModal(false);
                    setActiveModule('campaigns');
                  }}
                  className="w-full group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-brand-500/5 dark:hover:bg-brand-500/10 transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 group-hover:from-brand-500 group-hover:to-indigo-600 flex items-center justify-center shadow-sm shrink-0 transition-all duration-200">
                    <Edit3 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Enter Campaign Manually</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Set up goals, platforms &amp; schedule yourself in Campaign Builder</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 shrink-0 transition-colors" />
                </button>

                {/* Option 2: Generate Multiple Campaigns */}
                <button
                  onClick={() => {
                    setBuildCampaignModal(false);
                    setActiveModule('campaigns');
                  }}
                  className="w-full group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Generate Multiple Campaigns</p>
                      <span className="px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 text-[8px] font-extrabold uppercase tracking-wider">AI · 1 Month</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">AI generates full campaign suite for {activeWorkspace.brandName}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-500 shrink-0 transition-colors" />
                </button>

              </div>
            </div>

            {/* Modal Footer — Primary CTA */}
            <div className="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
              <button
                onClick={() => setBuildCampaignModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                Cancel
              </button>
              <button
                disabled={!campaignDuration || Number(campaignDuration) < 1}
                onClick={() => {
                  const days = Number(campaignDuration) || 30;
                  const goal = selectedCampaignIdea?.desc || '';
                  setBuildCampaignModal(false);
                  handleGenerateForCampaign(days, goal);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-extrabold shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Rocket className="w-4 h-4" />
                Proceed to Strategy
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ══════════ MODAL: UPLOAD IMAGE & CUSTOM DIRECTIVE ══════════ */}
      {showImageBriefModal && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-brand-500 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-500/20 text-white">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    Custom Image Visual Brief
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload an image asset &amp; describe how AI should utilize it for {activeWorkspace.brandName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImageBriefModal(false);
                  setUploadedImageFile(null);
                  setImagePreviewUrl('');
                  setImageDirective('');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">

              {/* 1. Image Upload Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-brand-500" />
                    1. Upload Reference Image
                  </span>
                  {imagePreviewUrl && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Image Loaded
                    </span>
                  )}
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreviewUrl ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 p-2 flex items-center justify-center max-h-56">
                    <img
                      src={imagePreviewUrl}
                      alt="Uploaded reference"
                      className="max-h-48 rounded-xl object-contain shadow-md"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImageFile(null);
                          setImagePreviewUrl('');
                        }}
                        className="p-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white shadow-lg transition-all cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleDropImage}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                      isDraggingFile
                        ? 'border-brand-500 bg-brand-500/10 scale-[0.99]'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to browse or drag &amp; drop reference image
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Supports PNG, JPG, JPEG, WebP, SVG, GIF (Max 10MB)
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Custom Guidance / Directive Input Box */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    2. What should AI do with this image? / Custom Directive
                  </span>
                </label>

                <textarea
                  rows={4}
                  value={imageDirective}
                  onChange={(e) => setImageDirective(e.target.value)}
                  placeholder="Tell us what you want us to do with the uploaded image (e.g. 'Use this product photo to design our main campaign poster', 'Extract product style & brand colors for Instagram post visuals', 'Incorporate this product showcase into our 30-day strategy')..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all resize-none"
                />

                {/* Quick Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Preset Directives:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Use as primary product focus in campaign posts",
                      "Extract brand style & logo for strategy visuals",
                      "Design promotional banner with custom text overlay",
                      "Incorporate product image into 30-day content plan"
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageDirective(prev => prev ? `${prev}\n${preset}` : preset)}
                        className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all text-left cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowImageBriefModal(false);
                  setUploadedImageFile(null);
                  setImagePreviewUrl('');
                  setImageDirective('');
                }}
                className="px-4 py-2.5 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmittingImageBrief || (!imagePreviewUrl && !imageDirective.trim())}
                onClick={handleGenerateCustomStrategy}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {isSubmittingImageBrief ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generating Custom Strategy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Generate Strategy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ══════════ STICKY FLOATING GENERATE CALENDAR BUTTON ══════════ */}
      {generatedDoc && activeTab === 'plan' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 shrink-0">
          <button 
            onClick={handleGenerateCalendar}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-2xl shadow-brand-600/40 border border-brand-400/30 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md whitespace-nowrap"
            title="Generate content calendar events from strategy"
          >
            <Calendar className="w-5 h-5 text-white shrink-0" />
            <span className="tracking-wide">Generate Calendar</span>
          </button>
        </div>
      )}

    </div>
  );
};
