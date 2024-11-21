import { DataTypes } from "sequelize";
import { sequelize } from "../dbConfig.js";

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

const createArtista = async ({ nome, generos, discos }) => {
    const transaction = await sequelize.transaction();
    try {
        const generoMusical = generos.join(',');

        const novoArtista = await Artista.create(
            { nome, generoMusical },
            { transaction }
        );

        const discosArray = Array.isArray(discos) ? discos : [discos];

        if (discosArray.length > 0) {
            const query = `
                UPDATE Disco
                SET ArtistaFK = :id
                WHERE discoId IN (:discos);
            `;

            await sequelize.query(query, {
                replacements: {
                    id: novoArtista.id,
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

const updateArtista = async (artistaId, nome, generoMusical) => {
    try {
        await sequelize.query(
            `UPDATE Artista
             SET nome = :nome,
                 generoMusical = :generoMusical
             WHERE id = :artistaId`,
            {
                replacements: { artistaId, nome, generoMusical },
            }
        );
        return true;
    } catch (err) {
        console.error('Erro ao atualizar artista:', err);
        throw err;
    }
};

const findAllArtistas = async () => {
    try {
        const [results] = await sequelize.query(`
            SELECT 
                a.id AS artistaId,
                a.nome AS nomeArtista,
                a.generoMusical,
                d.discoId,
                d.titulo AS tituloDisco,
                d.anoLancamento,
                d.capa
            FROM Artista a
            LEFT JOIN Disco d ON a.id = d.artistaFk
        `);
        return results;
    } catch (err) {
        console.error('Erro ao buscar artistas:', err);
        throw err;
    }
};

const deleteArtista = async (artistaId) => {
    const transaction = await sequelize.transaction();
    try {
        await sequelize.query(
            `UPDATE Disco
             SET artistaFk = NULL
             WHERE artistaFk = :artistaId`,
            {
                replacements: { artistaId },
                transaction,
            }
        );
        await sequelize.query(
            `DELETE FROM Artista
             WHERE id = :artistaId`,
            {
                replacements: { artistaId },
                transaction,
            }
        );
        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        console.error('Erro ao excluir artista:', err);
        throw err;
    }
};

const findArtistaById = async (id) => {
    try {
        const [results] = await sequelize.query(`
            SELECT 
                a.id AS artistaId,
                a.nome AS nomeArtista,
                a.generoMusical,
                d.discoId,
                d.titulo AS tituloDisco,
                d.anoLancamento,
                d.capa
            FROM Artista a
            LEFT JOIN Disco d ON a.id = d.artistaFk
            WHERE a.id = :id
        `, {
            replacements: { id },
        });

        if (!results || results.length === 0) {
            return null;
        }

        const artista = {
            artistaId: results[0].artistaId,
            nomeArtista: results[0].nomeArtista,
            generoMusical: results[0].generoMusical,
            discos: results
                .filter(r => r.discoId)
                .map(disco => ({
                    discoId: disco.discoId,
                    tituloDisco: disco.tituloDisco,
                    anoLancamento: disco.anoLancamento,
                    capa: disco.capa,
                })),
        };

        return artista;
    } catch (err) {
        console.error('Erro ao buscar artista pelo ID:', err);
        throw err;
    }
};

const dissociarDiscos = async (artistaId) => {
    try {
        await sequelize.query(
            `UPDATE Disco
             SET artistaFk = NULL
             WHERE artistaFk = :artistaId`,
            {
                replacements: { artistaId },
            }
        );
    } catch (err) {
        console.error('Erro ao dissociar discos:', err);
        throw err;
    }
};

const associarDiscos = async (artistaId, discos) => {
    try {
        await sequelize.query(
            `UPDATE Disco
             SET artistaFk = :artistaId
             WHERE discoId IN (:discos)`,
            {
                replacements: { artistaId, discos },
            }
        );
    } catch (err) {
        console.error('Erro ao associar discos:', err);
        throw err;
    }
};

const artistaModel = {
    createArtistaTable,
    createArtista,
    updateArtista,
    findAllArtistas,
    deleteArtista,
    findArtistaById,
    associarDiscos,
    dissociarDiscos
};

export default artistaModel;
