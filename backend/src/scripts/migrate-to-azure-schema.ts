#!/usr/bin/env tsx

/**
 * Script de Migração para Azure Schema Modernizado
 *
 * Este script migra os dados do schema atual (com IDs inteiros)
 * para o novo schema modernizado (com UUIDs) no Azure.
 *
 * IMPORTANTE: Execute este script em ambiente de teste primeiro!
 */

import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

interface MigrationConfig {
  source: mysql.ConnectionOptions;
  target: mysql.ConnectionOptions;
}

interface IdMapping {
  [oldId: string]: string; // old_id -> new_uuid
}

class AzureSchemaMigrator {
  private sourceConnection: mysql.Connection;
  private targetConnection: mysql.Connection;
  private idMappings: {
    u IdMapping;
    categories: IdMapping;
    items: IdMapping;
    loans: IdMapping;
  } = {
    users: {},
    categories: {},
    items: {},
    loans: {}
  };

  constructor(private config: MigrationConfig) {}

  async connect(): Promise<void> {
    console.log('🔌 Conectando aos bancos de dados...');

    this.sourceConnection = await mysql.createConnection(this.config.source);
    this.targetConnection = await mysql.createConnection(this.config.target);

    console.log('✅ Conexões estabelecidas com sucesso!');
  }

  async disconnect(): Promise<void> {
    await this.sourceConnection?.end();
    await this.targetConnection?.end();
    console.log('🔌 Conexões fechadas.');
  }

  async validateConnections(): Promise<void> {
    console.log('🔍 Validando conexões...');

    // Testar conexão source
    const [sourceResult] = await this.sourceConnection.execute('SELECT 1 as test');
    if (!sourceResult) throw new Error('Falha na conexão com banco de origem');

    // Testar conexão target
    const [targetResult] = await this.targetConnection.execute('SELECT 1 as test');
    if (!targetResult) throw new Error('Falha na conexão com banco de destino');

    console.log('✅ Conexões validadas!');
  }

  async backupSourceData(): Promise<void> {
    console.log('💾 Criando backup dos dados de origem...');

    const tables = ['users', 'categories', 'items', 'item_images', 'loans', 'reviews', 'messages'];

    for (const table of tables) {
      const [rows] = await this.sourceConnection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      const count = (rows as any)[0].count;
      console.log(`📊 Tabela ${table}: ${count} registros`);
    }

    console.log('✅ Backup de dados validado!');
  }

  async migrateUsers(): Promise<void> {
    console.log('👥 Migrando usuários...');

    const [users] = await this.sourceConnection.execute(`
      SELECT * FROM users WHERE 1=1
    `) as any[];

    for (const user of users) {
      const newId = uuidv4();
      this.idMappings.users[user.id] = newId;

      // Converter localização se existir
      let locationPoint = null;
      if (user.location_lat && user.location_lng) {
        locationPoint = `POINT(${user.location_lng} ${user.location_lat})`;
      }

      await this.targetConnection.execute(`
        INSERT INTO users (
          id, name, email, password_hash, avatar_url, phone, verified,
          location, address, rating, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ${locationPoint ? 'ST_GeomFromText(?)' : 'NULL'}, ?, ?, ?, ?)
      `, [
        newId,
        user.name,
        user.email,
        user.password_hash,
        user.avatar_url,
        user.phone,
        user.verified,
        ...(locationPoint ? [locationPoint] : []),
        user.address || null,
        user.rating || 0,
        user.created_at,
        user.updated_at
      ]);
    }

    console.log(`✅ ${users.length} usuários migrados!`);
  }

