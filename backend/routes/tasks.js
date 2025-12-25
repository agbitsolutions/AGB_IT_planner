import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { auth } from '../middleware/auth.js';
import upload from '../services/fileService.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.patch('/:id/complete', taskController.completeTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.patch('/:id/assign', taskController.assignTask);
router.delete('/:id', taskController.deleteTask);

// Task attachments and comments
router.post('/:id/attachments', upload.single('file'), taskController.addAttachment);
router.post('/:id/comments', taskController.addComment);

export default router;
