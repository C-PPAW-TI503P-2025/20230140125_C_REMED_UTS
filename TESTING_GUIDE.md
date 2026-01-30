# Panduan Setup dan Testing - Library System

## 🔧 Setup Database MySQL

### Langkah 1: Pastikan MySQL Server Berjalan
- Buka XAMPP atau MySQL Workbench
- Start MySQL Server

### Langkah 2: Buat Database
Buka MySQL command line atau phpMyAdmin, lalu jalankan:

```sql
CREATE DATABASE library_system;
```

### Langkah 3: Konfigurasi .env
Edit file `.env` sesuai dengan konfigurasi MySQL Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=        # Isi dengan password MySQL Anda (kosongkan jika tidak ada)
DB_NAME=library_system
DB_DIALECT=mysql
PORT=3000
```

### Langkah 4: Jalankan Server
```bash
npm start
```

Jika berhasil, Anda akan melihat:
```
✓ Database connection established successfully.
✓ Database synchronized successfully.
✓ Server running on http://localhost:3000
```

## 🧪 Testing dengan Postman

### Setup Postman Collection

#### 1. Test Public Endpoints

**A. Get All Books**
- Method: `GET`
- URL: `http://localhost:3000/api/books`
- Headers: (tidak perlu)
- Expected: Status 200, list semua buku

**B. Get Book by ID**
- Method: `GET`
- URL: `http://localhost:3000/api/books/1`
- Headers: (tidak perlu)
- Expected: Status 200, detail buku dengan ID 1

---

#### 2. Test Admin Endpoints

**A. Create Book**
- Method: `POST`
- URL: `http://localhost:3000/api/books`
- Headers:
  ```
  x-user-role: admin
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "title": "Belajar Node.js",
    "author": "John Doe",
    "stock": 10
  }
  ```
- Expected: Status 201, buku berhasil dibuat

**B. Update Book**
- Method: `PUT`
- URL: `http://localhost:3000/api/books/1`
- Headers:
  ```
  x-user-role: admin
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "title": "Belajar Node.js - Updated",
    "stock": 15
  }
  ```
- Expected: Status 200, buku berhasil diupdate

**C. Delete Book**
- Method: `DELETE`
- URL: `http://localhost:3000/api/books/1`
- Headers:
  ```
  x-user-role: admin
  ```
- Expected: Status 200, buku berhasil dihapus

---

#### 3. Test User Endpoints

**A. Borrow Book**
- Method: `POST`
- URL: `http://localhost:3000/api/borrow`
- Headers:
  ```
  x-user-role: user
  x-user-id: 1
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "bookId": 1,
    "latitude": -6.2088,
    "longitude": 106.8456
  }
  ```
- Expected: Status 201, buku berhasil dipinjam, stock berkurang

---

#### 4. Test Error Handling

**A. Test Without Admin Header**
- Method: `POST`
- URL: `http://localhost:3000/api/books`
- Headers: (tanpa x-user-role)
- Expected: Status 401, error message

**B. Test Borrow with Insufficient Stock**
- Pinjam buku sampai stock habis
- Expected: Status 400, "Stok buku tidak tersedia"

**C. Test Invalid Data**
- Method: `POST`
- URL: `http://localhost:3000/api/books`
- Headers: `x-user-role: admin`
- Body:
  ```json
  {
    "title": "",
    "author": "Test"
  }
  ```
- Expected: Status 400, validation error

## 📸 Checklist Screenshot untuk README

Ambil screenshot untuk hal-hal berikut:

### 1. Postman Tests
- [ ] GET /api/books (Public)
- [ ] GET /api/books/:id (Public)
- [ ] POST /api/books (Admin)
- [ ] PUT /api/books/:id (Admin)
- [ ] DELETE /api/books/:id (Admin)
- [ ] POST /api/borrow (User)
- [ ] Error handling (tanpa header)

### 2. Database Structure
- [ ] Screenshot tabel `books` di phpMyAdmin/MySQL Workbench
- [ ] Screenshot tabel `borrow_logs` di phpMyAdmin/MySQL Workbench
- [ ] Screenshot isi data di tabel `books`
- [ ] Screenshot isi data di tabel `borrow_logs` (dengan geolocation)

### 3. Server Running
- [ ] Screenshot terminal saat server berhasil running
- [ ] Screenshot response dari endpoint root `http://localhost:3000`

## ✅ Testing Checklist

- [ ] Database berhasil dibuat
- [ ] Server berhasil running tanpa error
- [ ] Tabel `books` dan `borrow_logs` otomatis terbuat
- [ ] GET /api/books berhasil
- [ ] GET /api/books/:id berhasil
- [ ] POST /api/books berhasil (dengan header admin)
- [ ] PUT /api/books/:id berhasil (dengan header admin)
- [ ] DELETE /api/books/:id berhasil (dengan header admin)
- [ ] POST /api/borrow berhasil (dengan header user)
- [ ] Stock buku berkurang setelah dipinjam
- [ ] Geolocation tersimpan di database
- [ ] Error handling berfungsi (tanpa header, stock habis, data invalid)

## 🎯 Sample Test Data

Gunakan data berikut untuk testing:

### Books
```json
[
  {
    "title": "Belajar Node.js",
    "author": "John Doe",
    "stock": 5
  },
  {
    "title": "Mastering Express.js",
    "author": "Jane Smith",
    "stock": 3
  },
  {
    "title": "Database dengan Sequelize",
    "author": "Bob Johnson",
    "stock": 7
  }
]
```

### Borrow Locations (Jakarta)
```json
{
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

### Borrow Locations (Bandung)
```json
{
  "latitude": -6.9175,
  "longitude": 107.6191
}
```

## 🐛 Troubleshooting

### Error: ECONNREFUSED
- **Penyebab**: MySQL server tidak running
- **Solusi**: Start MySQL di XAMPP atau MySQL Workbench

### Error: Access denied for user
- **Penyebab**: Username/password salah di .env
- **Solusi**: Cek konfigurasi DB_USER dan DB_PASSWORD

### Error: Unknown database 'library_system'
- **Penyebab**: Database belum dibuat
- **Solusi**: Jalankan `CREATE DATABASE library_system;`

### Error: Header x-user-role diperlukan
- **Penyebab**: Akses endpoint admin/user tanpa header
- **Solusi**: Tambahkan header yang sesuai di Postman
