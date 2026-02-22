import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    const message = err.message ?? err.name;

    res.status(err.status).json({ message });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
