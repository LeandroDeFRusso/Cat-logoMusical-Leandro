import express from 'express';
import { handleFileUpload } from '../middlewares/upload.js';
import { montarDisco, showAddDiscos, findDiscoById, updateDiscoById, showUpdateDiscos, excluirDisco } from '../controllers/discosController.js';

const router = express.Router();

router.get('/adicionarDiscos', showAddDiscos)

router.post('/adicionarDiscos',
    handleFileUpload([
        { name: 'capa', maxCount: 1 },
        { name: 'audio', maxCount: 1 }
    ]),
    montarDisco
);

router.get('/:id', findDiscoById);

router.get('/editarDiscos/:id', showUpdateDiscos);

router.post(
    '/editarDiscos/:id',
    handleFileUpload([
        { name: 'capa', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
    ]),
    updateDiscoById
);

router.post('/excluirDiscos/:id', excluirDisco);

export default router;