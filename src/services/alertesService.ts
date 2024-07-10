import Alertes from '../models/Alertes';
import { AlertType } from '../types/alertTypes';

class AlertesService {
  async getAllAlertes() {
    return await Alertes.findAll();
  }

  async getAlertesByUserId(userId: number) {
    return await Alertes.findAll({ where: { alternantId: userId } });
  }

  async getAlertesByType(type: AlertType) {
    return await Alertes.findAll({ where: { typeAlerte: type } });
  }

  async getAlertesByFormulaireId(formulaireId: number) {
    return await Alertes.findAll({ where: { formulaireId: formulaireId } });
  }

  async createAlerte(data: any) {
    return await Alertes.create(data);
  }
}

export default new AlertesService();
