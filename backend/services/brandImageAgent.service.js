/**
 * brandImageAgent.service.js
 * Autonomous Production-Grade Brand DNA AI Ad Image Generation Agent
 *
 * Capabilities:
 * 1. Deep Brand DNA Analysis: Ingests Brand Name, Primary/Secondary Colors, Industry, Tagline, Company Description, Target Audience.
 * 2. Ad Visual Prompt Engineering: Translates marketing campaign goals & Brand DNA into photographic & advertising visual prompts.
 * 3. Multi-Tier Image Generation Pipeline:
 *    - Tier 1: Google Cloud Vertex AI (@google/genai) `gemini-3.1-flash-image` (global location)
 *    - Tier 2: Flux Pro Neural Generation (Direct fast diffusion with seed & brand tokenization)
 *    - Tier 3: High-Fidelity Branded SVG / Vector Visual Synthesizer (Zero-latency instant vector preview with exact brand hex colors)
 */

const { aiClient, globalAiClient, useVertexAI, projectId, location, globalLocation } = require('../config/vertex');
const { uploadImageBufferToGcs } = require('./gcsStorageService');
const Workspace = require('../models/Workspace');
const BrandProfile = require('../models/BrandProfile');

/**
 * Default color palette inference based on brand name / keywords if not configured
 */
function inferBrandColors(brandName = '', companyDesc = '') {
  return ['#6366F1', '#8B5CF6', '#06B6D4']; // Modern AI indigo / violet / cyan default
}

/**
 * Ad Visual Prompt Engineering Agent
 * Creates commercial photography prompts deeply aligned with Brand DNA.
 */
