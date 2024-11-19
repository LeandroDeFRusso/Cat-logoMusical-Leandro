import express from 'express';
import { montarArtista, showAddArtista } from '../controllers/artistaContoller.js';

const router = express.Router();

router.get('/adicionarArtistas', showAddArtista);

router.post('/adicionarArtistas', montarArtista);

export default router;