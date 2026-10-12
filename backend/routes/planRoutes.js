const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Plan = require('../models/Plan');
const Workspace = require('../models/Workspace');

// Official Platform Subscription Plans Database Seed Data
const DEFAULT_PLANS = [
  {
    planId: 'base',
    name: 'Starter Plan',
    badge: 'Starter',
    subtitle: 'Core AI text generation & 60 monthly visual credits for solo creators',
    priceUSD: 5.99,
    priceINR: 499,
    yearlyPriceINR: 399,
    yearlyPriceUSD: 4.99,
    prices: {
      INR: { primary: '₹499', period: '/month', secondary: '($5.99/mo)' },
      USD: { primary: '$5.99', period: '/month', secondary: '(₹499/mo)' },
      EUR: { primary: '€4.99', period: '/month', secondary: '($5.99/mo)' },
      GBP: { primary: '£4.49', period: '/month', secondary: '($5.99/mo)' },
      CAD: { primary: 'CA$7.99', period: '/month', secondary: '($5.99/mo)' },
      AUD: { primary: 'A$8.99', period: '/month', secondary: '($5.99/mo)' },
      AED: { primary: 'AED 21.99', period: '/month', secondary: '($5.99/mo)' },
    },
    yearlyPrices: {
      INR: { primary: '₹399', period: '/month', secondary: 'billed ₹4,788/yr' },
      USD: { primary: '$4.99', period: '/month', secondary: 'billed $59.88/yr' },
      EUR: { primary: '€3.99', period: '/month', secondary: 'billed €47.88/yr' },
      GBP: { primary: '£3.49', period: '/month', secondary: 'billed £41.88/yr' },
      CAD: { primary: 'CA$5.99', period: '/month', secondary: 'billed CA$71.88/yr' },
      AUD: { primary: 'A$6.99', period: '/month', secondary: 'billed A$83.88/yr' },
      AED: { primary: 'AED 17.99', period: '/month', secondary: 'billed AED 215.88/yr' },
    },
    billingCycle: 'monthly',
    imageCredits: 60,
    textGenerations: '1,000 Gens / mo',
    description: 'Core AI text generation & 60 monthly visual credits for solo creators',
    isPopular: false,
    order: 1,
    features: [
      '60 Monthly Visual Credits (Shared across workspaces)',
      '1,000 Text Generations / mo (Social Posts, Blogs, Emails & Ads)',
      '3 Brand DNA Workspaces (Website Scraper & Tone Ingestion)',
      '30-Day Marketing Roadmap Generator (Strategy Hub)',
      'SEO Intelligence (Keyword Clusters & Content Briefs)',
      'Content Studio (Social Copy, Blogs & Sales Copy Generators)',
      'AISA™ Copilot AI Assistant & Drag-and-Drop Calendar'
    ]
  },
  {
    planId: 'professional',
    name: 'Pro Plan',
    badge: 'Growth Tier',
    subtitle: 'Multi-brand DNA, 150 visual credits, Campaign Builder & Approvals Desk',
    priceUSD: 11.99,
    priceINR: 999,
    yearlyPriceINR: 799,
    yearlyPriceUSD: 9.99,
    prices: {
      INR: { primary: '₹999', period: '/month', secondary: '($11.99/mo)' },
      USD: { primary: '$11.99', period: '/month', secondary: '(₹999/mo)' },
      EUR: { primary: '€10.99', period: '/month', secondary: '($11.99/mo)' },
      GBP: { primary: '£9.49', period: '/month', secondary: '($11.99/mo)' },
      CAD: { primary: 'CA$15.99', period: '/month', secondary: '($11.99/mo)' },
      AUD: { primary: 'A$17.99', period: '/month', secondary: '($11.99/mo)' },
      AED: { primary: 'AED 43.99', period: '/month', secondary: '($11.99/mo)' },
    },
    yearlyPrices: {
      INR: { primary: '₹799', period: '/month', secondary: 'billed ₹9,588/yr' },
      USD: { primary: '$9.99', period: '/month', secondary: 'billed $119.88/yr' },
      EUR: { primary: '€8.99', period: '/month', secondary: 'billed €107.88/yr' },
      GBP: { primary: '£7.49', period: '/month', secondary: 'billed £89.88/yr' },
      CAD: { primary: 'CA$12.99', period: '/month', secondary: 'billed CA$155.88/yr' },
      AUD: { primary: 'A$14.99', period: '/month', secondary: 'billed A$179.88/yr' },
      AED: { primary: 'AED 34.99', period: '/month', secondary: 'billed AED 419.88/yr' },
    },
    billingCycle: 'monthly',
    imageCredits: 150,
    textGenerations: '3,000 Gens / mo',
    description: 'Multi-brand DNA, 150 visual credits, Campaign Builder & Approvals Desk',
    isPopular: false,
    order: 2,
    features: [
      '150 Monthly Visual Credits (Shared across workspaces)',
      '3,000 Text Generations / mo (Full Content & Copy Suite)',
      '7 Brand DNA Workspaces (Multi-Brand Tone & Scraping)',
      'Campaign Builder (Multi-Channel Planner & Post Generator)',
      'GTM (Go-To-Market) Strategy Engine Unlocked',
      'Approvals Desk (Content Review Queue & Workflows)',
      'Asset Library & Performance Dashboard (KPI Metrics)'
    ]
  },
  {
    planId: 'agency_pro',
    name: 'Agency Plan',
    badge: 'Most Popular',
    subtitle: '10 multi-client workspaces & 250 visual credits',
    priceUSD: 15.99,
    priceINR: 1299,
    yearlyPriceINR: 999,
    yearlyPriceUSD: 12.99,
    prices: {
      INR: { primary: '₹1,299', period: '/month', secondary: '($15.99/mo)' },
      USD: { primary: '$15.99', period: '/month', secondary: '(₹1,299/mo)' },
      EUR: { primary: '€14.49', period: '/month', secondary: '($15.99/mo)' },
      GBP: { primary: '£12.49', period: '/month', secondary: '($15.99/mo)' },
      CAD: { primary: 'CA$21.99', period: '/month', secondary: '($15.99/mo)' },
      AUD: { primary: 'A$23.99', period: '/month', secondary: '($15.99/mo)' },
      AED: { primary: 'AED 58.99', period: '/month', secondary: '($15.99/mo)' },
    },
    yearlyPrices: {
      INR: { primary: '₹999', period: '/month', secondary: 'billed ₹11,988/yr' },
      USD: { primary: '$12.99', period: '/month', secondary: 'billed $155.88/yr' },
      EUR: { primary: '€11.49', period: '/month', secondary: 'billed €137.88/yr' },
      GBP: { primary: '£9.99', period: '/month', secondary: 'billed £119.88/yr' },
      CAD: { primary: 'CA$17.99', period: '/month', secondary: 'billed CA$215.88/yr' },
      AUD: { primary: 'A$19.99', period: '/month', secondary: 'billed A$239.88/yr' },
      AED: { primary: 'AED 46.99', period: '/month', secondary: 'billed AED 563.88/yr' },
    },
    billingCycle: 'monthly',
    imageCredits: 250,
    textGenerations: '8,000 Gens / mo',
    description: '10 multi-client workspaces & 250 visual credits',
    isPopular: true,
    order: 3,
    features: [
      '250 Monthly Visual Credits (Shared across workspaces)',
      '8,000 Text Generations / mo (High-Volume Strategy & Copy)',
      '10 Brand DNA Workspaces & Multi-Client Access',
      'AI Website Builder Unlocked (3 Websites / mo Limit)',
      'Strategy Image Briefs (3 Generations / mo Limit)',
      'SEO Competitor Gaps & Opportunities Unlocked',
      'GEO Regional Targeting Unlocked'
    ]
  },
  {
    planId: 'enterprise',
    name: 'Enterprise Plan',
    badge: 'Enterprise',
    subtitle: 'High-volume generation, 600 visual credits & unlimited AI text generation',
    priceUSD: 29.99,
    priceINR: 2499,
    yearlyPriceINR: 1999,
    yearlyPriceUSD: 23.99,
    prices: {
      INR: { primary: '₹2,499', period: '/month', secondary: '($29.99/mo)' },
      USD: { primary: '$29.99', period: '/month', secondary: '(₹2,499/mo)' },
      EUR: { primary: '€26.99', period: '/month', secondary: '($29.99/mo)' },
      GBP: { primary: '£22.99', period: '/month', secondary: '($29.99/mo)' },
      CAD: { primary: 'CA$39.99', period: '/month', secondary: '($29.99/mo)' },
      AUD: { primary: 'A$44.99', period: '/month', secondary: '($29.99/mo)' },
      AED: { primary: 'AED 109.99', period: '/month', secondary: '($29.99/mo)' },
    },
    yearlyPrices: {
      INR: { primary: '₹1,999', period: '/month', secondary: 'billed ₹23,988/yr' },
      USD: { primary: '$23.99', period: '/month', secondary: 'billed $287.88/yr' },
      EUR: { primary: '€21.99', period: '/month', secondary: 'billed €263.88/yr' },
      GBP: { primary: '£18.49', period: '/month', secondary: 'billed £221.88/yr' },
      CAD: { primary: 'CA$31.99', period: '/month', secondary: 'billed CA$383.88/yr' },
      AUD: { primary: 'A$35.99', period: '/month', secondary: 'billed A$431.88/yr' },
      AED: { primary: 'AED 87.99', period: '/month', secondary: 'billed AED 1,055.88/yr' },
    },
    billingCycle: 'monthly',
    imageCredits: 600,
    textGenerations: 'Unlimited',
    description: 'High-volume generation, 600 visual credits & unlimited AI text generation',
    isPopular: false,
    order: 4,
    features: [
      '600 Monthly Visual Credits (Shared across workspaces)',
      'UNLIMITED Text Generations (Uncapped AI Content Engine)',
      'Unlimited Brand Workspaces & Priority Processing',
      'AI Web Builder with Live Chat Edit (Real-Time Code Tweaking)',
      'Strategy Image Briefs (Unlimited Generations)',
      'All Core Platform Modules Included (Strategy, SEO, Content, Web & Ads)'
    ]
  }
];

