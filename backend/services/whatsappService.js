/**
 * WhatsApp Notification Service
 * Generates WhatsApp Web links for task notifications
 * No external API required - uses wa.me links
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WhatsAppService {
  constructor() {
    this.notificationLog = [];
    this.logFilePath = path.join(__dirname, '../../whatsapp-notifications.json');
    this.loadNotificationLog();
  }

  /**
   * Load notification log from JSON file
   */
  loadNotificationLog() {
    try {
      if (fs.existsSync(this.logFilePath)) {
        const data = fs.readFileSync(this.logFilePath, 'utf8');
        this.notificationLog = JSON.parse(data);
        console.log(`📋 Loaded ${this.notificationLog.length} WhatsApp notification records`);
      }
    } catch (error) {
      console.warn('⚠️  Could not load WhatsApp notification log:', error.message);
      this.notificationLog = [];
    }
  }

  /**
   * Save notification log to JSON file
   */
  saveNotificationLog() {
    try {
      fs.writeFileSync(
        this.logFilePath,
        JSON.stringify(this.notificationLog, null, 2),
        'utf8'
      );
      console.log(`✅ WhatsApp notification log saved (${this.notificationLog.length} records)`);
    } catch (error) {
      console.error('❌ Failed to save WhatsApp notification log:', error.message);
    }
  }

  /**
   * Format phone number for WhatsApp (remove non-digits, add country code if needed)
   */
  formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return null;
    
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If starts with 0, assume Indian number and add +91
    if (cleaned.startsWith('0')) {
      cleaned = '91' + cleaned.substring(1);
    }
    // If doesn't start with country code and is 10 digits, assume Indian
    else if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Generate WhatsApp message for task notification
   */
  generateTaskMessage(task, project, action = 'created') {
    const lines = [];
    
    lines.push(`🔔 *Task ${action.toUpperCase()}*`);
    lines.push('');
    lines.push(`📋 *${task.title}*`);
    
    if (task.description) {
      lines.push('');
      lines.push(`📝 ${task.description}`);
    }
    
    if (project) {
      lines.push('');
      lines.push(`🎯 Project: *${project.name}*`);
    }
    
    if (task.priority) {
      const priorityEmoji = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴'
      };
      lines.push(`${priorityEmoji[task.priority] || '⚪'} Priority: *${task.priority.toUpperCase()}*`);
    }
    
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      lines.push(`📅 Due: ${dueDate.toLocaleDateString()}`);
    }
    
    if (task.assignee) {
      lines.push(`👤 Assigned to: ${task.assignee}`);
    }
    
    lines.push('');
    lines.push('---');
    lines.push('_Sent from AGB Planner_');
    
    return lines.join('\n');
  }

  /**
   * Generate WhatsApp message for progress update
   */
  generateProgressMessage(task, project, oldStatus, newStatus, updateDetails) {
    const lines = [];
    
    lines.push(`📊 *TASK PROGRESS UPDATE*`);
    lines.push('');
    lines.push(`📋 *${task.title}*`);
    
    if (project) {
      lines.push(`🎯 Project: *${project.name}*`);
    }
    
    lines.push('');
    lines.push(`Status: ${oldStatus} → *${newStatus}*`);
    
    if (updateDetails) {
      lines.push('');
      lines.push(`💬 Update: ${updateDetails}`);
    }
    
    if (task.progress !== undefined) {
      lines.push(`Progress: ${task.progress}%`);
    }
    
    lines.push('');
    lines.push('---');
    lines.push('_Sent from AGB Planner_');
    
    return lines.join('\n');
  }

  /**
   * Create WhatsApp notification link
   */
  createWhatsAppLink(phoneNumber, message) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    if (!formatted) {
      console.warn('⚠️  Invalid phone number:', phoneNumber);
      return null;
    }
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    
    // Create wa.me link
    const link = `https://wa.me/${formatted}?text=${encodedMessage}`;
    
    return link;
  }

  /**
   * Prepare notifications for multiple team members
   */
  prepareNotifications(task, project, mentionedMembers, action = 'created') {
    const notifications = [];
    
    // Generate the message
    const message = action === 'updated' 
      ? this.generateProgressMessage(task, project, task.previousStatus, task.status, task.updateDetails)
      : this.generateTaskMessage(task, project, action);
    
    // Create notification for each mentioned member
    for (const member of mentionedMembers) {
      if (!member.whatsappNumber) {
        console.warn(`⚠️  Member ${member.name} has no WhatsApp number`);
        continue;
      }
      
      const link = this.createWhatsAppLink(member.whatsappNumber, message);
      
      if (link) {
        notifications.push({
          userId: member.userId,
          name: member.name,
          whatsappNumber: member.whatsappNumber,
          link: link,
          message: message,
          sentAt: new Date().toISOString(),
          taskId: task.id,
          taskTitle: task.title,
          projectName: project?.name,
          action: action
        });
      }
    }
    
    // Save to notification log
    this.notificationLog.push(...notifications);
    this.saveNotificationLog();
    
    console.log(`✅ Prepared ${notifications.length} WhatsApp notifications`);
    
    return notifications;
  }

  /**
   * Get notification history for a task
   */
  getTaskNotifications(taskId) {
    return this.notificationLog.filter(n => n.taskId === taskId);
  }

  /**
   * Get notification history for a user
   */
  getUserNotifications(userId) {
    return this.notificationLog.filter(n => n.userId === userId);
  }

  /**
   * Get all notifications
   */
  getAllNotifications() {
    return this.notificationLog;
  }

  /**
   * Clear old notifications (older than 30 days)
   */
  clearOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const before = this.notificationLog.length;
    this.notificationLog = this.notificationLog.filter(n => {
      return new Date(n.sentAt) > thirtyDaysAgo;
    });
    
    const removed = before - this.notificationLog.length;
    if (removed > 0) {
      this.saveNotificationLog();
      console.log(`🗑️  Cleared ${removed} old WhatsApp notifications`);
    }
    
    return removed;
  }
}

// Export singleton instance
const whatsappService = new WhatsAppService();
export default whatsappService;
