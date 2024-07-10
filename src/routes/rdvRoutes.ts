import { Router, Request, Response } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import rdvController from '../controllers/rdvController';


const router = Router();

router.post('/rdv', authMiddleware ,(req: Request, res: Response) => rdvController.createRdv(req, res));

// Route pour récupérer tous les rdv d'un suiveur par ID
router.get('/rdv/suiveur/:id', authMiddleware, (req: Request, res: Response) => rdvController.getRdvBySuiveurId(req, res));

// Route pour supprimer un rdv par ID
router.post('/rdv/delete', authMiddleware, (req: Request, res: Response) => rdvController.deleteRdv(req, res));



export default router;