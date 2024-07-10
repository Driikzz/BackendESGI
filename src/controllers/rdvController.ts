import { Request, Response } from 'express';
import rdvService from '../services/rdvService';
import rdvRepository from '../repositories/rdvRepository';
import { sendRdvCreatedEmail } from '../services/emailService';

class rdvController {
    static async createRdv(req: Request, res: Response) {
        const rdv = req.body;
        console.log(rdv);
        if ( await rdvRepository.rdvExists(rdv)) {
            return res.status(400).json({ message: 'Rdv already exists' });
        } else {
            try {
                const newRdv = await rdvService.create(rdv);

                const [tuteurEmail, alternantEmail, suiveurEmail] = await Promise.all([
                    rdvRepository.findEmailById(rdv.idTuteur),
                    rdvRepository.findEmailById(rdv.idAlternant),
                    rdvRepository.findEmailById(rdv.idSuiveur)
                ]);

                // Envoyer les e-mails avec les adresses récupérées
                await sendRdvCreatedEmail(tuteurEmail[0], alternantEmail[0], suiveurEmail[0], newRdv);
                console.log("mail",tuteurEmail[0], alternantEmail[0], suiveurEmail[0]);

                return res.status(201).json(newRdv);
            } catch (error) {
                console.error('Error creating rdv:', error);
                return res.status(500).json({ message: 'Error creating rdv' });
            }
        }
    }
    static async getRdvBySuiveurId(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
            const rdv = await rdvService.getRdvBySuiveurId(id);
            if (rdv) {
                return res.status(200).json(rdv);
            } else {
                return res.status(404).json({ message: 'Rdv not found' });
            }
        } catch (error) {
            console.error('Error getting rdv:', error);
            return res.status(500).json({ message: 'Error getting rdv' });
        }
    }


}

export default rdvController;