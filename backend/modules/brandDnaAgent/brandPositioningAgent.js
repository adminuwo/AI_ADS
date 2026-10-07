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
    const aiPrompt = `You are an expert Brand Intelligence Analyst.
Analyze the commercial website context, text excerpts, and attached page screenshots for "${brandName}" (${domainName}) to extract core Brand DNA attributes.

CRITICAL INSTRUCTIONS:
1. "primaryIndustry": Exact core commercial industry based on MAIN products/services sold to customers.
2. "secondaryIndustry": Optional secondary industry or null.
3. "businessType": Select the most accurate commercial model (e.g., "Corporate & Industrial Manufacturer", "B2C Consumer Platform", "D2C E-Commerce Brand", "B2B Enterprise & SaaS Platform", "Healthcare & Medical Provider").
4. "headquarters": Physical city, state/province, and country address found in page text/contact/footer screenshots (e.g., "Mumbai, Maharashtra, India", "Palo Alto, California, USA", "Ventura, California, USA"). If no specific location is found, return null.
5. "tagline": EXACT official tagline or slogan explicitly stated on the website (e.g., in hero/header, About/Brand pages, metadata, or JSON-LD schema).
   - Prefer phrases explicitly identified as "tagline" or "slogan", then prominent branding phrases near the brand name.
   - Return the EXACT wording as it appears on the website. Do NOT rewrite, summarize, translate, or generate.
   - NEVER use the company/legal name, product description, mission, vision, or generic marketing text (e.g., "Bestsellers", "50% off", "Shop Now", or product titles).
   - If no reliable tagline is explicitly supported by the website, return null. NEVER guess.
6. "missionStatement": Extract explicit company mission OR synthesize an implicit brand purpose statement grounded in main products/services (e.g., "To deliver innovative, accessible consumer solutions and exceptional customer experiences").
7. "vision": Extract explicit long-term vision OR synthesize an implicit brand vision statement grounded in industry leadership and customer impact.

Return ONLY a valid JSON object:
{
  "primaryIndustry": "String",
  "secondaryIndustry": "String or null",
  "businessType": "String",
  "headquarters": "String or null",
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
      if (!hqResult.headquarters.value && payload.headquarters && typeof payload.headquarters === 'string' && payload.headquarters.trim().length > 3) {
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

      // 4. Tagline (Prioritize verified official tagline or schema slogan; never guess)
      if (!taglineObj.value || !isValidOfficialTagline(taglineObj.value, brandName, domainName)) {
        if (scrapedMetadata.extractedTagline?.value && isValidOfficialTagline(scrapedMetadata.extractedTagline.value, brandName, domainName)) {
          taglineObj = scrapedMetadata.extractedTagline;
        } else if (scrapedMetadata.schemaSlogan && isValidOfficialTagline(scrapedMetadata.schemaSlogan, brandName, domainName)) {
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
                                  (scrapedMetadata.metaDescription || '').toLowerCase().includes(lowerCand);
            if (appearsInCopy) {
              taglineObj = {
                value: aiCand,
                sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'EXACT_WEBSITE_TEXT',
                sourceUrl: rawUrl,
                evidence: `Exact verbatim tagline verified in website text: "${aiCand}"`,
                method: 'VERBATIM_WEBSITE_TAGLINE',
                confidence: 0.92
              };
            }
          }
        }
      }

      // 5. Mission Statement
      if (payload.missionStatement && typeof payload.missionStatement === 'string' && payload.missionStatement.trim().length > 5) {
        missionObj = {
          value: payload.missionStatement.trim(),
          sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'IMPLICIT_BRAND_SYNTHESIS',
          sourceUrl: rawUrl,
          evidence: `Extracted/synthesized mission statement: "${payload.missionStatement.trim()}"`,
          method: 'MULTIMODAL_MISSION_AI',
          confidence: 0.88
        };
      }

      // 6. Vision
      if (payload.vision && typeof payload.vision === 'string' && payload.vision.trim().length > 5) {
        visionObj = {
          value: payload.vision.trim(),
          sourceType: hasVisual ? 'WEBSITE_DOM+WEBSITE_SCREENSHOT' : 'IMPLICIT_BRAND_SYNTHESIS',
          sourceUrl: rawUrl,
          evidence: `Extracted/synthesized vision statement: "${payload.vision.trim()}"`,
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
  
  // Final verification: If tagline does not pass strict rule, return null / UNKNOWN (NEVER guess or fallback to headings!)
  if (!taglineObj.value || !isValidOfficialTagline(taglineObj.value, brandName, domainName)) {
    taglineObj = {
      value: null,
      sourceType: 'UNKNOWN',
      sourceUrl: rawUrl,
      evidence: 'No reliable tagline explicitly supported by website',
      method: 'NO_OFFICIAL_TAGLINE_FOUND',
      confidence: 0
    };
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
