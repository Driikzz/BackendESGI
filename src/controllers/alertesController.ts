import { Request, Response } from 'express';
import alertesService from '../services/alertesService';
import { AlertTypes, AlertType } from '../types/alertTypes';
import { CustomRequest } from '../types/CustomRequest';

class AlertesController {
  async getAllAlertes(req: Request, res: Response) {
    try {
      const alertes = await alertesService.getAllAlertes();
      res.status(200).json(alertes);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async getAlertesByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const alertes = await alertesService.getAlertesByUserId(Number(userId));
      res.status(200).json(alertes);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async getAlertesByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (!(type in AlertTypes)) {
        return res.status(400).json({ error: 'Invalid alert type' });
      }
      const alertes = await alertesService.getAlertesByType(type as AlertType);
      res.status(200).json(alertes);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async traiterAlerte(req: CustomRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const result = await alertesService.traiterAlerte(Number(id), user.id);
      res.status(200).json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }
}

export default new AlertesController();
