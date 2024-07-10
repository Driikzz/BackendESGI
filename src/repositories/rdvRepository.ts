import { IRdv } from "../models/IRdv";
import Rdv from "../models/IRdv";




class rdvRepository {

    static async create(rdv : any ) {
        return await Rdv.create(rdv);
    }
}

export default rdvRepository;