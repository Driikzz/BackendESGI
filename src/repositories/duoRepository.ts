import Duo from '../models/Duo';
import { User } from '../models/IUser';
import Entreprise from '../models/IEntreprise';  // Import the correct model class

Duo.belongsTo(User, { as: 'Alternant', foreignKey: 'idAlternant' });
Duo.belongsTo(User, { as: 'Tuteur', foreignKey: 'idTuteur' });
Duo.belongsTo(User, { as: 'Suiveur', foreignKey: 'idSuiveur' });

User.hasMany(Duo, { foreignKey: 'idAlternant' });
User.hasMany(Duo, { foreignKey: 'idTuteur' });
User.hasMany(Duo, { foreignKey: 'idSuiveur' });

class DuoRepository {
  async createDuo(data: any) {
    return await Duo.create(data);
  }

  async getAllDuos() {
    return await Duo.findAll({
      include: [
        { model: User, as: 'Alternant' },
        { model: User, as: 'Tuteur' },
        { model: User, as: 'Suiveur' }
      ]
    });
  }

  async getDuoById(id: number) {
    return await Duo.findByPk(id);
  }

  async updateDuo(id: number, data: any) {
    const duo = await Duo.findByPk(id);
    if (duo) {
      return await duo.update(data);
    }
    return null;
  }

  async updateDuos(data: any) {
    return await Duo.update(data, {
      where: {
        idAlternant: data.idAlternant,
        idTuteur: data.idTuteur,
        idSuiveur: data.idSuiveur
      }
    });
  }

  async deleteDuo(id: number) {
    const duo = await Duo.findByPk(id);
    if (duo) {
      console.log("duo supprimé avec succès", duo);
      return await duo.destroy();
    }
    return null;
  }

  async getDuoWithSuiveurIdAndTrialPeriodMeetingFalse(id: number) {
    return await Duo.findAll({
      where: {
        idSuiveur: id,
        trialPeriodMeeting: false
      }
    });
  }

  async getDuoWithSuiveurIdAndMidTermMeetingFalse(id: number) {
    return await Duo.findAll({
      where: {
        idSuiveur: id,
        midTermMeeting: false
      }
    });
  }

  async getDuoWithSuiveurIdAndYearEndMeetingFalse(id: number) {
    return await Duo.findAll({
      where: {
        idSuiveur: id,
        yearEndMeeting: false
      }
    });
  }

  async findDuoByUserIds(alternantId: number, tuteurId: number, suiveurId: number) {
    return await Duo.findOne({
      where: {
        idAlternant: alternantId,
        idTuteur: tuteurId,
        idSuiveur: suiveurId
      }
    });
  }

  async getDuosBySuiveurId(id: number) {
    return await Duo.findAll({
      where: {
        idSuiveur: id
      },
      include: [
        {
          model: User,
          as: 'Alternant',
          attributes: ['id', 'name', 'lastname', 'email']
        },
        {
          model: User,
          as: 'Tuteur',
          attributes: ['id', 'name', 'lastname', 'email']
        },
        {
          model: User,
          as: 'Suiveur',
          attributes: ['id', 'name', 'lastname', 'email']
        }
      ]
    });
  }

  async deleteDuoById(duoId: number) {
    return await Duo.destroy({
      where: {
        idDuo: duoId
      }
    });
  }

  async findDuosByEnterpriseName(enterpriseName: string) {
    return await Duo.findAll({
      where: {
        enterpriseName: enterpriseName
      }
    });
  }

  async getDuosByEntrepriseId(id: number) {
    const entreprise = await Entreprise.findByPk(id);
    if (entreprise) {
      return await Duo.findAll({
        where: {
          enterpriseName: entreprise.name
        }
      });
    }
  }

  async updateDuoUsers(id: number, data: any) {
    const duo = await Duo.findByPk(id);
    if (duo) {
      return await duo.update(data);
    }
    return null;
  }

  async findAll(condition = {}) {
    return await Duo.findAll(condition);
  }

  async getDuosByTuteurId(id: number) {
    return await Duo.findAll({
      where: {
        idTuteur: id
      }
    });
  }

}

export default new DuoRepository();
