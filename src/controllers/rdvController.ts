import { Request, Response } from 'express';
import rdvService from '../services/rdvService';
import rdvRepository from '../repositories/rdvRepository';
import { sendRdvCancelledEmail, sendRdvCreatedEmail, sendRdvRelanceEmail } from '../services/emailService';
import duoRepository from '../repositories/duoRepository';

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
          const id = rdv[0].id;
          console.log("ID : ",id);
      
          const existingRdv = await rdvService.findRdvById(id);
      
          if (!existingRdv) {
            return res.status(404).json({ message: 'Rdv not found' });
          }
      
          const idAlternant = existingRdv.idAlternant;
          const idTuteur = existingRdv.idTuteur;
          console.log("IDS : ",idAlternant, idTuteur);
      
        const [alternantEmail, tuteurEmail] = await Promise.all([
            rdvRepository.findEmailById(idAlternant),
            rdvRepository.findEmailById(idTuteur),
        ]);

        const deletedRdv = await rdvService.deleteRdv(id);

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

      static async relanceRdv(req: Request, res: Response) {
        const id = parseInt(req.params.id);
    
        try {
            const duos = await duoRepository.getDuosBySuiveurId(id);
            console.log(duos);
    
            if (duos && duos.length > 0) {
                await Promise.all(duos.map(async (duo) => {
                    const { idTuteur, idAlternant } = duo.dataValues;
    
                    const hasRdv = await rdvRepository.getDuosWithoutRdv(idTuteur, idAlternant);
                    if (hasRdv) {
                        const [alternantEmail, tuteurEmail] = await Promise.all([
                            rdvRepository.findEmailById(idAlternant),
                            rdvRepository.findEmailById(idTuteur)
                        ]);
    
                        await Promise.all([
                            sendRdvRelanceEmail(tuteurEmail[0], alternantEmail[0]),
                            console.log("Mail sent to:", alternantEmail[0], tuteurEmail[0])
                        ]);
                    }
                }));
                return res.status(200).json({ message: 'Relance email sent successfully' });
            } else {
                return res.status(404).json({ message: 'Duo not found' });
            }
        } catch (error) {
            console.error('Error sending relance email:', error);
            return res.status(500).json({ message: 'Error sending relance email' });
        }
    }

    static async getDuosWithoutRdv(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
            const findDuo = await duoRepository.getDuosBySuiveurId(id);
            
            if (findDuo && findDuo.length > 0) {
                const duosWithoutRdv = [];
    
                for (const duo of findDuo) {
                    // On assume que duo.dataValues contient les valeurs nécessaires
                    const { idTuteur, idAlternant } = duo.dataValues;
    
                    const rdv = await rdvRepository.getDuosWithoutRdv(idTuteur, idAlternant);
                    if (rdv === true) {
                        duosWithoutRdv.push(duo);
                    }
                }
    
                if (duosWithoutRdv.length > 0) {
                    return res.status(200).json(duosWithoutRdv);
                } else {
                    return res.status(404).json({ message: 'All duos have a RDV' });
                }
            } else {
                return res.status(404).json({ message: 'No duos found for the given suiveur' });
            }
        } catch (error) {
            console.error('Error fetching duos without RDV:', error);
            return res.status(500).json({ message: 'Error fetching duos without RDV' });
        }
    }

    static async getRdvByTuteurId(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
            const rdv = await rdvService.getRdvByTuteurId(id);
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