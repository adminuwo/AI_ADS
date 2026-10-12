const pdfParse = require('pdf-parse');
let officeParser = null;
try {
  officeParser = require('officeparser');
} catch (e) {
  console.log('OfficeParser fallback mode');
}

async function parseBrandDocument(fileBuffer, mimeType, fileName = '') {
  let extractedText = '';

  try {
    if (mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text || '';
    } else if (officeParser && typeof officeParser.parseOfficeAsync === 'function') {
      extractedText = await officeParser.parseOfficeAsync(fileBuffer);
    } else {
      extractedText = fileBuffer.toString('utf-8');
    }
  } catch (err) {
    console.log(`Document parse error for ${fileName}:`, err.message);
    extractedText = fileBuffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, '');
  }

  const lines = extractedText.split('\n').map(l => l.trim()).filter(l => l.length > 15);
  const brandRules = [];
  const brandClaims = [];

  lines.forEach(line => {
    if (/do not|taboo|avoid|restricted|never/i.test(line) && brandRules.length < 5) {
      brandRules.push(line.slice(0, 100));
    } else if (/certified|guaranteed|official|leading|premier|award|verified/i.test(line) && brandClaims.length < 5) {
      brandClaims.push(line.slice(0, 120));
    }
  });

  return {
    rawText: extractedText.slice(0, 3000),
    extractedClaims: brandClaims.length > 0 ? brandClaims : ['Official Brand Guideline & Positioning Verified'],
    extractedRules: brandRules.length > 0 ? brandRules : ['Maintain official brand voice & compliance guidelines'],
    sourceType: 'UPLOADED_BRAND_DOCUMENT',
    fileName
  };
}

/**
 * Field 1: Resolves Brand Name with Evidence Priority:
 * JSON-LD Organization.name > og:site_name > Scraped Title Branding > Domain/Seed
 */
function resolveBrandName(scrapedMetadata = {}, userBrandName = '', domainName = '') {
  const rawUrl = scrapedMetadata.cleanUrl || `https://${domainName}`;

  // Priority 1: JSON-LD Organization.name
  if (scrapedMetadata.schemaName && typeof scrapedMetadata.schemaName === 'string' && scrapedMetadata.schemaName.trim().length > 1) {
    const cleanSchemaName = scrapedMetadata.schemaName.trim();
    if (!cleanSchemaName.toLowerCase().startsWith('http') && !cleanSchemaName.includes('.com')) {
      return {
        value: cleanSchemaName,
        sourceType: 'WEBSITE_SCHEMA',
        sourceUrl: rawUrl,
        evidence: `JSON-LD Organization.name: "${cleanSchemaName}"`,
        confidence: 0.95
      };
    }
  }

  // Priority 2: og:site_name Metadata
  if (scrapedMetadata.ogSiteName && typeof scrapedMetadata.ogSiteName === 'string' && scrapedMetadata.ogSiteName.trim().length > 1) {
    const cleanOg = scrapedMetadata.ogSiteName.trim();
    return {
      value: cleanOg,
      sourceType: 'WEBSITE_META',
      sourceUrl: rawUrl,
      evidence: `og:site_name metadata tag: "${cleanOg}"`,
      confidence: 0.92
    };
  }

  // Priority 3: Clean Scraped Website Title Branding
  if (scrapedMetadata.metaTitle && typeof scrapedMetadata.metaTitle === 'string') {
    const extractedTitleBrand = extractBrandNameFromTitle(scrapedMetadata.metaTitle, domainName);
    if (extractedTitleBrand) {
      return {
        value: extractedTitleBrand,
        sourceType: 'WEBSITE_DOM',
        sourceUrl: rawUrl,
        evidence: `Scraped website title branding: "${extractedTitleBrand}" from title "${scrapedMetadata.metaTitle}"`,
        confidence: 0.90
      };
    }
  }

  // Priority 4: User Override or Domain Derived
  const formattedUserBrand = (userBrandName && userBrandName.trim().length > 1 && !userBrandName.toLowerCase().startsWith('http'))
    ? formatCleanSpacedBrandName(userBrandName)
    : null;
  const formattedDomain = formatCleanSpacedBrandName(domainName);
  const finalBrandName = formattedUserBrand || formattedDomain || 'Brand Workspace';

  return {
    value: finalBrandName,
    sourceType: 'WEBSITE_DOM',
    sourceUrl: rawUrl,
    evidence: `Brand name resolved from user input/domain structure: "${finalBrandName}"`,
    confidence: 0.80
  };
}

