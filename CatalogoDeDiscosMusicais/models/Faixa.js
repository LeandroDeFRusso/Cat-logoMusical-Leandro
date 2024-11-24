import { DataTypes } from "sequelize";
import { sequelize } from "../dbConfig.js"

const Faixa = sequelize.define('Faixa', {
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
}, {
    tableName: 'Faixa',
    timestamps: false
});

const createFaixaTable = async () => {
    try {
        await Faixa.sync();
        console.log('Tabela Faixa criada um já existente no banco de dados!');
    } catch (err) {
        console.error('Erro ao criar a tabela Faixa:', err);
    }
};

const createFaixa = async (nome, duracao, audio) => {
    try {
        await Faixa.create({
            nome,
            duracao,
            audio
        });
        console.log('Faixa inserida com sucesso!')
    } catch (err) {
        console.error('Erro ao inserir faixa:', err);
    }
};

const faixaModel = {
    createFaixaTable,
    createFaixa
};

export default faixaModel;