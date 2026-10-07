/**
 * Unified Web Options (UWO) Central Auth Configuration
 * Enables seamless Single Sign-On (SSO) between AI Ads and the Unified Platform.
 */
import { API_BASE } from '../config/api';

export const getUnifiedApiBaseUrl = () => {
  const envUrl = (typeof window !== 'undefined' && window._env_?.VITE_UNIFIED_BACKEND_API) ||
    import.meta.env?.VITE_UNIFIED_BACKEND_API;

  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname;
    // When running in production/staging (not localhost), use live domain if not set
    if (currentHost && currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        return envUrl.trim().replace(/\/+$/, '');
      }
      return 'https://uwo24.com/api';
    }
  }

  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  return 'https://uwo24.com/api';
};

export const getBackendApiUrl = () => {
  const envUrl = (typeof window !== 'undefined' && window._env_?.VITE_API_URL) ||
    import.meta.env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return API_BASE;
};

export const getApis = () => {
  const unifiedBase = getUnifiedApiBaseUrl();
  const apiBase = getBackendApiUrl();

  // On uwo24.com live backend, Central Identity routes are mounted under /api/unified-auth
  const isUwoLive = unifiedBase.includes('uwo24.com');
  const authBase = isUwoLive ? `${unifiedBase}/unified-auth` : `${unifiedBase}/auth`;

  return {
    unifiedAuth: {
      register: `${authBase}/register`,
      login: `${authBase}/login`,
      forgotPassword: `${authBase}/forgot-password`,
      resetPassword: `${authBase}/reset-password`,
      me: `${authBase}/me`,
    },
    uwoLogin: `${apiBase}/auth/uwo-login`,
    baseUrl: apiBase,
  };
};

export const apis = getApis();
export default apis;
