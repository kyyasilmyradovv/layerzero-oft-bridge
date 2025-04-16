import { Router } from 'express';
import { getBridgeHistory } from '../controllers/bridgeController';
const router = Router();

router.get('/bridge-history', getBridgeHistory);

export default router;