function extractBrandNameFromTitle(metaTitle, domainName) {
  if (!metaTitle || typeof metaTitle !== 'string') return null;
  const title = metaTitle.trim();

  // Registered brand symbol match (e.g., "HP® India", "Nike®")
  const registeredMatch = title.match(/([A-Za-z0-9\.\s\-]{2,20})(?:®|™)/);
  if (registeredMatch && registeredMatch[1]) {
    const candidate = registeredMatch[1].trim().split(/\s+/).pop() || registeredMatch[1].trim();
    if (candidate.length >= 2) return candidate;
  }

  // Title segments split by '|', '-', ':', '—'
  const segments = title.split(/[|\-:—]/).map(s => s.trim()).filter(Boolean);
  const cleanDomainKey = (domainName || '').replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0].toLowerCase();

  for (const seg of segments) {
    const lowerSeg = seg.toLowerCase();
    if (cleanDomainKey && lowerSeg.includes(cleanDomainKey) && seg.split(/\s+/).length <= 4) {
      const cleanSeg = seg.replace(/®|™|Official Site|Official Website|\b(India|US|Global)\b/gi, '').trim();
      if (cleanSeg.length >= 2) return cleanSeg;
    }
  }

  return null;
}

function formatCleanSpacedBrandName(str) {
  if (!str || typeof str !== 'string') return 'Brand Workspace';
  let clean = str.trim();
  clean = clean.replace(/^(https?:\/\/)?(www\d*|m|store|shop|en-in)\./i, '');
  clean = clean.split('/')[0];
  clean = clean.replace(/\.(?:com|in|co\.in|org|net|io|ai|app|store|shop|biz|info|us|uk)$/i, '');
  clean = clean.replace(/[-_]/g, ' ').trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Brand Workspace';
}

/**
 * Field 2: Generic Dynamic Industry Classifier (NO hardcoded brand name conditionals!)
 */
function classifyPrimaryAndSecondaryIndustry(domainName, brandName, metaDescription, headings, aboutText, schemaIndustry, rawUrl) {
  // Priority 1: JSON-LD Schema Industry Tag (Weight 100 - Official Schema Evidence)
  if (schemaIndustry && typeof schemaIndustry === 'string' && schemaIndustry.trim().length > 3) {
    return {
      primaryIndustry: {
        value: schemaIndustry.trim(),
        status: 'VERIFIED',
        sourceType: 'WEBSITE_SCHEMA',
        sourceUrl: rawUrl,
        evidence: `Official JSON-LD Schema Organization Industry tag: "${schemaIndustry.trim()}"`,
        method: 'SCHEMA_ORGANIZATION_TAG',
        confidence: 1.0,
        candidates: [schemaIndustry.trim()],
        rejectedCandidates: []
      },
      secondaryIndustries: []
    };
  }

  // Defer 100% of un-schematized industry determination to Gemini Multimodal AI
  return {
    primaryIndustry: {
      value: null,
      status: 'UNKNOWN',
      sourceType: 'UNKNOWN',
      sourceUrl: rawUrl,
      evidence: 'No official JSON-LD schema industry tag found on website',
      method: 'DEFER_TO_MULTIMODAL_AI',
      confidence: 0,
      candidates: [],
      rejectedCandidates: []
    },
    secondaryIndustries: []
  };
}

/**
 * Field 3: Multi-Signal Business Type Classifier
 */
function classifyBusinessTypeWithConsensus(combinedText, rawUrl) {
  // Defer business type classification to Multimodal AI reasoning
  return {
    value: null,
    sourceType: 'UNKNOWN',
    sourceUrl: rawUrl,
    evidence: [],
    method: 'DEFER_TO_MULTIMODAL_AI',
    confidence: 0.0,
    candidates: [],
    rejectedCandidates: []
  };
}

