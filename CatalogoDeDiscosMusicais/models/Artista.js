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
        const novoArtista = await Artista.create(
            { nome, generoMusical },
            { transaction }
        );

        // Verifica se há discos selecionados
        const discosArray = Array.isArray(discos) ? discos : [discos];
        if (discosArray && discosArray.length > 0) {
            const query = `
                UPDATE Disco
                SET artistaFk = :artistaId
                WHERE discoId IN (:discos);
            `;

            await sequelize.query(query, {
                replacements: {
                    artistaId: novoArtista.id,
                    discos: discosArray,
                },
                transaction,
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

const updateArtista = async ({artistaId, nome, generoMusical, discos}) => {
    const transaction = await sequelize.transaction();
    try {
        const artistaAtualizado = await sequelize.update(
            { nome, generoMusical},
            {
                where: {id: artistaId},
                transaction,
            }
        );
        const removerAssociacoes = 'UPDATE disco SET artistaFk = NULL WHERE artistaFk =:artistaId';
        await sequelize.query(removerAssociacoes, {
            replacements: { artistaId },
            transaction,
        });
        if (discos && discos.length > 0) {
            const atualizarDiscos = 'UPDATE disco SET artistaFk = :artistaId WHERE discoId IN (:discos);';
            await sequelize.query(atualizarDiscos, {
                replacements: {
                    artistaId,
                    discos,
                },
                transaction,
            });
        }
        await transaction.commit();
        return artistaAtualizado;
    } catch (err) {
        await transaction.rollback();
        console.error('Erro ao atualizar o artista:', err);
        throw err;
    }
}

const artistaModel = {
    createArtistaTable,
    createArtista,
    updateArtista
};

export default artistaModel;