// ─── Memory Fallback Store ──────────────────────────────────────────────────
let memoryPlans = [...DEFAULT_PLANS];

// Helper: Seed/Sync plans into MongoDB database
const ensurePlansSeeded = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Plan.deleteMany({});
      await Plan.insertMany(DEFAULT_PLANS);
      console.log('[Plans Engine] Seeded latest subscription plans & feature checklists into MongoDB!');
    }
  } catch (err) {
    console.warn('[Plans Engine] MongoDB plan seed note:', err.message);
  }
};

const { optionalAuth, requireAuth } = require('../middleware/auth');

// ─── GET /api/plans ─────────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    await ensurePlansSeeded();

    // Check if requester is authenticated and has Developer role with custom plans
    if (req.user && req.user.role && req.user.role.toLowerCase() === 'developer') {
      const User = require('../models/User');
      const devUser = await User.findById(req.user.userId || req.user._id).select('customPlans role');
      if (devUser && Array.isArray(devUser.customPlans) && devUser.customPlans.length > 0) {
        return res.json({ success: true, plans: devUser.customPlans, isDeveloperCustom: true });
      }
    }

    let plans = [];
    if (mongoose.connection.readyState === 1) {
      plans = await Plan.find({}).sort({ order: 1 });
    }
    if (!plans || plans.length === 0) {
      plans = memoryPlans;
    }
    res.json({ success: true, plans, isDeveloperCustom: false });
  } catch (err) {
    console.error('[Get Plans Error]:', err.message);
    res.json({ success: true, plans: memoryPlans, isDeveloperCustom: false });
  }
});

