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
},  {
    tableName: 'Faixa',
    timestamps: false
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Faixa');
  },
};	