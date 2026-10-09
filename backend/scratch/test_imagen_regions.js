process.env.GOOGLE_GENAI_USE_VERTEXAI = 'true';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');

async function testRegions() {
  const regions = ['us-central1', 'us-east4', 'europe-west1', 'asia-east1', 'us-west1'];
  const models = ['imagen-3.0-generate-002', 'imagen-3.0-fast-generate-001', 'imagen-3.0-generate-001'];

  for (const reg of regions) {
    console.log(`\n--- Testing Region: ${reg} ---`);
    const client = new GoogleGenAI({
      vertexAI: true,
      project: process.env.GCP_PROJECT_ID || 'ai-mall-484810',
      location: reg
    });

    for (const model of models) {
      try {
        const res = await client.models.generateImages({
          model: model,
          prompt: 'A sleek modern luxury product photography shot',
          config: { numberOfImages: 1, outputMimeType: 'image/png' }
        });
        const bytes = res?.generatedImages?.[0]?.image?.imageBytes;
        if (bytes) {
          console.log(`🎉 SUCCESS! Region: ${reg} | Model: ${model} | Bytes: ${bytes.length}`);
          return;
        }
      } catch (err) {
        console.log(`❌ ${model} @ ${reg}:`, err.message);
      }
    }
  }
}

testRegions();
