import express from 'express';
import { handleFileUpload } from '../middlewares/upload.js';
import { montarDisco, showAddDiscos, findDiscoById, updateDiscoById, editarDiscos } from '../controllers/discosController.js';

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

router.get('/editar/:id', editarDiscos);

router.post('/editar/:id', updateDiscoById);







export default router;