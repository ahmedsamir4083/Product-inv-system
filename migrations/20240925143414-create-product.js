'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      Product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Product_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Product_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Product_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      Product_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories', 
          key: 'Category_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  },
};
