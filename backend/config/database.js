import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Failed: ${error.message}`);
    console.warn('⚠️  Server running in demo mode (limited functionality)');
    console.warn('💡 Update .env with MongoDB connection string to enable full functionality');
    // Don't exit, allow server to run with limited functionality
    return null;
  }
};

export default connectDB;
