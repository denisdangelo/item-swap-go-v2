#!/usr/bin/env node

/**
 * Script para configurar variáveis de ambiente
 * Uso: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

console.log('🔧 Configuração de Variáveis de Ambiente');
console.log('=====================================\n');

// Verificar se .env.local já existe
if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  Arquivo .env.local já existe!');
  rl.question('Deseja sobrescrever? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      createEnvFile();
    } else {
      console.log('❌ Operação cancelada.');
      rl.close();
    }
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  console.log('\n📝 Configurando variáveis de ambiente...\n');

  // Ler template do env.example
  let envContent = '';
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
  } else {
    // Template padrão se env.example não existir
    envContent = `# Google Maps API Configuration
# Get your API key from: https://console.cloud.google.com/apis/credentials
# Make sure to enable: Maps JavaScript API and Geocoding API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# API Configuration
VITE_API_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=Empresta aê
VITE_APP_DESCRIPTION=Plataforma de empréstimo de itens entre vizinhos
VITE_APP_VERSION=1.0.0

# Default Location (São Paulo, Brazil)
VITE_DEFAULT_LAT=-23.55052
VITE_DEFAULT_LNG=-46.633308

# Upload Configuration
VITE_MAX_UPLOAD_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Cache Configuration
VITE_CACHE_PREFIX=item_swap_
VITE_CACHE_VERSION=1

# Optional: Analytics
# VITE_GA_TRACKING_ID=your_ga_tracking_id_here

# Optional: Push Notifications
# VITE_PUSH_PUBLIC_KEY=your_push_public_key_here
`;
  }

  rl.question('🔑 Chave da API do Google Maps (deixe vazio para pular): ', (apiKey) => {
    if (apiKey.trim()) {
      envContent = envContent.replace('your_google_maps_api_key_here', apiKey.trim());
    }

    rl.question('🌐 URL da API (deixe vazio para usar padrão): ', (apiUrl) => {
      if (apiUrl.trim()) {
        envContent = envContent.replace('http://localhost:3000/api', apiUrl.trim());
      }

      rl.question('📍 Latitude padrão (deixe vazio para usar São Paulo): ', (lat) => {
        if (lat.trim()) {
          envContent = envContent.replace('-23.55052', lat.trim());
        }

        rl.question('📍 Longitude padrão (deixe vazio para usar São Paulo): ', (lng) => {
          if (lng.trim()) {
            envContent = envContent.replace('-46.633308', lng.trim());
          }

          // Salvar arquivo
          try {
            fs.writeFileSync(envLocalPath, envContent);
            console.log('\n✅ Arquivo .env.local criado com sucesso!');
            console.log('\n📋 Próximos passos:');
            console.log('1. Se você configurou a chave do Google Maps, certifique-se de:');
            console.log('   - Habilitar as APIs: Maps JavaScript API e Geocoding API');
            console.log('   - Configurar restrições de domínio (recomendado)');
            console.log('   - Ativar faturação no Google Cloud Console');
            console.log('2. Reinicie o servidor de desenvolvimento: npm run dev');
            console.log('\n📚 Para mais informações, consulte:');
            console.log('   - README.md');
            console.log('   - TROUBLESHOOTING.md');
          } catch (error) {
            console.error('❌ Erro ao criar arquivo .env.local:', error.message);
          }

          rl.close();
        });
      });
    });
  });
}
