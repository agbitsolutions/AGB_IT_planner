import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { auth } from '../middleware/auth.js';
import upload from '../services/fileService.js';

const router = express.Router();

// Public routes (for demo/testing)
router.post('/', taskController.createTask); // Allow task creation without auth
router.get('/', taskController.getAllTasks); // Allow viewing tasks
router.get('/:id', taskController.getTaskById); // Allow viewing single task
router.put('/:id', taskController.updateTask); // Allow task updates for testing

// Protected routes
router.use(auth);
router.patch('/:id/complete', taskController.completeTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.patch('/:id/assign', taskController.assignTask);
router.delete('/:id', taskController.deleteTask);

// Task attachments and comments
router.post('/:id/attachments', upload.single('file'), taskController.addAttachment);
router.post('/:id/comments', taskController.addComment);

export default router;
