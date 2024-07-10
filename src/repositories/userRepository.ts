import bcrypt from 'bcrypt';
import { User } from '../models/IUser';
import Duo from '../models/Duo';

class UserRepository {
  static async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  static async findById(id: number) {
    return await User.findByPk(id);
  }

  static async findAll() {
    return await User.findAll();
  }

  static async create(user: any) {
    user.password = await bcrypt.hash(user.password, 10);
    return await User.create(user);
  }

  static async findAlternantId(userIds: number[]): Promise<number | undefined> {
    const alternant = await User.findOne({
      where: {
        id: userIds,
        role: 'Alternant'
      }
    });
    return alternant?.id;
  }

  static async findTuteurId(userIds: number[]): Promise<number | undefined> {
    const tuteur = await User.findOne({
      where: {
        id: userIds,
        role: 'Tuteur'
      }
    });
    return tuteur?.id;
  }

  static async deleteUser(id: number) {
    const user = await this.findById(id);
    if (user) {
      user.name = '[Utilisateur Supprimé]';
      user.lastname = '[Utilisateur Supprimé]';
      user.password = '[Utilisateur Supprimé]';
      user.email = '[Utilisateur Supprimé]';
      user.phone = '[Utilisateur Supprimé]';
      user.role = '[Utilisateur Supprimé]';
      user.tag = ['[Utilisateur Supprimé]'];
      await user.save();
      return user;
    }
    return null;
  }

  static async findDuosWithUserId(id: number) {
    return await Duo.findAll({
      where: {
        idSuiveur: id
      }
    });
  }

  static async updatePassword(id: number, newPassword: string) {
    const user = await this.findById(id);
    if (user) {
      user.password = newPassword;
      await user.save();
      return user;
    } else {
      throw new Error('User not found');
    }
  }

  static async getAllAlternantsandTuteur() {
    return await User.findAll({
      where: {
        role: ['Alternant', 'Tuteur']
      }
    });
  }

  static async findAllAlternants() {
    return await User.findAll({ where: { role: 'Alternant' } });
  }
}

export default UserRepository;
