import { Request, Response } from 'express';
import userRepository from '../repositories/userRepository';
import userService from '../services/userService';
import { CustomRequest } from '../types/CustomRequest';
import { generateRandomPassword } from '../utils/passwordGenerator';
import { sendPasswordEmail } from '../services/emailService';
import bcrypt from 'bcrypt';

class UserController {
  static async getUserByEmail(email: string) {
    return await userRepository.findByEmail(email);
  }

  static getUserProfile(req: CustomRequest, res: Response) {
    const user = req.user;
    console.log('User profile fetched:', user);

    return res.status(200).json({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    });
  }

  static async getUserById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    console.log(`Fetching user by ID: ${id}`);
    const user = await userRepository.findById(id);
    return res.status(200).json(user);
  }

  static async getAllUsers(req: Request, res: Response) {
    console.log('Fetching all users');
    const users = await userRepository.findAll();
    return res.status(200).json(users);
  }

  static async createUser(req: Request, res: Response) {
    const user = req.body;
    console.log(`Creating user with email: ${user.email}`);

    if (Array.isArray(user)) {
        const newUsers = await Promise.all(user.map(async (u) => {
            if (!u.password) {
                u.password = generateRandomPassword();
            }
            return await userService.createUser(u, u.password);
        }));
        return res.status(201).json(newUsers);
    }

    const existingUser = await userRepository.findByEmail(user.email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        if (!user.password) {
            console.log("Generating random password");
            const randomPassword = generateRandomPassword();
            console.log(`Generated password: ${randomPassword}`);
            
            // Ajout de gestion d'erreur pour l'envoi d'email
            try {
                await sendPasswordEmail(user.email, randomPassword);
                console.log(`Email sent to ${user.email}`);
            } catch (emailError) {
                console.error(`Failed to send email to ${user.email}:`, emailError);
                return res.status(500).json({ message: 'Failed to send email', error: emailError });
            }

            const newUser = await userService.createUser(user, randomPassword);
            return res.status(201).json(newUser);
        }

        if (user.password) {
            const newUser = await userService.createUser(user, user.password);
            return res.status(201).json(newUser);
        }
    } catch (error: any) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Error creating user', error });
    }
}


  static async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    console.log(`Updating user ID: ${id}`);
    const userUpdates = req.body;
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (userUpdates.password) {
        console.log('Hashing new password for update', userUpdates.password);
        const hashedPassword = await bcrypt.hash(userUpdates.password, 10);
        userUpdates.password = hashedPassword;
    }

    try {
        const updatedUser = await userService.updateUser(id, userUpdates);
        console.log(`Updated user: ${JSON.stringify(updatedUser)}`);
        return res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Error updating user', error });
    }
}



  static async getDuosWhitUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    console.log(`Fetching duos for user ID: ${userId}`);
    const duos = await userService.findDuosWithUserId(userId);
    return res.status(200).json(duos);
  }

  static async updatePassword(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const { oldPassword, newPassword } = req.body;
    console.log(`Updating password for user ID: ${userId}, oldPassword: ${oldPassword}, newPassword: ${newPassword}`);
    try {
      const updatedUser = await userService.updatePassword(userId, newPassword, oldPassword);
      if (updatedUser === undefined) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }

  static async getAllAlternantsandTuteur(req: Request, res: Response){
    console.log('Fetching all alternants and tuteurs');
    const users = await userService.getAllAlternantsandTuteur();
    return res.status(200).json(users);
  };

  static async deleteUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    console.log(`Deleting user by ID: ${id}`);
    const user = await userRepository.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await userRepository.deleteUser(id);
    return res.status(204).send();
  }
}

export default UserController;
