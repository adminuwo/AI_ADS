process.env.GOOGLE_GENAI_USE_VERTEXAI = 'true';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');

async function testUsCentral1Imagen() {
  console.log('Testing Imagen 3 specifically with location: "us-central1"...');
  
  const client = new GoogleGenAI({
    vertexAI: true,
    project: process.env.GCP_PROJECT_ID || 'ai-mall-484810',
    location: 'us-central1'
  });

  const models = ['imagen-3.0-generate-002', 'imagen-3.0-fast-generate-001'];

  for (const m of models) {
    try {
      console.log(`Trying model ${m} in us-central1...`);
      const res = await client.models.generateImages({
        model: m,
        prompt: 'A sleek motorcycle on a city street at night, commercial photography',
        config: { numberOfImages: 1, outputMimeType: 'image/png' }
      });
      const bytes = res?.generatedImages?.[0]?.image?.imageBytes;
      if (bytes) {
        console.log(`🎉 SUCCESS IN US-CENTRAL1! Model ${m} returned ${bytes.length} bytes!`);
        return;
      }
    } catch (err) {
      console.error(`❌ Error for ${m} in us-central1:`, err.message);
    }
  }
}

testUsCentral1Imagen();
