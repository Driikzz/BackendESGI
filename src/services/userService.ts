import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository';
import { Request, Response } from 'express';
import { sendPasswordEmail } from '../services/emailService';

class UserService {
  static async getUserByEmail(email: string) {
    console.log(`Fetching user by email: ${email}`);
    return await userRepository.findByEmail(email);
  }

  static async getUserById(id: number) {
    console.log(`Fetching user by ID: ${id}`);
    return await userRepository.findById(id);
  }

  static async getAllUsers(req: Request, res: Response) {
    console.log('Fetching all users');
    const users = await userRepository.findAll();
    return res.status(200).json(users);
  }

  static async deleteUser(id: number) {
    console.log(`Deleting user by ID: ${id}`);
    const user = await userRepository.findById(id);
    if (!user) {
      return null;
    }
    return await userRepository.deleteUser(id);
  }

  static async findDuosWithUserId(id: number) {
    console.log(`Fetching duos for user ID: ${id}`);
    return await userRepository.findDuosWithUserId(id);
  }

  static async createUser(user: any, randomPassword : any) {
    console.log(`Creating user with email: ${user.email}`);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    console.log(`Plain password: ${randomPassword}`);
    console.log(`Hashed password: ${hashedPassword}`);
    user.password = hashedPassword;

    const newUser = await userRepository.create(user);

    return newUser;
  }

  static async updateUser(id: number, userUpdates: any) {
    console.log(`Repository: Updating user ID: ${id}`);
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new Error('User not found');
    }

    await existingUser.update(userUpdates);

    return existingUser;
  }

  static async updatePassword(id: number, newPassword: string, oldPassword: string) {
    console.log(`Updating password for user ID: ${id}`);
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Vérification de l'ancien mot de passe
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    console.log(`Is old password valid: ${isOldPasswordValid}`);
    if (!isOldPasswordValid) {
      throw new Error('Old password is incorrect');
    }

    // Hashage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`New hashed password: ${hashedPassword}`);
    return await userRepository.updatePassword(id, hashedPassword);
  }

  static async getAllAlternantsandTuteur() {
    console.log('Fetching all alternants and tuteurs');
    return await userRepository.getAllAlternantsandTuteur();
  }

  static async getAllAlternants() {
    console.log('Fetching all alternants');
    return await userRepository.findAllAlternants();
  }
}

export default UserService;
