# WhatsApp Task Notifications - User Guide

## Overview

Your AGB Planner now has WhatsApp integration for task notifications! This allows you to:
- Mention team members when creating tasks
- Send WhatsApp notifications automatically
- Keep your team updated via WhatsApp without leaving the app
- Track all notifications in a log file

## Setup

### 1. Add Team Members with WhatsApp Numbers

When creating a team:
1. Click "+ New Team"
2. Enter team name and description
3. **Add team members:**
   - Enter member name (e.g., "Shubham", "Priya", "Rahul")
   - Enter WhatsApp number (e.g., "+919049874780" or "9049874780")
   - Click "+ Add Member" for more members

**Format for WhatsApp numbers:**
- With country code: `+919049874780`
- Without country code (auto-adds +91): `9049874780`
- With zero: `09049874780` (auto-removes leading 0)

### 2. Create Tasks with Notifications

1. **Open Task Management:**
   - Navigate to "Tasks" section
   - Or click on a project

2. **Fill Task Details:**
   - **Task Title** (required): Brief description
   - **Project** (required): Select project
   - **Task Details**: Full description with @mentions
   - **Priority**: Low/Medium/High/Critical
   - **Due Date**: When it's due
   - **Tags**: Categories

3. **Mention Team Members:**
   - In "Notify Team Members (WhatsApp)" dropdown
   - Hold Ctrl/Cmd to select multiple members
   - Only members with WhatsApp numbers appear

4. **Create Task:**
   - Click "Create Task"
   - WhatsApp notification panel appears automatically

### 3. Send WhatsApp Notifications

After creating a task, you'll see:

```
📱 WhatsApp Notifications Ready
2 team member(s) will be notified

Shubham        [Send to Shubham]
Priya          [Send to Priya]

[Open All (2)]  [Close]
```

**Options:**
- **Send Individual:** Click "Send to [Name]" for one person
- **Open All:** Opens all WhatsApp conversations at once
- Each notification opens WhatsApp Web with pre-filled message

## WhatsApp Message Format

### Task Creation Notification

```
🔔 *TASK CREATED*

📋 *Implement Login Feature*

📝 Create user authentication with email/password
Add JWT token generation
Implement forgot password flow

🎯 Project: *AGB Planner*
🟡 Priority: *MEDIUM*
📅 Due: 15/01/2026
👤 Assigned to: Shubham

---
_Sent from AGB Planner_
```

### Progress Update Notification

```
📊 *TASK PROGRESS UPDATE*

📋 *Implement Login Feature*
🎯 Project: *AGB Planner*

Status: in_progress → *done*

💬 Update: Completed all authentication flows, tested successfully

---
_Sent from AGB Planner_
```

## How It Works

1. **No External API:** Uses WhatsApp Web (wa.me) - free and instant
2. **One-Click Send:** Opens WhatsApp with pre-filled message
3. **Automatic Formatting:** Adds emojis, priorities, dates automatically
4. **Notification Log:** Saved in `whatsapp-notifications.json`

## Using WhatsApp Links

When you click a notification button:

```javascript
https://wa.me/919049874780?text=🔔%20TASK%20CREATED...
```

This:
1. Opens WhatsApp Web in new tab
2. Starts chat with the phone number
3. Pre-fills the message
4. You just click "Send" in WhatsApp

## Technical Details

### Backend

**Files:**
- `backend/services/whatsappService.js` - Notification service
- `backend/controllers/taskController.js` - Task creation with notifications
- `backend/models/Task.js` - Task model with mentioned members
- `backend/models/Team.js` - Team model with WhatsApp numbers
- `whatsapp-notifications.json` - Notification log

**API Endpoints:**
```javascript
// Create task with notifications
POST /api/tasks
{
  "title": "Task title",
  "description": "Task details",
  "project": 1,
  "priority": "high",
  "mentionedMembers": [
    {
      "userId": "user123",
      "name": "Shubham",
      "whatsappNumber": "+919049874780"
    }
  ]
}

// Response includes WhatsApp links
{
  "success": true,
  "data": { /* task */ },
  "notifications": [
    {
      "userId": "user123",
      "name": "Shubham",
      "whatsappLink": "https://wa.me/919049874780?text=..."
    }
  ]
}
```

### Frontend

**Files:**
- `frontend/tasks.html` - Task management UI
- `frontend/js/tasks.js` - Task creation and notifications
- `frontend/js/app.js` - Team creation with WhatsApp
- `frontend/index.html` - Updated team form

**Key Functions:**
```javascript
// Initialize task management
initTaskManagement()

// Load team members for mentions
loadTeamMembers(teamId)

// Open WhatsApp for one member
openWhatsAppLink(index)

// Open all WhatsApp conversations
openAllWhatsAppLinks()
```

