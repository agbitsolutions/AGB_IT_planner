import express from 'express';
import * as teamController from '../controllers/teamController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required for demo/testing)
router.post('/', teamController.createTeam); // Allow public team creation
router.get('/public', teamController.getPublicTeams);

// Protected routes (require authentication)
router.use(auth);
router.get('/', teamController.getUserTeams);
router.get('/:id', teamController.getTeamById);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team member management
router.post('/:id/members', teamController.addTeamMember);
router.delete('/:id/members', teamController.removeTeamMember);

export default router;
