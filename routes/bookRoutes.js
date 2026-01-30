const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middleware/roleCheck');
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');

// Public routes
router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);

// Admin routes
router.post('/books', checkAdmin, createBook);
router.put('/books/:id', checkAdmin, updateBook);
router.delete('/books/:id', checkAdmin, deleteBook);

module.exports = router;
