# GitHub Copilot Instructions - AGB IT Solutions Admin Planner

## Execution Model

**CRITICAL: This application runs as serverless functions (Vercel/Railway)**

### Constraints
- ❌ NO long-running processes
- ❌ NO WebSockets or persistent connections
- ❌ NO in-memory state between requests
- ✅ Each function executes per-request and shuts down after
- ✅ Expect cold starts - optimize initialization
- ✅ Use stateless design patterns

## Architecture

### Backend
- **Runtime**: Node.js serverless functions
- **Database**: SQLite (file-based, use connection pooling)
- **Framework**: Express.js
- **Auth**: JWT tokens (stateless)
- **Email**: Nodemailer (configure for serverless)

### Frontend
- **Type**: Static files (HTML/CSS/JS)
- **Hosting**: Served from `/frontend` directory
- **API Calls**: To `/api/*` endpoints

## Code Standards

### 1. Database Operations
```javascript
// ✅ ALWAYS include success confirmations
const team = await Team.create(teamData);
console.log(`✅ Team created successfully: ${team.id}`);
return res.status(201).json({
  success: true,
  message: 'Team created successfully',
  data: team
});

// ✅ ALWAYS handle database errors gracefully
try {
  const result = await Model.create(data);
  console.log(`✅ Database operation succeeded`);
} catch (error) {
  console.error(`❌ Database operation failed:`, error);
  return res.status(500).json({
    success: false,
    message: 'Database operation failed',
    error: error.message
  });
}
```

### 2. Serverless-Friendly Patterns
```javascript
// ❌ AVOID: Long-running processes
setInterval(() => {}, 1000); // NO
cron.schedule(); // NO

// ✅ USE: One-time operations per request
app.get('/api/data', async (req, res) => {
  const data = await fetchData();
  return res.json(data);
});

// ✅ Handle cold starts efficiently
let dbConnection = null;
const getDB = async () => {
  if (!dbConnection) {
    dbConnection = await connectDatabase();
  }
  return dbConnection;
};
```

### 3. Email Service (Nodemailer)
```javascript
// ✅ Configure for serverless (lazy initialization)
let transporter = null;

const getEmailTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      pool: false, // Important for serverless
      maxConnections: 1
    });
  }
  return transporter;
};

// ✅ Send emails asynchronously but don't wait
const sendEmail = async (options) => {
  try {
    const transporter = getEmailTransporter();
    await transporter.sendMail(options);
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Email failed:', error);
    // Don't throw - email is not critical
  }
};
```

### 4. Response Patterns
```javascript
// ✅ ALWAYS send clear success/failure messages
res.status(201).json({
  success: true,
  message: 'Operation completed successfully',
  data: result
});

// ✅ Include database confirmation in logs
console.log(`✅ Database entry created: ${model.id}`);

// ✅ Handle errors with user-friendly messages
res.status(500).json({
  success: false,
  message: 'Failed to create resource',
  error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
});
```

### 5. API Endpoints
```javascript
// ✅ All endpoints must be stateless
// ✅ No session storage in memory
// ✅ JWT for authentication (in header)
// ✅ Close database connections properly

app.post('/api/resource', async (req, res) => {
  try {
    // Validate input
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Database operation
    const resource = await Model.create(req.body);
    console.log(`✅ Resource created: ${resource.id}`);

    // Success response
    return res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Operation failed',
      error: error.message
    });
  }
});
```

## Environment Variables

### Required
```bash
# Database
DB_PATH=./database.sqlite

# JWT
JWT_SECRET=<random-secret>

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Environment
NODE_ENV=production
PORT=5000
```

## Deployment Targets

### Vercel
- Deploy from `/backend` as serverless functions
- Set environment variables in Vercel dashboard
- Use `vercel.json` configuration
- Frontend served as static files

### Railway
- Deploy from root directory
- Set environment variables in Railway dashboard
- Use `railway.json` configuration
- Both backend and frontend bundled

## Testing Checklist

When implementing features:
- [ ] Add success confirmation logs
- [ ] Return clear success/error messages
- [ ] Handle database failures gracefully
- [ ] No long-running processes
- [ ] No WebSockets
- [ ] Stateless design
- [ ] JWT authentication
- [ ] Email sends asynchronously
- [ ] Cold start optimized
- [ ] Error messages user-friendly

## Common Patterns

### Create Operations
```javascript
export const createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    console.log(`✅ Resource created in database: ID ${resource.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};
```

### Update Operations
```javascript
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    await resource.update(req.body);
    console.log(`✅ Resource updated: ID ${resource.id}`);
    
    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: resource
    });
  } catch (error) {
    console.error('❌ Update failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};
```

## Performance Tips

1. **Connection Pooling**: Use for database connections
2. **Lazy Loading**: Initialize services only when needed
3. **Timeout Handling**: Set reasonable timeouts for operations
4. **Error Recovery**: Gracefully handle cold start issues
5. **Caching**: Use HTTP caching headers where appropriate

## Security

- ✅ Always validate input
- ✅ Sanitize user data
- ✅ Use JWT for authentication
- ✅ Don't expose sensitive errors in production
- ✅ Rate limit API endpoints (via middleware)
- ✅ Use HTTPS in production
- ✅ Set secure headers (helmet.js)

---

**Remember**: Every request is isolated. Design for stateless, serverless execution.
