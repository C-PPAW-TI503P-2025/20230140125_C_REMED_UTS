const { sequelize } = require('../config/database');
const Book = require('./Book');
const BorrowLog = require('./BorrowLog');

// Define associations
Book.hasMany(BorrowLog, {
    foreignKey: 'bookId',
    as: 'borrowLogs'
});

BorrowLog.belongsTo(Book, {
    foreignKey: 'bookId',
    as: 'book'
});

module.exports = {
    sequelize,
    Book,
    BorrowLog
};
