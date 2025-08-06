# 🚀 Guia de Migração para Azure Database - Empresta aê

Este guia contém todas as instruções para migrar e modernizar o banco de dados
do "Empresta aê" para Azure Database for MySQL Flexible Server.

## 📋 Arquivos Incluídos

- `azure-schema-modernized.sql` - Schema completo modernizado com UUIDs
- `azure-configuration.sql` - Configurações otimizadas para Azure
- `../scripts/migrate-to-azure-schema.ts` - Script de migração de dados
- Este README com instruções completas

## 🏗️ Pré-requisitos

### 1. Recursos Azure Necessários

- Azure Database for MySQL Flexible Server
- Azure Cache for Redis
- Azure Key Vault
- Azure Monitor
- Virtual Network configurada

### 2. Ferramentas Locais

```bash
# Node.js e dependências
npm install mysql2 uuid dotenv tsx

# Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az login
```

## 🔧 Passo a Passo da Migração

### Fase 1: Preparação do Ambiente Azure

#### 1.1 Criar Resource Group

```bash
az group create \
  --name empresta-ae-rg \
  --location brazilsouth
```

#### 1.2 Criar Azure Database for MySQL

```bash
az mysql flexible-server create \
  --resource-group empresta-ae-rg \
  --name-ae-mysql \
  --location brazilsouth \
  --admin-user empresta_admin \
  --admin-password "SuaSenhaSegura123!" \
  --sku-name Standard_D4ds_v4 \
  --tier GeneralPurpose \
  --storage-size 512 \
  --storage-auto-grow Enabled \
  --backup-retention 35 \
  --geo-redundant-backup Enabled \
  --high-availability ZoneRedundant
```

#### 1.3 Configurar Firewall

```bash
# Permitir acesso do seu IP
az mysql flexible-server firewall-rule create \
  --resource-group empresta-ae-rg \
  --name empresta-ae-mysql \
  --rule-name AllowMyIP \
  --start-ip-address SEU_IP \
  --end-ip-address SEU_IP

# Permitir serviços Azure
az mysql flexible-server firewall-rule create \
  --resource-group empresta-ae-rg \
  --name empresta-ae-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### 1.4 Criar Azure Cache for Redis

```bash
az redis create \
  --resource-group empresta-ae-rg \
  --name empresta-ae-redis \
  --location brazilsouth \
  --sku Standard \
  --vm-size c1 \
  --enable-non-ssl-port
```

### Fase 2: Configuração do Banco de Dados

#### 2.1 Conectar ao MySQL Azure

```bash
mysql -h empresta-ae-mysql.mysql.database.azure.com \
      -u empresta_admin \
      -p \
      --ssl-mode=REQUIRED
```

#### 2.2 Criar Database

```sql
CREATE DATABASE empresta_ae CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE empresta_ae;
```

#### 2.3 Executar Schema Modernizado

```bash
# Executar o schema principal
mysql -h empresta-ae-mysql.mysql.database.azure.com \
      -u empresta_admin \
      -p \
      --ssl-mode=REQUIRED \
      empresta_ae < database/azure-schema-modernized.sql
```

#### 2.4 Aplicar Configurações Azure

```bash
# Executar configurações otimizadas
mysql -h empresta-ae-mysql.mysql.database.azure.com \
      -u empresta_admin \
      -p \
      --ssl-mode=REQUIRED \
      empresta_ae < database/azure-configuration.sql
```

### Fase 3: Migração de Dados

#### 3.1 Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env.migration
cat > .env.migration << EOF
# Banco de origem (atual)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_atual
DB_NAME=empresta_ae

# Banco de destino (Azure)
AZURE_MYSQL_HOST=empresta-ae-mysql.mysql.database.azure.com
AZURE_MYSQL_PORT=3306
AZURE_MYSQL_USER=empresta_admin
AZURE_MYSQL_PASSWORD=SuaSenhaSegura123!
AZURE_MYSQL_DATABASE=empresta_ae
EOF
```

#### 3.2 Executar Migração de Dados

```bash
# Instalar dependências
npm install mysql2 uuid dotenv tsx

# Executar migração
npx tsx scripts/migrate-to-azure-schema.ts
```

### Fase 4: Configuração da Aplicação

#### 4.1 Atualizar Variáveis de Ambiente da App

