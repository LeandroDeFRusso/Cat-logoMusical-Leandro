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
    }, 
      discoFK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
         model: 'Disco',
          key: 'discoId',
      },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'GeneroMusical',
    timestamps: false
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('GeneroMusical');
  },
};