// ─── POST /api/plans/developer-custom ─────────────────────────────────────────
router.post('/developer-custom', requireAuth, async (req, res) => {
  try {
    const userRole = (req.user?.role || '').toLowerCase();
    if (userRole !== 'developer') {
      return res.status(403).json({
        success: false,
        error: 'Only Developer role accounts can edit and save custom subscription plans.'
      });
    }

    const { plans } = req.body || {};
    if (!Array.isArray(plans) || plans.length === 0) {
      return res.status(400).json({ success: false, error: 'A valid array of custom plans is required.' });
    }

    const User = require('../models/User');
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId || req.user._id,
      { customPlans: plans },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Developer custom plans saved! These plan modifications are private and visible exclusively to your developer account.',
      customPlans: updatedUser.customPlans
    });
  } catch (err) {
    console.error('[Save Developer Custom Plans Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/plans/developer-custom/reset ─────────────────────────────────
router.post('/developer-custom/reset', requireAuth, async (req, res) => {
  try {
    const userRole = (req.user?.role || '').toLowerCase();
    if (userRole !== 'developer') {
      return res.status(403).json({
        success: false,
        error: 'Only Developer role accounts can reset custom subscription plans.'
      });
    }

    const User = require('../models/User');
    await User.findByIdAndUpdate(
      req.user.userId || req.user._id,
      { customPlans: [] }
    );

    res.json({
      success: true,
      message: 'Reset custom developer plans to platform default plans.'
    });
  } catch (err) {
    console.error('[Reset Developer Custom Plans Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/plans/subscribe ──────────────────────────────────────────────
router.post('/subscribe', async (req, res) => {
  const { workspaceId, planId, userEmail } = req.body || {};
  try {
    await ensurePlansSeeded();
    let targetPlan = null;

    if (mongoose.connection.readyState === 1) {
      targetPlan = await Plan.findOne({ planId });
    }
    if (!targetPlan) {
      targetPlan = memoryPlans.find(p => p.planId === planId || (p.planId === 'base' && planId === 'starter')) || memoryPlans[0];
    }

    if (mongoose.connection.readyState === 1) {
      if (workspaceId && mongoose.Types.ObjectId.isValid(workspaceId)) {
        await Workspace.findByIdAndUpdate(workspaceId, {
          subscriptionTier: targetPlan.name,
          visualCredits: targetPlan.imageCredits
        });
      } else {
        await Workspace.updateMany({}, {
          subscriptionTier: targetPlan.name,
          visualCredits: targetPlan.imageCredits
        });
      }

      const User = require('../models/User');
      if (userEmail) {
        await User.findOneAndUpdate({ email: userEmail }, {
          plan: targetPlan.planId,
          subscriptionTier: targetPlan.name,
          credits: targetPlan.imageCredits
        });
      } else {
        await User.updateMany({}, {
          plan: targetPlan.planId,
          subscriptionTier: targetPlan.name,
          credits: targetPlan.imageCredits
        });
      }
    }

    res.json({
      success: true,
      message: `Successfully subscribed to ${targetPlan.name} plan. MongoDB database updated!`,
      plan: targetPlan
    });
  } catch (err) {
    console.error('[Subscribe Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
