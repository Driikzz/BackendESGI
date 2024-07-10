import { Request, Response } from 'express';
import userRepository from '../repositories/userRepository';
import userService from '../services/userService';
import { CustomRequest } from '../types/CustomRequest';
import { generateRandomPassword } from '../utils/passwordGenerator';
import { sendPasswordEmail } from '../services/emailService';

class UserController {
  static async getUserByEmail(email: string) {
    return await userRepository.findByEmail(email);
  }

  static getUserProfile(req: CustomRequest, res: Response) {
    const user = req.user;
    console.log('user', user);

    // Envoie la réponse avec les données de l'utilisateur
    return res.status(200).json({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    });
  }

  static async getUserById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = await userRepository.findById(id);
    return res.status(200).json(user);
  }

  static async getAllUsers(req: Request, res: Response) {
    const users = await userRepository.findAll();
    return res.status(200).json(users);
  }

  static async createUser(req: Request, res: Response) {
    const user = req.body;

    if (Array.isArray(user)) {
      const newUsers = await Promise.all(user.map(async (u) => {
        if (!u.password) {
          u.password = generateRandomPassword();
        }
        return await userRepository.create(u);
      }));
      return res.status(201).json(newUsers);
    }

    const existingUser = await userRepository.findByEmail(user.email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!user.password) {
      user.password = generateRandomPassword();
    }

    const plainPassword = user.password;

    try {
      const newUser = await userService.createUser(user); // Hash the password here
      await sendPasswordEmail(user.email, plainPassword);

      return res.status(201).json(newUser);
    } catch (error: any) { // Typage explicite de l'erreur
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Error creating user', error });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    console.log('id', id);
    const user = req.body;
    console.log('user', user);
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    await existingUser.update(user);
    return res.status(200).json(existingUser);
  }

  static async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);

    try {
      const deletedUser = await userService.deleteUser(userId);
      if (deletedUser === undefined) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User soft deleted successfully' });
    } catch (error: any) { // Typage explicite de l'erreur
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }

  static async getDuosWhitUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const duos = await userService.findDuosWithUserId(userId);
    return res.status(200).json(duos);
  }

  // Route pour mofifier le mot de passe d'un utilisateur
  static async updatePassword(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const { oldPassword, newPassword } = req.body;
    console.log('userId', userId, 'oldPassword', oldPassword, 'newPassword', newPassword);
    try {
      const updatedUser = await userService.updatePassword(userId, newPassword, oldPassword);
      if (updatedUser === undefined) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(updatedUser);
    } catch (error: any) { // Typage explicite de l'erreur
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }

  static async getAllAlternantsandTuteur(req: Request, res: Response){
    const users = await userService.getAllAlternantsandTuteur();
    return res.status(200).json(users);
  };

}

export default UserController;
