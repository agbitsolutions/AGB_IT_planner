import express from 'express';
import * as teamController from '../controllers/teamController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Team routes
router.post('/', teamController.createTeam);
router.get('/', teamController.getUserTeams);
router.get('/public', teamController.getPublicTeams);
router.get('/:id', teamController.getTeamById);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team member management
router.post('/:id/members', teamController.addTeamMember);
router.delete('/:id/members', teamController.removeTeamMember);

export default router;