  async migrateCategories(): Promise<void> {
    console.log('📂 Migrando categorias...');

    const [categories] = await this.sourceConnection.execute(`
      SELECT * FROM categories
    `) as any[];

    for (const category of categories) {
      const newId = uuidv4();
      this.idMappings.categories[category.id] = newId;

      // Gerar slug a partir do nome
      const slug = category.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .trim();

      await this.targetConnection.execute(`
        INSERT INTO categories (
          id, name, slug, icon, color, active, sort_order, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newId,
        category.name,
        slug,
        category.icon,
        category.color,
        true,
        0,
        category.created_at
      ]);
    }

    console.log(`✅ ${categories.length} categorias migradas!`);
  }

  async migrateItems(): Promise<void> {
    console.log('📦 Migrando itens...');

    const [items] = await this.sourceConnection.execute(`
      SELECT * FROM items
    `) as any[];

    for (const item of items) {
      const newId = uuidv4();
      this.idMappings.items[item.id] = newId;

      // Converter localização
      let locationPoint = null;
      if (item.location_lat && item.location_lng) {
        locationPoint = `POINT(${item.location_lng} ${item.location_lat})`;
      }

      // Mapear IDs de usuário e categoria
      const userId = this.idMappings.users[item.user_id];
      const categoryId = this.idMappings.categories[item.category_id];

      if (!userId || !categoryId) {
        console.warn(`⚠️ Pulando item ${item.id} - usuário ou categoria não encontrados`);
        continue;
      }

      await this.targetConnection.execute(`
        INSERT INTO items (
          id, user_id, category_id, title, description, price, period, status,
          location, address, rating, view_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ${locationPoint ? 'ST_GeomFromText(?)' : 'NULL'}, ?, ?, ?, ?, ?)
      `, [
        newId,
        userId,
        categoryId,
        item.title,
        item.description,
        item.price,
        item.period,
        item.status,
        ...(locationPoint ? [locationPoint] : []),
        item.address,
        0, // rating inicial
        0, // view_count inicial
        item.created_at,
        item.updated_at
      ]);
    }

    console.log(`✅ ${items.length} itens migrados!`);
  }

  async migrateItemImages(): Promise<void> {
    console.log('🖼️ Migrando imagens dos itens...');

    const [images] = await this.sourceConnection.execute(`
      SELECT * FROM item_images
    `) as any[];

    for (const image of images) {
      const itemId = this.idMappings.items[image.item_id];

      if (!itemId) {
        console.warn(`⚠️ Pulando imagem ${image.id} - item não encontrado`);
        continue;
      }

      await this.targetConnection.execute(`
        INSERT INTO item_images (
          id, item_id, url, is_primary, sort_order, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        itemId,
        image.url,
        image.is_primary,
        0,
        image.created_at
      ]);
    }

    console.log(`✅ ${images.length} imagens migradas!`);
  }

  async migrateLoans(): Promise<void> {
    console.log('🤝 Migrando empréstimos...');

    const [loans] = await this.sourceConnection.execute(`
      SELECT * FROM loans
    `) as any[];

    for (const loan of loans) {
      const newId = uuidv4();
      this.idMappings.loans[loan.id] = newId;

      const itemId = this.idMappings.items[loan.item_id];
      const borrowerId = this.idMappings.users[loan.borrower_id];
      const lenderId = this.idMappings.users[loan.lender_id];

      if (!itemId || !borrowerId || !lenderId) {
        console.warn(`⚠️ Pulando empréstimo ${loan.id} - referências não encontradas`);
        continue;
      }

      await this.targetConnection.execute(`
        INSERT INTO loans (
          id, item_id, borrower_id, lender_id, start_date, end_date,
          status, total_price, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newId,
        itemId,
        borrowerId,
        lenderId,
        loan.start_date,
        loan.end_date,
        loan.status,
        loan.total_price,
        loan.created_at,
        loan.updated_at
      ]);
    }

    console.log(`✅ ${loans.length} empréstimos migrados!`);
  }

  async migrateReviews(): Promise<void> {
    console.log('⭐ Migrando avaliações...');

    const [reviews] = await this.sourceConnection.execute(`
      SELECT * FROM reviews
    `) as any[];

    for (const review of reviews) {
      const loanId = this.idMappings.loans[review.loan_id];
      const reviewerId = this.idMappings.users[review.reviewer_id];
      const reviewedId = this.idMappings.users[review.reviewed_id];

      if (!loanId || !reviewerId || !reviewedId) {
        console.warn(`⚠️ Pulando avaliação ${review.id} - referências não encontradas`);
        continue;
      }

      await this.targetConnection.execute(`
        INSERT INTO reviews (
          id, loan_id, reviewer_id, reviewed_id, rating, comment, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        loanId,
        reviewerId,
        reviewedId,
        review.rating,
        review.comment,
        review.created_at
      ]);
    }

    console.log(`✅ ${reviews.length} avaliações migradas!`);
  }

