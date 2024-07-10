import { Router, Request, Response } from 'express';
import meetingController from '../controllers/meetingController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/duos/:duoId/startOfYearMeeting', authMiddleware, (req: Request, res: Response) => meetingController.submitStartOfYearMeeting(req, res));
router.post('/duos/:duoId/midTermMeeting', authMiddleware, (req: Request, res: Response) => meetingController.submitMidTermMeeting(req, res));
router.post('/duos/:duoId/endOfYearMeeting', authMiddleware, (req: Request, res: Response) => meetingController.submitEndOfYearMeeting(req, res));

router.get('/students/:studentId/startOfYearMeeting', authMiddleware, (req: Request, res: Response) => meetingController.getStartOfYearMeeting(req, res));
router.get('/students/:studentId/midTermMeeting', authMiddleware, (req: Request, res: Response) => meetingController.getMidTermMeeting(req, res));
router.get('/students/:studentId/endOfYearMeeting', authMiddleware, (req: Request, res: Response) => meetingController.getEndOfYearMeeting(req, res));

export default router;
