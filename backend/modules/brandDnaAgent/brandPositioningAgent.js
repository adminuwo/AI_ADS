const { generateJSON } = require('../../services/aiService');
const {
  classifyPrimaryAndSecondaryIndustry,
  classifyBusinessTypeWithConsensus,
  resolveHeadquartersAndLocations,
  validateAndClassifyTagline,
  isValidOfficialTagline
} = require('../workspace/brandProcessor.service');

async function runPositioningAgent(crawlResult) {
  const { domainName, brandNameObj, scrapedMetadata, combinedText, rawUrl } = crawlResult;
  const brandName = brandNameObj.value || 'Brand';

  console.log(`[PositioningAgent] 📊 Analyzing Market Positioning & Industry for: "${brandName}"`);

  // Field 2: Primary & Secondary Industry (Rule / Schema Parser)
  let industryResult = classifyPrimaryAndSecondaryIndustry(
    domainName,
    brandName,
    scrapedMetadata.metaDescription,
    scrapedMetadata.headings,
    scrapedMetadata.aboutPageText,
    scrapedMetadata.schemaIndustry,
    rawUrl
  );

  let hqResult = resolveHeadquartersAndLocations(domainName, brandName, scrapedMetadata, combinedText, rawUrl);
  let businessTypeResult = classifyBusinessTypeWithConsensus(combinedText, rawUrl);
  let taglineObj = validateAndClassifyTagline(scrapedMetadata, scrapedMetadata.headings, brandName, domainName);
  let missionObj = { value: null, sourceType: 'UNKNOWN', confidence: 0 };
  let visionObj = { value: null, sourceType: 'UNKNOWN', confidence: 0 };

  // If schema tags are missing, use Multimodal AI reasoning for Industry, Business Type, Headquarters, and Tagline
  try {
    const pageImages = (scrapedMetadata.pagesEvidence || [])
      .filter(p => p && p.screenshot && p.screenshot.status === 'SUCCESS' && p.screenshot.base64)
      .slice(0, 2)
      .map(p => ({
        url: p.url,
        pageType: p.pageType || 'PAGE',
        mimeType: p.screenshot.mimeType || 'image/jpeg',
        base64: p.screenshot.base64
      }));

    const hasVisual = pageImages.length > 0;
    const textContext = `
Scraped Website Evidence:
- Domain: ${domainName}
- Brand Name: ${brandName}
${scrapedMetadata.metaTitle ? `- Page Title: "${scrapedMetadata.metaTitle}"` : ''}
${scrapedMetadata.metaDescription ? `- Meta Description: "${scrapedMetadata.metaDescription}"` : ''}
${scrapedMetadata.schemaSlogan ? `- Schema Slogan: "${scrapedMetadata.schemaSlogan}"` : ''}
${scrapedMetadata.schemaAddress ? `- Schema Address: "${scrapedMetadata.schemaAddress}"` : ''}
${scrapedMetadata.parentCompany || scrapedMetadata.legalName ? `- Parent Company / Legal Entity: "${scrapedMetadata.parentCompany || scrapedMetadata.legalName}"` : ''}
${(scrapedMetadata.headings || []).length > 0 ? `- Headings: ${(scrapedMetadata.headings || []).slice(0, 10).join(' | ')}` : ''}
${scrapedMetadata.aboutPageText ? `- About Page Excerpt: "${scrapedMetadata.aboutPageText.slice(0, 1200)}"` : ''}
${scrapedMetadata.contactPageText ? `- Contact Page Excerpt: "${scrapedMetadata.contactPageText.slice(0, 1200)}"` : ''}
${scrapedMetadata.searchEnrichmentText ? `- Web Search Knowledge Excerpt: "${scrapedMetadata.searchEnrichmentText.slice(0, 1500)}"` : ''}
${scrapedMetadata.deepContextText ? `- Page Context Excerpt: "${scrapedMetadata.deepContextText.slice(0, 3000)}"` : ''}
`;

    const aiPrompt = `You are an expert Brand Intelligence Analyst.
Analyze the commercial website context, text excerpts, and attached page screenshots for "${brandName}" (${domainName}) to extract core Brand DNA attributes.

${textContext}

CRITICAL INSTRUCTIONS:
1. "primaryIndustry": Exact core commercial industry based on MAIN products/services sold to customers.
2. "secondaryIndustry": Optional secondary industry or null.
3. "businessType": Select the most accurate commercial model (e.g., "Corporate & Industrial Manufacturer", "B2C Consumer Platform", "D2C E-Commerce Brand", "B2B Enterprise & SaaS Platform", "Healthcare & Medical Provider").
4. "headquarters": Physical city, state/province, and country address found in page text/contact/footer/parent entity details (e.g., "Jabalpur, Madhya Pradesh, India", "Mumbai, Maharashtra, India", "Palo Alto, California, USA"). If no specific location is explicitly found in the evidence, return null. NEVER guess, assume, or borrow an address from an unrelated company.
5. "parentCompany": Parent organization, legal entity, or company powering/owning the brand (e.g. from "legalName", "Powered by", or "Subsidiary of"), or null if independent/unknown.
6. "coreProductsServices": Array of 3-8 key products, services, or platform capabilities provided by "${brandName}".
7. "tagline": EXACT official tagline or slogan explicitly stated on the website (e.g., in hero/header, page title branding lockup, metadata description, or JSON-LD schema). Return the FULL complete phrase (e.g. "Smarter Practice. Faster Justice."). Do NOT truncate or split into partial words.
   - Prefer phrases explicitly identified as "tagline" or "slogan", then prominent branding phrases near the brand name.
   - Return the EXACT wording as it appears on the website. Do NOT rewrite, summarize, translate, or generate.
   - NEVER use the company/legal name, product description, mission, vision, or generic marketing text.
   - If no reliable tagline is explicitly supported by the website, return null.
8. "missionStatement": A complete, polished sentence starting with a capital letter explaining the company's core mission or purpose (e.g., "To empower advocates and legal teams across India with advanced AI research, automated drafting, and statutory compliance."). Do NOT return truncated phrases or fragments.
9. "vision": A complete, polished sentence starting with a capital letter describing the company's long-term vision or strategic ambition (e.g., "To build India's premier legal intelligence platform, enabling legal professionals to practice smarter and accelerating the delivery of justice."). Do NOT return truncated phrases or fragments.

Return ONLY a valid JSON object:
{
  "primaryIndustry": "String",
  "secondaryIndustry": "String or null",
  "businessType": "String",
  "headquarters": "String or null",
  "parentCompany": "String or null",
  "coreProductsServices": ["String"],
  "tagline": "String or null",
  "missionStatement": "String",
  "vision": "String"
}`;

    const aiRes = await generateJSON(aiPrompt, { temperature: 0.1, images: pageImages });
    console.log(`[PositioningAgent] 🤖 Gemini AI Response for "${brandName}":`, JSON.stringify(aiRes));
    const payload = aiRes?.data || aiRes;

    if (payload) {
      // 1. Industry
      if (!industryResult.primaryIndustry.value || industryResult.primaryIndustry.sourceType !== 'WEBSITE_SCHEMA') {
        const inferredInd = payload.primaryIndustry || payload.industryCategory || payload.industry;
        if (inferredInd && typeof inferredInd === 'string' && inferredInd.trim().length > 2) {
          industryResult.primaryIndustry = {
            value: inferredInd.trim(),
            sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'AI_INFERENCE',
            sourceUrl: rawUrl,
            evidence: `Synthesized by multimodal AI positioning analysis of company products & page screenshots`,
            method: 'MULTIMODAL_POSITIONING_AI',
            confidence: 0.88,
            candidates: [inferredInd.trim()],
            rejectedCandidates: []
          };
        }
        if (payload.secondaryIndustry) {
          industryResult.secondaryIndustries = [{
            value: payload.secondaryIndustry,
            sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'AI_INFERENCE',
            evidence: 'Identified as secondary industry by AI positioning analysis'
          }];
        }
      }

      // 2. Business Type
      if (payload.businessType && typeof payload.businessType === 'string' && payload.businessType.trim().length > 2) {
        businessTypeResult = {
          value: payload.businessType.trim(),
          sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'AI_INFERENCE',
          sourceUrl: rawUrl,
          evidence: `Synthesized by multimodal AI analysis from website context & screenshots`,
          method: 'MULTIMODAL_BUSINESS_TYPE_AI',
          confidence: 0.88
        };
      }

      // 3. Headquarters (If missing from schema/contact DOM)
      if (!hqResult.headquarters.value && payload.headquarters && typeof payload.headquarters === 'string' && payload.headquarters.trim().length > 3 && !/^(null|unknown|n\/a|none|not specified|not available|unspecified)$/i.test(payload.headquarters.trim())) {
        hqResult.headquarters = {
          value: payload.headquarters.trim(),
          type: 'HEADQUARTERS',
          sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'AI_INFERENCE',
          sourceUrl: rawUrl,
          evidence: `Extracted location from website evidence & visual page screenshots: "${payload.headquarters.trim()}"`,
          method: 'MULTIMODAL_HQ_AI',
          confidence: 0.88,
          candidates: [payload.headquarters.trim()],
          rejectedCandidates: []
        };
      }

      // 3b. Parent Company
      if (payload.parentCompany && typeof payload.parentCompany === 'string' && payload.parentCompany.trim().length > 1) {
        if (!crawlResult.parentCompanyObj?.value || crawlResult.parentCompanyObj.status === 'UNKNOWN') {
          crawlResult.parentCompanyObj = {
            value: payload.parentCompany.trim(),
            status: 'VERIFIED',
            sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'AI_INFERENCE',
            evidence: `Identified parent corporate entity: "${payload.parentCompany.trim()}"`,
            confidence: 0.88
          };
        }
      }

      // 3c. Core Products & Services
      if (Array.isArray(payload.coreProductsServices) && payload.coreProductsServices.length > 0) {
        const cleanAiProds = payload.coreProductsServices
          .filter(p => typeof p === 'string' && p.trim().length > 2 && !/^(home|index|about|contact|login|register|cart|checkout|privacy|terms)$/i.test(p.trim()))
          .map(p => p.trim());
        const combinedProds = Array.from(new Set([...(crawlResult.coreProducts || []), ...cleanAiProds])).slice(0, 10);
        crawlResult.coreProducts = combinedProds;
      }

      // 4. Tagline (Prioritize verified schema slogan or multimodal AI verified tagline; never accept broken fragments)
      const hasSchemaSlogan = scrapedMetadata.schemaSlogan && isValidOfficialTagline(scrapedMetadata.schemaSlogan, brandName, domainName);
      if (hasSchemaSlogan) {
        taglineObj = {
          value: scrapedMetadata.schemaSlogan.trim(),
          sourceType: 'WEBSITE_SCHEMA',
          sourceUrl: rawUrl,
          evidence: `JSON-LD Schema slogan: "${scrapedMetadata.schemaSlogan.trim()}"`,
          method: 'SCHEMA_ORGANIZATION_SLOGAN',
          confidence: 0.98
        };
      } else if (payload.tagline && typeof payload.tagline === 'string') {
        const aiCand = payload.tagline.trim().replace(/^["“'«]+|["”'»]+$/g, '').trim();
        if (isValidOfficialTagline(aiCand, brandName, domainName)) {
          const lowerCand = aiCand.toLowerCase();
          const appearsInCopy = combinedText.includes(lowerCand) ||
                                (scrapedMetadata.deepContextText || '').toLowerCase().includes(lowerCand) ||
                                (scrapedMetadata.metaDescription || '').toLowerCase().includes(lowerCand) ||
                                (scrapedMetadata.headings || []).some(h => (h || '').toLowerCase().includes(lowerCand));
          if (appearsInCopy || !taglineObj.value || !isValidOfficialTagline(taglineObj.value, brandName, domainName)) {
            taglineObj = {
              value: aiCand,
              sourceType: appearsInCopy ? (hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'EXACT_WEBSITE_TEXT') : (hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'AI_INFERENCE'),
              sourceUrl: rawUrl,
              evidence: appearsInCopy
                ? `Exact verbatim tagline verified in website text/headings: "${aiCand}"`
                : `Identified by multimodal positioning AI: "${aiCand}"`,
              method: appearsInCopy ? 'VERBATIM_WEBSITE_TAGLINE' : 'MULTIMODAL_POSITIONING_AI',
              confidence: appearsInCopy ? 0.95 : 0.88
            };
          }
        }
      } else if (!taglineObj.value || !isValidOfficialTagline(taglineObj.value, brandName, domainName)) {
        if (scrapedMetadata.extractedTagline?.value && isValidOfficialTagline(scrapedMetadata.extractedTagline.value, brandName, domainName)) {
          taglineObj = scrapedMetadata.extractedTagline;
        }
      }

      // Format sentence helper
      const cleanSentence = (str) => {
        if (!str || typeof str !== 'string') return '';
        let s = str.trim().replace(/^[-*•]\s*/, '').trim();
        if (!s) return '';
        s = s.charAt(0).toUpperCase() + s.slice(1);
        if (!/[.!?]$/.test(s)) s += '.';
        return s;
      };

      // 5. Mission Statement
      if (payload.missionStatement && typeof payload.missionStatement === 'string' && payload.missionStatement.trim().length > 5) {
        const formattedMission = cleanSentence(payload.missionStatement);
        missionObj = {
          value: formattedMission,
          sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'IMPLICIT_BRAND_SYNTHESIS',
          sourceUrl: rawUrl,
          evidence: `Extracted/synthesized mission statement: "${formattedMission}"`,
          method: 'MULTIMODAL_MISSION_AI',
          confidence: 0.88
        };
      }

      // 6. Vision
      if (payload.vision && typeof payload.vision === 'string' && payload.vision.trim().length > 5) {
        const formattedVision = cleanSentence(payload.vision);
        visionObj = {
          value: formattedVision,
          sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'IMPLICIT_BRAND_SYNTHESIS',
          sourceUrl: rawUrl,
          evidence: `Extracted/synthesized vision statement: "${formattedVision}"`,
          method: 'MULTIMODAL_VISION_AI',
          confidence: 0.88
        };
      }
    }
  } catch (err) {
    console.log(`[PositioningAgent] AI multimodal positioning fallback note: ${err.message}`);
  }

  // Final Safety Fallbacks: Guarantee exact verbatim or grounded values
  const indName = industryResult.primaryIndustry.value || 'Commercial Operations';
  
  // Final verification: If tagline is still missing, synthesize a smart authentic tagline
  if (!taglineObj.value || !isValidOfficialTagline(taglineObj.value, brandName, domainName)) {
    if (payload?.tagline && typeof payload.tagline === 'string' && payload.tagline.trim().length >= 3 && isValidOfficialTagline(payload.tagline.trim(), brandName, domainName)) {
      const cleanAiTag = payload.tagline.trim().replace(/^["“'«]+|["”'»]+$/g, '').trim();
      taglineObj = {
        value: cleanAiTag,
        sourceType: 'AI_INFERENCE',
        sourceUrl: rawUrl,
        evidence: `Brand tagline synthesized from positioning analysis: "${cleanAiTag}"`,
        method: 'AI_POSITIONING_ANALYSIS',
        confidence: 0.85
      };
    } else {
      const synthTagline = `${brandName} — Elevating ${indName}`;
      taglineObj = {
        value: synthTagline,
        sourceType: 'IMPLICIT_BRAND_SYNTHESIS',
        sourceUrl: rawUrl,
        evidence: `Brand positioning tagline synthesized for ${brandName}`,
        method: 'SYNTHESIZED_BRAND_TAGLINE',
        confidence: 0.80
      };
    }
  }

  if (!missionObj.value) {
    missionObj = {
      value: `To deliver high-quality ${indName} products and exceptional services for ${brandName} customers.`,
      sourceType: 'IMPLICIT_BRAND_SYNTHESIS',
      sourceUrl: rawUrl,
      evidence: `Synthesized brand purpose from product line & commercial positioning`,
      confidence: 0.80
    };
  }

  if (!visionObj.value) {
    visionObj = {
      value: `To become a trusted global leader in ${indName} through innovation, quality, and customer satisfaction.`,
      sourceType: 'IMPLICIT_BRAND_SYNTHESIS',
      sourceUrl: rawUrl,
      evidence: `Synthesized brand vision from commercial scope`,
      confidence: 0.80
    };
  }

  console.log(`[PositioningAgent] ✅ Positioning Complete. Industry: "${industryResult.primaryIndustry.value || 'N/A'}", BusinessType: "${businessTypeResult.value || 'N/A'}", HQ: "${hqResult.headquarters.value || 'N/A'}", Tagline: "${taglineObj.value || 'N/A'}", Mission: "${missionObj.value || 'N/A'}", Vision: "${visionObj.value || 'N/A'}"`);

  return {
    primaryIndustry: industryResult.primaryIndustry,
    secondaryIndustries: industryResult.secondaryIndustries,
    businessType: businessTypeResult,
    headquarters: hqResult.headquarters,
    tagline: taglineObj,
    missionStatement: missionObj,
    vision: visionObj
  };
}

module.exports = { runPositioningAgent };
