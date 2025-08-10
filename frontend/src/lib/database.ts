import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'empresta_user',
  password: process.env.DB_PASSWORD || 'SuaSenha123!',
  database: process.env.DB_NAME || 'empresta_ae',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
};

// Pool de conexões
export const pool = mysql.createPool(dbConfig);

// Testar conexão
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com MySQL estabelecida!');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error);
    throw error;
  }
}

// Função para executar queries com melhor tratamento de erro
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
}
