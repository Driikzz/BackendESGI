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

// Route pour récupérer un duo avec un user de role suiveur et qui trialPeriodMeeting est false
router.get('/duos/suiveur/:id/trialPeriodMeeting', authMiddleware, (req: Request, res: Response) => duoController.getDuoWithSuiveurIdAndPeriodMeetingFalse(req, res));

// Route pour récupérer les duos attribués à un suiveur
router.get('/suiveur/:id/duos', authMiddleware, (req: Request, res: Response) => duoController.getDuosBySuiveurId(req, res));

// Route pour récupérer les duos d'une entreprise
router.get('/entreprise/:id/duos', authMiddleware, (req: Request, res: Response) => duoController.getDuosByEntrepriseId(req, res));

// Route pour modifier les champs Alternant, Tuteur et Suiveur d'un duo
router.put('/:id/users', authMiddleware, (req: Request, res: Response) => duoController.updateDuoUsers(req, res));
// Route pour récupérer les duos à partir de l'id d'un tuteur
router.get('/tuteur/:id/duos', authMiddleware, (req: Request, res: Response) => duoController.getDuosByTuteurId(req, res));

export default router;
