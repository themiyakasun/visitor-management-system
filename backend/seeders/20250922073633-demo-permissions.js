'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('permissions', [
      {
        resource: 'user',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resource: 'user',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resource: 'user',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resource: 'role',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resource: 'role',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resource: 'role',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('permissions', null, {});
  },
};
