import { Request, Response } from 'express';
import rdvService from '../services/rdvService';
import rdvRepository from '../repositories/rdvRepository';
import { sendRdvCancelledEmail, sendRdvCreatedEmail } from '../services/emailService';

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

    static async deleteRdv (req: Request, res: Response){
        const rdv = req.body;
        console.log(rdv);
      
        try {
          // Extraire les informations nécessaires du rendez-vous
          const id = rdv[0].id;
          console.log("ID : ",id);
      
          // Récupérer le rendez-vous complet par son ID
          const existingRdv = await rdvService.findRdvById(id);
      
          if (!existingRdv) {
            return res.status(404).json({ message: 'Rdv not found' });
          }
      
          // Récupérer les IDs de l'alternant et du tuteur depuis le rendez-vous existant
          const idAlternant = existingRdv.idAlternant;
          const idTuteur = existingRdv.idTuteur;
          console.log("IDS : ",idAlternant, idTuteur);
      
          // Récupérer les adresses e-mail de l'alternant et du tuteur
        const [alternantEmail, tuteurEmail] = await Promise.all([
            rdvRepository.findEmailById(idAlternant),
            rdvRepository.findEmailById(idTuteur),
        ]);

        // Supprimer le rendez-vous de la base de données
        const deletedRdv = await rdvService.deleteRdv(id);

        // Envoyer les courriels d'annulation
        await Promise.all([
            sendRdvCancelledEmail(alternantEmail[0], existingRdv),
            sendRdvCancelledEmail(tuteurEmail[0], existingRdv),
            console.log("mail",alternantEmail[0], tuteurEmail[0])
        ]);
          return res.status(200).json({ message: 'Rdv deleted successfully', rdv: deletedRdv });
        } catch (error) {
          console.error('Error deleting rdv:', error);
          return res.status(500).json({ message: 'Error deleting rdv' });
        }
      };


}

export default rdvController;