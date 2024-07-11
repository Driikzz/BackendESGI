import rdvRepository from "../repositories/rdvRepository";

class rdvService {
    static async create(rdv:any) {
        return rdvRepository.create(rdv);
    }

    static async getRdvBySuiveurId(id: number) {
        return rdvRepository.getRdvBySuiveurId(id);
    }

    static async deleteRdv(id: number) {
        return rdvRepository.deleteRdv(id);
    }

    static async findRdvById(id: number) {
        return rdvRepository.findRdvById(id);
    }

    static async getDuosWithoutRdv( tuteurId: number, alternantId: number) {
        return rdvRepository.getDuosWithoutRdv( tuteurId, alternantId);
    }
    static async getRdvByTuteurId(id: number) {
        return rdvRepository.getRdvByTuteurId(id);
    }
}

export default rdvService;