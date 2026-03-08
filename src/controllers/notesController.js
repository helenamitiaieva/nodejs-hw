import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res, next) {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 10;

    const filter = {
      userId: req.user._id,
    };

    if (tag) {
      filter.tag = tag;
    }

    if (search !== undefined) {
      const trimmedSearch = String(search).trim();
      if (trimmedSearch) {
        filter.$text = { $search: trimmedSearch };
      }
    }

    const totalNotes = await Note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / perPageNumber) || 1;
    const skip = (pageNumber - 1) * perPageNumber;

    const notes = await Note.find(filter).skip(skip).limit(perPageNumber);

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (err) {
    next(err);
  }
}

export async function getNoteById(req, res, next) {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
}

export async function createNote(req, res, next) {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
}

export async function updateNote(req, res, next) {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: req.user._id,
      },
      req.body,
      { new: true },
    );

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
}
