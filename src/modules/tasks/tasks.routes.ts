import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from './tasks.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', createTask);
router.get('/', getTasks);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;