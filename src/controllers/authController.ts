import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import userService from '../services/userService';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(`Login attempt for email: ${email}`);

  try {
    const user: any = await userService.getUserByEmail(email);
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Fetched user: ${JSON.stringify(user)}`);
    console.log(`User's stored hashed password: ${user.password}`);
    console.log(`Password provided for comparison: ${password}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}`);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1400h',
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  login,
};
