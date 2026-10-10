process.env.GOOGLE_GENAI_USE_VERTEXAI = 'true';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');

async function testFix() {
  console.log('Testing GoogleGenAI with Vertex AI mode explicit...');
  const client = new GoogleGenAI({
    vertexAI: true,
    project: process.env.GCP_PROJECT_ID || 'ai-mall-484810',
    location: 'us-central1'
  });

  try {
    const res = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello Vertex AI, reply in 5 words.'
    });
    console.log('✅ Vertex text success:', res.text || res.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (err) {
    console.error('❌ Vertex text error:', err.message);
  }
}

testFix();
