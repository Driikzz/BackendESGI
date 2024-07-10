import Alertes from '../models/Alertes';

class AlertesService {
  async getAllAlertes() {
    return await Alertes.findAll();
  }

  async getAlertesByUserId(userId: number) {
    return await Alertes.findAll({ where: { alternantId: userId } });
  }

  async getAlertesByType(type: string) {
    return await Alertes.findAll({ where: { typeAlerte: type } });
  }
  async getAlertesByFormulaireId(formulaireId: number) {
    return await Alertes.findAll({ where: { formulaireId: formulaireId } });
  }

  async createAlerte(data: any) {
    return await Alertes.create(data);
  }

  async traiterAlerte(id: number, traitantId: number) {
    const alerte = await Alertes.findByPk(id);
    if (!alerte) {
      throw new Error('Alerte not found');
    }
    alerte.dateDeTraitement = new Date();
    alerte.traitantId = traitantId;
    await alerte.save();
    return alerte;
  }
}

export default new AlertesService();
