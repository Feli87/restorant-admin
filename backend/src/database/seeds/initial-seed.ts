import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Table, TableStatus } from '../../modules/tables/entities/table.entity';
import { Category } from '../../modules/menu/entities/category.entity';
import { MenuItem } from '../../modules/menu/entities/menu-item.entity';
import { InventoryItem } from '../../modules/inventory/entities/inventory-item.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'restaurant_admin',
  entities: [User, Table, Category, MenuItem, InventoryItem],
  synchronize: true,
});

async function seed() {
  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Database connected.');

  const userRepository = dataSource.getRepository(User);
  const tableRepository = dataSource.getRepository(Table);
  const categoryRepository = dataSource.getRepository(Category);
  const menuItemRepository = dataSource.getRepository(MenuItem);
  const inventoryRepository = dataSource.getRepository(InventoryItem);

  // --- Seed Users ---
  console.log('Seeding users...');
  const salt = await bcrypt.genSalt(10);

  const users = [
    {
      email: 'admin@restaurant.com',
      password: await bcrypt.hash('admin123', salt),
      name: 'Admin Principal',
      role: UserRole.ADMIN,
      is_active: true,
    },
    {
      email: 'mesero1@restaurant.com',
      password: await bcrypt.hash('mesero123', salt),
      name: 'Carlos Mesero',
      role: UserRole.WAITER,
      is_active: true,
    },
    {
      email: 'mesero2@restaurant.com',
      password: await bcrypt.hash('mesero123', salt),
      name: 'Maria Mesera',
      role: UserRole.WAITER,
      is_active: true,
    },
    {
      email: 'cajero@restaurant.com',
      password: await bcrypt.hash('cajero123', salt),
      name: 'Ana Cajera',
      role: UserRole.CASHIER,
      is_active: true,
    },
    {
      email: 'chef@restaurant.com',
      password: await bcrypt.hash('chef1234', salt),
      name: 'Pedro Chef',
      role: UserRole.CHEF,
      is_active: true,
    },
  ];

  for (const userData of users) {
    const existing = await userRepository.findOne({ where: { email: userData.email } });
    if (!existing) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`  Created user: ${userData.email}`);
    } else {
      console.log(`  User already exists: ${userData.email}`);
    }
  }

  // --- Seed Tables ---
  console.log('Seeding tables...');
  const tables = [
    { number: 1, capacity: 2, status: TableStatus.AVAILABLE },
    { number: 2, capacity: 2, status: TableStatus.AVAILABLE },
    { number: 3, capacity: 4, status: TableStatus.AVAILABLE },
    { number: 4, capacity: 4, status: TableStatus.AVAILABLE },
    { number: 5, capacity: 6, status: TableStatus.AVAILABLE },
    { number: 6, capacity: 6, status: TableStatus.AVAILABLE },
    { number: 7, capacity: 8, status: TableStatus.AVAILABLE },
    { number: 8, capacity: 8, status: TableStatus.AVAILABLE },
  ];

  for (const tableData of tables) {
    const existing = await tableRepository.findOne({ where: { number: tableData.number } });
    if (!existing) {
      const table = tableRepository.create({
        ...tableData,
        qr_code: `QR-TABLE-${tableData.number}`,
      });
      await tableRepository.save(table);
      console.log(`  Created table: #${tableData.number}`);
    } else {
      console.log(`  Table already exists: #${tableData.number}`);
    }
  }

  // --- Seed Categories ---
  console.log('Seeding categories...');
  const categoriesData = [
    { name: 'Entradas', description: 'Appetizers and starters', display_order: 1, is_active: true },
    { name: 'Platos Principales', description: 'Main courses', display_order: 2, is_active: true },
    { name: 'Bebidas', description: 'Drinks and beverages', display_order: 3, is_active: true },
    { name: 'Postres', description: 'Desserts and sweets', display_order: 4, is_active: true },
  ];

  const savedCategories: Record<string, Category> = {};

  for (const catData of categoriesData) {
    let existing = await categoryRepository.findOne({ where: { name: catData.name } });
    if (!existing) {
      existing = categoryRepository.create(catData);
      existing = await categoryRepository.save(existing);
      console.log(`  Created category: ${catData.name}`);
    } else {
      console.log(`  Category already exists: ${catData.name}`);
    }
    savedCategories[catData.name] = existing;
  }

  // --- Seed Menu Items ---
  console.log('Seeding menu items...');
  const menuItemsData = [
    // Entradas
    { name: 'Nachos Supreme', description: 'Crispy tortilla chips with cheese, jalapeños, guacamole, and sour cream', price: 12.99, category_name: 'Entradas', prep_time_min: 10, station: 'cold' },
    { name: 'Empanadas de Carne', description: 'Three beef empanadas served with chimichurri sauce', price: 10.50, category_name: 'Entradas', prep_time_min: 15, station: 'hot' },
    { name: 'Ceviche Mixto', description: 'Mixed seafood ceviche with lime, onion, and cilantro', price: 14.99, category_name: 'Entradas', prep_time_min: 12, station: 'cold' },

    // Platos Principales
    { name: 'Lomo Saltado', description: 'Stir-fried beef tenderloin with tomatoes, onions, and french fries', price: 24.99, category_name: 'Platos Principales', prep_time_min: 25, station: 'hot' },
    { name: 'Pollo a la Brasa', description: 'Rotisserie chicken with salad and fries', price: 18.50, category_name: 'Platos Principales', prep_time_min: 30, station: 'grill' },
    { name: 'Paella Mixta', description: 'Spanish rice with seafood, chicken, and vegetables', price: 28.99, category_name: 'Platos Principales', prep_time_min: 35, station: 'hot' },
    { name: 'Tacos al Pastor', description: 'Three pork tacos with pineapple, onion, and cilantro', price: 16.99, category_name: 'Platos Principales', prep_time_min: 20, station: 'grill' },

    // Bebidas
    { name: 'Limonada Natural', description: 'Freshly squeezed lemonade', price: 4.50, category_name: 'Bebidas', prep_time_min: 3, station: 'bar' },
    { name: 'Pisco Sour', description: 'Classic Peruvian cocktail with pisco, lime, egg white, and bitters', price: 12.00, category_name: 'Bebidas', prep_time_min: 5, station: 'bar' },
    { name: 'Agua Mineral', description: 'Sparkling or still mineral water', price: 3.00, category_name: 'Bebidas', prep_time_min: 1, station: 'bar' },

    // Postres
    { name: 'Tres Leches', description: 'Traditional three milks cake', price: 8.99, category_name: 'Postres', prep_time_min: 5, station: 'cold' },
    { name: 'Churros con Chocolate', description: 'Fried dough sticks with chocolate dipping sauce', price: 7.50, category_name: 'Postres', prep_time_min: 10, station: 'hot' },
  ];

  for (const itemData of menuItemsData) {
    const category = savedCategories[itemData.category_name];
    if (!category) continue;

    const existing = await menuItemRepository.findOne({
      where: { name: itemData.name, category_id: category.id },
    });

    if (!existing) {
      const menuItem = menuItemRepository.create({
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        category_id: category.id,
        prep_time_min: itemData.prep_time_min,
        station: itemData.station,
        is_available: true,
      });
      await menuItemRepository.save(menuItem);
      console.log(`  Created menu item: ${itemData.name}`);
    } else {
      console.log(`  Menu item already exists: ${itemData.name}`);
    }
  }

  // --- Seed Inventory Items ---
  console.log('Seeding inventory items...');
  const inventoryData = [
    { name: 'Pollo (kg)', quantity: 25, unit: 'kg', min_stock: 5, unit_cost: 8.50 },
    { name: 'Carne de Res (kg)', quantity: 15, unit: 'kg', min_stock: 3, unit_cost: 15.00 },
    { name: 'Arroz (kg)', quantity: 50, unit: 'kg', min_stock: 10, unit_cost: 2.50 },
    { name: 'Cebolla (kg)', quantity: 20, unit: 'kg', min_stock: 5, unit_cost: 1.80 },
    { name: 'Tomate (kg)', quantity: 18, unit: 'kg', min_stock: 5, unit_cost: 2.20 },
    { name: 'Limones (kg)', quantity: 10, unit: 'kg', min_stock: 3, unit_cost: 3.00 },
    { name: 'Aceite de Oliva (lt)', quantity: 8, unit: 'lt', min_stock: 2, unit_cost: 12.00 },
    { name: 'Harina (kg)', quantity: 30, unit: 'kg', min_stock: 5, unit_cost: 1.50 },
    { name: 'Leche (lt)', quantity: 20, unit: 'lt', min_stock: 5, unit_cost: 2.00 },
    { name: 'Pisco (lt)', quantity: 6, unit: 'lt', min_stock: 2, unit_cost: 25.00 },
    { name: 'Agua Mineral (unidad)', quantity: 48, unit: 'unidad', min_stock: 12, unit_cost: 0.80 },
    { name: 'Chocolate (kg)', quantity: 5, unit: 'kg', min_stock: 1, unit_cost: 18.00 },
  ];

  for (const invData of inventoryData) {
    const existing = await inventoryRepository.findOne({ where: { name: invData.name } });
    if (!existing) {
      const item = inventoryRepository.create(invData);
      await inventoryRepository.save(item);
      console.log(`  Created inventory item: ${invData.name}`);
    } else {
      console.log(`  Inventory item already exists: ${invData.name}`);
    }
  }

  console.log('\nSeed completed successfully!');
  await dataSource.destroy();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
