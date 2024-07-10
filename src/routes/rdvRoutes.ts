import { Router, Request, Response } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import rdvController from '../controllers/rdvController';


const router = Router();

router.post('/rdv', authMiddleware ,(req: Request, res: Response) => rdvController.createRdv(req, res));


export default router;