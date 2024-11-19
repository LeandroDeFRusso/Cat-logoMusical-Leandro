import express from 'express';
import { handleFileUpload } from '../middlewares/upload.js';
import { montarDisco, showAddDiscos } from '../controllers/discosController.js';

const router = express.Router();

router.get('/adicionarDiscos', showAddDiscos)

router.post('/adicionarDiscos',
    handleFileUpload([
        { name: 'capa', maxCount: 1 },
        { name: 'audio', maxCount: 1 }
    ]),
    montarDisco
);







export default router;