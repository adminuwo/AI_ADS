const SystemSetting = require('../models/SystemSetting');

const DEFAULT_MODEL_CONFIG = {
  // ─── 1. Text Response & AI Copilot Chat ───
  textModel: 'gemini-2.5-flash',
  fallbackTextModel: 'gemini-2.5-flash',
  textTemperature: 0.7,
  jsonTemperature: 0.1,
  textMaxTokens: 4096,

  // ─── 2. Autonomous Website Builder ───
  websiteBuilderModel: 'gemini-2.5-flash',

  // ─── 3. SEO Engine & Blog Generator ───
  seoModel: 'gemini-2.5-flash',

  // ─── 4. 30-Day Content Strategy Agent ───
  strategyModel: 'gemini-2.5-flash',

  // ─── 5. Visual Ad Image Generation Engine ───
  imageModel: 'gemini-3.1-flash-image',
  fallbackImageModel: 'imagen-3.0-generate-002',
  imageProvider: 'vertex-ai',
  imageAspectRatio: '1:1',

  // ─── 6. Google Live Search Grounding ───
  groundingModel: 'gemini-2.5-flash',

  // ─── 7. Vision & Logo Color Grounding ───
  visionModel: 'gemini-2.5-flash',

  // ─── 8. Visual Prompt Crafting ───
  promptCraftingModel: 'gemini-2.5-flash',

  // ─── Metadata ───
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system'
};

// In-memory cache for ultra-fast zero-latency lookup across all agent requests
let activeCachedConfig = { ...DEFAULT_MODEL_CONFIG };

/**
 * Initializes and warms the in-memory cache from MongoDB on startup.
 */
async function initModelConfig() {
  try {
    const setting = await SystemSetting.findOne({ key: 'ai_model_config' });
    if (setting && setting.value) {
      activeCachedConfig = {
        ...DEFAULT_MODEL_CONFIG,
        ...setting.value
      };
      console.log(`🤖 [ModelConfig] Loaded active AI models: Text="${activeCachedConfig.textModel}", Image="${activeCachedConfig.imageModel}"`);
    } else {
      await SystemSetting.findOneAndUpdate(
        { key: 'ai_model_config' },
        { key: 'ai_model_config', value: DEFAULT_MODEL_CONFIG },
        { upsert: true, new: true }
      );
      console.log(`🤖 [ModelConfig] Initialized default AI models: Text="${DEFAULT_MODEL_CONFIG.textModel}", Image="${DEFAULT_MODEL_CONFIG.imageModel}"`);
    }
  } catch (err) {
    console.warn('[ModelConfig] Note on initializing model config:', err.message);
  }
}

/**
 * Synchronous getter for request execution paths that do not await DB calls.
 */
function getActiveModelConfigSync() {
  return activeCachedConfig;
}

/**
 * Asynchronous getter that ensures latest DB state.
 */
async function getActiveModelConfig() {
  try {
    const setting = await SystemSetting.findOne({ key: 'ai_model_config' });
    if (setting && setting.value) {
      activeCachedConfig = {
        ...DEFAULT_MODEL_CONFIG,
        ...setting.value
      };
    }
  } catch (err) {
    // Return cached on DB error
  }
  return activeCachedConfig;
}

/**
 * Updates the model configuration in both memory cache and MongoDB.
 */
async function updateModelConfig(newConfig, updatedBy = 'Admin') {
  const merged = {
    ...activeCachedConfig,
    ...newConfig,
    lastUpdated: new Date().toISOString(),
    updatedBy
  };

  activeCachedConfig = merged;

  try {
    await SystemSetting.findOneAndUpdate(
      { key: 'ai_model_config' },
      { key: 'ai_model_config', value: merged },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`✅ [ModelConfig] AI Models successfully updated by ${updatedBy}: Text="${merged.textModel}", Image="${merged.imageModel}"`);
  } catch (err) {
    console.error('[ModelConfig] Error saving model config to DB:', err.message);
    throw err;
  }

  return activeCachedConfig;
}

/**
 * Resets the model configuration back to factory default.
 */
async function resetModelConfig(updatedBy = 'Admin') {
  return await updateModelConfig(DEFAULT_MODEL_CONFIG, updatedBy);
}

module.exports = {
  DEFAULT_MODEL_CONFIG,
  initModelConfig,
  getActiveModelConfig,
  getActiveModelConfigSync,
  updateModelConfig,
  resetModelConfig
};
