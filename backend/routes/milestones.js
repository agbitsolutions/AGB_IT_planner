import express from 'express';
import * as milestoneController from '../controllers/milestoneController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Milestone routes
router.post('/', milestoneController.createMilestone);
router.get('/', milestoneController.getAllMilestones);
router.get('/timeline', milestoneController.getMilestoneTimeline);
router.get('/:id', milestoneController.getMilestoneById);
router.get('/:id/progress', milestoneController.calculateMilestoneProgress);
router.put('/:id', milestoneController.updateMilestone);
router.delete('/:id', milestoneController.deleteMilestone);

export default router;
