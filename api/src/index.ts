import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { APP_ORIGIN, PORT } from './constants/env';
import { connectToDatabase } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { OK } from './constants/httpCodes';
import authRoutes from './routes/auth.route';

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true
  })
);
app.use(cookieParser());

//health check
app.get('/health', (req, res) => {
  res.status(OK).json({
    status: 'OK',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: Date.now()
  });
});

app.use('/api/auth', authRoutes);

//errorHandler middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await connectToDatabase();
});
