import { DataTypes } from "sequelize";
import { sequelize } from "../dbConfig.js";

const Disco = sequelize.define('Disco', {
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
        artistaFK: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'Artista',
            key: 'id',
      },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
    },
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

const createDiscoTable = async () => {
    try {
        await Disco.sync();
        console.log('Tabela Discos criada ou já existente no banco de dados!')
    } catch (err) {
        console.error('Erro ao sincronizar tabela para criação ou verificação da mesma:', err)
    }
};

const createDisco = async (titulo, anoLancamento, capa, nome, duracao, audio, generos) => {
    const transaction = await sequelize.transaction();
    try {
        const novoDisco = await Disco.create(
            { titulo, anoLancamento, capa },
            { transaction }
        );
        const discoFK = novoDisco.discoId;

        await sequelize.query(
            'INSERT INTO faixa(nome, duracao, audio, discoFK) values(:nome, :duracao, :audio, :discoFK)',
            { replacements: { nome, duracao, audio, discoFK }, transaction }
        );

        const generosArray = Array.isArray(generos) ? generos : [generos];
        for (const genero of generosArray) {
            await sequelize.query(
                'INSERT INTO GeneroMusical(genero, discoFK) values(:genero, :discoFK)',
                { replacements: { genero, discoFK }, transaction }
            );
        }
        await transaction.commit();
        console.log('Disco, faixas e gêneros musicais inseridos com sucesso!');
    } catch (err) {
        await transaction.rollback();
        console.error('Erro ao inserir o disco ou as faixas ou os gêneros musicais:', err);
        throw err;
    }
};

const findAllDiscos = async () => {
    const [discos] = await sequelize.query(`
        SELECT 
            d.discoId, 
            d.titulo, 
            d.anoLancamento, 
            d.capa,
            a.nome AS nomeArtista
        FROM Disco d
        LEFT JOIN artista a ON d.artistaFK = a.id
    `);
    return discos;
};

const findGenerosByDiscoId = async (discoId) => {
    const [generos] = await sequelize.query(`
        SELECT genero
        FROM GeneroMusical
        WHERE discoFK = :discoId
    `, { replacements: { discoId } });
    return generos.map(g => g.genero);
};

const findFaixasByDiscoId = async (discoId) => {
    const [faixas] = await sequelize.query(`
        SELECT nome, duracao, audio
        FROM faixa
        WHERE discoFK = :discoId
    `, { replacements: { discoId } });
    return faixas;
};

const validarDiscosNaoAssociados = async () =>{
    const [results] = await sequelize.query(
        'SELECT discoId, titulo, anoLancamento from disco where artistaFK is NULL'
    );
    return results;
};

const findDiscoById = async (id) => {
    try {
        const [results] = await sequelize.query(`
            SELECT 
                d.discoId, 
                d.titulo, 
                d.anoLancamento, 
                d.capa,
                GROUP_CONCAT(DISTINCT g.genero ORDER BY g.genero ASC SEPARATOR ', ') AS generoMusical,
                a.nome AS nomeArtista,
                f.nome AS faixaNome,
                f.duracao AS faixaDuracao,
                f.audio AS faixaAudio
            FROM Disco d
            LEFT JOIN faixa f ON d.discoId = f.discoFK
            LEFT JOIN generomusical g ON d.discoId = g.discoFK
            LEFT JOIN artista a ON d.artistaFK = a.id
            WHERE d.discoId = :id
            GROUP BY 
                d.discoId, 
                d.titulo, 
                d.anoLancamento, 
                d.capa, 
                a.nome,
                f.nome,
                f.duracao,
                f.audio
        `, { replacements: { id } });
        return results.length > 0 ? results[0] : null;
    } catch (err) {
        console.error('Erro ao buscar detalhes do disco:', err);
        throw err;
    }
};

