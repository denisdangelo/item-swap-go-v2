# Development Guide

Este guia contém informações específicas para desenvolvedores trabalhando no projeto Empresta aê.

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- Redis (opcional, para cache)
- Docker e Docker Compose (opcional)

### Instalação

1. **Clone o repositório**

   ```bash
   git clone <repository-url>
   cd empresta-ae-production
   git checkout production-ready
   ```

2. **Instale as dependências**

   ```bash
   npm run install:all
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env

   # Backend
   cp backend/.env.example backend/.env
   ```

4. **Configure o banco de dados**

   ```sql
   CREATE DATABASE empresta_ae CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON empresta_ae.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. **Inicie o desenvolvimento**
   ```bash
   npm run dev
   ```

## 🏗️ Estrutura do Projeto

```
empresta-ae-production/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Serviços de API
│   │   ├── store/             # Estado global (Zustand)
│   │   ├── types/             # Tipos TypeScript
│   │   └── utils/             # Utilitários
│   ├── public/                # Assets estáticos
│   └── package.json
├── backend/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/       # Controladores de rota
│   │   ├── services/          # Lógica de negócio
│   │   ├── repositories/      # Acesso a dados
│   │   ├── middleware/        # Middleware Express
│   │   ├── models/            # Modelos de dados
│   │   ├── utils/             # Utilitários
│   │   └── config/            # Configurações
│   ├── tests/                 # Testes do backend
│   ├── migrations/            # Migrações do banco
│   └── package.json
├── shared/                      # Tipos compartilhados
│   └── types/                 # Interfaces TypeScript
├── docker/                      # Configurações Docker
├── docs/                        # Documentação
└── package.json                # Configuração do workspace
```

## 🛠️ Scripts Disponíveis

### Workspace (Raiz)

```bash
# Desenvolvimento
npm run dev              # Inicia frontend e backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend

# Build
npm run build            # Build completo
npm run build:frontend   # Build do frontend
npm run build:backend    # Build do backend
npm run build:shared     # Build dos tipos compartilhados

# Testes
npm run test             # Todos os testes
npm run test:frontend    # Testes do frontend
npm run test:backend     # Testes do backend

# Qualidade de código
npm run lint             # Lint em todos os projetos
npm run format           # Format em todos os projetos
npm run type-check       # Type check em todos os projetos

# Docker
npm run docker:dev       # Ambiente de desenvolvimento com Docker
npm run docker:dev:down  # Para o ambiente Docker
npm run docker:test      # Sobe apenas bancos de teste
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
npm run type-check       # Verificação de tipos
```

### Backend

```bash
cd backend

npm run dev              # Servidor com hot reload
npm run build            # Compilar TypeScript
npm run start            # Executar versão compilada
npm run test             # Testes unitários
npm run test:watch       # Testes em modo watch
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # Verificação de tipos
npm run db:migrate       # Executar migrações
npm run db:seed          # Popular banco com dados
npm run db:reset         # Resetar banco de dados
```

## 🐳 Desenvolvimento com Docker

### Ambiente Completo

```bash
# Subir todos os serviços (frontend, backend, banco, redis)
npm run docker:dev

# Parar todos os serviços
npm run docker:dev:down
```

### Apenas Bancos de Dados

```bash
# Subir apenas MySQL e Redis para testes
npm run docker:test
```

### Serviços Disponíveis

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **MySQL**: localhost:3306
- **Redis**: localhost:6379
- **MySQL Test**: localhost:3307
- **Redis Test**: localhost:6380

## 🧪 Testes

### Estrutura de Testes

```
backend/tests/
├── unit/                # Testes unitários
├── integration/         # Testes de integração
├── e2e/                # Testes end-to-end
├── fixtures/           # Dados de teste
├── helpers/            # Utilitários de teste
└── setup.ts            # Configuração global

frontend/src/test/
├── components/         # Testes de componentes
├── hooks/             # Testes de hooks
├── services/          # Testes de serviços
├── utils/             # Testes de utilitários
└── setup.ts           # Configuração global
```

### Executando Testes

```bash
# Todos os testes
npm run test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Testes específicos
npm run test -- --testNamePattern="AuthService"
```

## 🔧 Configuração do Editor

### VS Code

O projeto inclui configurações do VS Code em `.vscode/`:

- **settings.json**: Configurações do workspace
- **extensions.json**: Extensões recomendadas
- **launch.json**: Configurações de debug
- **tasks.json**: Tarefas personalizadas

### Extensões Recomendadas

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Hero
- Auto Rename Tag
- Path Intellisense
- GitHub Copilot

## 🎯 Padrões de Código

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new authentication system
fix: resolve login validation issue
docs: update API documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for auth service
chore: update dependencies
```

### TypeScript

- Use tipos explícitos sempre que possível
- Prefira interfaces sobre types para objetos
- Use enums para constantes relacionadas
- Evite `any`, use `unknown` quando necessário

### React

- Use componentes funcionais com hooks
- Prefira composição sobre herança
- Use TypeScript para props
- Implemente error boundaries
- Use React.memo para otimização quando necessário

### Backend

- Siga arquitetura em camadas
- Use dependency injection
- Implemente tratamento de erros adequado
- Use middleware para funcionalidades transversais
- Valide dados de entrada com Zod

## 🚀 Deploy

### Ambientes

- **Development**: Ambiente local
- **Staging**: Ambiente de teste
- **Production**: Ambiente de produção

### Variáveis de Ambiente

Cada ambiente tem seu próprio arquivo `.env`:

- `.env` - Desenvolvimento local
- `.env.test` - Testes
- `.env.production` - Produção

### Build para Produção

```bash
# Build completo
npm run build

# Verificar builds
npm run preview  # Frontend
npm run start    # Backend (após build)
```

## 🐛 Debug

### VS Code Debug

Use as configurações em `.vscode/launch.json`:

- **Debug Backend**: Debug do servidor Node.js
- **Debug Frontend**: Debug no Chrome
- **Debug Tests**: Debug dos testes
- **Debug Full Stack**: Debug completo

### Logs

```bash
# Backend logs
tail -f backend/logs/app.log

# Docker logs
docker-compose -f docker-compose.dev.yml logs -f backend
```

## 📚 Recursos Úteis

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribuição

1. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
2. Faça suas alterações seguindo os padrões do projeto
3. Execute os testes: `npm run test`
4. Execute o linting: `npm run lint`
5. Faça commit seguindo conventional commits
6. Abra um Pull Request

## ❓ Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**

   - Verifique se o MySQL está rodando
   - Confirme as credenciais no `.env`
   - Teste a conexão: `npm run db:test`

2. **Erro de dependências**

   - Limpe node_modules: `rm -rf node_modules package-lock.json`
   - Reinstale: `npm run install:all`

3. **Erro de TypeScript**

   - Execute type check: `npm run type-check`
   - Verifique imports e exports

4. **Erro de ESLint**
   - Execute fix automático: `npm run lint -- --fix`
   - Verifique configurações em `.eslintrc.json`

### Logs e Debug

```bash
# Logs detalhados
DEBUG=* npm run dev:backend

# Logs do Docker
docker-compose -f docker-compose.dev.yml logs -f

# Verificar saúde dos serviços
curl http://localhost:3001/health
```
