import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import { connectToDatabase } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { OK } from './constants/httpCodes';
import authRoutes from './routes/auth.route';
import { authenticate } from './middleware/authenticate';
import userRoutes from './routes/user.route';

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
//morgan logger
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//health check
app.get('/health', (req, res) => {
  res.status(OK).json({
    status: 'OK',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: Date.now()
  });
});

app.use('/api/auth', authRoutes);
//protected routes
app.use('/api/user', authenticate, userRoutes);

//errorHandler middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await connectToDatabase();
});
