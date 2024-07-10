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
}

export default rdvService;