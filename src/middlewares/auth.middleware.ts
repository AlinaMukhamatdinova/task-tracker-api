import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Нет доступа. Требуется токен.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as { userId: string };
    req.userId = decoded.userId;
    next(); // Пропускаем запрос дальше
  } catch (error) {
    return res.status(401).json({ error: 'Неверный или просроченный токен' });
  }
};
