# API Testing Guide

## 🧪 Complete API Documentation & Testing Examples

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints (except health check) require JWT token:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🏥 Health Check

### Test API is Running
```bash
curl -X GET http://localhost:5000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "AGB Planner API is running",
  "timestamp": "2025-12-26T10:00:00.000Z"
}
```

---

## 👥 Teams API

### 1. Create Team
```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering",
    "description": "Engineering team",
    "isPublic": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Engineering",
    "description": "Engineering team",
    "owner": "user_id",
    "members": [{
      "userId": "user_id",
      "role": "lead",
      "joinedAt": "2025-12-26T10:00:00Z"
    }],
    "projects": [],
    "isPublic": true,
    "createdAt": "2025-12-26T10:00:00Z",
    "updatedAt": "2025-12-26T10:00:00Z"
  }
}
```

### 2. Get User's Teams
```bash
curl -X GET http://localhost:5000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Public Teams
```bash
curl -X GET http://localhost:5000/api/teams/public \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Team by ID
```bash
curl -X GET http://localhost:5000/api/teams/TEAM_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Update Team
```bash
curl -X PUT http://localhost:5000/api/teams/TEAM_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team Updated",
    "description": "Updated description",
    "isPublic": true
  }'
```

### 6. Delete Team
```bash
curl -X DELETE http://localhost:5000/api/teams/TEAM_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Add Team Member
```bash
curl -X POST http://localhost:5000/api/teams/TEAM_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "role": "member"
  }'
```

### 8. Remove Team Member
```bash
curl -X DELETE http://localhost:5000/api/teams/TEAM_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID"
  }'
```

**Member Roles:**
- `lead` - Full permissions
- `member` - Can create projects and tasks
- `viewer` - Read-only access

---

## 📁 Projects API

### 1. Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "description": "Redesign company website",
    "team": "TEAM_ID"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Website Redesign",
    "description": "Redesign company website",
    "team": "TEAM_ID",
    "owner": "USER_ID",
    "tasks": [],
    "milestones": [],
    "status": "active",
    "startDate": "2025-12-26T10:00:00Z",
    "endDate": null,
    "color": "#2080c0",
    "createdAt": "2025-12-26T10:00:00Z",
    "updatedAt": "2025-12-26T10:00:00Z"
  }
}
```

### 2. Get All Projects
```bash
# Get all projects for a team
curl -X GET "http://localhost:5000/api/projects?teamId=TEAM_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Project Details
```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Update Project
```bash
curl -X PUT http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "description": "Updated description",
    "status": "in_progress",
    "color": "#ff5722"
  }'
```

**Status Values:**
- `planning` - Pre-launch
- `active` - Currently running
- `paused` - Temporarily stopped
- `completed` - Finished
- `archived` - Historical

### 5. Delete Project
```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Get Project Statistics
```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTasks": 10,
    "completedTasks": 6,
    "pendingTasks": 4,
    "highPriorityTasks": 2,
    "progress": 60
  }
}
```

---

## ✅ Tasks API

### 1. Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design homepage",
    "description": "Create mockups for homepage",
    "project": "PROJECT_ID",
    "priority": "high",
    "dueDate": "2025-12-31",
    "estimatedHours": 8,
    "tags": ["design", "frontend"]
  }'
```

### 2. Get Tasks
```bash
# Get all tasks for a project
curl -X GET "http://localhost:5000/api/tasks?projectId=PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get tasks with filters
curl -X GET "http://localhost:5000/api/tasks?projectId=PROJECT_ID&status=in_progress&assignee=USER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Task Details
```bash
curl -X GET http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "description": "Updated description",
    "priority": "medium",
    "status": "in_progress"
  }'
```

### 5. Update Task Status (Kanban)
```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

**Status Values:**
- `todo` - Not started
- `in_progress` - Currently working
- `in_review` - Under review
- `done` - Completed

### 6. Mark Task Complete
```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Assign Task
```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/assign \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignee": "USER_ID"
  }'
```

### 8. Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9. Add Task Attachment
```bash
curl -X POST http://localhost:5000/api/tasks/TASK_ID/attachments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

### 10. Add Task Comment
```bash
curl -X POST http://localhost:5000/api/tasks/TASK_ID/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This task looks good! Please review."
  }'
