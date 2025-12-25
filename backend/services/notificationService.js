import fs from 'fs';
import path from 'path';

class NotificationService {
  async checkDueTasks() {
    const Task = (await import('../models/Task.js')).default;
    const User = (await import('../models/User.js')).default;
    const Project = (await import('../models/Project.js')).default;
    const EmailService = (await import('./emailService.js')).default;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    try {
      const dueTasks = await Task.find({
        dueDate: {
          $gte: tomorrow,
          $lte: endOfTomorrow,
        },
        isCompleted: false,
      }).populate('assignee project');

      for (const task of dueTasks) {
        if (task.assignee) {
          await EmailService.sendTaskDueNotification(
            task.assignee,
            task,
            task.project
          );
        }
      }

      console.log(`Checked ${dueTasks.length} tasks due tomorrow`);
    } catch (error) {
      console.error('Error checking due tasks:', error);
    }
  }

  async checkOverdueTasks() {
    const Task = (await import('../models/Task.js')).default;
    const EmailService = (await import('./emailService.js')).default;

    const now = new Date();

    try {
      const overdueTasks = await Task.find({
        dueDate: { $lt: now },
        isCompleted: false,
      }).populate('assignee project');

      for (const task of overdueTasks) {
        if (task.assignee) {
          await EmailService.sendTaskOverdueNotification(
            task.assignee,
            task,
            task.project
          );
        }
      }

      console.log(`Checked ${overdueTasks.length} overdue tasks`);
    } catch (error) {
      console.error('Error checking overdue tasks:', error);
    }
  }

  async checkMilestoneAlerts() {
    const Milestone = (await import('../models/Milestone.js')).default;
    const EmailService = (await import('./emailService.js')).default;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    try {
      const upcomingMilestones = await Milestone.find({
        dueDate: {
          $gte: new Date(),
          $lte: thirtyDaysFromNow,
        },
        status: { $ne: 'completed' },
      }).populate('owner project team');

      for (const milestone of upcomingMilestones) {
        if (milestone.owner) {
          await EmailService.sendMilestoneAlert(
            milestone.owner,
            milestone,
            milestone.project
          );
        }
      }

      console.log(`Checked ${upcomingMilestones.length} upcoming milestones`);
    } catch (error) {
      console.error('Error checking milestone alerts:', error);
    }
  }
}

export default new NotificationService();
