'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('GeneroMusical', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
      genero: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'GeneroMusical',
    timestamps: false
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('GeneroMusical');
  },
};