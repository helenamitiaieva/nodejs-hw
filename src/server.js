import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';

const app = express();

app.use(logger);
app.use(express.json());
app.use(cors());

app.use(notesRoutes);

app.use(errors());

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  await connectMongoDB();

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server started on port ${PORT}`);
  });
}

startServer();
