const express = require('express');
const mongoose = require('mongoose');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/booksdb';

app.use(express.json()); // pour lire le JSON envoyé dans les requêtes

app.get('/', (req, res) => res.json({ message: 'API Livres OK' }));
app.use('/books', booksRouter);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connecté à MongoDB');
    app.listen(PORT, () => console.log(`API lancée sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error('Erreur MongoDB :', err.message);
    process.exit(1);
  });