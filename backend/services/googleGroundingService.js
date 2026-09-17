const { aiClient, globalAiClient } = require('../config/vertex');

/**
 * googleGroundingService.js
 * Executes real-time Google Search Grounding queries using Google Cloud Vertex AI / Gemini SDK
 */

async function searchWithGoogleGrounding(prompt, model = 'gemini-2.5-flash') {
  const client = globalAiClient || aiClient;
  if (!client) {
    console.warn('[GoogleGrounding] Google Vertex/Gemini client is not initialized.');
    return null;
  }

  const candidateModels = [model, 'gemini-2.5-flash', 'gemini-1.5-flash-002'];
  for (const mName of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model: mName,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || '';
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata || {};
      const webQueries = groundingMetadata.webSearchQueries || [];
      const groundingChunks = (groundingMetadata.groundingChunks || []).map(c => c.web || c);

      return {
        success: true,
        text,
        webQueries,
        groundingChunks,
        groundingMetadata,
        model: mName
      };
    } catch (err) {
      console.warn(`[GoogleGrounding] Model "${mName}" note: ${err.message?.slice(0, 120)}`);
    }
  }

  return null;
}

module.exports = {
  searchWithGoogleGrounding
};
