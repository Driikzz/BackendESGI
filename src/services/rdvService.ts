import rdvRepository from "../repositories/rdvRepository";

class rdvService {
    static async create(rdv:any) {
        return rdvRepository.create(rdv);
    }
}

export default rdvService;