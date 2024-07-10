import { Router } from 'express';
import alertesController from '../controllers/alertesController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/alertes', authMiddleware, (req, res) => alertesController.getAllAlertes(req, res));
router.get('/alertes/user/:userId', authMiddleware, (req, res) => alertesController.getAlertesByUserId(req, res));
router.get('/alertes/type/:type', authMiddleware, (req, res) => alertesController.getAlertesByType(req, res));
router.put('/alertes/:id/traiter', authMiddleware, (req, res) => alertesController.traiterAlerte(req, res));

export default router;
