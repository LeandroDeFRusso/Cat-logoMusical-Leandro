import express from 'express';
import { atualizarArtista, excluirArtista, listarArtistas, montarArtista, renderEditarArtista, showAddArtista } from '../controllers/artistaContoller.js';

const router = express.Router();

router.get('/adicionarArtistas', showAddArtista);

router.post('/adicionarArtistas', montarArtista);

router.get('/visualizarArtistas', listarArtistas);

router.get('/editarArtistas/:id', renderEditarArtista);

router.post('/editarArtistas/:id', atualizarArtista)

router.post('/excluirArtistas/:id', excluirArtista)

export default router;