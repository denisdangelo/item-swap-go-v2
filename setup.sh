#!/bin/bash

echo "🚀 Setup do projeto Empresta aê"
echo "================================"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale primeiro: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado"
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

# Verificar Git
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado. Instale primeiro: https://git-scm.com/"
    exit 1
fi

echo "✅ Git encontrado: $(git --version)"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Instalar dependências adicionais
echo "🔧 Instalando dependências do MySQL..."
npm install mysql2 bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken

# Verificar arquivo .env
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "⚠️  Configure as variáveis no arquivo .env"
fi

# Criar pastas necessárias
echo "📁 Criando estrutura de pastas..."
mkdir -p database scripts

echo "✅ Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o MySQL:"
echo "   - Instale MySQL ou XAMPP"
echo "   - Crie o banco 'empresta_ae'"
echo "   - Execute: mysql -u root -p < database/schema.sql"
echo ""
echo "2. Configure o arquivo .env com suas credenciais"
echo ""
echo "3. Teste a conexão:"
echo "   npm run db:test"
echo ""
echo "4. Migre os dados:"
echo "   npm run db:migrate"
echo ""
echo "5. Execute o projeto:"
echo "   npm run dev"
echo ""
echo "🌐 Acesse: http://localhost:5173"
