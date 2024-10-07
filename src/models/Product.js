const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');


const Product = sequelize.define(
    'Product',
    {

      Product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Product_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Product_price: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
      },
      Product_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      Category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Category', 
          key: 'Category_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },

    {
        timestamps: true,
    }
  );

  module.exports = Product;