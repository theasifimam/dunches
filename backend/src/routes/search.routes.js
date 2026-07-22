import { Router } from 'express';
import { globalSearch } from '../controllers/search.controller.js';

const router = Router();

// GET /api/v1/search?q=...
router.get('/', globalSearch);

export default router;
