import bodyParser from 'body-parser';
import flash from 'connect-flash';
import EventEmitter from 'events';
import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import methodOverrride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialize, sequelize } from './dbConfig.js';
import artista from './routes/artista.js';
import discos from './routes/discos.js';
import index from './routes/index.js';

const app = express();

app.use(methodOverrride('_method'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Configurações do app
    //Sessão
    app.use(session({
        secret: 'fsnfosnfibuingsbgsngjsnvjbnsbusnvsnjbsj',
        resave: false,
        saveUnitialized: true,
        cookie: { secure: false}
    }));

    app.use(flash());

    //Middleware para passar as informações de sessão e falsh para os arquivos views
    app.use((req, res, next) =>{
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.user = req.session.user;
        next();
    });

    // Middleware para o passar o body
    app.use(express.json());
    app.use(express.urlencoded({ extendd: true }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Handlebars
    app.engine('handlebars', engine({
        runtimeOptions: {
            allowProtoMethodsByDefault: true,
            allowProtoMethodsByDefault: true,
        },
        helpers: {
            //Caso tenha alguma formatação especifica a ser declarada
        }
    }));

    //Acesso as Views
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, 'views'));

    //Inicia a conexão do banco de dados MySql e realiza a sincronização com as mesmas
    async function initializeDatabase() {
        try {
            await initialize();
            await sequelize.sync();
            console.log("Muito bom, banco de dados MySql conectado e tabelas sincronizadas com sucesso!")
        } catch (error){
            console.error('Erro ao iniciar a conexão com o banco de dados,' , error);
            process.exit(1);
        }
    }

    //Arquivos estáticos
    app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
    app.use(express.static('public'));

    //Rotas
    app.use('/', index);
    app.use('/discos', discos);
    app.use('/artistas', artista);

//Liberar Servidor
const PORT = 8081;
app.listen(PORT, async () =>{
    await initializeDatabase();
    console.log("Perfeito, servidor rodando na porta:" , PORT);
});