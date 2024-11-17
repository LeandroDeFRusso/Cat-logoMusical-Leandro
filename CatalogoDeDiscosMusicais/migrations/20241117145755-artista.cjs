'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('Artista', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
      nome: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
      generoMusical: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
      discoFK1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Disco',
          key: 'discoId',
      },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
},  {
    tableName: 'Artista',
    timestamps: false
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Artista');
  },
};
