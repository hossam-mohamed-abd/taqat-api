import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import session from 'express-session'
import MongoStore from "connect-mongo";
import connectDB from "./DB/mongoose.js";
import authRouter from "./routes/auth.routes.js";
import mainRouter from './routes/main.routes.js';
import taskRoutes from "./routes/task.routes.js";
import subMainRoutes from "./routes/submain.routes.js";
import kaderRouter from "./routes/kader.routes.js";
import deadlineRouter from "./routes/deadline.routes.js";
import remainingWorkRoutes from "./routes/remaining-work.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:5174", "http://localhost:5173"];

// Add Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));



await connectDB();
// Add Routes
app.use('/api/auth', authRouter);
app.use('/api/main', mainRouter);
app.use('/api/tasks', taskRoutes)
app.use('/api/sub-main', subMainRoutes)
app.use('/api/kader', kaderRouter)
app.use('/api/deadline', deadlineRouter)
app.use('/api/remaining-work', remainingWorkRoutes)
app.get('/api/health', (_req, res) => res.status(200).json({ ok: true }));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: "Internal Server Error",
    error: error.message,
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
