import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userService from '../services/userService';

interface CustomRequest extends Request {
  user?: any;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    (req as CustomRequest).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authMiddleware;
