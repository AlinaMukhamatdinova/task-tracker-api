import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import { hashPassword, comparePassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Пользователь уже существует' });

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, password: hashedPassword, name } });
    const token = generateToken(user.id);

    res.status(201).json({ message: 'Успешная регистрация', token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Неверный email или пароль' });

    const token = generateToken(user.id);
    res.status(200).json({ message: 'Успешный вход', token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при входе' });
  }
};