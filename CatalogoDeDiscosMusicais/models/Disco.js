import { DataTypes } from "sequelize";
import { sequelize } from "../dbConfig.js"
import { Artista } from "./Artista.js";
import faixaModel from "./Faixa.js";

const Disco = sequelize.define('Disco', {
    discoId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    anoLancamento: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    capa: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName:'Disco',
    timestamps: false
});

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

//Parte para criação das associações ao disco
Disco.belongsTo(Artista, { foreignKey: 'artistaFk' });
Artista.hasMany(Disco, { foreignKey: 'artistaFk' });

Disco.hasMany(Faixa, { foreignKey: 'discoFk' });
Faixa.belongsTo(Disco, { foreignKey: 'discoFk' });

Disco.belongsToMany(GeneroMusical, { through: 'DiscoGeneroMusical' });
GeneroMusical.belongsToMany(Disco, { through: 'DiscoGeneroMusical' });

const createDiscoTable = async () => {
    try {
        await Disco.sync();
        console.log('Tabela Discos criada ou já existente no banco de dados!')
    } catch (err) {
        console.error('Erro ao sincronizar tabela para criação ou verificação da mesma:', err)
    }
};

const createDisco = async (titulo, anoLancamento, capa, nome, duracao, audio, genero) => {
    try {
        const novoDisco = await Disco.create({
            titulo,
            anoLancamento,
            capa
        });
        await Faixa.create({
            nome,
            duracao,
            audio,
            discoFk: novoDisco.discoId
        });
        const novoGenero = await GeneroMusical.create({
            genero
        });
        await novoDisco.setGeneroMusical(novoGenero);
        console.log('Disco e faixas inseridos com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir o disco ou as faixas, tente novamente:', err);
    }
};


const discosModel = {
    createDiscoTable,
    createDisco
};

export default discosModel;