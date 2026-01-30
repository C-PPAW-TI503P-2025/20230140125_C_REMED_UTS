const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    try {
        // Connect tanpa specify database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('✓ Connected to MySQL server');

        // Create database jika belum ada
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`✓ Database '${process.env.DB_NAME}' created or already exists`);

        await connection.end();
        console.log('✓ Setup complete! You can now run: npm start');
    } catch (error) {
        console.error('✗ Error creating database:', error.message);
        console.error('\nPastikan:');
        console.error('1. MySQL server sudah running');
        console.error('2. Username dan password di .env sudah benar');
        console.error('3. Port MySQL sudah benar (default: 3306, Anda pakai: ' + (process.env.DB_PORT || 3306) + ')');
    }
}

createDatabase();
