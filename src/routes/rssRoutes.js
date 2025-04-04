import express from 'express';
import { extractAndSaveRSS } from '../controllers/rssController.js';

const router = express.Router();

router.get('/extract', extractAndSaveRSS);

export default router;