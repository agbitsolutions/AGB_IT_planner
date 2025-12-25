import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendTaskDueNotification(user, task, project) {
    const mailOptions = {
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: user.email,
      subject: `Task Due Tomorrow: ${task.title} - ${project.name}`,
      html: this.getTaskDueTemplate(user, task, project),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.email}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
    }
  }

  async sendTaskOverdueNotification(user, task, project) {
    const daysOverdue = Math.floor(
      (Date.now() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24)
    );

    const mailOptions = {
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: user.email,
      subject: `OVERDUE: ${task.title} - ${project.name}`,
      html: this.getTaskOverdueTemplate(user, task, project, daysOverdue),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Overdue email sent to ${user.email}`);
    } catch (error) {
      console.error(`Error sending overdue email: ${error.message}`);
    }
  }

  async sendMilestoneAlert(user, milestone, project) {
    const daysUntilDue = Math.floor(
      (new Date(milestone.dueDate) - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const mailOptions = {
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: user.email,
      subject: `Milestone Alert: ${milestone.title} - ${daysUntilDue} days remaining`,
      html: this.getMilestoneAlertTemplate(user, milestone, project, daysUntilDue),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Milestone alert sent to ${user.email}`);
    } catch (error) {
      console.error(`Error sending milestone alert: ${error.message}`);
    }
  }

  async sendTeamInvitation(email, teamName, invitedBy) {
    const mailOptions = {
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: email,
      subject: `You've been invited to join ${teamName}`,
      html: this.getTeamInvitationTemplate(teamName, invitedBy),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invitation sent to ${email}`);
    } catch (error) {
      console.error(`Error sending invitation: ${error.message}`);
    }
  }

  getTaskDueTemplate(user, task, project) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2080c0;">Task Due Tomorrow</h2>
        <p>Hi ${user.name},</p>
        <p>The following task is due tomorrow:</p>
        <div style="background: #f5f7fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0;">${task.title}</h3>
          <p style="margin: 4px 0;"><strong>Project:</strong> ${project.name}</p>
          <p style="margin: 4px 0;"><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
          <p style="margin: 4px 0;"><strong>Priority:</strong> <span style="color: #ff9800; font-weight: bold;">${task.priority.toUpperCase()}</span></p>
          ${task.description ? `<p style="margin: 4px 0;"><strong>Description:</strong> ${task.description}</p>` : ''}
        </div>
        <p>Please ensure this task is completed on time.</p>
        <p>Best regards,<br>AGB Planner Team</p>
      </div>
    `;
  }

  getTaskOverdueTemplate(user, task, project, daysOverdue) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f44336;">OVERDUE TASK</h2>
        <p>Hi ${user.name},</p>
        <p>The following task is <strong>${daysOverdue} days overdue</strong>:</p>
        <div style="background: #ffebee; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f44336;">
          <h3 style="margin: 0 0 8px 0; color: #c62828;">${task.title}</h3>
          <p style="margin: 4px 0;"><strong>Project:</strong> ${project.name}</p>
          <p style="margin: 4px 0;"><strong>Was Due:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
          <p style="margin: 4px 0;"><strong>Priority:</strong> <span style="color: #f44336; font-weight: bold;">${task.priority.toUpperCase()}</span></p>
        </div>
        <p>Please complete this task immediately to keep the project on track.</p>
        <p>Best regards,<br>AGB Planner Team</p>
      </div>
    `;
  }

  getMilestoneAlertTemplate(user, milestone, project, daysUntilDue) {
    const status = daysUntilDue <= 7 ? '🔴 URGENT' : '⚠️ APPROACHING';
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff9800;">Milestone Alert ${status}</h2>
        <p>Hi ${user.name},</p>
        <p>An important milestone is approaching:</p>
        <div style="background: #fff3e0; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ff9800;">
          <h3 style="margin: 0 0 8px 0;">${milestone.title}</h3>
          <p style="margin: 4px 0;"><strong>Project:</strong> ${project.name}</p>
          <p style="margin: 4px 0;"><strong>Due Date:</strong> ${new Date(milestone.dueDate).toLocaleDateString()}</p>
          <p style="margin: 4px 0;"><strong>Days Until Due:</strong> <span style="font-weight: bold; color: ${daysUntilDue <= 7 ? '#f44336' : '#ff9800'};">${daysUntilDue}</span></p>
          <p style="margin: 4px 0;"><strong>Progress:</strong> ${milestone.progress}%</p>
        </div>
        <p>Make sure all associated tasks are on track.</p>
        <p>Best regards,<br>AGB Planner Team</p>
      </div>
    `;
  }

  getTeamInvitationTemplate(teamName, invitedBy) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2080c0;">Team Invitation</h2>
        <p>You've been invited to join the <strong>${teamName}</strong> team by <strong>${invitedBy}</strong>.</p>
        <p>
          <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 12px 24px; background: #2080c0; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Accept Invitation
          </a>
        </p>
        <p>Best regards,<br>AGB Planner Team</p>
      </div>
    `;
  }
}

export default new EmailService();