```bash
# Atualizar .env da aplicação
cat > .env << EOF
# Azure Database
AZURE_MYSQL_HOST=empresta-ae-mysql.mysql.database.azure.com
AZURE_MYSQL_PORT=3306
AZURE_MYSQL_USER=empresta_app
AZURE_MYSQL_PASSWORD=SenhaSeguraApp123!
AZURE_MYSQL_DATABASE=empresta_ae

# Azure Redis
AZURE_REDIS_HOST=empresta-ae-redis.redis.cache.windows.net
AZURE_REDIS_PORT=6380
AZURE_REDIS_KEY=sua_chave_redis

# Outras configurações
JWT_SECRET=sua_chave_jwt_super_segura
NODE_ENV=production
EOF
```

#### 4.2 Atualizar Código da Aplicação

**Configuração de Conexão (src/config/database.ts):**

```typescript
import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.AZURE_MYSQL_HOST,
  port: parseInt(process.env.AZURE_MYSQL_PORT || '3306'),
  user: process.env.AZURE_MYSQL_USER,
  password: process.env.AZURE_MYSQL_PASSWORD,
  database: process.env.AZURE_MYSQL_DATABASE,
  ssl: {
    rejectUnauthorized: true,
  },
  connectionLimit: 20,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
};

export const pool = mysql.createPool(poolConfig);
```

**Configuração Redis (src/config/redis.ts):**

```typescript
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.AZURE_REDIS_HOST,
  port: parseInt(process.env.AZURE_REDIS_PORT || '6380'),
  password: process.env.AZURE_REDIS_KEY,
  tls: {},
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});
```

### Fase 5: Configuração de Read Replicas

#### 5.1 Criar Read Replica

```bash
az mysql flexible-server replica create \
  --resource-group empresta-ae-rg \
  --name empresta-ae-mysql-replica \
  --source-server empresta-ae-mysql \
  --location brazilsouth
```

#### 5.2 Configurar Load Balancing no Código

```typescript
// src/config/database-manager.ts
class DatabaseManager {
  private primaryPool: mysql.Pool;
  private replicaPools: mysql.Pool[];
  private currentReplicaIndex = 0;

  constructor() {
    this.primaryPool = mysql.createPool({
      host: process.env.AZURE_MYSQL_HOST,
      // ... outras configurações
    });

    this.replicaPools = [
      mysql.createPool({
        host: process.env.AZURE_MYSQL_REPLICA_HOST,
        // ... outras configurações
      }),
    ];
  }

  async executeRead(query: string, params?: any[]): Promise<any> {
    const replica = this.getHealthyReplica();
    return replica.execute(query, params);
  }

  async executeWrite(query: string, params?: any[]): Promise<any> {
    return this.primaryPool.execute(query, params);
  }

  private getHealthyReplica(): mysql.Pool {
    return this.replicaPools[
      this.currentReplicaIndex++ % this.replicaPools.length
    ];
  }
}
```

## 🔍 Validação e Testes

### 1. Testar Conexão

```bash
# Testar conexão com o banco
npx tsx scripts/test-connection.ts
```

### 2. Validar Migração

```sql
-- Verificar contagem de registros
SELECT
  'users' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'items' as tabela, COUNT(*) as total FROM items
UNION ALL
SELECT 'categories' as tabela, COUNT(*) as total FROM categories;

-- Testar queries geoespaciais
SELECT
  id, title,
  ST_Distance_Sphere(location, POINT(-46.6333, -23.5505)) as distance_meters
FROM items
WHERE location IS NOT NULL
ORDER BY distance_meters
LIMIT 10;
```

### 3. Testar Performance

```sql
-- Testar índices
EXPLAIN SELECT * FROM items
WHERE status = 'available'
AND category_id = 'uuid-da-categoria'
ORDER BY created_at DESC;

-- Testar busca textual
EXPLAIN SELECT * FROM items
WHERE MATCH(title, description) AGAINST('furadeira' IN NATURAL LANGUAGE MODE);
```

## 📊 Monitoramento

### 1. Configurar Azure Monitor

```bash
# Habilitar métricas
az monitor metrics alert create \
  --name "MySQL CPU High" \
  --resource-group empresta-ae-rg \
  --scopes /subscriptions/YOUR_SUBSCRIPTION/resourceGroups/empresta-ae-rg/providers/Microsoft.DBforMySQL/flexibleServers/empresta-ae-mysql \
  --condition "avg Percentage CPU > 80" \
  --description "CPU usage is above 80%"
```

