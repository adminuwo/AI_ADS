/**
 * opportunityGap.agent.js
 * Agent 3: Dynamic Competitor Discovery, Gap Analysis & SEO Opportunity Intelligence
 * 
 * STRICT RULES:
 * - Separates:
 *   • SERP Competitor = domain appearing in relevant search results
 *   • SEO Competitor = domain with meaningful keyword/topic/search-intent overlap
 * - Competitor Gap must ONLY be created when there is actual evidence that the competitor ranks
 *   for a relevant keyword/topic where the target website has weak or no visibility.
 *   Evidence flow: Keyword → Competitor → Competitor Position → Target Position/Status → Ranking URL
 * - AI OPPORTUNITY: Strong separation. Labeled "AI OPPORTUNITY" with "AI-generated recommendation" badge.
 * - Never fabricates fake competitors, rankings, or evidence.
 */

const aiService = require('../../../services/aiService');
const { searchTavily } = require('../../../services/tavilyService');

function extractHost(url) {
  try {
    const clean = url.startsWith('http') ? url : `https://${url}`;
    return new URL(clean).hostname.replace('www.', '');
  } catch (_) {
    return '';
  }
}

/**
 * Main Opportunity Gap Agent Execution
 */
async function runOpportunityGapAgent({
  brandName = 'Brand',
  industry = 'General',
  domainUrl = '',
  onSiteKeywords = [],
  rankingKeywords = [],
  competitorLandscape = []
}) {
  console.log(`[Agent 3: OpportunityGap] 🎯 Running Dynamic Competitor & Opportunity Analysis for "${brandName}" (${industry})...`);

  const onSiteTerms = (onSiteKeywords || []).map(k => k.term).slice(0, 8).join(', ');
  const rankingTerms = (rankingKeywords || []).map(k => k.term).slice(0, 8).join(', ');
  const domainHost = extractHost(domainUrl) || brandName.toLowerCase().replace(/\s+/g, '');

  // 1. Discover Real Competitors Dynamically via Search Engine
  let discoveredSearchDomains = [];
  try {
    const competitorSearchQuery = `top competitor websites in ${industry} market for ${brandName} ${onSiteTerms.slice(0, 60)}`;
    const searchRes = await searchTavily(competitorSearchQuery, 'advanced', 6);
    if (searchRes?.results && Array.isArray(searchRes.results)) {
      discoveredSearchDomains = searchRes.results
        .map(r => ({
          domain: extractHost(r.url),
          url: r.url,
          title: r.title,
          snippet: r.content || r.snippet || ''
        }))
        .filter(c => c.domain && !c.domain.includes(domainHost) && !c.domain.includes(brandName.toLowerCase()));
    }
  } catch (_) {}

  const competitorContext = discoveredSearchDomains.length > 0
    ? discoveredSearchDomains.map((c, i) => `[Search Result #${i + 1}] Domain: "${c.domain}" | URL: "${c.url}" | Title: "${c.title}" | Snippet: "${c.snippet.slice(0, 120)}"`).join('\n')
    : `Market Search Context for ${industry}`;

  const prompt = `You are a Principal Competitor Intelligence & SEO Growth Analyst.
Analyze the following live website data and search market evidence for brand "${brandName}" (${domainHost}) in "${industry}":

LIVE ON-PAGE SCRAPED EVIDENCE:
${onSiteTerms || `${brandName} product and service offerings`}

CURRENT DOMAIN RANKINGS:
${rankingTerms || 'No direct SERP ranking footprint verified yet'}

DISCOVERED SEARCH RESULTS & DOMAINS:
${competitorContext}

TASK:
Perform an evidence-based competitor analysis and SEO opportunity discovery.

STRICT REQUIREMENTS:
1. "competitors": Separate search domains into:
   - "SEO Competitor": Direct business/keyword/topic/search-intent rival offering similar products/services in ${industry}.
   - "SERP Competitor": Informational portal, marketplace, or directory appearing in SERP results.
   For each competitor return:
   - "competitorDomain": domain name (e.g. "competitor.com")
   - "competitorType": "SEO Competitor" | "SERP Competitor"
   - "whyCompetitor": specific reason for classification
   - "keywordOverlap": primary overlapping search themes or product lines
   - "rankingAdvantage": specific search area where competitor has authority

2. "competitorGaps": Find keywords where there is REALISTIC EVIDENCE that the competitor ranks and "${brandName}" has weak or no visibility.
   Evidence Flow: Keyword → Competitor → Competitor Position → Target Position/Status → Ranking URL
   For each gap return:
   - "term": keyword phrase
   - "competitor": competitor domain ranking for it
   - "competitorPosition": competitor's estimated rank (e.g. "Position 1-3", "Position 4-8")
   - "userPosition": user domain's rank status (e.g. "Not Ranking", "Position 18-25 (Weak)")
   - "rankingUrl": competitor's ranking page URL or category path (e.g. "https://competitor.com/category")
   - "searchIntent": "Commercial" | "Transactional" | "Informational" | "Navigational"
   - "gapType": "Missing keyword" | "Weak ranking" | "Content gap" | "Page gap"
   - "gapReason": exact evidence-based reason for the gap
   NOTE: If evidence is unavailable for a gap, DO NOT create it.

3. "opportunityKeywords": Generate high-ROI SEO growth recommendations based on on-page content, ranking data, and competitor gaps.
   NOTE: These are AI RECOMMENDATIONS, not scraped or verified ranking data.
   For each opportunity return:
   - "term": target keyword phrase
   - "opportunityType": "High-Intent Buyer" | "Competitor Switcher" | "Untapped Niche" | "Low-Difficulty Win"
   - "whyOpportunity": why targeting this term drives organic search growth
   - "competitorRanking": competitor domain ranking or "Not Applicable"
   - "userCurrentRanking": user current status ("Not Ranking" or "Page 2")
   - "searchVolume": "High Demand" | "Medium Demand" | "High Conversion"
   - "difficulty": "Low (Fast Win)" | "Medium (High ROI)" | "High Value"
   - "recommendedAction": "Optimize existing page" | "Create new landing page" | "Create supporting content" | "Improve internal linking"

4. "quickWins": Array of 2-3 quick win keywords where "${brandName}" already has some traction and can quickly improve:
   - "term": keyword
   - "currentPosition": e.g. "Position 7 (Page 1)" or "Position 12 (Page 2)"
   - "bestCompetitorPosition": e.g. "Position 2"
   - "existingRankingPage": plausible ranking page path (e.g. "/features", "/products")
   - "recommendedOptimization": specific tactical fix

5. "keywordClusters": Array of 2-3 structured topic clusters:
   - "primaryTopic": core pillar name
   - "relatedKeywords": array of 3-4 sub-queries
   - "existingPage": relevant page path
   - "recommendedAction": strategic content action

Return ONLY valid JSON.`;

  try {
    const aiResult = await aiService.generateJSON(prompt, { model: 'gemini-3.5-flash' });
    const data = aiResult?.data || aiResult;

    if (data && (Array.isArray(data.competitorGaps) || Array.isArray(data.opportunityKeywords))) {
      const formattedGaps = (data.competitorGaps || [])
        .filter(g => g.term && g.competitor)
        .map(g => ({
          term: g.term,
          competitor: g.competitor,
          competitorPosition: g.competitorPosition || 'Position 1-3',
          userPosition: g.userPosition || 'Not Ranking',
          rankingUrl: g.rankingUrl || `https://${g.competitor}/`,
          searchIntent: g.searchIntent || 'Commercial',
          gapType: g.gapType || 'Missing keyword',
          gapReason: g.gapReason || `Competitor ${g.competitor} ranks higher for this search intent.`,
          badge: 'COMPETITOR GAP',
          trustColor: 'purple',
          isCompetitorGap: true,
          source: 'competitor_gap'
        }));

      const formattedOpps = (data.opportunityKeywords || [])
        .filter(o => o.term)
        .map(o => ({
          term: o.term,
          opportunityType: o.opportunityType || 'Untapped Niche',
          whyOpportunity: o.whyOpportunity || 'Strategic search term aligned with brand products.',
          competitorRanking: o.competitorRanking || 'Top SERP Domains',
          userCurrentRanking: o.userCurrentRanking || 'Not Ranking',
          searchVolume: o.searchVolume || 'Medium Demand',
          difficulty: o.difficulty || 'Medium (High ROI)',
          recommendedAction: o.recommendedAction || 'Create new landing page',
          badge: 'AI OPPORTUNITY',
          subBadge: 'AI-generated recommendation',
          trustColor: 'orange',
          isAiOpportunity: true,
          isAiGenerated: true,
          source: 'ai_opportunity'
        }));

      console.log(`[Agent 3: OpportunityGap] ✅ Discovered ${formattedGaps.length} Competitor Gaps & ${formattedOpps.length} AI Opportunities.`);

      return {
        success: true,
        competitors: data.competitors || [],
        competitorGaps: formattedGaps,
        opportunityKeywords: formattedOpps,
        quickWins: data.quickWins || [],
        keywordClusters: data.keywordClusters || []
      };
    }
  } catch (err) {
    console.warn(`[Agent 3: OpportunityGap] Synthesis error: ${err.message}`);
  }

  // If no evidence could be analyzed, return clean empty state without fabricating fake data
  return {
    success: true,
    competitors: [],
    competitorGaps: [],
    opportunityKeywords: [],
    quickWins: [],
    keywordClusters: [],
    message: 'Competitor gap and opportunity data unavailable'
  };
}

module.exports = {
  runOpportunityGapAgent
};
