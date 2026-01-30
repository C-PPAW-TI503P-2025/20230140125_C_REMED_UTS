# Library System with Geolocation

Backend API untuk sistem manajemen perpustakaan dengan fitur peminjaman berbasis lokasi. Proyek ini dibuat untuk UCP 1 (Ujian Capaian Pembelajaran 1) mata kuliah Pengembangan Aplikasi Web.

## 📋 Deskripsi

Aplikasi ini adalah backend sederhana untuk manajemen perpustakaan yang memiliki fitur peminjaman berbasis lokasi (geolocation). Sistem menggunakan simulasi role-based access control melalui HTTP Headers untuk membedakan akses Admin dan User.

## ✨ Fitur

- **Public Access**: Melihat daftar buku dan detail buku
- **Admin Mode**: CRUD (Create, Read, Update, Delete) buku
- **User Mode**: Meminjam buku dengan tracking lokasi (latitude & longitude)
- **Geolocation Tracking**: Setiap peminjaman mencatat koordinat lokasi user
- **Stock Management**: Otomatis mengurangi stok buku saat dipinjam
- **Validation**: Validasi input untuk memastikan data yang masuk valid

## 🛠️ Teknologi

- **Backend**: Node.js & Express.js
- **Database**: MySQL dengan Sequelize ORM
- **Authentication**: Simulasi role-based access via HTTP Headers

## 📦 Prerequisites

Pastikan sudah terinstall:
- Node.js (v14 atau lebih baru)
- MySQL Server
- NPM atau Yarn

## 🚀 Instalasi

### 1. Clone atau Download Project

```bash
cd REMIDI_PAW
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Database

Buat database MySQL baru:

```sql
CREATE DATABASE library_system;
```

### 4. Setup Environment Variables

Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=library_system
DB_DIALECT=mysql

# Server Configuration
PORT=3000
```

### 5. Jalankan Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

Database tables akan otomatis dibuat saat server pertama kali dijalankan.

## 📚 API Endpoints

### Public Endpoints (Tidak Perlu Header)

#### 1. Get All Books
```
GET /api/books
```

**Response:**
```json
{
  "success": true,
  "message": "Berhasil mengambil data buku",
  "data": [
    {
      "id": 1,
      "title": "Belajar Node.js",
      "author": "John Doe",
      "stock": 5
    }
  ]
}
```

#### 2. Get Book by ID
```
GET /api/books/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Berhasil mengambil detail buku",
  "data": {
    "id": 1,
    "title": "Belajar Node.js",
    "author": "John Doe",
    "stock": 5
  }
}
```

---

### Admin Endpoints (Perlu Header: `x-user-role: admin`)

#### 3. Create Book
```
POST /api/books
Headers: x-user-role: admin
```

**Request Body:**
```json
{
  "title": "Belajar Express.js",
  "author": "Jane Smith",
  "stock": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Buku berhasil ditambahkan",
  "data": {
    "id": 2,
    "title": "Belajar Express.js",
    "author": "Jane Smith",
    "stock": 10
  }
}
```

#### 4. Update Book
```
PUT /api/books/:id
Headers: x-user-role: admin
```

**Request Body:**
```json
{
  "title": "Belajar Express.js Updated",
  "stock": 15
}
```

#### 5. Delete Book
```
DELETE /api/books/:id
Headers: x-user-role: admin
```

---

### User Endpoints (Perlu Header: `x-user-role: user` dan `x-user-id: 1`)

#### 6. Borrow Book
```
POST /api/borrow
Headers: 
  x-user-role: user
  x-user-id: 1
```

