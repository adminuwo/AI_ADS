/**
 * liveOnPageCrawler.agent.js
 * Agent 1: Live On-Page Crawler & Content Extractor
 * 
 * STRICT RULES:
 * - Scrapes the real live website HTML (Direct HTTP / Tavily anti-bot extract).
 * - Extracts from: <title>, <meta description>, <meta keywords>, <h1>, <h2>, <h3>, visible text, img[alt], a[href], Schema ld+json.
 * - Extracts EXACT text and surrounding snippets as evidence.
 * - Must NEVER invent keywords or hallucinate on-page content.
 * - All items labeled "VERIFIED ON-PAGE" (Green).
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { extractTavilyUrl, searchTavily } = require('../../../services/tavilyService');
const aiService = require('../../../services/aiService');

function normalizeUrl(inputUrl) {
  let url = (inputUrl || '').trim();
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

function deriveDomainHost(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (_) {
    return '';
  }
}

/**
 * Pure Deterministic HTML Scraper - extracts exact on-page elements with snippet evidence
 */
function extractDeterministicOnPageData($, targetUrl) {
  const verifiedList = [];
  const seenTerms = new Set();

  function addVerifiedKeyword({ term, source, tagSource, snippet, pageUrl }) {
    if (!term || typeof term !== 'string') return;
    const cleanTerm = term.trim().replace(/\s+/g, ' ');
    if (cleanTerm.length < 3 || cleanTerm.length > 120) return;
    const lower = cleanTerm.toLowerCase();
    if (seenTerms.has(lower)) return;
    seenTerms.add(lower);

    verifiedList.push({
      term: cleanTerm,
      pageUrl: pageUrl || targetUrl,
      source: source || 'On-Page Content',
      tagSource: tagSource || 'body',
      evidenceSnippet: snippet ? snippet.slice(0, 160) : `Extracted directly from <${tagSource}> on ${targetUrl}`,
      badge: 'VERIFIED ON-PAGE',
      trustColor: 'green',
      isVerifiedOnPage: true
    });
  }

  // 1. Page Title
  const pageTitle = $('title').text().trim().replace(/\s+/g, ' ');
  if (pageTitle) {
    addVerifiedKeyword({
      term: pageTitle,
      source: 'Page Title',
      tagSource: 'title',
      snippet: `<title>${pageTitle}</title>`,
      pageUrl: targetUrl
    });
  }

  // 2. Meta Description
  const metaDesc = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
  if (metaDesc) {
    addVerifiedKeyword({
      term: metaDesc.length > 80 ? metaDesc.slice(0, 80) + '...' : metaDesc,
      source: 'Meta Description',
      tagSource: 'meta[name="description"]',
      snippet: metaDesc,
      pageUrl: targetUrl
    });
  }

  // 3. Meta Keywords
  const metaKw = $('meta[name="keywords"]').attr('content') || '';
  if (metaKw) {
    metaKw.split(',').forEach(k => {
      const trimmed = k.trim();
      if (trimmed) {
        addVerifiedKeyword({
          term: trimmed,
          source: 'Meta Keywords',
          tagSource: 'meta[name="keywords"]',
          snippet: `meta keywords: "${trimmed}"`,
          pageUrl: targetUrl
        });
      }
    });
  }

  // 4. H1 Headings
  $('h1').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) {
      addVerifiedKeyword({
        term: text,
        source: 'H1 Heading',
        tagSource: 'h1',
        snippet: `<h1>${text}</h1>`,
        pageUrl: targetUrl
      });
    }
  });

  // 5. H2 Headings
  $('h2').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) {
      addVerifiedKeyword({
        term: text,
        source: 'H2 Subheading',
        tagSource: 'h2',
        snippet: `<h2>${text}</h2>`,
        pageUrl: targetUrl
      });
    }
  });

  // 6. H3 Headings
  $('h3').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) {
      addVerifiedKeyword({
        term: text,
        source: 'H3 Section',
        tagSource: 'h3',
        snippet: `<h3>${text}</h3>`,
        pageUrl: targetUrl
      });
    }
  });

  // 7. Image ALT texts
  $('img[alt]').each((_, el) => {
    const alt = $(el).attr('alt')?.trim();
    if (alt && alt.length > 3 && alt.length < 80) {
      addVerifiedKeyword({
        term: alt,
        source: 'Image ALT',
        tagSource: 'img[alt]',
        snippet: `<img alt="${alt}" src="${$(el).attr('src') || ''}" />`,
        pageUrl: targetUrl
      });
    }
  });

  // 8. Anchor Texts (Navigation & Key Links)
  $('nav a, header a, a[class*="nav"], a[class*="menu"]').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    const href = $(el).attr('href');
    if (text && text.length > 2 && text.length < 40 && !text.includes('http')) {
      addVerifiedKeyword({
        term: text,
        source: 'Navigation Anchor Text',
        tagSource: 'a[href]',
        snippet: `<a href="${href || '#'}">${text}</a>`,
        pageUrl: href && href.startsWith('http') ? href : targetUrl
      });
    }
  });

  // 9. Schema / Structured Data JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html());
      if (json.name) {
        addVerifiedKeyword({
          term: json.name,
          source: 'Schema Structured Data',
          tagSource: 'ld+json',
          snippet: `Schema @type: "${json['@type'] || 'WebPage'}" | name: "${json.name}"`,
          pageUrl: targetUrl
        });
      }
      if (json.headline) {
        addVerifiedKeyword({
          term: json.headline,
          source: 'Schema Headline',
          tagSource: 'ld+json',
          snippet: `Schema headline: "${json.headline}"`,
          pageUrl: targetUrl
        });
      }
    } catch (_) {}
  });

  return verifiedList;
}

