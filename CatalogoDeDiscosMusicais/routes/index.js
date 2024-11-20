import express from 'express';
import discosModel from '../models/Disco.js';
import faixaModel from '../models/Faixa.js';
import artistaModel from '../models/Artista.js';
import generoMusicalModel from '../models/GeneroMusical.js';
import upload from '../middlewares/upload.js';
import { showDiscos } from '../controllers/discosController.js';

const router = express.Router();

router.get('/', showDiscos);


export default router;