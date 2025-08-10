/**
 * Configurações da API
 */
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Configurações de autenticação
 */
export const AUTH_CONFIG = {
  tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  tokenPrefix: 'Bearer ',
} as const;

/**
 * Configurações do aplicativo
 */
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Empresta aê',
  description:
    import.meta.env.VITE_APP_DESCRIPTION || 'Plataforma de empréstimo de itens entre vizinhos',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

/**
 * Configurações de mapa
 */
export const MAP_CONFIG = {
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  defaultLocation: {
    lat: Number(import.meta.env.VITE_DEFAULT_LAT) || -23.55052,
    lng: Number(import.meta.env.VITE_DEFAULT_LNG) || -46.633308,
  },
  defaultZoom: 12,
} as const;

/**
 * Configurações de upload
 */
export const UPLOAD_CONFIG = {
  maxSize: Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 5 * 1024 * 1024, // 5MB
  allowedTypes: (
    import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp'
  ).split(','),
} as const;

/**
 * Configurações de cache
 */
export const CACHE_CONFIG = {
  prefix: import.meta.env.VITE_CACHE_PREFIX || 'item_swap_',
  version: import.meta.env.VITE_CACHE_VERSION || '1',
  defaultTTL: 60 * 60 * 1000, // 1 hora
} as const;

/**
 * Configurações de analytics
 */
export const ANALYTICS_CONFIG = {
  gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID,
} as const;

/**
 * Configurações de notificações
 */
export const NOTIFICATION_CONFIG = {
  pushPublicKey: import.meta.env.VITE_PUSH_PUBLIC_KEY,
} as const;

/**
 * Verifica se todas as variáveis de ambiente obrigatórias estão definidas
 */
export function validateEnv() {
  const requiredVars = ['VITE_API_URL'];

  const optionalVars = ['VITE_MAPBOX_TOKEN', 'VITE_GOOGLE_MAPS_API_KEY', 'VITE_GA_TRACKING_ID'];

  const missingRequiredVars = requiredVars.filter((varName) => !import.meta.env[varName]);

  if (missingRequiredVars.length > 0) {
    console.error(
      '❌ Variáveis de ambiente obrigatórias não definidas:',
      missingRequiredVars.join(', ')
    );
    throw new Error('Variáveis de ambiente obrigatórias não definidas');
  }

  const missingOptionalVars = optionalVars.filter((varName) => !import.meta.env[varName]);

  if (missingOptionalVars.length > 0) {
    console.warn(
      '⚠️ Variáveis de ambiente opcionais não definidas:',
      missingOptionalVars.join(', ')
    );

    if (missingOptionalVars.includes('VITE_GOOGLE_MAPS_API_KEY')) {
      console.warn(
        '⚠️ A chave da API do Google Maps não está configurada. A geolocalização usará o serviço de fallback (Nominatim).'
      );
    }
  }
}

// Valida as variáveis de ambiente ao iniciar
// validateEnv();
