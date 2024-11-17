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
      },
      artistaFk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Artista',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      faixaFk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Faixa',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      generoMusicalFk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'GeneroMusical',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    }, {
      tableName: 'Disco',
      timestamps: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Disco');
  },
};
