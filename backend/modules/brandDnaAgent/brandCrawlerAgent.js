/**
 * Sub-Agent 1: Live Web Crawler & Provenance DOM Scraper Agent
 * Path: backend/modules/brandDnaAgent/brandCrawlerAgent.js
 * 
 * Role: Technical Web Collector & Data Extraction Agent
 * Responsibility: Live website crawling, anti-bot bypass, Cheerio DOM cleanup, JSON-LD schema parsing.
 */

const { scrapeBrandWebsite } = require('../workspace/brandScraper.service');
const { resolveBrandName, resolveHeadquartersAndLocations, resolveContactInformation } = require('../workspace/brandProcessor.service');
const { recordTelemetryEvent } = require('../../services/telemetryService');
let searchTavily = async () => null;
try {
  const tav = require('../../services/tavilyService');
  if (tav && tav.searchTavily) searchTavily = tav.searchTavily;
} catch (e) {}

async function runCrawlerAgent(targetUrl, seedBrandName = '') {
  console.log(`[CrawlerAgent] 🔍 Initiating live crawl for: ${targetUrl}`);
  
  try {
    recordTelemetryEvent({
      component: 'BrandDnaAgent:Crawler',
      action: 'CRAWL_START',
      details: { targetUrl, seedBrandName }
    });
  } catch (e) {}

  const scrapedMetadata = await scrapeBrandWebsite(targetUrl, seedBrandName);
  const rawUrl = scrapedMetadata.cleanUrl || targetUrl;
  const domainName = scrapedMetadata.domainName || '';

  // Resolve Brand Name & HQ using provenance rules
  const brandNameObj = resolveBrandName(scrapedMetadata, seedBrandName, domainName);
  const combinedText = ((domainName || '') + ' ' + (scrapedMetadata.headings || []).join(' ') + ' ' + (scrapedMetadata.metaDescription || '') + ' ' + (scrapedMetadata.aboutPageText || '') + ' ' + (scrapedMetadata.deepContextText || '')).toLowerCase();
  let hqObj = resolveHeadquartersAndLocations(domainName, brandNameObj.value.toLowerCase(), scrapedMetadata, combinedText, rawUrl);
  const contactObj = resolveContactInformation(scrapedMetadata, rawUrl);

  let parentCompanyObj = { value: null, status: 'UNKNOWN', sourceType: 'UNKNOWN', evidence: 'No explicit parent company evidence in website DOM', confidence: 0 };
  if (scrapedMetadata.parentCompany) {
    parentCompanyObj = {
      value: scrapedMetadata.parentCompany,
      status: 'VERIFIED',
      sourceType: 'WEBSITE_DOM',
      evidence: `Found parent corporate entity in website DOM: "${scrapedMetadata.parentCompany}"`,
      confidence: 0.90
    };
  }

  // Fallback 1: Web Search Enrichment via Tavily if HQ or Parent Company is missing from site DOM
  if (!hqObj.headquarters.value || hqObj.headquarters.confidence < 0.5) {
    try {
      const cleanSearchBrand = (brandNameObj.value || '').replace(/[™®©]/g, '').trim();
      const parentName = (parentCompanyObj?.value || scrapedMetadata.parentCompany || scrapedMetadata.legalName || '').replace(/[™®©]/g, '').trim();
      const legalQuery = parentName && parentName.toLowerCase() !== cleanSearchBrand.toLowerCase()
        ? `"${cleanSearchBrand}" OR "${parentName}" corporate headquarters location address city country`
        : `"${cleanSearchBrand}" corporate headquarters location address city country`;

      const searchPromise = searchTavily(legalQuery, 'advanced', 4);
      const searchRes = await Promise.race([
        searchPromise,
        new Promise(resolve => setTimeout(() => resolve(null), 8000))
      ]);
      if (searchRes && (searchRes.answer || (searchRes.results && searchRes.results.length > 0))) {
        // Collect candidate text snippets that are STRICTLY RELEVANT to cleanSearchBrand or parentName
        const entityTokens = [
          cleanSearchBrand.toLowerCase(),
          parentName.toLowerCase(),
          cleanSearchBrand.toLowerCase().replace(/\s+/g, ''),
          parentName.toLowerCase().replace(/\s+/g, '')
        ].filter(t => t && t.length >= 3);

        const relevantSnippets = (searchRes.results || [])
          .map(r => r.snippet || '')
          .filter(snippet => {
            if (!snippet || snippet.length < 15) return false;
            const lowerSnippet = snippet.toLowerCase();
            return entityTokens.some(token => lowerSnippet.includes(token));
          });

        let answerText = '';
        if (searchRes.answer && typeof searchRes.answer === 'string') {
          const lowerAns = searchRes.answer.toLowerCase();
          if (entityTokens.some(token => lowerAns.includes(token))) {
            answerText = searchRes.answer;
          }
        }

        const filteredText = (answerText + ' ' + relevantSnippets.join(' ')).trim();
        if (filteredText.length > 10) {
          scrapedMetadata.searchEnrichmentText = filteredText;
          const searchHq = resolveHeadquartersAndLocations(
            domainName,
            cleanSearchBrand.toLowerCase(),
            {
              deepContextText: filteredText,
              searchEnrichmentText: filteredText,
              parentCompany: parentName
            },
            filteredText,
            rawUrl
          );
          if (searchHq?.headquarters?.value) {
            hqObj = searchHq;
            hqObj.headquarters.sourceType = 'SEARCH_ENRICHMENT';
            hqObj.headquarters.evidence = `Retrieved via web search enrichment: "${(answerText || relevantSnippets[0] || '').slice(0, 150)}"`;
            console.log(`[CrawlerAgent] ✅ HQ Enriched via Web Search: "${hqObj.headquarters.value}"`);
          } else {
            console.log(`[CrawlerAgent] ℹ️ Web Search results found but no verified physical HQ address. Keeping HQ as null.`);
          }
        } else {
          console.log(`[CrawlerAgent] ℹ️ Web Search returned no entity-grounded HQ snippets for "${cleanSearchBrand}". Safely falling back to null.`);
        }
      }
    } catch (err) {
      console.log(`[CrawlerAgent] Web Search HQ enrichment note: ${err.message}`);
    }
  }

  // Ensure contactObj is populated with discovered location, phone, and email
  if (hqObj?.headquarters?.value) {
    if (!contactObj.value) {
      contactObj.value = {
        email: scrapedMetadata.emails?.[0] || scrapedMetadata.schemaEmail || null,
        phone: scrapedMetadata.phones?.[0] || scrapedMetadata.schemaTelephone || null,
        location: hqObj.headquarters.value
      };
      contactObj.sourceType = hqObj.headquarters.sourceType || 'WEBSITE_DOM';
      contactObj.confidence = 0.85;
    } else if (!contactObj.value.location) {
      contactObj.value.location = hqObj.headquarters.value;
    }
  }
  if (scrapedMetadata.phones?.[0] && contactObj.value && !contactObj.value.phone) {
    contactObj.value.phone = scrapedMetadata.phones[0];
  }
  if (scrapedMetadata.emails?.[0] && contactObj.value && !contactObj.value.email) {
    contactObj.value.email = scrapedMetadata.emails[0];
  }

  // Extract Core Product / Category Signals
  const rawCandidates = [
    ...(scrapedMetadata.navCategories || []),
    ...(scrapedMetadata.headings || []),
    ...(scrapedMetadata.aboutPageHeadings || [])
  ];

  const coreProducts = Array.from(new Set(
    rawCandidates
      .filter(c => typeof c === 'string' && c.trim().length > 3 && !/^(home|index|about|contact|login|register|cart|checkout|privacy|terms)$/i.test(c.trim()))
      .slice(0, 8)
  ));

  console.log(`[CrawlerAgent] ✅ Crawl & Extraction complete. Core Products: ${coreProducts.length}, HQ: "${hqObj.headquarters.value || 'N/A'}"`);

  return {
    rawUrl,
    domainName,
    brandNameObj,
    parentCompanyObj,
    hqObj: hqObj.headquarters,
    contactObj,
    coreProducts,
    scrapedMetadata,
    combinedText
  };
}

module.exports = { runCrawlerAgent };
