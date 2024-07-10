import Alertes from '../models/Alertes';

class AlertesRepository {
  async getAllAlertes() {
    return await Alertes.findAll();
  }

  async getAlertesByUserId(userId: number) {
    return await Alertes.findAll({ where: { alternantId: userId } });
  }
}

export default new AlertesRepository();
