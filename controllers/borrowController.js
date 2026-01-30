const { Book, BorrowLog } = require('../models');

// Borrow book with geolocation
const borrowBook = async (req, res, next) => {
    try {
        const { bookId, latitude, longitude } = req.body;
        const userId = req.userId; // From middleware

        // Validation
        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: 'Book ID diperlukan'
            });
        }

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Latitude dan longitude diperlukan'
            });
        }

        // Check if book exists
        const book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Buku tidak ditemukan'
            });
        }

        // Check stock availability
        if (book.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Stok buku tidak tersedia'
            });
        }

        // Reduce stock
        book.stock -= 1;
        await book.save();

        // Create borrow log
        const borrowLog = await BorrowLog.create({
            userId,
            bookId,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            borrowDate: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Buku berhasil dipinjam',
            data: {
                borrowLog,
                book: {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    remainingStock: book.stock
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get borrow history
const getBorrowHistory = async (req, res, next) => {
    try {
        const userId = req.userId; // From middleware

        const history = await BorrowLog.findAll({
            where: { userId },
            include: [{
                model: Book,
                as: 'book',
                attributes: ['title', 'author']
            }],
            order: [['borrowDate', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    borrowBook,
    getBorrowHistory
};
