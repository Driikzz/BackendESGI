import { Router, Request, Response } from 'express';
import userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { CustomRequest } from '../types/CustomRequest';


const router = Router();

router.get('/', authMiddleware, (req: CustomRequest, res: Response) => userController.getUserProfile(req, res)); 
// Route pour récupérer par id un utilisateur
router.get('/users/:id', authMiddleware, (req: Request, res: Response) => userController.getUserById(req, res));
// Route pour récupérer tous les utilisateurs
router.get('/users', authMiddleware, (req: CustomRequest, res: Response) => userController.getAllUsers(req, res));
// Route pour crée un utilisateur
router.post('/users', authMiddleware, (req: Request, res: Response) => userController.createUser(req, res));
// Route pour modifier un utilisateur
router.put('/users/:id',authMiddleware, (req: Request, res: Response) => userController.updateUser(req, res));
// Route pour supprimer un utilisateur 
router.delete('/users/:id',authMiddleware, (req: Request, res: Response) => userController.deleteUser(req, res));

// Route pour récupérer tous les duo attaché à un user de role suiveur
router.get('/users/:id/duos', authMiddleware, (req: Request, res: Response) => userController.getDuosWhitUserId(req, res));

// Route pour mofifier le mot de passe d'un utilisateur
router.put('/users/:id/password', authMiddleware, (req: Request, res: Response) => userController.updatePassword(req, res));

// Route pour récupérer tous les alternants et tous les suiveurs
router.get('/users/alternants/tuteur', authMiddleware, (req: Request, res: Response) => userController.getAllAlternantsandTuteur(req, res));

export default router;
