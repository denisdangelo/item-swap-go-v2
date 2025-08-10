"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/lib/database");
async function test() {
    try {
        console.log('🔍 Testando conexão com o banco de dados...');
        await (0, database_1.testConnection)();
        console.log('✅ Conexão com banco OK!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Erro na conexão:', error);
        console.log('\n🔧 Possíveis soluções:');
        console.log('1. Verifique se o MySQL está rodando');
        console.log('2. Verifique as credenciais no arquivo .env');
        console.log('3. Verifique se o banco "empresta_ae" existe');
        console.log('4. Verifique se o usuário tem permissões');
        process.exit(1);
    }
}
test();
