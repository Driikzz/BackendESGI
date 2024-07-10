import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository';
import { Request, Response } from 'express';

class UserService {
  static async getUserByEmail(email: string) {
    return await userRepository.findByEmail(email);
  }

  static async getUserById(id: number) {
    return await userRepository.findById(id);
  }

  static async getAllUsers(req: Request, res: Response) {
    const users = await userRepository.findAll();
    return res.status(200).json(users);
  }

  static async deleteUser(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      return null;
    }
    return await userRepository.deleteUser(id);
  }

  static async findDuosWithUserId(id: number) {
    return await userRepository.findDuosWithUserId(id);
  }

  static async createUser(user: any) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return await userRepository.create(user);
  }

  static async updatePassword(id: number, newPassword: string, oldPassword: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Vérification de l'ancien mot de passe
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new Error('Old password is incorrect');
    }

    // Hashage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await userRepository.updatePassword(id, hashedPassword);
  }

  static async getAllAlternantsandTuteur() {
    return await userRepository.getAllAlternantsandTuteur();
  }

  static async getAllAlternants() {
    return await userRepository.findAllAlternants();
  }
}

export default UserService;
