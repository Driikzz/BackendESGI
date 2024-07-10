import { Request, Response } from 'express';
import rdvService from '../services/rdvService';

class rdvController {

    static async createRdv(req: Request, res: Response) {
        const rdv = req.body;
        console.log(rdv);
        try {
          const newRdv = await rdvService.create(rdv);
          return res.status(201).json(newRdv);
        } catch (error) {
          console.error('Error creating rdv:', error);
          return res.status(500).json({ message: 'Error creating rdv' });
        }
    } 


}

export default rdvController;