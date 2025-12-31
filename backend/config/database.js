import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running on Vercel (serverless)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// SQLite database path (only for local/Railway)
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

let sequelize;
let dbAvailable = false;

// Only use SQLite if NOT on Vercel
if (!isVercel) {
  try {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 3,
        min: 0,
        acquire: 10000,
        idle: 5000
      },
      retry: {
        max: 3
      }
    });
  } catch (error) {
    console.warn('⚠️  SQLite not available, will use demo storage');
    sequelize = null;
  }
} else {
  console.log('🔵 Running on Vercel - Using demo storage (in-memory)');
  sequelize = null;
}

const connectDB = async () => {
  if (!sequelize) {
    console.log('⚠️  Database unavailable, using demo storage mode');
    dbAvailable = false;
    return null;
  }

  try {
    await sequelize.authenticate();
    console.log(`✅ SQLite3 Database Connected: ${dbPath}`);
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized');
    
    dbAvailable = true;
    return sequelize;
  } catch (error) {
    console.error(`❌ Database Connection Failed: ${error.message}`);
    console.log('⚠️  Falling back to demo storage mode');
    dbAvailable = false;
    return null;
  }
};

const isDatabaseAvailable = () => dbAvailable;

export { sequelize, connectDB, isDatabaseAvailable, isVercel };
export default connectDB;
