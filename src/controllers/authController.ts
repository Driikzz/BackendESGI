import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import userService from '../services/userService';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(email,password)

  try {
    // Vérifie si l'utilisateur existe
    const user: any = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Vérifie si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Génère un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1400h', // Optionnel : délai d'expiration du token
    });

    // Retourne le token JWT
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  login,
};