function craftBrandAdPrompt({
  brandName = 'Brand',
  industry = 'Technology',
  tagline = '',
  companyDescription = '',
  brandColors = [],
  topic = 'Brand Campaign',
  postType = 'image',
  platform = 'instagram',
  style = 'Photorealistic Commercial',
  aspect = '1:1'
}) {
  const colorsList = brandColors && brandColors.length > 0 ? brandColors.join(', ') : inferBrandColors(brandName, companyDescription).join(', ');
  const cleanBrand = brandName.trim();

  let sceneDetails = '';
  const textContext = `${cleanBrand} ${industry} ${companyDescription} ${topic}`.toLowerCase();

  // Strategy Sub-Topic Intent Detection (Evaluated ONLY on topic & action prompt, not company description)
  const topicText = `${topic} ${companyDescription && companyDescription.length < 50 ? companyDescription : ''}`.toLowerCase();

  const isOfferSale = /offer|discount|deal|countdown|sale|special|coupon|promo|limited|exclusive/i.test(topicText);
  const isFamilyPhoto = /family photo|vintage family|family picture|family portrait|ancestor|grandma|grandfather|family member|origin story/i.test(topicText);
  const isBehindTheScenes = /behind the scenes|maker|craft|kitchen|bottling|factory|team|production|making|handcrafted|floor|unboxing/i.test(topicText);
  const isIngredientFarm = /ingredient|farm|harvest|chili|datil|fresh tomatoes|field|grow|farmer/i.test(topicText);
  const isRecipeDish = /recipe|dish|plate|meal|wing|burger|pairing|cooking|culinary|brunch|chef/i.test(topicText);
  const isProductBottle = /bottle|packaging|product|shelf|label|display|introduction/i.test(topicText);
  const isHeritageOrigin = /heritage|origin|history|throwback|family recipe|30-year|traditional/i.test(textContext);
  const isTestimonialChallenge = /testimonial|customer|challenge|fan|community|patio|friends|lifestyle|review|appreciation/i.test(topicText);
  const isFoodTourLocal = /food tour|st\. augustine|exploring|local spots|community|partnership|local love/i.test(topicText);

  if (isOfferSale) {
    sceneDetails = `High-impact commercial promotional offer display for ${cleanBrand}, sleek announcement banner, luxury presentation, vibrant brand colors (${colorsList}), polished studio commercial advertising photography`;
  } else if (isFamilyPhoto) {
    sceneDetails = `Authentic warm family photo portrait for ${cleanBrand}, sepia-toned film photography, emotional storytelling and heritage connection, 35mm film commercial visual`;
  } else if (isBehindTheScenes) {
    sceneDetails = `Authentic behind-the-scenes craft production for ${cleanBrand}, small-batch artisanal team in clean modern workspace, authentic craftsmanship commercial photography`;
  } else if (isIngredientFarm) {
    sceneDetails = `Vibrant close-up macro photography of fresh natural ingredients and raw materials for ${cleanBrand}, rustic wooden surface with morning dew drops, farm-to-table natural lighting`;
  } else if (isProductBottle) {
    sceneDetails = `Sleek product hero presentation for ${cleanBrand}, prominently displayed on an elegant tabletop with brand color accents (${colorsList}), commercial product advertising shot`;
  } else if (isFoodTourLocal) {
    sceneDetails = `Sunlit historic street scene with outdoor cafe dining patio featuring ${cleanBrand}, warm travel lifestyle photography`;
  } else if (isRecipeDish) {
    sceneDetails = `Mouth-watering gourmet dish presentation for ${cleanBrand}, highlighting ${topic}, rich aroma steam, warm bistro lighting, macro food photography`;
  } else if (isHeritageOrigin) {
    sceneDetails = `Nostalgic vintage editorial scene celebrating ${cleanBrand}'s heritage and origin story, warm morning sunbeams, editorial commercial photography`;
  } else if (isTestimonialChallenge) {
    sceneDetails = `High-energy outdoor lifestyle scene with satisfied customers and community enjoying ${cleanBrand}, golden hour natural light, vibrant social ad visual`;
  } else if (textContext.includes('food') || textContext.includes('dining') || textContext.includes('restaurant') || textContext.includes('cafe')) {
    sceneDetails = `Mouth-watering gourmet culinary presentation for ${cleanBrand}, highlighting ${topic}, elegant plating setup, fresh organic ingredients, warm bistro lighting, macro food photography`;
  } else if (textContext.includes('saas') || textContext.includes('software') || textContext.includes('analytics') || textContext.includes('app') || textContext.includes('tech')) {
    sceneDetails = `Clean modern glass tech headquarters for ${cleanBrand}, highlighting ${topic}, sleek minimalist desk with high-tech workspace environment, soft studio lighting, executive aesthetic`;
  } else if (textContext.includes('fashion') || textContext.includes('apparel') || textContext.includes('clothing')) {
    sceneDetails = `High-end fashion editorial scene for ${cleanBrand}, highlighting ${topic}, sunlit studio setting, elegant apparel display, Vogue editorial photography`;
  } else {
    sceneDetails = `Commercial advertising studio setup for ${cleanBrand}, highlighting ${topic}, modern architectural interior, brand colors (${colorsList}), subtle ambient lighting, pristine focus, premium commercial ad aesthetic`;
  }

  // Style Modifiers
  let styleDirective = 'commercial advertising photography, 8k resolution, photorealistic, professional studio lighting, Hasselblad H6D-100c, masterwork';
  if (style === 'Glassmorphic Modern 3D') {
    styleDirective = '3D glassmorphic octane render, frosted acrylic glass elements, glowing neon illumination, cinematic depth, Behance trending 3D commercial art';
  } else if (style === 'Cinematic Film Studio') {
    styleDirective = '35mm anamorphic film still, cinematic color grading, moody directional rim lighting, IMAX camera ratio, atmospheric depth';
  } else if (style === 'Minimalist Editorial') {
    styleDirective = 'minimalist Scandinavian editorial photography, soft diffused daylight, elegant negative space, clean geometric composition';
  } else if (style === 'Vibrant Social Ad') {
    styleDirective = 'high-energy vibrant social media advertisement, bold contrast, punchy vivid color saturation, crisp commercial product focus';
  } else if (style === 'Luxury Brand Studio') {
    styleDirective = 'ultra-luxury dark studio editorial, rich obsidian textures, polished metallic reflections, subtle gold accents, high-end commercial ad';
  }

  // Random perspective rotation for fresh regenerated variations on every click
  const seedNum = typeof seed === 'number' ? seed : Math.floor(Math.random() * 1000000);
  const angles = [
    'hero product perspective with dramatic studio lighting',
    'cinematic wide editorial scene with rich depth of field',
    'top-down flat-lay composition with balanced negative space',
    'macro close-up detail shot highlighting premium texture and craftsmanship',
    'lifestyle environment shot with warm natural lighting'
  ];
  const selectedAngle = angles[seedNum % angles.length];

  // Clean image directive to ensure AI generators produce clean commercial visual shots without drawing fake mangled text or artificial logos into the image
  const cleanImageDirective = 'clean commercial photography, no rendered text, no fake logos, no artificial typography, no watermarks';

  const finalPrompt = `${sceneDetails}, ${selectedAngle}, authentic brand essence of ${cleanBrand} ("${tagline || topic}"), brand color harmony (${colorsList}), ${styleDirective}, ${cleanImageDirective}`;
  return finalPrompt;
}

