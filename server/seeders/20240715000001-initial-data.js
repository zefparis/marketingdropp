'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const [admin] = await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        referralCode: 'ADMIN123',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { returning: true });

    // Create regular user
    const userHashedPassword = await bcrypt.hash('user123', 10);
    
    const [user] = await queryInterface.bulkInsert('Users', [
      {
        name: 'John Doe',
        email: 'user@example.com',
        password: userHashedPassword,
        role: 'user',
        referralCode: 'USER123',
        referredById: admin.id,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { returning: true });

    // Create sample products
    const products = await queryInterface.bulkInsert('Products', [
      {
        name: 'Roblox 1000 Robux',
        description: 'Get 1000 Robux for your Roblox account',
        category: 'Roblox',
        price: 9.99,
        stock: 100,
        image: 'roblox-robux.jpg',
        provider: 'MANUAL',
        isActive: true,
        averageRating: 4.5,
        numReviews: 10,
        totalSales: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Riot Points 1380',
        description: 'Get 1380 Riot Points for League of Legends',
        category: 'Riot Games',
        price: 9.99,
        stock: 50,
        image: 'riot-points.jpg',
        provider: 'MANUAL',
        isActive: true,
        averageRating: 4.7,
        numReviews: 15,
        totalSales: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'PlayStation Network $20 Gift Card',
        description: '$20 PSN Gift Card for PlayStation Store',
        category: 'PlayStation',
        price: 19.99,
        stock: 30,
        image: 'psn-card.jpg',
        provider: 'MANUAL',
        isActive: true,
        averageRating: 4.8,
        numReviews: 20,
        totalSales: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { returning: true });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all data from tables
    await queryInterface.bulkDelete('Reviews', null, {});
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
