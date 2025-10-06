import admin from 'firebase-admin';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dailyTasksRouter from "./routes/dailyTasks";
import subTasksRouter from "./routes/subTasks";
import statsRouter from "./routes/stats";
import { authMiddleware, AuthRequest } from "./middleware/authMiddleware"

dotenv.config()

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
  ),
})

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
  });

  app.get("/api/protected", authMiddleware, (req: AuthRequest, res) => {
    res.json({
      message: "Access granted",
      user: req.user,
    })
  })

  app.use("/api/daily-tasks", authMiddleware, dailyTasksRouter)
  app.use("/api/sub-tasks", authMiddleware, subTasksRouter)
  app.use("/api/stats", authMiddleware, statsRouter)

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