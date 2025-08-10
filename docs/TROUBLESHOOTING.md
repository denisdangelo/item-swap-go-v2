# Guia de Solução de Problemas - Google Maps API

## Problemas Comuns e Soluções

### 1. Erro: "Google Maps API request denied. Check API key restrictions."

**Causa:** A chave da API do Google Maps não está configurada ou tem restrições
que impedem seu uso.

**Soluções:**

#### A. Verificar se a chave está configurada

1. Abra o console do navegador (F12)
2. Procure por mensagens de log que começam com "🔧 Status das Configurações de
   Ambiente"
3. Verifique se a mensagem mostra "Chave da API do Google Maps configurada"

#### B. Configurar a chave da API

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione a linha: `VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui`
3. Substitua `sua_chave_aqui` pela chave real
4. Reinicie o servidor de desenvolvimento

#### C. Obter uma nova chave da API

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "API Key"
5. Copie a chave gerada

#### D. Habilitar as APIs necessárias

No Google Cloud Console, vá para "APIs & Services" > "Library" e habilite:

- **Maps JavaScript API**
- **Geocoding API**

#### E. Configurar restrições de domínio

1. Vá para "APIs & Services" > "Credentials"
2. Clique na sua chave da API
3. Em "Application restrictions", selecione "HTTP referrers"
4. Adicione os domínios:
   - `localhost:*`
   - `127.0.0.1:*`
   - Seu domínio de produção (se aplicável)

### 2. Erro: "InvalidKeyMapError"

**Causa:** A chave da API é inválida ou expirou.

**Soluções:**

1. Verifique se a chave está correta no arquivo `.env.local`
2. Gere uma nova chave no Google Cloud Console
3. Verifique se a chave não expirou
4. Confirme se as APIs estão habilitadas
5. **Importante:** Verifique se a faturação está ativada no Google Cloud

### 3. Erro: "API key does not have Geocoding API enabled"

**Causa:** A Geocoding API não está habilitada no projeto.

**Solução:**

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto
3. Vá para "APIs & Services" > "Library"
4. Procure por "Geocoding API"
5. Clique em "Enable"

### 4. Erro: "OVER_QUERY_LIMIT"

**Causa:** A cota da API foi excedida.

**Soluções:**

1. Aguarde até o próximo período de cobrança
2. Configure limites de uso no Google Cloud Console
3. Considere usar um plano pago se necessário
4. Verifique se há cobranças pendentes na conta

### 5. Erro: "O mapa é inicializado sem um ID de mapa válido"

**Causa:** O componente do mapa está tentando inicializar sem uma chave válida.

**Solução:** Configure a chave da API seguindo os passos acima.

### 6. Aplicação não carrega o mapa

**Causa:** Problemas de configuração ou rede.

**Soluções:**

1. Verifique se o arquivo `.env.local` está na raiz do projeto
2. Confirme que a variável `VITE_GOOGLE_MAPS_API_KEY` está definida
3. Reinicie o servidor de desenvolvimento após configurar a chave
4. Verifique se não há bloqueios de firewall ou proxy

## Verificação Rápida

Para verificar se tudo está configurado corretamente:

1. Abra o console do navegador (F12)
2. Recarregue a página
3. Procure por estas mensagens:
   ```
   🔧 Status das Configurações de Ambiente
   🗺️ Google Maps: Chave da API do Google Maps configurada
   🌐 API: URL da API configurada
   ✅ Todas as configurações estão corretas!
   ```

## Estrutura do Arquivo .env.local

```env
# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...sua_chave_aqui

# API Configuration
VITE_API_URL=http://localhost:3000/api

# Default Location (São Paulo)
VITE_DEFAULT_LAT=-23.55052
VITE_DEFAULT_LNG=-46.633308
```

## Passo a Passo Completo para Configurar Google Maps

### 1. Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Select a project" > "New Project"
3. Digite um nome para o projeto (ex: "item-swap-maps")
4. Clique em "Create"

### 2. Habilitar APIs

1. No menu lateral, vá para "APIs & Services" > "Library"
2. Procure por "Maps JavaScript API" e clique em "Enable"
3. Procure por "Geocoding API" e clique em "Enable"

### 3. Criar Chave da API

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "API Key"
3. Copie a chave gerada

### 4. Configurar Restrições (Recomendado)

1. Clique na chave da API criada
2. Em "Application restrictions", selecione "HTTP referrers"
3. Adicione os domínios:
   - `localhost:*`
   - `127.0.0.1:*`
   - `192.168.*.*` (para desenvolvimento local)
4. Em "API restrictions", selecione "Restrict key"
5. Selecione apenas "Maps JavaScript API" e "Geocoding API"
6. Clique em "Save"

### 5. Ativar Faturação (Obrigatório)

1. No menu lateral, vá para "Billing"
2. Clique em "Link a billing account"
3. Crie uma conta de faturação ou vincule uma existente
4. **Nota:** O Google oferece $200 de crédito gratuito por mês

### 6. Configurar no Projeto

1. Crie o arquivo `.env.local` na raiz do projeto
2. Adicione: `VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui`
3. Substitua `sua_chave_aqui` pela chave real
4. Reinicie o servidor: `npm run dev`

## Fallback e Funcionalidades Alternativas

Se o Google Maps não estiver disponível, a aplicação oferece:

- **Lista de itens com distância:** Os itens são exibidos em uma lista com
  informações de distância calculadas
- **Geolocalização básica:** Usa o serviço de fallback (Nominatim) para
  geocodificação
- **Funcionalidade completa:** Todas as outras funcionalidades continuam
  funcionando normalmente

## Recursos Úteis

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [Error Messages Reference](https://developers.google.com/maps/documentation/javascript/error-messages)
- [Billing and Quotas](https://developers.google.com/maps/documentation/javascript/usage-and-billing)

## Suporte

Se os problemas persistirem:

1. Verifique se todas as APIs estão habilitadas
2. Confirme se as restrições de domínio estão corretas
3. Teste a chave em um projeto simples
4. Consulte a documentação oficial do Google Maps
5. Verifique se há cobranças pendentes na conta do Google Cloud
6. Confirme se a faturação está ativada

### Contato para Suporte

- Verifique os logs no console do navegador
- Consulte a documentação oficial do Google Maps
- Se necessário, entre em contato com o suporte do Google Cloud
