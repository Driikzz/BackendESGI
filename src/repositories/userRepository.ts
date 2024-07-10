import { User } from '../models/IUser';
import Duo from '../models/Duo';

class UserRepository {
  static async findByEmail(email: string) {
    console.log(`Repository: Fetching user by email: ${email}`);
    return await User.findOne({ where: { email } });
  }

  static async findById(id: number) {
    console.log(`Repository: Fetching user by ID: ${id}`);
    return await User.findByPk(id);
  }

  static async findAll() {
    console.log('Repository: Fetching all users');
    return await User.findAll();
  }

  static async create(user: any) {
    console.log(`Repository: Creating user with email: ${user.email}`);
    return await User.create(user);
  }

  static async findAlternantId(userIds: number[]): Promise<number | undefined> {
    console.log(`Repository: Fetching alternant ID for user IDs: ${userIds}`);
    const alternant = await User.findOne({
      where: {
        id: userIds,
        role: 'Alternant'
      }
    });
    return alternant?.id;
  }

  static async findTuteurId(userIds: number[]): Promise<number | undefined> {
    console.log(`Repository: Fetching tuteur ID for user IDs: ${userIds}`);
    const tuteur = await User.findOne({
      where: {
        id: userIds,
        role: 'Tuteur'
      }
    });
    return tuteur?.id;
  }

  static async deleteUser(id: number) {
    console.log(`Repository: Deleting user by ID: ${id}`);
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
    console.log(`Repository: Fetching duos for user ID: ${id}`);
    return await Duo.findAll({
      where: {
        idSuiveur: id
      }
    });
  }

  static async updatePassword(id: number, newPassword: string) {
    console.log(`Repository: Updating password for user ID: ${id}`);
    const user = await this.findById(id);
    if (user) {
      user.password = newPassword;
      await user.save();
      console.log(`Updated user's password to: ${newPassword}`);
      return user;
    } else {
      throw new Error('User not found');
    }
  }

  static async updateUser(id: number, userUpdates: any) {
    console.log(`Repository: Updating user ID: ${id}`);
    const user = await this.findById(id);
    if (user) {
      await user.update(userUpdates);
      console.log(`Updated user: ${JSON.stringify(user)}`);
      return user;
    } else {
      throw new Error('User not found');
    }
  }

  static async getAllAlternantsandTuteur() {
    console.log('Repository: Fetching all alternants and tuteurs');
    return await User.findAll({
      where: {
        role: ['Alternant', 'Tuteur']
      }
    });
  }

  static async findAllAlternants() {
    console.log('Repository: Fetching all alternants');
    return await User.findAll({ where: { role: 'Alternant' } });
  }
}

export default UserRepository;
