import { DataTypes } from "sequelize";
import { sequelize } from "../dbConfig.js";
import discosModel from "./Disco.js";

const Artista = sequelize.define('Artista', {
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
    }
},{
    tableName: 'Artista',
    timestamps: false
});

const createArtistaTable = async () =>{
    try {
        await Artista.sync();
        console.log('Tabela Artista criada ou já existente no banco de dados!');
    } catch (err) {
        console.error('Erro ao sincronizar tabela para criação ou verificação da mesma:', err);
    }
};

const createArtista = async (nome, generoMusical) =>{
    try {
        await Artista.create({
            nome,
            generoMusical
        });
        console.log('Artista inserido com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir candidato:', err);
    }
};

const artistaModel = {
    Artista,
    createArtistaTable,
    createArtista
};

export { Artista };
export default artistaModel;
