import 'dotenv/config';
import express from 'express';
import { PORT } from './constants/env';
import { connectToDatabase } from './config/db';

const app = express();

//health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: Date.now()
  });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await connectToDatabase();
});
