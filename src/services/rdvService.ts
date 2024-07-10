import rdvRepository from "../repositories/rdvRepository";

class rdvService {
    static async create(rdv:any) {
        return rdvRepository.create(rdv);
    }

    static async getRdvBySuiveurId(id: number) {
        return rdvRepository.getRdvBySuiveurId(id);
    }
}

export default rdvService;