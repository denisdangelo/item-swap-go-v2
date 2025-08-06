import { pool } from '../src/lib/database';
import { mockUsers, mockCategories, mockItems } from '../src/services/mockData';
import bcrypt from 'bcryptjs';

async function migrateData() {
  try {
    console.log('🚀 Iniciando migração de dados...');

    // 1. Migrar categorias
    console.log('📂 Migrando categorias...');
    for (const category of mockCategories) {
      await pool.execute('INSERT IGNORE INTO categories (name, icon, color) VALUES (?, ?, ?)', [
        category.name,
        category.icon,
        category.color,
      ]);
    }
    console.log('✅ Categorias migradas');

    // 2. Migrar usuários
    console.log('👥 Migrando usuários...');
    const userIds: number[] = [];
    for (const mockUser of mockUsers) {
      const passwordHash = await bcrypt.hash('123456', 12); // Senha padrão

      const [result] = await pool.execute(
        'INSERT IGNORE INTO users (name, email, password_hash, avatar_url, verified) VALUES (?, ?, ?, ?, ?)',
        [mockUser.name, mockUser.email, passwordHash, mockUser.avatar, mockUser.verified]
      );

      const userId = (result as any).insertId;
      if (userId) userIds.push(userId);
    }
    console.log('✅ Usuários migrados');

    // 3. Migrar itens
    console.log('📦 Migrando itens...');
    for (const mockItem of mockItems) {
      // Buscar categoria
      const [categoryRows] = await pool.execute('SELECT id FROM categories WHERE name = ?', [
        mockItem.category,
      ]);
      const categories = categoryRows as any[];
      const categoryId = categories[0]?.id || 1;

      // Escolher usuário aleatório
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];

      // Inserir item
      const [itemResult] = await pool.execute(
        `INSERT INTO items (user_id, category_id, title, description, price, period, status, location_lat, location_lng, address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUserId,
          categoryId,
          mockItem.title,
          mockItem.description,
          mockItem.price,
          mockItem.period,
          mockItem.status,
          mockItem.location?.lat,
          mockItem.location?.lng,
          mockItem.location?.address,
        ]
      );

      const itemId = (itemResult as any).insertId;

      // Inserir imagens
      if (mockItem.images && mockItem.images.length > 0) {
        for (let i = 0; i < mockItem.images.length; i++) {
          await pool.execute(
            'INSERT INTO item_images (item_id, url, is_primary) VALUES (?, ?, ?)',
            [itemId, mockItem.images[i], i === 0]
          );
        }
      }
    }
    console.log('✅ Itens migrados');

    console.log('🎉 Migração concluída com sucesso!');
    console.log(`📊 Resumo:`);
    console.log(`   - ${mockCategories.length} categorias`);
    console.log(`   - ${mockUsers.length} usuários`);
    console.log(`   - ${mockItems.length} itens`);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await pool.end();
  }
}

migrateData();