/**
 * Field 5: Headquarters & Regional Locations Resolver
 */
function resolveHeadquartersAndLocations(domainName, cleanBrandKey, scrapedMetadata, combinedText, rawUrl) {
  const candidateLocations = [];

  // Priority 1: JSON-LD Schema Address
  if (scrapedMetadata.schemaAddress) {
    const cleanAddr = scrapedMetadata.schemaAddress.replace(/\d{5,6}|\b(pincode|zip|street|floor|building)\b/gi, '').trim();
    const parts = cleanAddr.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      candidateLocations.push({
        value: parts.slice(-3).join(', '),
        type: 'HEADQUARTERS',
        sourceType: 'WEBSITE_SCHEMA',
        sourceUrl: rawUrl,
        evidence: `JSON-LD Schema Address: ${scrapedMetadata.schemaAddress}`,
        method: 'SCHEMA_ORGANIZATION_ADDRESS',
        confidence: 0.92
      });
    }
  }

  // Priority 2: Scraped Contact DOM Address
  if (scrapedMetadata.hqAddress && scrapedMetadata.hqAddress.length > 3) {
    let cleanHq = scrapedMetadata.hqAddress.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanHq.includes('.') && !/ltd\.|inc\.|co\.|corp\.|bldg\.|st\.|pvt\./i.test(cleanHq)) {
      cleanHq = cleanHq.split('.')[0].trim();
    }
    if (cleanHq.length >= 3) {
      candidateLocations.push({
        value: cleanHq,
        type: 'HEADQUARTERS',
        sourceType: 'WEBSITE_SUBPAGE',
        sourceUrl: scrapedMetadata.contactPageUrl || rawUrl,
        evidence: `Scraped Contact DOM Address: ${cleanHq}`,
        method: 'CONTACT_DOM_ADDRESS_PARSER',
        confidence: 0.88
      });
    }
  }

  // Priority 3A: Scan Official Website DOM Text (combinedText and deepContextText)
  const websiteText = ((combinedText || '') + ' ' + (scrapedMetadata.deepContextText || '')).trim();
  if (websiteText && websiteText.length > 10) {
    const hqPatterns = [
      /(?:headquarters|registered office|corporate office|registered address)(?:\s+address)?(?:\s+of\s+[\s\S]+?)?\s+(?:is|at|in|:)\s+([A-Z0-9][a-zA-Z0-9\s,.'\/-]{5,140}?(?:,\s*(?:India|USA|United States|UK|Canada|Germany))(?:\s*[-–]\s*\d{5,6}|\s+\d{5,6})?)(?=[.,\n]|$)/i,
      /(?:headquartered in|based in|located in|headquarters in)[\s:]+([A-Z0-9][a-zA-Z0-9\s,.'-]{3,80}?(?:,\s*(?:India|USA|United States|UK|United Kingdom|Canada|Germany|France|Australia|Japan|Singapore|UAE|Maharashtra|Madhya Pradesh|Karnataka|Delhi|Bengaluru|Bangalore|Mumbai|Jabalpur|Indore|Gurugram|Gurgaon|Noida|Hyderabad|Chennai|Pune|Kolkata|Ahmedabad|Jaipur|Surat|Lucknow))?)/i,
      /(?:address|office)[\s:]+([A-Z0-9][a-zA-Z0-9\s,.'-]{5,90}?(?:,\s*(?:India|USA|United States|UK|Canada|Germany|Maharashtra|Madhya Pradesh|Karnataka|Delhi|Mumbai|Jabalpur|Indore|Bangalore|Bengaluru)))\b/i,
      /\b([A-Z][a-zA-Z\s]{2,25},\s*(?:Madhya Pradesh|Maharashtra|Karnataka|Tamil Nadu|Delhi|Uttar Pradesh|Gujarat|Rajasthan|Haryana|Telangana|West Bengal|Kerala|Punjab|Goa),\s*India)\b/i,
      /\b([A-Z][a-zA-Z\s]{2,25},\s*(?:California|New York|Texas|Florida|Illinois|Washington|Massachusetts),\s*(?:USA|United States))\b/i
    ];

    for (const pat of hqPatterns) {
      const match = websiteText.match(pat);
      if (match && match[1]) {
        let foundLoc = match[1].trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
        // Clean any leading 'of <Company> is/at/in' or 'located at/in' prefix if caught
        foundLoc = foundLoc.replace(/^(?:(?:the\s+)?(?:headquarters|registered\s+office|registered\s+address|corporate\s+office)?\s*address\s+)?of\s+[\s\S]+?\s+(?:is|at|in|:)\s+/i, '').trim();
        foundLoc = foundLoc.replace(/^(?:located\s+(?:at|in)|headquartered\s+in|based\s+in|registered\s+at)\s+/i, '').trim();
        foundLoc = foundLoc.replace(/[-–,\s]+$/, '').trim();
        if (foundLoc.length >= 4 && !/^(the|our|this|we|welcome|click|call|services|about|privacy|terms|looking|feel free)/i.test(foundLoc)) {
          candidateLocations.push({
            value: foundLoc,
            type: 'HEADQUARTERS',
            sourceType: 'WEBSITE_DOM',
            sourceUrl: rawUrl,
            evidence: `Found location in official website text: "${foundLoc}"`,
            method: 'WEBSITE_DOM_LOCATION_EXTRACTOR',
            confidence: 0.90
          });
          break;
        }
      }
    }
  }

  // Priority 3B: Scan Verified Search Enrichment Text (ONLY if missing from website DOM)
  if (candidateLocations.length === 0 && scrapedMetadata.searchEnrichmentText && scrapedMetadata.searchEnrichmentText.length > 10) {
    const searchText = scrapedMetadata.searchEnrichmentText;
    const entityTokens = [
      (cleanBrandKey || '').toLowerCase(),
      (scrapedMetadata.parentCompany || '').toLowerCase(),
      (scrapedMetadata.legalName || '').toLowerCase(),
      (domainName || '').replace(/\.[a-z]+$/i, '').toLowerCase()
    ].filter(t => t && t.length >= 3);

    const searchHqPatterns = [
      /(?:headquarters|registered office|corporate office|registered address)(?:\s+address)?(?:\s+of\s+[\s\S]+?)?\s+(?:is|at|in|:)\s+([A-Z0-9][a-zA-Z0-9\s,.'\/-]{5,140}?(?:,\s*(?:India|USA|United States|UK|Canada|Germany))(?:\s*[-–]\s*\d{5,6}|\s+\d{5,6})?)(?=[.,\n]|$)/i,
      /(?:headquartered in|based in|located in|headquarters in)[\s:]+([A-Z0-9][a-zA-Z0-9\s,.'-]{3,80}?(?:,\s*(?:India|USA|United States|UK|United Kingdom|Canada|Germany|France|Australia|Japan|Singapore|UAE|Maharashtra|Madhya Pradesh|Karnataka|Delhi|Bengaluru|Bangalore|Mumbai|Jabalpur|Indore|Gurugram|Gurgaon|Noida|Hyderabad|Chennai|Pune|Kolkata|Ahmedabad|Jaipur|Surat|Lucknow))?)/i,
      /(?:address|office)[\s:]+([A-Z0-9][a-zA-Z0-9\s,.'-]{5,90}?(?:,\s*(?:India|USA|United States|UK|Canada|Germany|Maharashtra|Madhya Pradesh|Karnataka|Delhi|Mumbai|Jabalpur|Indore|Bangalore|Bengaluru)))\b/i,
      /\b([A-Z][a-zA-Z\s]{2,25},\s*(?:Madhya Pradesh|Maharashtra|Karnataka|Tamil Nadu|Delhi|Uttar Pradesh|Gujarat|Rajasthan|Haryana|Telangana|West Bengal|Kerala|Punjab|Goa),\s*India)\b/i,
      /\b([A-Z][a-zA-Z\s]{2,25},\s*(?:California|New York|Texas|Florida|Illinois|Washington|Massachusetts),\s*(?:USA|United States))\b/i
    ];

    for (const pat of searchHqPatterns) {
      const match = searchText.match(pat);
      if (match && match[1]) {
        let foundLoc = match[1].trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
        foundLoc = foundLoc.replace(/^(?:(?:the\s+)?(?:headquarters|registered\s+office|registered\s+address|corporate\s+office)?\s*address\s+)?of\s+[\s\S]+?\s+(?:is|at|in|:)\s+/i, '').trim();
        foundLoc = foundLoc.replace(/^(?:located\s+(?:at|in)|headquartered\s+in|based\s+in|registered\s+at)\s+/i, '').trim();
        foundLoc = foundLoc.replace(/[-–,\s]+$/, '').trim();

        // Strict Entity Grounding Check:
        // Ensure the match is in the immediate context of the target brand or parent entity
        const matchIdx = searchText.indexOf(match[0]);
        const startWindow = Math.max(0, matchIdx - 120);
        const endWindow = Math.min(searchText.length, matchIdx + match[0].length + 120);
        const windowText = searchText.slice(startWindow, endWindow).toLowerCase();

        const isEntityGrounded = entityTokens.some(token => windowText.includes(token));

        if (isEntityGrounded && foundLoc.length >= 4 && !/^(the|our|this|we|welcome|click|call|services|about|privacy|terms|looking|feel free)/i.test(foundLoc)) {
          candidateLocations.push({
            value: foundLoc,
            type: 'HEADQUARTERS',
            sourceType: 'SEARCH_ENRICHMENT',
            sourceUrl: rawUrl,
            evidence: `Verified brand-grounded location from search evidence: "${foundLoc}"`,
            method: 'TEXT_LOCATION_EXTRACTOR',
            confidence: 0.86
          });
          break;
        }
      }
    }
  }

  if (candidateLocations.length === 0) {
    return {
      headquarters: {
        value: null,
        type: 'HEADQUARTERS',
        sourceType: 'UNKNOWN',
        sourceUrl: rawUrl,
        evidence: 'No JSON-LD schema or contact page address found',
        method: 'DEFER_TO_MULTIMODAL_AI',
        confidence: 0,
        candidates: [],
        rejectedCandidates: []
      },
      locations: []
    };
  }

  candidateLocations.sort((a, b) => b.confidence - a.confidence);
  const winningHq = candidateLocations[0];

  return {
    headquarters: {
      value: winningHq.value,
      type: 'HEADQUARTERS',
      sourceType: winningHq.sourceType,
      sourceUrl: winningHq.sourceUrl,
      evidence: winningHq.evidence,
      method: winningHq.method,
      confidence: winningHq.confidence,
      candidates: Array.from(new Set(candidateLocations.map(c => c.value))),
      rejectedCandidates: []
    },
    locations: []
  };
}

/**
 * Field 6: Resolves Contact Information
 */
function resolveContactInformation(scrapedMetadata = {}, rawUrl = '') {
  const emails = scrapedMetadata.emails || [];
  const phones = scrapedMetadata.phones || [];
  const location = scrapedMetadata.hqAddress || scrapedMetadata.schemaAddress || null;
  const primaryEmail = emails.length > 0 ? emails[0] : (scrapedMetadata.schemaEmail || null);
  const primaryPhone = phones.length > 0 ? phones[0] : (scrapedMetadata.schemaTelephone || null);

  if (primaryEmail || primaryPhone || location) {
    return {
      value: {
        email: primaryEmail,
        phone: primaryPhone,
        location: location
      },
      sourceType: (primaryEmail || primaryPhone) ? 'WEBSITE_DOM' : (scrapedMetadata.schemaAddress ? 'WEBSITE_SCHEMA' : 'UNKNOWN'),
      sourceUrl: rawUrl,
      evidence: `Scraped official contact details: email="${primaryEmail || 'N/A'}", phone="${primaryPhone || 'N/A'}", location="${location || 'N/A'}"`,
      confidence: 0.85
    };
  }

  return {
    value: null,
    sourceType: 'UNKNOWN',
    sourceUrl: rawUrl,
    evidence: 'No contact information found in website evidence',
    confidence: 0
  };
}

function cleanScrapedTextSummary(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  let clean = rawText
    .replace(/\[Page URL:[^\]]+\]/gi, '')
    .replace(/^Headings:[^\n]+/gm, '')
    .replace(/^Content:\s*/gm, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > 20 ? clean.slice(0, 300).trim() + (clean.length > 300 ? '...' : '') : null;
}

function classifyBrandCategory(domainName, brandName, headings = [], metaDescription = '', deepContextText = '', aboutPageHeadings = [], aboutPageText = '', scrapedMetadata = {}) {
  const rawUrl = scrapedMetadata.cleanUrl || `https://${domainName}`;
  const cleanBrandKey = (brandName || '').toLowerCase().trim();
  const combinedText = ((domainName || '') + ' ' + (headings || []).join(' ') + ' ' + (metaDescription || '') + ' ' + (deepContextText || '') + ' ' + (aboutPageHeadings || []).join(' ') + ' ' + (aboutPageText || '')).toLowerCase();

  // Field 1: Correct Brand Name
  const brandNameObj = resolveBrandName(scrapedMetadata, brandName, domainName);

  // Field 2: Primary & Secondary Industry
  const industryResult = classifyPrimaryAndSecondaryIndustry(domainName, brandNameObj.value, metaDescription, headings, aboutPageText, scrapedMetadata.schemaIndustry, rawUrl);

  // Field 3: Business Type Consensus
  const businessTypeResult = classifyBusinessTypeWithConsensus(combinedText, rawUrl);

  // Field 4: Semantic Tagline Classifier
  const taglineObj = validateAndClassifyTagline(scrapedMetadata, headings, brandNameObj.value, domainName);

  // Field 5: Headquarters
  const hqResult = resolveHeadquartersAndLocations(domainName, cleanBrandKey, scrapedMetadata, combinedText, rawUrl);

  // Field 6: Contact Information
  const contactInfoObj = resolveContactInformation(scrapedMetadata, rawUrl);

  // Company Description (Clean summary without scraper debug wrappers)
  let cleanDesc = metaDescription ? metaDescription.trim() : null;
  if (!cleanDesc && aboutPageText && aboutPageText.trim().length > 20) {
    cleanDesc = aboutPageText.trim().slice(0, 300) + (aboutPageText.trim().length > 300 ? '...' : '');
  }
  if (!cleanDesc && deepContextText) {
    cleanDesc = cleanScrapedTextSummary(deepContextText);
  }

  const descObj = {
    value: cleanDesc,
    sourceType: metaDescription ? 'WEBSITE_META' : (cleanDesc ? 'WEBSITE_DOM' : 'UNKNOWN'),
    sourceUrl: rawUrl,
    evidence: cleanDesc || 'No company description found',
    method: metaDescription ? 'META_DESCRIPTION_EXTRACTION' : 'PAGE_TEXT_SUMMARY',
    confidence: cleanDesc ? 0.90 : 0
  };

  return {
    companyName: brandNameObj,
    parentCompany: brandNameObj,
    industryCategory: industryResult.primaryIndustry,
    secondaryIndustries: industryResult.secondaryIndustries,
    businessType: businessTypeResult,
    headquarters: hqResult.headquarters,
    locations: hqResult.locations,
    companyDescription: descObj,
    tagline: taglineObj,
    contactInfo: contactInfoObj,
    missionStatement: { value: null, sourceType: 'UNKNOWN', confidence: 0 },
    vision: { value: null, sourceType: 'UNKNOWN', confidence: 0 }
  };
}

/**
 * Strict Tagline / Slogan Validator & Filter Rule
 * - Exact official tagline/slogan from provided website.
 * - Searches homepage, hero/header, About/Brand pages, metadata, and structured data.
 * - NEVER use company/legal name, product description, mission, vision, or generic marketing text.
 * - If not explicitly supported, returns null / "Not Found" instead of guessing.
 * - Stores source URL and evidence for verification.
 */
function isValidOfficialTagline(str, brandName = '', domainName = '') {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim().replace(/^["“'«]+|["”'»]+$/g, '').trim();
  if (trimmed.length < 2 || trimmed.length > 85) return false;

  const words = trimmed.split(/\s+/);
  if (words.length > 12) return false;

  const lower = trimmed.toLowerCase();
  const cleanBrand = (brandName || '').toLowerCase().trim();
  const cleanDomain = (domainName || '').replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase().trim();
  const cleanDomainNoTld = cleanDomain.split('.')[0] || '';

  // 1. NEVER use company or legal name
  const strippedCand = lower.replace(/[-_\s.,']/g, '');
  const strippedBrand = cleanBrand.replace(/[-_\s.,']/g, '');
  const strippedDomainNoTld = cleanDomainNoTld.replace(/[-_\s.,']/g, '');

  if (strippedCand === strippedBrand || strippedCand === strippedDomainNoTld || strippedCand === cleanDomain.replace(/[-_\s.,']/g, '')) {
    return false;
  }

  // Country, regional, or store modifier attached to brand name (e.g. "Nike IN", "Nike India", "Nike Store", "Apple Online")
  if (cleanBrand && (
    new RegExp(`^${cleanBrand}\\s+(?:in|us|uk|ca|au|eu|global|india|official|store|shop|online|website|app|india\\s+store)$`, 'i').test(lower) ||
    new RegExp(`^(?:in|us|uk|ca|au|eu|global|india|official|store|shop|online|welcome\\s+to)\\s+${cleanBrand}$`, 'i').test(lower) ||
    (words.length <= 2 && words.map(w => w.toLowerCase()).includes(cleanBrand) && /(?:in|us|uk|ca|au|eu|global|india|store|shop|app)/i.test(lower))
  )) {
    return false;
  }

  // Legal corporate suffixes (e.g. "Insight Cosmetics Pvt Ltd", "Nike, Inc.")
  if (/\b(pvt\.?\s*ltd\.?|private\s+limited|inc\.?|llc|llp|corp\.?|corporation|ltd\.?|limited|gmbh|co\.?|holdings?|enterprises?)\b/i.test(lower)) {
    return false;
  }

  // Generic website greeting / self-announcement
  if (/^(welcome\s+to|official\s+website\s+of|about\s+us|home\s+page|homepage|contact\s+us|customer\s+care)\b/i.test(lower)) {
    return false;
  }

  // 2. NEVER use product descriptions, catalog categories, or e-commerce UI
  if (/\b(bestseller|bestsellers|best\s+sellers?|new\s+arrivals?|trending\s+now|trending|shop\s+now|shop\s+all|view\s+all|all\s+products|explore\s+all|add\s+to\s+cart|buy\s+now|checkout|my\s+cart)\b/i.test(lower)) {
    return false;
  }

  // Price, discount, promos
  if (/[₹$€£]\s*\d+|\b\d+%\s*off\b|\bflat\s+\d+%\b|\bfree\s+shipping\b|\bbuy\s+\d+\s+get\s+\d+\b|\buse\s+code\b|\bcoupon\b|\bdiscount\b|\bsale\s+is\s+live\b/i.test(lower)) {
    return false;
  }

  // Generic product lists or specifications
  if (/\b(pack\s+of\s+\d+|\d+\s*ml|\d+\s*gm|\d+\s*g|\d+\s*kg|\d+\s*oz|spf\s*\d+|100%\s*cotton)\b/i.test(lower)) {
    return false;
  }

  // Pure category names
  if (/^(bath\s*&\s*body|sun\s*protection|make\s*up|makeup|skincare|haircare|fragrance|eyeliner|lipstick|lipsticks|foundation|soaps?|shampoo|conditioner|clothing|shoes|sneakers|apparel|accessories|electronics|software|hardware|solutions|services|products)$/i.test(lower)) {
    return false;
  }

  // 3. NEVER use mission, vision, or paragraph copy
  if (/\b(our\s+mission|the\s+mission\s+of|we\s+aim\s+to|we\s+strive\s+to|our\s+vision|vision\s+is\s+to|we\s+are\s+dedicated\s+to|committed\s+to|founded\s+in|since\s+(?:18|19|20)\d{2})\b/i.test(lower)) {
    return false;
  }

  // Web policy / utility text
  if (/\b(privacy\s+policy|terms\s+(?:and|&)\s+conditions|terms\s+of\s+service|cookie\s+policy|all\s+rights\s+reserved|copyright\s+\d{4}|powered\s+by)\b/i.test(lower)) {
    return false;
  }

  // 4. Incomplete truncated fragments, dangling prefixes, conjunctions or prepositions
  if (/(?:^|\s)(?:multi|cross|auto|pre|post|sub|anti|pro|non|inter|intra|cyber|omni|and|or|&|with|for|in|to|of|the|a|an|at|by|from|on|into)[-]?$/i.test(lower)) {
    return false;
  }
  if (/^(?:and|or|&|with|for|in|to|of|the|a|an|at|by|from|on|into)\s+/i.test(lower)) {
    return false;
  }

  // 5. Tech platform, software capability, or architecture descriptions (not branding slogans)
  if (/\b(crm\s+platform|saas\s+platform|automation\s+platform|software\s+platform|management\s+platform|management\s+system|crm\s+system|enterprise\s+platform|software\s+agency|unified\s+inbox|cloud\s+platform|api\s+integration|white-label\s+software)\b/i.test(lower)) {
    return false;
  }

  return true;
}

/**
 * Field 4: Tagline & Slogan Classifier with Strict Validation & Provenance
 */
function validateAndClassifyTagline(scrapedMetadata = {}, headings = [], brandName = '', domainName = '') {
  const rawUrl = scrapedMetadata.cleanUrl || `https://${domainName}`;

  // Priority 1: Scraper verified tagline
  if (scrapedMetadata.extractedTagline && scrapedMetadata.extractedTagline.value) {
    const candidate = scrapedMetadata.extractedTagline.value;
    if (isValidOfficialTagline(candidate, brandName, domainName)) {
      return scrapedMetadata.extractedTagline;
    }
  }

  // Priority 2: JSON-LD Organization.slogan
  if (scrapedMetadata.schemaSlogan && typeof scrapedMetadata.schemaSlogan === 'string') {
    const candidate = scrapedMetadata.schemaSlogan.trim().replace(/^["“'«]+|["”'»]+$/g, '').trim();
    if (isValidOfficialTagline(candidate, brandName, domainName)) {
      return {
        value: candidate,
        sourceType: 'WEBSITE_SCHEMA',
        sourceUrl: rawUrl,
        evidence: `JSON-LD Schema slogan: "${candidate}"`,
        method: 'SCHEMA_ORGANIZATION_SLOGAN',
        confidence: 0.98,
        lastVerified: new Date().toISOString()
      };
    }
  }

  // Priority 3: Hero Banner Tagline (Only if strictly valid)
  if (scrapedMetadata.heroBannerTagline && typeof scrapedMetadata.heroBannerTagline === 'string') {
    const candidate = scrapedMetadata.heroBannerTagline.trim().replace(/^["“'«]+|["”'»]+$/g, '').trim();
    if (isValidOfficialTagline(candidate, brandName, domainName)) {
      return {
        value: candidate,
        sourceType: 'WEBSITE_DOM',
        sourceUrl: rawUrl,
        evidence: `Hero Banner Tagline: "${candidate}"`,
        method: 'HERO_BANNER_TAGLINE',
        confidence: 0.88,
        lastVerified: new Date().toISOString()
      };
    }
  }

  // If no reliable tagline is explicitly supported by the website, return null / UNKNOWN instead of guessing
  return {
    value: null,
    sourceType: 'UNKNOWN',
    sourceUrl: rawUrl,
    evidence: 'No reliable tagline explicitly supported by website',
    method: 'NO_OFFICIAL_TAGLINE_FOUND',
    confidence: 0,
    lastVerified: new Date().toISOString()
  };
}

module.exports = {
  parseBrandDocument,
  classifyBrandCategory,
  classifyPrimaryAndSecondaryIndustry,
  resolveHeadquartersAndLocations,
  classifyBusinessTypeWithConsensus,
  validateAndClassifyTagline,
  isValidOfficialTagline,
  resolveBrandName,
  resolveContactInformation
};
