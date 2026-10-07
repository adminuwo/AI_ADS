/**
 * Global API Base Configuration
 * In local development, Vite dev server proxies '/api' to backend (e.g., http://127.0.0.1:5000).
 * In production on GCP Cloud Run, the unified Express server serves frontend at '/' and API at '/api'.
 * Can be explicitly overridden with VITE_API_URL if needed.
 */

const resolveApiBase = () => {
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // On live domain (aiads.aisa24.com or any non-localhost host), use relative /api unless explicitly set to a valid HTTPS URL
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const explicit = (
        (window._env_ && window._env_.VITE_API_BASE_URL) ||
        import.meta.env.VITE_API_BASE_URL ||
        (window._env_ && window._env_.VITE_API_URL) ||
        import.meta.env.VITE_API_URL ||
        ''
      ).trim();
      if (explicit && (explicit.startsWith('https://') || explicit.startsWith('/'))) {
        return explicit.replace(/\/+$/, '');
      }
      return '/api';
    }
  }

  return (
    (typeof window !== 'undefined' && window._env_ && window._env_.VITE_API_BASE_URL) ||
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' && window._env_ && window._env_.VITE_API_URL) ||
    import.meta.env.VITE_API_URL ||
    '/api'
  ).replace(/\/+$/, '');
};

export const API_BASE = resolveApiBase();

/**
 * Returns full URL for a given API endpoint path.
 * @param {string} endpoint - e.g. '/chat' or 'chat'
 * @returns {string} - e.g. '/api/chat'
 */
export const getApiUrl = (endpoint = '') => {
  if (!endpoint) return API_BASE;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};

export default API_BASE;