/**
 * Main Crawler Agent Execution
 */
async function runLiveOnPageCrawlerAgent(params = {}) {
  const websiteUrl = typeof params === 'string' ? params : params.websiteUrl;
  let brandName = typeof params === 'object' ? params.brandName : arguments[1] || '';
  let industry = params.industry || '';

  const targetUrl = normalizeUrl(websiteUrl);
  console.log(`[Agent 1: LiveOnPageCrawler] 🕷️ Crawling live website: "${targetUrl || brandName}"...`);

  if (!targetUrl) {
    return {
      success: false,
      error: 'No URL provided',
      targetUrl: '',
      headings: { h1: [], h2: [], h3: [] },
      internalPages: [],
      onSiteKeywords: [],
      resolvedBrandName: brandName || 'Brand',
      resolvedIndustry: industry || 'General'
    };
  }

  let html = '';
  let crawlMethod = 'Direct HTTP Scraping';
  let bodyText = '';
  let headings = { h1: [], h2: [], h3: [] };
  let internalPages = [];
  let title = '';
  let metaDescription = '';

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000,
      maxRedirects: 5
    });
    html = response.data;
  } catch (err) {
    console.warn(`[Agent 1: LiveOnPageCrawler] Direct HTTP failed (${err.message}). Using Tavily extract...`);
    try {
      const tavRes = await extractTavilyUrl(targetUrl);
      if (tavRes?.rawContent && tavRes.rawContent.length > 100) {
        html = tavRes.rawContent;
        crawlMethod = 'Tavily Anti-Bot Live Extract';
      }
    } catch (_) {}
  }

  // If client-side rendered / sparse html, search Tavily for actual page content
  if (!html || html.length < 500) {
    try {
      const host = deriveDomainHost(targetUrl);
      const searchRes = await searchTavily(`site:${host} official website details`, 'advanced', 3);
      if (searchRes?.results?.length > 0) {
        bodyText = searchRes.results.map(r => `${r.title}: ${r.content || r.snippet}`).join('\n');
        crawlMethod = 'Tavily SERP & Page Synthesis';
      }
    } catch (_) {}
  }

  let verifiedOnPageKeywords = [];

  if (html) {
    const $ = cheerio.load(html);
    $('script:not([type="application/ld+json"]), style, noscript, svg, iframe').remove();

    title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

    $('h1').each((_, el) => { const t = $(el).text().trim(); if (t) headings.h1.push(t); });
    $('h2').each((_, el) => { const t = $(el).text().trim(); if (t && headings.h2.length < 12) headings.h2.push(t); });
    $('h3').each((_, el) => { const t = $(el).text().trim(); if (t && headings.h3.length < 12) headings.h3.push(t); });

    const domainHost = deriveDomainHost(targetUrl);
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      try {
        const fullLink = new URL(href, targetUrl);
        if (fullLink.hostname === domainHost && fullLink.pathname.length > 2) {
          if (!internalPages.includes(fullLink.pathname) && internalPages.length < 8) {
            internalPages.push(fullLink.pathname);
          }
        }
      } catch (_) {}
    });

    bodyText = $('body').text().replace(/\s+/g, ' ').slice(0, 4000);
    verifiedOnPageKeywords = extractDeterministicOnPageData($, targetUrl);
  }

  // Detect Brand & Industry dynamically from real scraped evidence
  let resolvedBrand = brandName;
  let resolvedIndustry = industry;

  const domainHost = deriveDomainHost(targetUrl);
  const brandPrompt = `You are a Technical Website Analyst.
Analyze the following LIVE SCRAPED DATA from website "${targetUrl}":
- Domain Host: "${domainHost}"
- Page Title: "${title}"
- Meta Description: "${metaDescription}"
- Top Headings: ${headings.h1.concat(headings.h2).slice(0, 6).join(' | ')}
- Body Excerpt: "${bodyText.slice(0, 1500)}"

TASK:
1. Determine the EXACT real Brand Name of this website (e.g. "HRX", "Shopify", "Nike", "HubSpot", "Nescafe").
2. Determine the EXACT Industry / Niche of this website (e.g. "Fitness & Activewear Apparel", "E-Commerce Software", "B2B SaaS Marketing").

Return a JSON with:
- "brandName": string
- "industry": string

Return ONLY valid JSON.`;

  try {
    const aiRes = await aiService.generateJSON(brandPrompt, { model: 'gemini-3.5-flash' });
    const data = aiRes?.data || aiRes;
    if (data?.brandName) resolvedBrand = data.brandName;
    if (data?.industry) resolvedIndustry = data.industry;
  } catch (_) {
    if (!resolvedBrand && domainHost) {
      resolvedBrand = domainHost.split('.')[0].toUpperCase();
    }
  }

  console.log(`[Agent 1: LiveOnPageCrawler] ✅ Crawled "${targetUrl}". Found ${verifiedOnPageKeywords.length} verified on-page keywords. Brand: "${resolvedBrand}" (${resolvedIndustry})`);

  return {
    success: true,
    targetUrl,
    crawlMethod,
    headings,
    internalPages,
    metaTitle: title,
    metaDescription,
    resolvedBrandName: resolvedBrand || 'Brand',
    resolvedIndustry: resolvedIndustry || 'General',
    onSiteKeywords: verifiedOnPageKeywords.slice(0, 15)
  };
}

module.exports = {
  runLiveOnPageCrawlerAgent,
  normalizeUrl,
  deriveDomainHost
};
