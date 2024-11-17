'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('Faixa', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
      duracao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    audio: {
      type: DataTypes.STRING,
      allowNull: false
    }
},  {
    tableName: 'Faixa',
    timestamps: false
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Faixa');
  },
};