import { IRdv } from "../models/IRdv";
import Rdv from "../models/IRdv";
import { User } from "../models/IUser";

class rdvRepository {

    static async create(rdv : any ) {
        return await Rdv.create(rdv);
    }

    static async rdvExists(rdv: IRdv): Promise<boolean> {
        const existingRdv = await Rdv.findOne({
          where: {
            idSuiveur: rdv.idSuiveur,
            dateRdv: rdv.dateRdv
          }
        });
        return !!existingRdv;
      }

    static async getRdvBySuiveurId(id: number) {
        return await Rdv.findAll({
          where: {
            idSuiveur: id
          }
        });
    }

    static async findEmailById(id: number): Promise<string[]> {
        const users = await User.findAll({
          where: {
            id: id
          }
        });
        return users.map(user => user.email);
    }
}

export default rdvRepository;