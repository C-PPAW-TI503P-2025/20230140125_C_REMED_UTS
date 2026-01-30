const express = require('express');
const router = express.Router();
const { checkUser } = require('../middleware/roleCheck');
const { borrowBook } = require('../controllers/borrowController');

// User route - borrow book with geolocation
router.post('/borrow', checkUser, borrowBook);

module.exports = router;
