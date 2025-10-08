import admin from "firebase-admin";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dailyTasksRouter from "./routes/dailyTasks";
import subTasksRouter from "./routes/subTasks";
import statsRouter from "./routes/stats";
import { authMiddleware, AuthRequest } from "./middleware/authMiddleware";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
    ),
  });
}

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URL_PROD];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI || "");
  isConnected = true;
  console.log("Connected to MongoDB");
};
connectDB().catch(console.error);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "API is running" });
});

app.get("/api/protected", authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

app.use("/api/daily-tasks", authMiddleware, dailyTasksRouter);
app.use("/api/sub-tasks", authMiddleware, subTasksRouter);
app.use("/api/stats", authMiddleware, statsRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

export default app;