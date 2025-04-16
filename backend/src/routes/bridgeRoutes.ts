import { Router } from 'express';
import { getBridgeHistory } from '../controllers/bridgeController';

const router = Router();

// GET /bridge-history?address=<user>
router.get('/bridge-history', getBridgeHistory);

export default router;
