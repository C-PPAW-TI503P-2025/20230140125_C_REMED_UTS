const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from public folder

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Library System API - Geolocation Based Borrowing',
        endpoints: {
            public: {
                'GET /api/books': 'Melihat semua buku',
                'GET /api/books/:id': 'Detail buku'
            },
            admin: {
                'POST /api/books': 'Tambah buku (Header: x-user-role: admin)',
                'PUT /api/books/:id': 'Update buku (Header: x-user-role: admin)',
                'DELETE /api/books/:id': 'Hapus buku (Header: x-user-role: admin)'
            },
            user: {
                'POST /api/borrow': 'Pinjam buku (Header: x-user-role: user, x-user-id: [id])'
            }
        }
    });
});

app.use('/api', bookRoutes);
app.use('/api', borrowRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        // Sync database (create tables if not exist)
        await sequelize.sync({ alter: true });
        console.log('✓ Database synchronized successfully.');

        // Start server
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
