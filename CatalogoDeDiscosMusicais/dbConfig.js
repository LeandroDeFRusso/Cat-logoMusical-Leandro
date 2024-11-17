import { Sequelize } from "sequelize";

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1209200412Le@',
    database: 'catalogomusical',
    dialect: 'mysql'
};

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

export async function initialize () {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados MySQL foi estabelicida com sucesso.');
    } catch (error){
        console.error('Erro ao conectar com o banco de dados:', error);
        throw error;
    }
}

export async function close() {
    try {
        await sequelize.close();
        console.log('Conexão com o banco de dados MySQL fechada com sucesso.');
    } catch (error) {
        console.error('Erro ao fechar a conexão com o banco de dados:', error);
    }
}

export { sequelize };
    
