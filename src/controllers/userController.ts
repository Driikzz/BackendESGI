import userRepository from '../repositories/userRepository';
import { Request, Response } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { generateRandomPassword } from '../utils/passwordGenerator';
import userService from '../services/userService';


const getUserByEmail = async (email: string) => {
  return await userRepository.findByEmail(email);
};


const getUserProfile = (req: CustomRequest , res: Response) => {
  const user = req.user; 
  console.log('user', user);

  // Envoie la réponse avec les données de l'utilisateur
  return res.status(200).json({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    role : user?.role,
  });
};

// Route pour récupérer par id un utilisateur
const getUserById = async (req: Request, res:Response,) => {
  const id = parseInt(req.params.id);
  const user = await userRepository.findById(id);
  return res.status(200).json(user);
}

// Route pour récupérer tous les utilisateurs
const getAllUsers = async (req: Request, res: Response) => {
  const users = await userRepository.findAll();
  return res.status(200).json(users);
};

// Route pour crée un utilisateur
const createUser = async (req: Request, res: Response) => {
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

  console.log('user', user);
  const existingUser = await userRepository.findByEmail(user.email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  if (!user.password) {
    user.password = generateRandomPassword();
  }

  const newUser = await userRepository.create(user);
  return res.status(201).json(newUser);
};

// Route pour modifier un utilisateur
const updateUser = async (req: Request, res: Response) => {
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
};

// controler delete user 
const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const deletedUser = await userService.deleteUser(userId);
    if (deletedUser === undefined) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User soft deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error });
  }
};

export default {
  getUserByEmail,
  getAllUsers,
  getUserProfile,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
};
