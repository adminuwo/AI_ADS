process.env.GOOGLE_GENAI_USE_VERTEXAI = 'true';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');

async function testImagen() {
  console.log('Testing Imagen 3 in Vertex AI us-central1...');
  const client = new GoogleGenAI({
    vertexAI: true,
    project: process.env.GCP_PROJECT_ID || 'ai-mall-484810',
    location: 'us-central1'
  });

  const models = ['imagen-3.0-generate-002', 'imagen-3.0-fast-generate-001'];

  for (const model of models) {
    try {
      console.log(`Trying generateImages for model ${model}...`);
      const res = await client.models.generateImages({
        model: model,
        prompt: 'Commercial product photograph of a modern luxury perfume bottle on a sleek black background',
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1'
        }
      });
      const bytes = res?.generatedImages?.[0]?.image?.imageBytes;
      if (bytes) {
        console.log(`🎉 SUCCESS! Model ${model} returned ${bytes.length} bytes!`);
        return;
      }
    } catch (err) {
      console.error(`❌ Model ${model} error:`, err.message);
    }
  }
}

testImagen();
