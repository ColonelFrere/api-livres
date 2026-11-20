const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    titre:  { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    page:   { type: Number, required: true, min: 1 }
  },
  {
    timestamps: true,
    toJSON: {
      // renvoie "id" au lieu de "_id" et retire "__v"
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Book', bookSchema);

const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');

const router = express.Router();

// vérifie qu'un id a le bon format MongoDB
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /books
router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// GET /books/:id
router.get('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'ID invalide' });
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'Livre introuvable' });
  res.json(book);
});

// POST /books
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /books/:id
router.put('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'ID invalide' });
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!book) return res.status(404).json({ error: 'Livre introuvable' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /books/:id
router.delete('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'ID invalide' });
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ error: 'Livre introuvable' });
  res.status(204).send();
});

module.exports = router;