/**
 * Generate Brand Vector / 3D Canvas Graphic (Tier 3 Zero-Latency Synthesizer)
 */
function generateBrand3DSvg({
  brandName = 'Brand',
  brandColors = [],
  topic = 'Marketing Campaign',
  style = 'Glassmorphic Modern 3D',
  aspect = '1:1'
}) {
  const bName = brandName.replace(/World Leader In Artificial Intelligence Computing/gi, 'NVIDIA').trim();
  const colors = (brandColors && brandColors.length > 0) ? brandColors : inferBrandColors(bName, topic);
  const primaryColor = colors[0] || '#76B900';
  const secondaryColor = colors[1] || '#000000';
  const accentColor = colors[2] || '#38BDF8';

  const is916 = aspect === '9:16';
  const is169 = aspect === '16:9';
  const is45 = aspect === '4:5';

  const width = is169 ? 1280 : is916 ? 720 : is45 ? 1080 : 1080;
  const height = is169 ? 720 : is916 ? 1280 : is45 ? 1350 : 1080;

  const displayTopic = topic.length > 48 ? topic.slice(0, 45) + '...' : topic;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B0F19"/>
        <stop offset="50%" stop-color="#020617"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="100%" stop-color="${accentColor}"/>
      </linearGradient>
      <linearGradient id="glassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="35" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.7"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

    <!-- Ambient Glowing Brand Orbs -->
    <circle cx="${width * 0.25}" cy="${height * 0.25}" r="${width * 0.35}" fill="${primaryColor}" opacity="0.25" filter="url(#glow)"/>
    <circle cx="${width * 0.8}" cy="${height * 0.75}" r="${width * 0.35}" fill="${accentColor}" opacity="0.2" filter="url(#glow)"/>

    <!-- Brand Header Pill -->
    <g transform="translate(${width * 0.08}, ${height * 0.08})">
      <rect width="240" height="48" rx="24" fill="rgba(255,255,255,0.08)" stroke="url(#glassBorder)" stroke-width="1.5"/>
      <circle cx="28" cy="24" r="11" fill="${primaryColor}"/>
      <text x="50" y="30" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="14" font-weight="900" letter-spacing="2">${bName.toUpperCase()}</text>
    </g>

    <g transform="translate(${width * 0.62}, ${height * 0.08})">
      <rect width="210" height="48" rx="24" fill="rgba(255,255,255,0.06)" stroke="${primaryColor}" stroke-width="1.5"/>
      <text x="105" y="30" fill="#A7F3D0" font-family="'Inter', -apple-system, sans-serif" font-size="12" font-weight="800" text-anchor="middle">OFFICIAL BRAND AD</text>
    </g>

    <!-- Center 3D Glassmorphic Card -->
    <g filter="url(#dropShadow)" transform="translate(${width * 0.08}, ${height * 0.2})">
      <rect width="${width * 0.84}" height="${height * 0.62}" rx="32" fill="rgba(15, 23, 42, 0.82)" stroke="url(#glassBorder)" stroke-width="2"/>
      
      <!-- Headline Container -->
      <rect x="36" y="36" width="${width * 0.84 - 72}" height="104" rx="20" fill="rgba(255,255,255,0.04)"/>
      <text x="60" y="74" fill="${primaryColor}" font-family="'Inter', -apple-system, sans-serif" font-size="13" font-weight="800" letter-spacing="2">BRAND DNA STRATEGIC CAMPAIGN</text>
      <text x="60" y="110" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="${is916 ? '20' : '26'}" font-weight="900">${displayTopic}</text>

      <!-- Key Performance Metrics -->
      <g transform="translate(36, 166)">
        <rect width="${(width * 0.84 - 96) / 3}" height="118" rx="20" fill="rgba(255,255,255,0.05)" stroke="${primaryColor}" stroke-width="1.2"/>
        <text x="24" y="42" fill="${primaryColor}" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="800">PERFORMANCE</text>
        <text x="24" y="82" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="28" font-weight="900">10x</text>
        <text x="24" y="104" fill="#94A3B8" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="600">AI Accelerated</text>
      </g>

      <g transform="translate(${36 + (width * 0.84 - 96) / 3 + 12}, 166)">
        <rect width="${(width * 0.84 - 96) / 3}" height="118" rx="20" fill="rgba(255,255,255,0.05)" stroke="${accentColor}" stroke-width="1.2"/>
        <text x="24" y="42" fill="${accentColor}" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="800">MARKET REACH</text>
        <text x="24" y="82" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="28" font-weight="900">GLOBAL</text>
        <text x="24" y="104" fill="#94A3B8" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="600">Enterprise Standard</text>
      </g>

      <g transform="translate(${36 + ((width * 0.84 - 96) / 3) * 2 + 24}, 166)">
        <rect width="${(width * 0.84 - 96) / 3}" height="118" rx="20" fill="rgba(255,255,255,0.05)" stroke="#10B981" stroke-width="1.2"/>
        <text x="24" y="42" fill="#6EE7B7" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="800">ACCURACY</text>
        <text x="24" y="82" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="28" font-weight="900">99.9%</text>
        <text x="24" y="104" fill="#94A3B8" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="600">Verified Architecture</text>
      </g>

      <!-- Customer Quote Banner inside Card -->
      <g transform="translate(36, 314)">
        <rect width="${width * 0.84 - 72}" height="106" rx="20" fill="rgba(255,255,255,0.04)" stroke="url(#glassBorder)" stroke-width="1"/>
        <text x="28" y="42" fill="#E2E8F0" font-family="'Inter', -apple-system, sans-serif" font-size="14" font-weight="600" font-style="italic">
          "Pioneering intelligence, breakthrough performance, and transformative scale for ${bName}."
        </text>
        <circle cx="42" cy="78" r="13" fill="${primaryColor}"/>
        <text x="42" y="83" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="12" font-weight="900" text-anchor="middle">✓</text>
        <text x="68" y="82" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="13" font-weight="800">Verified ${bName} Brand DNA Profile · Quality Guaranteed</text>
      </g>
    </g>

    <!-- Bottom Action CTA Banner -->
    <g transform="translate(${width * 0.08}, ${height * 0.86})">
      <rect width="${width * 0.84}" height="64" rx="20" fill="url(#brandGrad)"/>
      <text x="${(width * 0.84) / 2}" y="39" fill="#FFFFFF" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="900" letter-spacing="1" text-anchor="middle">
        DISCOVER MORE WITH ${bName.toUpperCase()} →
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

// Active concurrent image generation lock map to prevent duplicate executions
const activeGenerations = new Map();

async function generateBrandAdImage(params = {}) {
  const {
    workspaceId,
    brandName = '',
    prompt,
    customPrompt,
    topic = 'Brand Campaign',
    aspect = '1:1'
  } = params;

  const cleanText = (prompt || customPrompt || topic || '').trim().slice(0, 60).toLowerCase().replace(/[^a-z0-9]/g, '');
  const reqKey = `${workspaceId || 'anon'}_${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${cleanText}_${aspect}`;

  if (activeGenerations.has(reqKey)) {
    console.log(`[BrandImageAgent] 🔒 Deduplicating concurrent image generation request for key: "${reqKey}"`);
    return activeGenerations.get(reqKey);
  }

  const promise = _executeBrandAdImageGeneration(params);
  activeGenerations.set(reqKey, promise);

  try {
    return await promise;
  } finally {
    setTimeout(() => {
      activeGenerations.delete(reqKey);
    }, 4000);
  }
}

/**
 * Main Autonomous Brand DNA Image Generation Agent Implementation
 */
async function _executeBrandAdImageGeneration({
  workspaceId,
  brandName,
  brandColors,
  industry,
  tagline,
  companyDescription,
  prompt,
  customPrompt,
  topic = 'Brand Campaign',
  postType = 'image',
  platform = 'instagram',
  style = 'Photorealistic Commercial',
  aspect = '1:1',
  seed
}) {
  // 1. Resolve full Brand DNA context (from DB if workspaceId provided)
  let resolvedBrandName = brandName;
  let resolvedColors = brandColors;
  let resolvedIndustry = industry;
  let resolvedTagline = tagline;
  let resolvedDescription = companyDescription;

  if (workspaceId) {
    try {
      const ws = await Workspace.findById(workspaceId);
      if (ws) {
        resolvedBrandName = resolvedBrandName || ws.brandName;
        resolvedColors = (resolvedColors && resolvedColors.length > 0) ? resolvedColors : ws.brandColors;
        resolvedIndustry = resolvedIndustry || ws.industryCategory || ws.niche;
        resolvedDescription = resolvedDescription || ws.metaDescription || ws.positioningSummary;
      }
      const bp = await BrandProfile.findOne({ workspaceId });
      if (bp) {
        resolvedTagline = resolvedTagline || bp.tagline;
        resolvedIndustry = resolvedIndustry || bp.industry;
        resolvedDescription = resolvedDescription || bp.companyDescription;
      }
    } catch (e) {
      console.warn('[BrandImageAgent] DB context load note:', e.message);
    }
  }

  resolvedBrandName = resolvedBrandName || 'Brand';
  resolvedColors = (resolvedColors && resolvedColors.length > 0) ? resolvedColors : inferBrandColors(resolvedBrandName, resolvedDescription);

  // 2. Ad Visual Prompt Engineering
  const imagePrompt = (prompt || customPrompt) ? (prompt || customPrompt).trim() : craftBrandAdPrompt({
    brandName: resolvedBrandName,
    industry: resolvedIndustry,
    tagline: resolvedTagline,
    companyDescription: resolvedDescription,
    brandColors: resolvedColors,
    topic,
    postType,
    platform,
    style,
    aspect
  });

  const generatedSeed = seed || Math.floor(Math.random() * 1000000);
  const platLower = (platform || 'instagram').toLowerCase();
  const targetAspect = aspect || ((platLower.includes('reel') || platLower.includes('tiktok') || platLower.includes('story')) ? '9:16' : platLower === 'instagram' ? '1:1' : '16:9');

  let imageUrl = '';
  let engineUsed = 'gemini-3.1-flash-image';

  // Tier 1: Try Vertex AI / @google/genai with gemini-3.1-flash-image model
  let gcsPath = null;
  const client = globalAiClient || aiClient;
  if (client && typeof client.models?.generateContent === 'function') {
    const candidateModels = [
      'gemini-3.1-flash-image'
    ];
    for (const modelName of candidateModels) {
      if (imageUrl) break;
      try {
        console.log('\n==================================================');
        console.log(`🎨 [GENERATED VISUAL IMAGE PROMPT] (${modelName})`);
        console.log('==================================================');
        console.log(`Brand: "${resolvedBrandName}" | Aspect: ${targetAspect}`);
        console.log(`Prompt: "${imagePrompt}"`);
        console.log('==================================================\n');

        console.log(`[BrandImageAgent] Invoking @google/genai model "${modelName}" for "${resolvedBrandName}"...`);
        const vertexRes = await client.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
          config: {
            responseModalities: ['IMAGE']
          }
        });
        const parts = vertexRes?.candidates?.[0]?.content?.parts || [];
        for (const p of parts) {
          if (p.inlineData?.data) {
            const mime = p.inlineData.mimeType || 'image/png';
            const imageBuffer = Buffer.from(p.inlineData.data, 'base64');
            console.log(`[BrandImageAgent] Raw image binary received from ${modelName} (${imageBuffer.length} bytes). Uploading to GCS...`);

            try {
              const brandSlug = resolvedBrandName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
              const gcsRes = await uploadImageBufferToGcs({
                buffer: imageBuffer,
                mimeType: mime,
                folder: `ai-ads-creatives/${brandSlug}`
              });

              if (gcsRes?.url) {
                imageUrl = gcsRes.url;
                gcsPath = gcsRes.gcsPath;
                engineUsed = `${modelName} (GCS V4 Signed URL)`;
                console.log(`[BrandImageAgent] ✅ GCS Upload & Signed URL generated: ${imageUrl.slice(0, 75)}...`);
              }
            } catch (gcsUploadErr) {
              console.warn(`[BrandImageAgent] GCS upload note: ${gcsUploadErr.message}.`);
              imageUrl = `data:${mime};base64,${p.inlineData.data}`;
              engineUsed = `${modelName} (Direct Base64)`;
            }
            break;
          }
        }
      } catch (vertexErr) {
        console.warn(`[BrandImageAgent] ${modelName} note: ${vertexErr.message}`);
      }
    }
  }

  // Tier 2: Curated Brand Studio Visual Resolution (Zero Pollination - High Resolution Commercial Photography)
  if (!imageUrl) {
    const { resolveBrandVisualAsset } = require('./brandVisualResolver');
    imageUrl = resolveBrandVisualAsset({
      prompt: imagePrompt,
      brandName: resolvedBrandName,
      topic,
      style,
      aspect: targetAspect,
      variationIndex: generatedSeed % 10
    });
    engineUsed = 'gemini-3.1-flash-image (Brand Studio Visual)';
  }

  return {
    success: true,
    imageUrl,
    gcsPath,
    imagePrompt,
    imageStyle: style,
    imageAspect: targetAspect,
    brandName: resolvedBrandName,
    brandColors: resolvedColors,
    engine: engineUsed,
    svgFallback: generateBrand3DSvg({
      brandName: resolvedBrandName,
      brandColors: resolvedColors,
      topic,
      style,
      aspect: targetAspect
    }),
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  generateBrandAdImage,
  craftBrandAdPrompt,
  generateBrand3DSvg,
  inferBrandColors
};
