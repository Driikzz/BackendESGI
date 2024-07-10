import { IRdv } from "../models/IRdv";
import Rdv from "../models/IRdv";
import { User } from "../models/IUser";

Rdv.belongsTo(User, { foreignKey: 'idTuteur', as: 'tuteur' });
Rdv.belongsTo(User, { foreignKey: 'idSuiveur', as: 'suiveur' });
Rdv.belongsTo(User, { foreignKey: 'idAlternant', as: 'alternant' });

class rdvRepository {
    static findEmailsByRole(arg0: string): any {
        throw new Error('Method not implemented.');
    }

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

     
      
      // Méthode pour récupérer les rendez-vous par ID de suiveur avec peuplement des détails d'utilisateur
      static async getRdvBySuiveurId(id: number) {
        try {
          const rdvs = await Rdv.findAll({
            where: { idSuiveur: id },
            include: [
              { model: User, as: 'tuteur' },
              { model: User, as: 'suiveur' },
              { model: User, as: 'alternant' }
            ]
          });
          return rdvs;
        } catch (error) {
          console.error('Error retrieving rdvs by suiveur ID:', error);
          throw error;
        }
      }

    static async findEmailById(id: number): Promise<string[]> {
        const users = await User.findAll({
          where: {
            id: id
          }
        });
        return users.map(user => user.email);
    }

    static async deleteRdv(id: number) {
        const rdv = await Rdv.findByPk(id);
        if (rdv) {
          return await rdv.destroy();
        }
        return null;
    }

    static async findRdvById(id: number) {
        return await Rdv.findByPk(id);
    }
}

export default rdvRepository;