"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@/config/database");
const logger_1 = __importDefault(require("@/config/logger"));
const CategoryRepository_1 = require("@/repositories/CategoryRepository");
const ItemRepository_1 = require("@/repositories/ItemRepository");
const UserRepository_1 = require("@/repositories/UserRepository");
async function seed() {
    try {
        logger_1.default.info('🌱 Starting database seeding...');
        // Test database connection
        const isConnected = await (0, database_1.testConnection)();
        if (!isConnected) {
            throw new Error('Database connection failed');
        }
        const categoryRepo = new CategoryRepository_1.CategoryRepository();
        const userRepo = new UserRepository_1.UserRepository();
        const itemRepo = new ItemRepository_1.ItemRepository();
        // Seed categories
        logger_1.default.info('Creating categories...');
        const categories = [
            {
                name: 'Eletrônicos',
                description: 'Dispositivos eletrônicos, gadgets e equipamentos tecnológicos',
                icon: 'smartphone',
                color: '#3B82F6',
            },
            {
                name: 'Ferramentas',
                description: 'Ferramentas para construção, reparo e manutenção',
                icon: 'wrench',
                color: '#EF4444',
            },
            {
                name: 'Esportes',
                description: 'Equipamentos esportivos e de recreação',
                icon: 'football',
                color: '#10B981',
            },
            {
                name: 'Casa e Jardim',
                description: 'Itens para casa, decoração e jardinagem',
                icon: 'home',
                color: '#F59E0B',
            },
            {
                name: 'Veículos',
                description: 'Carros, motos, bicicletas e acessórios',
                icon: 'car',
                color: '#8B5CF6',
            },
            {
                name: 'Livros e Mídia',
                description: 'Livros, filmes, jogos e material educativo',
                icon: 'book',
                color: '#EC4899',
            },
            {
                name: 'Roupas e Acessórios',
                description: 'Vestuário, calçados e acessórios de moda',
                icon: 'shirt',
                color: '#06B6D4',
            },
            {
                name: 'Música',
                description: 'Instrumentos musicais e equipamentos de áudio',
                icon: 'music',
                color: '#84CC16',
            },
        ];
        const createdCategories = [];
        for (const categoryData of categories) {
            const existing = await categoryRepo.findByName(categoryData.name);
            if (!existing) {
                const category = await categoryRepo.create(categoryData);
                createdCategories.push(category);
                logger_1.default.info(`✅ Created category: ${category.name}`);
            }
            else {
                createdCategories.push(existing);
                logger_1.default.info(`⏭️  Category already exists: ${existing.name}`);
            }
        }
        // Seed demo users
        logger_1.default.info('Creating demo users...');
        const users = [
            {
                email: 'joao@example.com',
                password: 'Password123!',
                first_name: 'João',
                last_name: 'Silva',
                phone: '(11) 99999-1111',
                bio: 'Gosto de compartilhar e ajudar a comunidade. Tenho várias ferramentas e equipamentos disponíveis.',
                location_lat: -23.5505,
                location_lng: -46.6333,
                location_address: 'São Paulo, SP',
            },
            {
                email: 'maria@example.com',
                password: 'Password123!',
                first_name: 'Maria',
                last_name: 'Santos',
                phone: '(11) 99999-2222',
                bio: 'Adoro livros e tenho uma grande coleção. Sempre disposta a emprestar!',
                location_lat: -23.5489,
                location_lng: -46.6388,
                location_address: 'São Paulo, SP',
            },
            {
                email: 'carlos@example.com',
                password: 'Password123!',
                first_name: 'Carlos',
                last_name: 'Oliveira',
                phone: '(11) 99999-3333',
                bio: 'Entusiasta de tecnologia e esportes. Tenho equipamentos de qualidade para compartilhar.',
                location_lat: -23.5558,
                location_lng: -46.6396,
                location_address: 'São Paulo, SP',
            },
        ];
        const createdUsers = [];
        for (const userData of users) {
            const existing = await userRepo.findByEmail(userData.email);
            if (!existing) {
                const user = await userRepo.create(userData);
                createdUsers.push(user);
                logger_1.default.info(`✅ Created user: ${user.email}`);
            }
            else {
                createdUsers.push(existing);
                logger_1.default.info(`⏭️  User already exists: ${existing.email}`);
            }
        }
        // Seed demo items
        logger_1.default.info('Creating demo items...');
        const items = [
            {
                owner_id: createdUsers[0].id,
                category_id: createdCategories.find((c) => c.name === 'Ferramentas').id,
                title: 'Furadeira Elétrica Bosch',
                description: 'Furadeira elétrica profissional da Bosch, ideal para trabalhos domésticos e profissionais. Inclui kit com brocas variadas.',
                condition_rating: 4,
                estimated_value: 250.0,
                daily_rate: 15.0,
                location_lat: -23.5505,
                location_lng: -46.6333,
                location_address: 'São Paulo, SP',
            },
            {
                owner_id: createdUsers[0].id,
                category_id: createdCategories.find((c) => c.name === 'Casa e Jardim').id,
                title: 'Cortador de Grama Elétrico',
                description: 'Cortador de grama elétrico em excelente estado. Perfeito para jardins pequenos e médios.',
                condition_rating: 5,
                estimated_value: 400.0,
                daily_rate: 25.0,
                location_lat: -23.5505,
                location_lng: -46.6333,
                location_address: 'São Paulo, SP',
            },
            {
                owner_id: createdUsers[1].id,
                category_id: createdCategories.find((c) => c.name === 'Livros e Mídia').id,
                title: 'Coleção Harry Potter Completa',
                description: 'Coleção completa dos livros do Harry Potter em português. Todos os 7 livros em ótimo estado de conservação.',
                condition_rating: 4,
                estimated_value: 150.0,
                daily_rate: 5.0,
                location_lat: -23.5489,
                location_lng: -46.6388,
                location_address: 'São Paulo, SP',
            },
            {
                owner_id: createdUsers[1].id,
                category_id: createdCategories.find((c) => c.name === 'Eletrônicos').id,
                title: 'Tablet Samsung Galaxy Tab',
                description: 'Tablet Samsung Galaxy Tab de 10 polegadas. Ideal para estudos, leitura e entretenimento.',
                condition_rating: 4,
                estimated_value: 800.0,
                daily_rate: 20.0,
                location_lat: -23.5489,
                location_lng: -46.6388,
                location_address: 'São Paulo, SP',
            },
            {
                owner_id: createdUsers[2].id,
                category_id: createdCategories.find((c) => c.name === 'Esportes').id,
                title: 'Bicicleta Mountain Bike',
                description: 'Bicicleta mountain bike aro 29, ideal para trilhas e passeios urbanos. Bem conservada e revisada.',
                condition_rating: 4,
                estimated_value: 1200.0,
                daily_rate: 30.0,
                location_lat: -23.5558,
                location_lng: -46.6396,
                location_address: 'São Paulo, SP',
            },
            {
                owner_id: createdUsers[2].id,
                category_id: createdCategories.find((c) => c.name === 'Música').id,
                title: 'Violão Clássico Yamaha',
                description: 'Violão clássico Yamaha em excelente estado. Cordas novas e som perfeito. Ideal para iniciantes e intermediários.',
                condition_rating: 5,
                estimated_value: 350.0,
                daily_rate: 12.0,
                location_lat: -23.5558,
                location_lng: -46.6396,
                location_address: 'São Paulo, SP',
            },
        ];
        for (const itemData of items) {
            const { owner_id, ...createData } = itemData;
            const item = await itemRepo.create(createData, owner_id);
            logger_1.default.info(`✅ Created item: ${item.title}`);
        }
        logger_1.default.info('✅ Database seeding completed successfully');
        logger_1.default.info(`📊 Created: ${createdCategories.length} categories, ${createdUsers.length} users, ${items.length} items`);
        process.exit(0);
    }
    catch (error) {
        logger_1.default.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
}
// Run seeding
seed();
