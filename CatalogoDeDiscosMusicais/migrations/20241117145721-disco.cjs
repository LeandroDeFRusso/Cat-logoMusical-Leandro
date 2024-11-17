'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('Disco', {
      discoId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      titulo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      anoLancamento: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      capa: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {
      tableName: 'Disco',
      timestamps: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Disco');
  },
};
