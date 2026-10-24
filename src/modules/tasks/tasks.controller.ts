import { Response } from 'express';
import { prisma } from '../../config/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

// 1. Создать задачу
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId!;
    const task = await prisma.task.create({ data: { title, description, userId } });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании задачи' });
  }
};

// 2. Получить все свои задачи
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении задач' });
  }
};

// 3. Обновить задачу
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.userId!;
    const updated = await prisma.task.updateMany({
      where: { id: String(id), userId: String(userId) },
      data: { 
        title: title ? String(title) : undefined, 
        description: description ? String(description) : undefined, 
        status: status ? String(status) : undefined 
      }
    });
    if (updated.count === 0) return res.status(404).json({ error: 'Задача не найдена' });
    res.json({ message: 'Задача обновлена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении' });
  }
};

// 4. Удалить задачу
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const deleted = await prisma.task.deleteMany({ where: { id: String(id), userId: String(userId) } });
    if (deleted.count === 0) return res.status(404).json({ error: 'Задача не найдена' });
    res.json({ message: 'Задача удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении' });
  }
};