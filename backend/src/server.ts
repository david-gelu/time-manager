import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Updated CORS configuration with more options
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/time-manager');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Wait for MongoDB connection before starting server
connectDB().then(() => {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
  });

  // Test route with better error handling
  app.get('/api/test', async (req, res) => {
    try {
      // Check if MongoDB is connected
      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB not connected');
      }

      const stats = await mongoose.connection.db.stats();
      res.json({
        message: 'Backend is connected',
        mongoStatus: 'Connected',
        databaseStats: {
          collections: stats.collections,
          documents: stats.objects,
          dataSize: stats.dataSize
        }
      });
    } catch (error) {
      console.error('Error fetching MongoDB stats:', error);
      res.status(500).json({
        error: 'Failed to fetch MongoDB stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Error handling middleware
  app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
  });

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});