**Request Body:**
```json
{
  "bookId": 1,
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

#### 7. Get Borrow History
```
GET /api/borrow/history
Headers: 
  x-user-role: user
  x-user-id: 1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "bookId": 1,
      "borrowDate": "2026-01-31T01:23:45.000Z",
      "latitude": -6.2088,
      "longitude": 106.8456,
      "book": {
        "title": "Belajar Node.js",
        "author": "John Doe"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Buku berhasil dipinjam",
  "data": {
    "borrowLog": {
      "id": 1,
      "userId": 1,
      "bookId": 1,
      "latitude": -6.2088,
      "longitude": 106.8456,
      "borrowDate": "2026-01-29T09:53:00.000Z"
    },
    "book": {
      "id": 1,
      "title": "Belajar Node.js",
      "author": "John Doe",
      "remainingStock": 4
    }
  }
}
```

## 🗂️ Struktur Database

### Table: `books`
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary Key, Auto Increment |
| title | STRING | Judul buku (tidak boleh kosong) |
| author | STRING | Penulis buku (tidak boleh kosong) |
| stock | INTEGER | Jumlah stok buku |
| createdAt | DATETIME | Waktu dibuat |
| updatedAt | DATETIME | Waktu diupdate |

### Table: `borrow_logs`
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary Key, Auto Increment |
| userId | INTEGER | ID user yang meminjam |
| bookId | INTEGER | Foreign Key ke table books |
| borrowDate | DATETIME | Tanggal peminjaman |
| latitude | FLOAT | Koordinat latitude lokasi peminjaman |
| longitude | FLOAT | Koordinat longitude lokasi peminjaman |
| createdAt | DATETIME | Waktu dibuat |
| updatedAt | DATETIME | Waktu diupdate |

## 📁 Struktur Project

```
REMIDI_PAW/
├── config/
│   └── database.js          # Konfigurasi Sequelize
├── controllers/
│   ├── bookController.js    # Logic untuk CRUD buku
│   └── borrowController.js  # Logic untuk peminjaman
├── middleware/
│   ├── roleCheck.js         # Middleware untuk cek role
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── Book.js              # Model Buku
│   ├── BorrowLog.js         # Model Log Peminjaman
│   └── index.js             # Model associations
├── routes/
│   ├── bookRoutes.js        # Routes untuk buku
│   └── borrowRoutes.js      # Routes untuk peminjaman
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # NPM dependencies
├── server.js               # Entry point aplikasi
└── README.md               # Dokumentasi
```

## 🧪 Panduan Testing dengan Postman

Untuk menguji semua fitur, buka Postman dan ikuti langkah berikut:

### 1. Persiapan Header Umum
Hampir semua endpoint (kecuali Public) membutuhkan Header. Masukkan ini di tab **Headers** di Postman:
- `Content-Type`: `application/json`
- `x-user-role`: `admin` (untuk CRUD) atau `user` (untuk Pinjam)
- `x-user-id`: `1` (untuk User)

### 2. Skenario Uji Admin (CRUD)
Gunakan `x-user-role: admin` di Header:

*   **CREATE (Tambah Buku)**
    *   Method: `POST`
    *   URL: `http://localhost:3000/api/books`
    *   Body (raw JSON): 
        ```json
        { "title": "Buku Baru", "author": "Penulis", "stock": 10 }
        ```
*   **READ (Lihat Semua)**
    *   Method: `GET`
    *   URL: `http://localhost:3000/api/books`
*   **UPDATE (Ubah Buku)**
    *   Method: `PUT`
    *   URL: `http://localhost:3000/api/books/1` (ganti 1 dengan ID buku)
    *   Body (raw JSON): 
        ```json
        { "title": "Judul Baru", "stock": 5 }
        ```
*   **DELETE (Hapus Buku)**
    *   Method: `DELETE`
    *   URL: `http://localhost:3000/api/books/1`

### 3. Skenario Uji User (Pinjam & Riwayat)
Gunakan `x-user-role: user` dan `x-user-id: 1` di Header:

*   **BORROW (Pinjam Buku)**
    *   Method: `POST`
    *   URL: `http://localhost:3000/api/borrow`
    *   Body (raw JSON):
        ```json
        { "bookId": 1, "latitude": -6.20, "longitude": 106.84 }
        ```
*   **HISTORY (Lihat Riwayat)**
    *   Method: `GET`
    *   URL: `http://localhost:3000/api/borrow/history`

## 📸 Screenshots

*(Screenshots akan ditambahkan setelah testing)*

### 1. Postman - Test Endpoint API
- Screenshot testing semua endpoints

### 2. Database Structure
- Screenshot struktur tabel di MySQL

### 3. Sample Data
- Screenshot data di tabel books dan borrow_logs

## ⚠️ Catatan Penting

- **Role Simulation**: Aplikasi ini menggunakan simulasi role melalui HTTP Headers. Dalam production, gunakan JWT atau session-based authentication.
- **Validation**: Sudah diimplementasikan validasi sederhana (title dan author tidak boleh kosong, stock tidak boleh negatif).
- **Error Handling**: Semua error ditangani dengan response JSON yang konsisten.

## 👨‍💻 Author

Dibuat untuk UCP 1 - Pengembangan Aplikasi Web
Fakultas Teknik - Program Studi Teknologi Informasi

## 📝 License

ISC
