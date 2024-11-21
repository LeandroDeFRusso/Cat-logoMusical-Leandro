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
                'INSERT INTO generomusical(genero, discoFK) values(:genero, :discoFK)',
                { replacements: { genero, discoFK }, transaction }
            );
        }
        await transaction.commit();
        console.log('Disco, faixas e gêneros musicais inseridos com sucesso!');
    } catch (err) {
        await transaction.rollback();
        console.error('Erro ao inserir o disco, as faixas ou os gêneros:', err);
        throw err;
    }
};


const findAllDiscos = async () => {
    try {
        const [results] = await sequelize.query(`
            SELECT 
                d.discoId, 
                d.titulo, 
                d.anoLancamento, 
                d.capa,
                f.nome AS faixaNome, 
                f.duracao AS faixaDuracao,
                f.audio as faixaAudio,
                g.genero AS generoMusical,
                a.nome AS nomeArtista
            FROM Disco d
            LEFT JOIN faixa f ON d.discoId = f.discoFk
            LEFT JOIN generomusical g ON d.discoId = g.discoFk
            LEFT JOIN artista a ON d.artistaFk = a.id
        `);
        return results;
    } catch (err) {
        console.error('Erro ao buscar discos:', err);
        throw err;
    }
};

const validarDiscosNaoAssociados = async () =>{
    const [results] = await sequelize.query(
        'SELECT discoId, titulo, anoLancamento from disco where artistaFk is NULL'
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
                f.nome AS faixaNome, 
                f.duracao AS faixaDuracao,
                f.audio as faixaAudio,
                g.genero AS generoMusical,
                a.nome AS nomeArtista
            FROM Disco d
            LEFT JOIN faixa f ON d.discoId = f.discoFk
            LEFT JOIN generomusical g ON d.discoId = g.discoFk
            LEFT JOIN artista a ON d.artistaFk = a.id
            WHERE d.discoId = :id
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
               CASE WHEN d.artistaFk = :artistaId THEN true ELSE false END AS associado
        FROM Disco d
        WHERE d.artistaFk IS NULL OR d.artistaFk = :artistaId
    `, {
        replacements: { artistaId },
    });
    return results;
};

const discosModel = {
    createDiscoTable,
    createDisco,
    findAllDiscos,
    validarDiscosNaoAssociados,
    findDiscoById,
    updateDiscoById,
    findDiscosByArtistaId
};

export default discosModel;