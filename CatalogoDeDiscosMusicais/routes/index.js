import express from 'express';
import { showDiscos } from '../controllers/discosController.js';

const router = express.Router();

router.get('/', showDiscos);


export default router;