### 2. Queries de Monitoramento

```sql
-- Monitorar queries lentas
SELECT * FROM slow_queries_summary LIMIT 10;

-- Monitorar conexões ativas
SELECT * FROM active_connections;

-- Verificar uso de índices
SELECT
  table_name,
  index_name,
  cardinality
FROM information_schema.statistics
WHERE table_schema = 'empresta_ae'
ORDER BY cardinality DESC;
```

## 🔒 Segurança

### 1. Configurar SSL/TLS

```sql
-- Verificar SSL obrigatório
SHOW VARIABLES LIKE 'require_secure_transport';

-- Deve retornar ON
```

### 2. Configurar Usuários com Privilégios Mínimos

```sql
-- Já incluído no azure-configuration.sql
-- Usuários: empresta_app, empresta_read, empresta_backup, empresta_monitor
```

### 3. Configurar Azure Key Vault

```bash
# Criar Key Vault
az keyvault create \
  --resource-group empresta-ae-rg \
  --name empresta-ae-keyvault \
  --location brazilsouth

# Armazenar secrets
az keyvault secret set \
  --vault-name empresta-ae-keyvault \
  --name "mysql-connection-string" \
  --value "mysql://empresta_app:senha@empresta-ae-mysql.mysql.database.azure.com:3306/empresta_ae?ssl=true"
```

## 🚀 Deploy da Aplicação

### 1. Configurar App Service

```bash
az appservice plan create \
  --resource-group empresta-ae-rg \
  --name empresta-ae-plan \
  --location brazilsouth \
  --sku P1V2

az webapp create \
  --resource-group empresta-ae-rg \
  --plan empresta-ae-plan \
  --name empresta-ae-app \
  --runtime "NODE|18-lts"
```

### 2. Configurar Variáveis de Ambiente

```bash
az webapp config appsettings set \
  --resource-group empresta-ae-rg \
  --name empresta-ae-app \
  --settings \
    AZURE_MYSQL_HOST=empresta-ae-mysql.mysql.database.azure.com \
    AZURE_MYSQL_USER=empresta_app \
    AZURE_MYSQL_DATABASE=empresta_ae \
    AZURE_REDIS_HOST=empresta-ae-redis.redis.cache.windows.net
```

## 🔧 Manutenção

### 1. Backup Manual

```bash
# Backup completo
mysqldump -h empresta-ae-mysql.mysql.database.azure.com \
          -u empresta_admin \
          -p \
          --ssl-mode=REQUIRED \
          --single-transaction \
          --routines \
          --triggers \
          empresta_ae > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Limpeza Automática

```sql
-- Executar procedures de limpeza (já configuradas)
CALL CleanExpiredSessions();
CALL CleanOldNotifications();
CALL UpdateUserStats();
```

### 3. Monitoramento de Performance

```sql
-- Verificar queries lentas
SELECT * FROM performance_schema.events_statements_summary_by_digest
WHERE AVG_TIMER_WAIT > 2000000000000
ORDER BY AVG_TIMER_WAIT DESC
LIMIT 10;
```

## ⚠️ Troubleshooting

### Problemas Comuns

1. **Erro de SSL**: Certifique-se de usar `--ssl-mode=REQUIRED`
2. **Timeout de Conexão**: Verifique firewall rules
3. **Charset Issues**: Use `utf8mb4` em todas as conexões
4. **Performance Lenta**: Verifique índices e configurações de buffer

### Logs Importantes

```bash
# Logs do App Service
az webapp log tail --resource-group empresta-ae-rg --name empresta-ae-app

# Métricas do MySQL
az monitor metrics list \
  --resource /subscriptions/YOUR_SUBSCRIPTION/resourceGroups/empresta-ae-rg/providers/Microsoft.DBforMySQL/flexibleServers/empresta-ae-mysql \
  --metric "cpu_percent"
```

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs do Azure Monitor
2. Consulte a documentação do Azure Database for MySQL
3. Execute os scripts de validação incluídos

---

🎉 **Parabéns!** Seu banco de dados agora está modernizado e rodando no Azure
com alta disponibilidade, performance otimizada e todas as melhores práticas
implementadas!
