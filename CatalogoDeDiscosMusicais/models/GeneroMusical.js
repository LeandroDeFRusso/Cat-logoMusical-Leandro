import { DataTypes } from "sequelize";
import { sequelize } from "../dbConfig.js";

const GeneroMusical = sequelize.define('GeneroMusical', {
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

const createGeneroMusicalTable = async () => {
    try {
        await GeneroMusical.sync();
        console.log('Tabela Genero Musical criado ou já existente no banco de dados!');
    } catch (err) {
        console.error('Erro ao criar a tabela Genero Musical:', err);
    }
};

const createGeneroMusical = async (genero) => {
    try {
        await GeneroMusical.create ({
            genero
        });
        console.log('Genero Musical inserido com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir o Genero Musical:', err);
    }
};

const generoMusicalModel = {
    createGeneroMusicalTable,
    createGeneroMusical
};

export default generoMusicalModel;