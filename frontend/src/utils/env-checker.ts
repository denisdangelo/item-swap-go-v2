/**
 * Utilitário para verificar configurações de ambiente
 */

export interface EnvCheckResult {
  googleMaps: {
    hasKey: boolean;
    isValid: boolean;
    message: string;
  };
  api: {
    hasUrl: boolean;
    message: string;
  };
  overall: {
    isConfigured: boolean;
    missingItems: string[];
  };
}

export function checkEnvironmentVariables(): EnvCheckResult {
  const result: EnvCheckResult = {
    googleMaps: {
      hasKey: false,
      isValid: false,
      message: '',
    },
    api: {
      hasUrl: false,
      message: '',
    },
    overall: {
      isConfigured: false,
      missingItems: [],
    },
  };

  // Verificar Google Maps API Key
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  result.googleMaps.hasKey = !!googleMapsKey && googleMapsKey.trim() !== '';

  if (!result.googleMaps.hasKey) {
    result.googleMaps.message = 'Chave da API do Google Maps não configurada';
    result.overall.missingItems.push('VITE_GOOGLE_MAPS_API_KEY');
  } else {
    result.googleMaps.message = 'Chave da API do Google Maps configurada';
    result.googleMaps.isValid = true;
  }

  // Verificar API URL
  const apiUrl = import.meta.env.VITE_API_URL;
  result.api.hasUrl = !!apiUrl && apiUrl.trim() !== '';

  if (!result.api.hasUrl) {
    result.api.message = 'URL da API não configurada';
    result.overall.missingItems.push('VITE_API_URL');
  } else {
    result.api.message = 'URL da API configurada';
  }

  // Verificar configuração geral
  result.overall.isConfigured = result.googleMaps.hasKey && result.api.hasUrl;

  return result;
}

export function logEnvironmentStatus(): void {
  const status = checkEnvironmentVariables();

  console.group('🔧 Status das Configurações de Ambiente');

  console.log('🗺️ Google Maps:', status.googleMaps.message);
  console.log('🌐 API:', status.api.message);

  if (status.overall.isConfigured) {
    console.log('✅ Todas as configurações estão corretas!');
  } else {
    console.log('⚠️ Configurações pendentes:', status.overall.missingItems.join(', '));
    console.log('📖 Consulte o README.md para instruções de configuração');
  }

  console.groupEnd();
}

export function getSetupInstructions(): string[] {
  const instructions = [
    'Para configurar o Google Maps API:',
    '1. Acesse https://console.cloud.google.com/',
    '2. Crie um projeto ou selecione um existente',
    '3. Vá para "APIs & Services" > "Credentials"',
    '4. Clique em "Create Credentials" > "API Key"',
    '5. Habilite as APIs: Maps JavaScript API e Geocoding API',
    '6. Configure restrições de domínio (recomendado)',
    '7. Crie um arquivo .env.local na raiz do projeto',
    '8. Adicione: VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui',
    '',
    'Para configurar a API:',
    '1. Adicione ao .env.local: VITE_API_URL=http://localhost:3000/api',
    '',
    'Após configurar, reinicie o servidor de desenvolvimento.',
  ];

  return instructions;
}
