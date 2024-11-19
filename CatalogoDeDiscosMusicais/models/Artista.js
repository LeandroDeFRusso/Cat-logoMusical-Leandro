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

const createArtista = async ({ nome, generoMusical, discos }) => {
    const transaction = await sequelize.transaction();
    try {
        const novoArtista = await Artista.create({ 
            nome, 
            generoMusical 
        }, { 
            transaction 
        });



        if (discosArray.length > 0) {
            const query = `
                UPDATE Disco
                SET artistaFK = ?
                WHERE discoId IN (?) 
                AND (artistaFK IS NULL OR artistaFK != ?);
            `;
            await sequelize.query(query, {
                replacements: [novoArtista.id, discosArray, novoArtista.id],
                transaction,
                type: sequelize.QueryTypes.UPDATE
            });
        }
        await transaction.commit();
        return novoArtista;
    } catch (err) {
        await transaction.rollback();
        console.error('Erro ao salvar artista na model:', err);
        throw err;
    }
};






const artistaModel = {
    createArtistaTable,
    createArtista
};

export default artistaModel;
