import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp());

app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${PORT}`);
});
