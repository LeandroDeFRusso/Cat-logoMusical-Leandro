import express from 'express';
import discosModel from '../models/Disco.js';
import faixaModel from '../models/Faixa.js';
import artistaModel from '../models/Artista.js';
import generoMusicalModel from '../models/GeneroMusical.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

export const showInicio = (req, res) => {
    res.render('index');
};

router.get('/', showInicio);

router.get('/', async (req, res) => {
    try {
        const discos = await Disco.findAll({
            include: [Faixa, Artista, GeneroMusical]
        });
        res.render('discos/lista', { discos });
    } catch (err) {
        req.flash('error_msg', 'Erro ao buscar discos!');
        res.redirect('/');
    }
});


export default router;