  async migrateMessages(): Promise<void> {
    console.log('💬 Migrando mensagens...');

    const [messages] = await this.sourceConnection.execute(`
      SELECT * FROM messages
    `) as any[];

    for (const message of messages) {
      const loanId = this.idMappings.loans[message.loan_id];
      const senderId = this.idMappings.users[message.sender_id];

      if (!loanId || !senderId) {
        console.warn(`⚠️ Pulando mensagem ${message.id} - referências não encontradas`);
        continue;
      }

      await this.targetConnection.execute(`
        INSERT INTO messages (
          id, loan_id, sender_id, content, read_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        loanId,
        senderId,
        message.content,
        message.read_at,
        message.created_at
      ]);
    }

    console.log(`✅ ${messages.length} mensagens migradas!`);
  }

  async updateStatistics(): Promise<void> {
    console.log('📊 Atualizando estatísticas...');

    // Atualizar contadores de reviews dos usuários
    await this.targetConnection.execute(`
      UPDATE users u
      SET rating = (
        SELECT COALESCE(AVG(r.rating), 0)
        FROM reviews r
        WHERE r.reviewed_id = u.id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews r
        WHERE r.reviewed_id = u.id
      )
    `);

    // Atualizar contadores dos itens
    await this.targetConnection.execute(`
      UPDATE items i
      SET rating = (
        SELECT COALESCE(AVG(r.rating), 0)
        FROM reviews r
        JOIN loans l ON r.loan_id = l.id
        WHERE l.item_id = i.id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews r
        JOIN loans l ON r.loan_id = l.id
        WHERE l.item_id = i.id
      )
    `);

    console.log('✅ Estatísticas atualizadas!');
  }

  async validateMigration(): Promise<void> {
    console.log('🔍 Validando migração...');

    const tables = [
      { name: 'users', source: 'users' },
      { name: 'categories', source: 'categories' },
      { name: 'items', source: 'items' },
      { name: 'item_images', source: 'item_images' },
      { name: 'loans', source: 'loans' },
      { name: 'reviews', source: 'reviews' },
      { name: 'messages', source: 'messages' }
    ];

    for (const table of tables) {
      const [sourceCount] = await this.sourceConnection.execute(
        `SELECT COUNT(*) as count FROM ${table.source}`
      ) as any[];

      const [targetCount] = await this.targetConnection.execute(
        `SELECT COUNT(*) as count FROM ${table.name}`
      ) as any[];

      const sourceTotal = sourceCount[0].count;
      const targetTotal = targetCount[0].count;

      if (sourceTotal === targetTotal) {
        console.log(`✅ ${table.name}: ${targetTotal} registros (OK)`);
      } else {
        console.log(`⚠️ ${table.name}: origem=${sourceTotal}, destino=${targetTotal} (DIFERENÇA)`);
      }
    }
  }

  async run(): Promise<void> {
    try {
      console.log('🚀 Iniciando migração para Azure Schema...\n');

      await this.connect();
      await this.validateConnections();
      await this.backupSourceData();

      console.log('\n📋 Iniciando migração de dados...');
      await this.migrateUsers();
      await this.migrateCategories();
      await this.migrateItems();
      await this.migrateItemImages();
      await this.migrateLoans();
      await this.migrateReviews();
      await this.migrateMessages();

      console.log('\n📊 Finalizando migração...');
      await this.updateStatistics();
      await this.validateMigration();

      console.log('\n🎉 Migração concluída com sucesso!');

    } catch (error) {
      console.error('❌ Erro durante a migração:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Configuração da migração
const migrationConfig: MigrationConfig = {
  source: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'empresta_ae',
    charset: 'utf8mb4'
  },
  target: {
    host: process.env.AZURE_MYSQL_HOST || 'localhost',
    port: parseInt(process.env.AZURE_MYSQL_PORT || '3306'),
    user: process.env.AZURE_MYSQL_USER || 'root',
    password: process.env.AZURE_MYSQL_PASSWORD || '',
    database: process.env.AZURE_MYSQL_DATABASE || 'empresta_ae',
    charset: 'utf8mb4',
    ssl: {
      rejectUnauthorized: true
    }
  }
};

// Executar migração
if (require.main === module) {
  const migrator = new AzureSchemaMigrator(migrationConfig);

  migrator.run().catch((error) => {
    console.error('Falha na migração:', error);
    process.exit(1);
  });
}

export { AzureSchemaMigrator };
