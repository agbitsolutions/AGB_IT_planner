import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

// Serverless-optimized configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 3,          // Reduced for serverless
    min: 0,          // No minimum connections
    acquire: 10000,  // Faster acquisition for cold starts
    idle: 5000       // Release connections faster
  },
  retry: {
    max: 3
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ SQLite3 Database Connected: ${dbPath}`);
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error(`❌ Database Connection Failed: ${error.message}`);
    throw error;
  }
};

export { sequelize, connectDB };
export default connectDB;