```

**Priority Values:**
- `low` - Can wait
- `medium` - Normal priority
- `high` - Important
- `critical` - Urgent

---

## 🎯 Milestones API

### 1. Create Milestone
```bash
curl -X POST http://localhost:5000/api/milestones \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Phase 1 Complete",
    "description": "Complete design phase",
    "project": "PROJECT_ID",
    "team": "TEAM_ID",
    "startDate": "2025-12-26",
    "dueDate": "2026-01-31"
  }'
```

### 2. Get Milestones
```bash
# Get milestones for a team
curl -X GET "http://localhost:5000/api/milestones?teamId=TEAM_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get milestones for a project
curl -X GET "http://localhost:5000/api/milestones?projectId=PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get milestones by status
curl -X GET "http://localhost:5000/api/milestones?teamId=TEAM_ID&status=in_progress" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Milestone Details
```bash
curl -X GET http://localhost:5000/api/milestones/MILESTONE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Timeline View
```bash
curl -X GET "http://localhost:5000/api/milestones/timeline?teamId=TEAM_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "2025-12": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Phase 1",
        "startDate": "2025-12-26T00:00:00Z",
        "dueDate": "2025-12-31T00:00:00Z",
        "status": "in_progress",
        "progress": 50
      }
    ],
    "2026-01": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "title": "Phase 2",
        "startDate": "2026-01-01T00:00:00Z",
        "dueDate": "2026-01-31T00:00:00Z",
        "status": "not_started",
        "progress": 0
      }
    ]
  }
}
```

### 5. Update Milestone
```bash
curl -X PUT http://localhost:5000/api/milestones/MILESTONE_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "status": "completed",
    "progress": 100
  }'
```

### 6. Delete Milestone
```bash
curl -X DELETE http://localhost:5000/api/milestones/MILESTONE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Calculate Milestone Progress
```bash
curl -X GET http://localhost:5000/api/milestones/MILESTONE_ID/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTasks": 10,
    "completedTasks": 7,
    "progress": 70
  }
}
```

**Milestone Status:**
- `not_started` - Planning stage
- `in_progress` - Currently running
- `at_risk` - Behind schedule
- `completed` - Finished

---

## 🧬 Workflow Example

### Complete User Journey:

#### 1. Create Team
```bash
TEAM_RESPONSE=$(curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Team A", "isPublic": true}')

TEAM_ID=$(echo $TEAM_RESPONSE | jq -r '.data._id')
```

#### 2. Create Project
```bash
PROJECT_RESPONSE=$(curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Project 1\", \"team\": \"$TEAM_ID\"}")

PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.data._id')
```

#### 3. Create Milestone
```bash
curl -X POST http://localhost:5000/api/milestones \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Phase 1\",
    \"project\": \"$PROJECT_ID\",
    \"team\": \"$TEAM_ID\",
    \"startDate\": \"2025-12-26\",
    \"dueDate\": \"2026-01-31\"
  }"
```

#### 4. Create Tasks
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Task 1\",
    \"project\": \"$PROJECT_ID\",
    \"priority\": \"high\",
    \"dueDate\": \"2025-12-31\"
  }"
```

#### 5. Move Task to In Progress
```bash
TASK_ID="task_id_from_step_4"
curl -X PATCH http://localhost:5000/api/tasks/$TASK_ID/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

#### 6. Get Project Stats
```bash
curl -X GET http://localhost:5000/api/projects/$PROJECT_ID/stats \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 Postman Collection Template

Save as `AGB-Planner.postman_collection.json`:

```json
{
  "info": {
    "name": "AGB Planner API",
    "description": "Complete API collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{JWT_TOKEN}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Teams",
      "item": [
        {
          "name": "Create Team",
          "request": {
            "method": "POST",
            "url": "{{BASE_URL}}/teams",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Engineering\",\n  \"isPublic\": true\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## ✨ Testing Tips

### 1. Install jq for JSON parsing
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

### 2. Create alias for API calls
```bash
alias api='curl -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json"'

# Usage
api -X GET http://localhost:5000/api/teams
```

### 3. Save token to variable
```bash
# Get token from your authentication endpoint
export TOKEN="your_jwt_token_here"

# Use in requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/teams
```

---

## 🐛 Common Issues

### 401 Unauthorized
- Token is missing or expired
- Check Authorization header
- Generate new token

### 400 Bad Request
- Missing required fields
- Invalid data format
- Check request body

### 404 Not Found
- Resource ID doesn't exist
- Wrong endpoint
- Check URL spelling

### 500 Server Error
- Check backend logs
- Verify database connection
- Review request payload

---

**Happy testing! 🚀**
