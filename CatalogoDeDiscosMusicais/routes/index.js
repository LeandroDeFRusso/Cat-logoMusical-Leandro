import express from 'express';
import { showDiscos, buscarDisco } from '../controllers/discosController.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { titulo, artista, genero } = req.query;
    if (titulo || artista || genero) {
        return buscarDisco(req, res);
    }
    return showDiscos(req, res);
});

export default router;