const updateDiscoById = async (discoId, novoTitulo, novoAnoLancamento, novaCapa, novoGenero, novoNome, novaDuracao, novoAudio) => {
    const transaction = await sequelize.transaction();
    try {
        console.log({
            discoId,
            novoTitulo,
            novoAnoLancamento,
            novaCapa,
            novoGenero,
            novoNome,
            novaDuracao,
            novoAudio
        });        
        await sequelize.query(
            `UPDATE disco
             SET titulo = :novoTitulo,
                 anoLancamento = :novoAnoLancamento,
                 capa = :novaCapa
             WHERE discoId = :discoId`,
            {
                replacements: { novoTitulo, novoAnoLancamento, novaCapa, discoId },
                transaction,
            }
        );
        if (novoGenero) {
            await sequelize.query(
                `UPDATE generomusical
                 SET genero = :novoGenero
                 WHERE discoFk = :discoId`,
                {
                    replacements: { novoGenero, discoId },
                    transaction,
                }
            );
        }
        if (novoNome || novaDuracao || novoAudio) {
            await sequelize.query(
                `UPDATE faixa
                 SET nome = :novoNome,
                     duracao = :novaDuracao,
                     audio = :novoAudio
                 WHERE discoFk = :discoId`,
                {
                    replacements: { novoNome, novaDuracao, novoAudio, discoId },
                    transaction,
                }
            );
        }
        await transaction.commit();
        console.log('Disco e faixa atualizados com sucesso!');
    } catch (err) {
        await transaction.rollback();
        console.error('Erro ao atualizar o disco ou a faixa:', err);
        throw err;
    }
};

const findDiscosByArtistaId = async (artistaId) => {
    const [results] = await sequelize.query(`
        SELECT d.discoId, d.titulo, 
               CASE WHEN d.artistaFK = :artistaId THEN true ELSE false END AS associado
        FROM Disco d
        WHERE d.artistaFK IS NULL OR d.artistaFK = :artistaId
    `, {
        replacements: { artistaId },
    });
    return results;
};

const deleteDisco = async (discoId) => {
    const transaction = await sequelize.transaction();
    try {
        await sequelize.query(
            `DELETE FROM Disco
             WHERE discoId = :discoId`,
            {
                replacements: { discoId },
                transaction,
            }
        );
        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        console.error('Erro ao excluir disco:', err);
        throw err;
    }
};

const searchDisco = async ({ titulo, artista, genero, generoMusical }) => {
    const whereClauses = [];
    const replacements = {};

    if (titulo) {
        whereClauses.push('d.titulo LIKE :titulo');
        replacements.titulo = `%${titulo}%`;
    }
    if (artista) {
        whereClauses.push('a.nome LIKE :artista');
        replacements.artista = `%${artista}%`;
    }
    if (genero) {
        whereClauses.push('(g.genero LIKE :genero OR a.generoMusical LIKE :genero)');
        replacements.genero = `%${genero}%`;
    }
    if (generoMusical) {
        whereClauses.push('a.generoMusical LIKE :generoMusical');
        replacements.generoMusical = `%${generoMusical}%`;
    }

    const whereCondition = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const query = `
        SELECT 
            d.discoId, 
            d.titulo, 
            d.anoLancamento, 
            d.capa,
            GROUP_CONCAT(DISTINCT g.genero ORDER BY g.genero ASC SEPARATOR ', ') AS generoMusical,
            a.nome AS nomeArtista,
            a.generoMusical AS generoArtista,
            f.nome AS faixaNome,
            f.duracao AS faixaDuracao,
            f.audio AS faixaAudio
        FROM Disco d
        LEFT JOIN generomusical g ON d.discoId = g.discoFk
        LEFT JOIN faixa f ON d.discoId = f.discoFK
        LEFT JOIN artista a ON d.artistaFk = a.id
        ${whereCondition}
        GROUP BY d.discoId, d.titulo, d.anoLancamento, d.capa, a.nome, a.generoMusical, f.nome, f.duracao, f.audio
    `;
    try {
        const [results] = await sequelize.query(query, { replacements });
        return results;
    } catch (err) {
        console.error('Erro ao buscar discos com filtros:', err);
        throw err;
    }
};

const discosModel = {
    createDiscoTable,
    createDisco,
    findAllDiscos,
    validarDiscosNaoAssociados,
    findDiscoById,
    updateDiscoById,
    findDiscosByArtistaId,
    deleteDisco,
    findGenerosByDiscoId,
    findFaixasByDiscoId,
    searchDisco
};

export default discosModel;