## Notification Log

All notifications are saved in `whatsapp-notifications.json`:

```json
[
  {
    "userId": "user123",
    "name": "Shubham",
    "whatsappNumber": "+919049874780",
    "link": "https://wa.me/919049874780?text=...",
    "message": "🔔 *TASK CREATED*\n\n📋 *Task Title*...",
    "sentAt": "2026-01-01T10:30:00.000Z",
    "taskId": 5,
    "taskTitle": "Implement Login",
    "projectName": "AGB Planner",
    "action": "created"
  }
]
```

**Features:**
- Persists across server restarts
- Tracks who was notified and when
- Auto-clears notifications older than 30 days
- Useful for audit trail

## Examples

### Example 1: Create Task with Notification

1. Create team "Development Team"
2. Add members:
   - Shubham: +919049874780
   - Priya: +919876543210

3. Create task:
   - Title: "Fix bug in login"
   - Project: AGB Planner
   - Mention: Shubham, Priya
   - Click "Create Task"

4. WhatsApp panel appears
5. Click "Open All (2)"
6. Two WhatsApp tabs open with messages
7. Click "Send" in each WhatsApp tab

### Example 2: Progress Update

```javascript
// Update task status
PUT /api/tasks/5
{
  "status": "done",
  "updateDetails": "Fixed authentication flow",
  "notifyMembers": true
}

// Team members get progress notification
```

### Example 3: Direct WhatsApp Link

For manual use:

```javascript
const whatsappService = require('./services/whatsappService');

const link = whatsappService.createWhatsAppLink(
  '+919049874780',
  'Hello from AGB Planner!'
);

console.log(link);
// https://wa.me/919049874780?text=Hello%20from%20AGB%20Planner!
```

## Best Practices

1. **Add WhatsApp numbers during team setup** - easier than adding later
2. **Use descriptive task titles** - appears in notification
3. **Mention only relevant members** - don't spam everyone
4. **Send progress updates** - keeps team in loop
5. **Use priority levels** - shown with colored emojis
6. **Set due dates** - included in notifications
7. **Open All at once** - faster than individual sends

## Troubleshooting

### Members not showing in mentions dropdown

**Solution:** Make sure members have WhatsApp numbers added to their profile

### WhatsApp link not working

**Solution:** 
- Check phone number format
- Must start with country code (+91 for India)
- No spaces or special characters

### Notifications not appearing

**Solution:**
- Check browser popup blocker
- Allow popups for your domain
- Try "Open All" instead of individual

### Message not pre-filled in WhatsApp

**Solution:**
- WhatsApp Web must be logged in
- Try opening link in incognito mode
- Clear browser cache

## Advanced Usage

### Custom Notification Messages

Edit `backend/services/whatsappService.js`:

```javascript
generateTaskMessage(task, project, action) {
  // Customize message format
  const lines = [];
  lines.push(`Your custom message`);
  lines.push(`Task: ${task.title}`);
  // ...
  return lines.join('\n');
}
```

### Notification Webhooks

Add webhook support for automated notifications:

```javascript
// After creating notification
await sendWebhook(notification);
```

### Batch Notifications

Send to all team members at once:

```javascript
const team = await Team.findByPk(teamId);
const notifications = whatsappService.prepareNotifications(
  task,
  project,
  team.members.filter(m => m.whatsappNumber),
  'created'
);
```

## Security Notes

- ✅ No API keys needed
- ✅ No external service dependencies
- ✅ Phone numbers stored in your database
- ✅ WhatsApp links are public (wa.me)
- ⚠️ Anyone with link can see message preview
- ⚠️ Don't include sensitive info in notifications

## FAQ

**Q: Do I need WhatsApp Business API?**
A: No! This uses WhatsApp Web (wa.me) which is free

**Q: Can I send notifications automatically?**
A: Currently opens WhatsApp Web - you click "Send"
For fully automated, you'd need WhatsApp Business API

**Q: Does this work on mobile?**
A: Yes! Opens WhatsApp app on mobile devices

**Q: Can I customize messages?**
A: Yes, edit `generateTaskMessage()` in whatsappService.js

**Q: Is there a rate limit?**
A: No limit on our side. WhatsApp may have limits

**Q: Can I see notification history?**
A: Yes, check `whatsapp-notifications.json`

## Summary

✅ **Easy Setup**: Just add WhatsApp numbers to team members
✅ **One-Click Notifications**: Opens WhatsApp with pre-filled message
✅ **No Cost**: Uses free WhatsApp Web
✅ **Audit Trail**: All notifications logged
✅ **Mobile Friendly**: Works on desktop and mobile
✅ **Customizable**: Edit message templates

Start using WhatsApp notifications today to keep your team connected! 📱✨
