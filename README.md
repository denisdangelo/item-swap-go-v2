# Empresta aê 📦

Uma plataforma moderna para compartilhamento e empréstimo de itens entre
vizinhos e comunidade.

## 🏗️ Arquitetura

Este projeto foi reestruturado para uma arquitetura profissional com:

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL 8.0
- **Shared**: Tipos TypeScript compartilhados
- **Docker**: Containerização completa

## 📁 Estrutura do Projeto

```
empresta-ae-production/
├── frontend/                    # React application
│   ├── src/                    # Source code
│   ├── public/                 # Static assets
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
├── backend/                     # Node.js API
│   ├── src/                    # Source code
│   │   ├── controllers/        # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Data models
│   │   ├── utils/             # Utilities
│   │   └── config/            # Configuration
│   ├── tests/                 # Backend tests
│   ├── migrations/            # Database migrations
│   └── package.json           # Backend dependencies
├── shared/                      # Shared types and utilities
│   └── types/                  # TypeScript interfaces
├── docker/                      # Docker configurations
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
└── package.json                # Workspace configuration
```

## 🚀 Instalação e Setup

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- Git
- Docker (opcional)

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd empresta-ae-production
git checkout production-ready
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências do workspace
npm run install:all

# Ou instalar individualmente
npm install                    # Root workspace
cd frontend && npm install     # Frontend
cd ../backend && npm install   # Backend
cd ../shared && npm install    # Shared types
```

### 3. Configurar Variáveis de Ambiente

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

Edite os arquivos `.env` com suas configurações.

### 4. Configurar Banco de Dados

```sql
-- Conectar ao MySQL
mysql -u root -p

-- Criar banco
CREATE DATABASE empresta_ae CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON empresta_ae.* TO 'user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Executar Migrações

```bash
cd backend
npm run db:migrate
```

### 6. Rodar o Projeto

```bash
# Desenvolvimento (ambos frontend e backend)
npm run dev

# Ou separadamente
npm run dev:frontend  # Frontend na porta 5173
npm run dev:backend   # Backend na porta 3001
```

## 🐳 Docker

### Desenvolvimento com Docker

```bash
# Subir todos os serviços
npm run docker:up

# Build das imagens
npm run docker:build

# Parar serviços
npm run docker:down
```

### Serviços Docker

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## 🔧 Scripts Disponíveis

### Workspace (Raiz)

```bash
npm run dev              # Rodar frontend e backend
npm run build            # Build completo (shared + backend + frontend)
npm run test             # Executar todos os testes
npm run lint             # Lint em todos os projetos
npm run format           # Format em todos os projetos
```

### Frontend

```bash
cd frontend
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build
npm run test             # Testes unitários
npm run lint             # ESLint
npm run format           # Prettier
```

### Backend

```bash
cd backend
npm run dev              # Servidor de desenvolvimento com watch
npm run build            # Compilar TypeScript
npm run start            # Rodar versão compilada
npm run test             # Testes unitários
npm run db:migrate       # Executar migrações
npm run db:seed          # Popular banco com dados iniciais
```

## 🌐 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Perfil do usuário

### Itens

- `GET /api/items` - Listar itens
- `GET /api/items/:id` - Detalhes do item
- `POST /api/items` - Criar item
- `PUT /api/items/:id` - Atualizar item
- `DELETE /api/items/:id` - Deletar item

### Usuários

- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil

## 🔐 Segurança

- Autenticação JWT com refresh tokens
- Senhas criptografadas com bcrypt
- Rate limiting em endpoints sensíveis
- Validação de dados com Zod
- Headers de segurança com Helmet
- CORS configurado adequadamente

## 🧪 Testes

```bash
# Todos os testes
npm run test

# Frontend
npm run test:frontend

# Backend
npm run test:backend

# Com coverage
npm run test:coverage
```

## 📦 Build para Produção

```bash
# Build completo
npm run build

# Build individual
npm run build:frontend
npm run build:backend
npm run build:shared
```

## 🚀 Deploy

### Usando Docker

```bash
# Build das imagens de produção
docker-compose -f docker/docker-compose.yml build

# Deploy
docker-compose -f docker/docker-compose.yml up -d
```

### Deploy Manual

1. Build do projeto: `npm run build`
2. Configure variáveis de ambiente de produção
3. Execute migrações: `npm run db:migrate`
4. Inicie os serviços

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- Documentação: `/docs`
- Issues: GitHub Issues
- Email: suporte@empresta-ae.com

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
