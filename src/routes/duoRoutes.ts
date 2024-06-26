import { Router, Request, Response } from 'express';
import duoController from '../controllers/duoController';
import authMiddleware from '../middlewares/authMiddleware';
import { CustomRequest } from '../types/CustomRequest';

const router = Router();

// Route pour créer un duo
router.post('/', (req: Request, res: Response) => duoController.createDuo(req, res));

// Route pour récupérer tous les duos
router.get('/', authMiddleware, (req: CustomRequest, res: Response) => duoController.getAllDuos(req, res));

// Route pour récupérer un duo par ID
router.get('/:id', authMiddleware, (req: CustomRequest, res: Response) => duoController.getDuoById(req, res));

// Route pour mettre à jour un duo par ID
router.put('/:id', authMiddleware, (req: Request, res: Response) => duoController.updateDuo(req, res));

// Route pour supprimer un duo par ID
router.delete('/:id', authMiddleware, (req: Request, res: Response) => duoController.deleteDuo(req, res));

export default router;
