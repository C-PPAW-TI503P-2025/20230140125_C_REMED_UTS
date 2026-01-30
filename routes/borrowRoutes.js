const express = require('express');
const router = express.Router();
const { checkUser } = require('../middleware/roleCheck');
const { borrowBook, getBorrowHistory } = require('../controllers/borrowController');

// User route - borrow book with geolocation
router.post('/borrow', checkUser, borrowBook);
router.get('/borrow/history', checkUser, getBorrowHistory);

module.exports = router;
