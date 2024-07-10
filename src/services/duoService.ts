import Duo, { IDuo } from '../models/Duo';
import { IEntreprise } from '../models/IEntreprise';
import duoRepository from '../repositories/duoRepository';
import userRepository from '../repositories/userRepository';

class DuoService {
    async createDuo(data: any) {
        return await duoRepository.createDuo(data);
    }

    async getAllDuos() {
        return await duoRepository.getAllDuos();
    }

    async getDuoById(id: number) {
        return await duoRepository.getDuoById(id);
    }

    async updateDuo(id: number, data: any) {
        return await duoRepository.updateDuo(id, data);
    }

    async deleteDuo(id: number) {
        return await duoRepository.deleteDuo(id);
    }

    async createOrUpdateDuoIfNecessary(entreprise: IEntreprise): Promise<void> {
        const userIdsArray = entreprise.userId;
        console.log("userIdsArray", userIdsArray);
        
        for (const userIds of userIdsArray as any[]) {
            const alternantId = await userRepository.findAlternantId(userIds);
            console.log("alternantId", alternantId);
            const tuteurId = await userRepository.findTuteurId(userIds);
            console.log("tuteurId", tuteurId);
            if (alternantId && tuteurId) {
                const suiveurId = userIds.find((id: any) => id !== alternantId && id !== tuteurId);
                console.log("suiveurId", suiveurId);

                const existingDuo = await duoRepository.findDuoByUserIds(alternantId, tuteurId, suiveurId);
                if (existingDuo) {
                    const updatedDuoAttributes: IDuo = {
                        ...existingDuo,
                        idAlternant: alternantId,
                        idTuteur: tuteurId,
                        idSuiveur: suiveurId || existingDuo.idSuiveur,
                        enterpriseName: entreprise.name,
                    };  
                    console.log("updatedDuoAttributes", updatedDuoAttributes);
    
                    await duoRepository.updateDuos(updatedDuoAttributes);
                    console.log("Duo mis à jour avec succès");
                } else {
                    const duoAttributes: IDuo = {
                        idAlternant: alternantId,
                        idTuteur: tuteurId,
                        idSuiveur: suiveurId || 0,
                        enterpriseName: entreprise.name,
                        isEnterpriseRecruit: false,
                        trialPeriodMeeting: false,
                        midTermMeeting: false,
                        yearEndMeeting: false,
                        creationDate: new Date()
                    };
                    console.log("duoAttributes", duoAttributes);
    
                    await this.createDuo(duoAttributes);
                    console.log("Duo créé avec succès");
                }
            } else {
                console.log("Alternant ou Tuteur non trouvé pour userIds:", userIds);
            }
        }
    }
    

    async getDuoWithSuiveurIdAndTrialPeriodMeetingFalse(id: number) {
        return await duoRepository.getDuoWithSuiveurIdAndTrialPeriodMeetingFalse(id);
    }

    async getDuoWithSuiveurIdAndMidTermMeetingFalse(id: number) {
        return await duoRepository.getDuoWithSuiveurIdAndMidTermMeetingFalse(id);
    }

    async getDuoWithSuiveurIdAndYearEndMeetingFalse(id: number) {
        return await duoRepository.getDuoWithSuiveurIdAndYearEndMeetingFalse(id);
    }

    async getDuosBySuiveurId(id: number) {
        return await duoRepository.getDuosBySuiveurId(id);
    }

    async getDuosByEntrepriseId(id: number) {
        return await duoRepository.getDuosByEntrepriseId(id);
    }

    async updateDuoUsers(id: number, data: any) {
        return await duoRepository.updateDuoUsers(id, data);
    }

    async getDuosByUserId(userId: number) {
        return await duoRepository.findAll({ where: { idAlternant: userId } });
      }

    async getDuosByTuteurId(id: number) {
        return await duoRepository.getDuosByTuteurId(id);
    }
    
}

export default new DuoService();
