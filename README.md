🗂️ Struktur Database

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

Bukti Hasil Pengujian (Screenshots)
1. Public
a. GET
Penjelasan: Menampilkan seluruh list buku serta dengan jumlahnya
<img width="1920" height="1080" alt="Screenshot 2026-01-31 020844" src="https://github.com/user-attachments/assets/c40eb69d-696d-4009-803e-27ffbe89ffe0" />

b. GET by id
Penjelasan: Menampilkan list buku serta dengan jumlahnya sesuai dengan id yang di berikan
<img width="1920" height="1080" alt="Screenshot 2026-01-31 020935" src="https://github.com/user-attachments/assets/0942166d-9818-4ea4-a42a-cee5f11f0ff3" />

2. Admin Mode
Penjelasan: Admin memiliki otoritas penuh untuk menambah buku baru (POST), mengupdate (PUT)serta menghapus buku (DELETE) yang sudah tidak tersedia di perpustakaan.

a. POST
<img width="1920" height="1080" alt="Screenshot 2026-01-31 021119" src="https://github.com/user-attachments/assets/a8b0a218-a7fb-4160-8f3b-62e847955c60" />

b. PUT
<img width="1920" height="1080" alt="Screenshot 2026-01-31 021536" src="https://github.com/user-attachments/assets/26e2a653-669d-408c-82bf-26efd5c46672" />

c. DELETE
<img width="1920" height="1080" alt="Screenshot 2026-01-31 021608" src="https://github.com/user-attachments/assets/deb52479-9560-4017-80a7-2756e1612976" />

3. User Mode
a. POST
Penjelasan: Endpoint POST /api/borrow berhasil memproses peminjaman buku dengan mengirimkan data bookId serta koordinat lokasi (latitude & longitude).
<img width="1920" height="1080" alt="Screenshot 2026-01-31 021750" src="https://github.com/user-attachments/assets/f4364578-0e5e-4228-8f37-46b60fe216f3" />

b. GET UNTUK MELIHAT HISTORY DARI PEMINJAMAN BUKU
<img width="1920" height="1080" alt="Screenshot 2026-01-31 021855" src="https://github.com/user-attachments/assets/69c5679e-0d2e-4c9b-a4f0-cb1b3340f89f" />

Database
1. Tabel Peminjaman
Penjelasan: Screenshot ini membuktikan bahwa koordinat Geolocation benar-benar tersimpan di tabel borrowlogs.
<img width="1920" height="1080" alt="Screenshot 2026-01-31 023313" src="https://github.com/user-attachments/assets/acf5c21e-9bd3-45f1-b88a-b8376e6dc326" />

2. Tabel buku
Penjelasan: Logika bisnis untuk pengurangan stok berjalan dengan benar. Setiap kali ada transaksi peminjaman di tabel borrowlogs, jumlah stock pada tabel books akan otomatis berkurang secara real-time.
<img width="1920" height="1080" alt="Screenshot 2026-01-31 023418" src="https://github.com/user-attachments/assets/cd56779e-f9d2-455a-ac49-7c67c3acd296" />

Tampilan Web KING MU
HALAMAN PEMBUKA DARI KING MU
<img width="1920" height="1080" alt="Screenshot 2026-01-31 025351" src="https://github.com/user-attachments/assets/b65353fb-4eb8-4bd9-8397-09de6935ba63" />

Tampilan Web ADMIN
1. VALIDASI DI BAGIAN KELOLA BUKU ADMIN BAWHA JUDUL DAN PENULIH HARUS DI ISI
<img width="1920" height="1080" alt="Screenshot 2026-01-31 025455" src="https://github.com/user-attachments/assets/3987ab8e-bbfb-4825-a10b-2f31372df68e" />

2. HALAMAN DAFTAR BUKU ADMIN
<img width="1920" height="1080" alt="Screenshot 2026-01-31 025443" src="https://github.com/user-attachments/assets/eefb1538-37d4-4c2a-9de4-6b7a50ac34f9" />

3. HALAMAN KELOLA ADMIN EDIT
   A. SEBELUM
   <img width="1920" height="1080" alt="Screenshot 2026-01-31 025752" src="https://github.com/user-attachments/assets/3b50b827-1d16-4428-b31e-6c5280fa478c" />
   
   B. SESUDAH DI EDIT
   <img width="1920" height="1080" alt="Screenshot 2026-01-31 025811" src="https://github.com/user-attachments/assets/9e601d59-d4fd-4ff0-a0c4-9e5c6cdb74b5" />

4. HALAMAN KELOLA ADMIN HAPUS
   A. SEBELUM
   <img width="1920" height="1080" alt="Screenshot 2026-01-31 025859" src="https://github.com/user-attachments/assets/bce32fbc-ecc1-45cc-9f1f-0c723cd2dec6" />
   
   B. SESUDAH DI HAPUS
   <img width="1920" height="1080" alt="Screenshot 2026-01-31 030001" src="https://github.com/user-attachments/assets/ac617930-ecac-46b7-befe-62a52f411794" />

5. HALAMAN UNTUK MELIHAT RIWAYAT PEMINJAMAN BUKU 
<img width="1920" height="1080" alt="Screenshot 2026-01-31 030031" src="https://github.com/user-attachments/assets/3816b99a-2cd7-417d-8ecd-02178f97fd7c" />

Tampilan Web USER
SEBENARNYA UNTUK TAMPILAN USER DAN ADMIN MAU DARI HALAMAN DAFTAR DAN RIWAYAT SAMA CUMAN YANG MENJADI PEMBEDA ANTAR ADMIN DAN USER ADALAH DI BAGIAN
HALAMAN KELOLA BUKU UNTUK ADMIN DAN HALAMAN PEMINJAMAN UNTUK USER
1. HALAMAN PEMINJAMAN 
<img width="1920" height="1080" alt="Screenshot 2026-01-31 030404" src="https://github.com/user-attachments/assets/0b3af7cc-512b-4f6a-9ff6-021bbc51f241" />

2. RIWAYAT DARI PEMINJAMAN 
<img width="1920" height="1080" alt="Screenshot 2026-01-31 030434" src="https://github.com/user-attachments/assets/25392051-3223-4749-978b-fe363b446092" />

DONEE
