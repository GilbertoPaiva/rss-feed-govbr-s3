import express from 'express';
import { extractAndSaveRSS } from '../controllers/rssController.js';

const router = express.Router();

router.get('/buscar-rss', extractAndSaveRSS);

export default router;
