require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');

async function runTest() {
  console.log('Testing Vertex AI Image Generation...');
  console.log('GCP_PROJECT_ID:', process.env.GCP_PROJECT_ID);
  console.log('GEMINI_API_KEY present?:', Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY));

  const client = new GoogleGenAI({
    vertexAI: true,
    project: process.env.GCP_PROJECT_ID || 'ai-mall-484810',
    location: 'us-central1'
  });

  const models = ['imagen-3.0-generate-002', 'imagen-3.0-fast-generate-001', 'gemini-2.5-flash'];
  
  for (const m of models) {
    try {
      console.log(`\nTesting generateImages with model ${m}...`);
      const res = await client.models.generateImages({
        model: m,
        prompt: 'A modern sleek beverage bottle on a luxury studio background',
        config: { numberOfImages: 1, outputMimeType: 'image/png' }
      });
      console.log(`✅ Success for ${m}! Bytes:`, res?.generatedImages?.[0]?.image?.imageBytes?.length);
    } catch (err) {
      console.error(`❌ Failed for ${m}:`, err.message);
    }
  }
}

runTest();
