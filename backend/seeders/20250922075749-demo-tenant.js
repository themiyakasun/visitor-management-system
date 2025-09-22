'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tenants', [
      {
        id: uuidv4(),
        name: 'Tenant 1',
        slug: 'tenant-1',
        description: 'First tenant',
        email: 'tenant1@example.com',
        phone: '1234567890',
        city: 'Colombo',
        country: 'Sri Lanka',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Tenant 2',
        slug: 'tenant-2',
        description: 'Second tenant',
        email: 'tenant2@example.com',
        phone: '0987654321',
        city: 'Kandy',
        country: 'Sri Lanka',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tenants', null, {});
  },
};
