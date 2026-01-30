const API_BASE = 'http://localhost:3000/api';
let allBooks = [];

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    initTabs();
    initRoleLogic();
});

// Role Logic
function initRoleLogic() {
    const roleSelector = document.getElementById('userRole');
    const updateUI = () => {
        const role = roleSelector.value;
        const tabKelola = document.getElementById('tabKelola');
        const tabPinjam = document.getElementById('tabPinjam');

        if (role === 'admin') {
            tabKelola.style.display = 'block';
            tabPinjam.style.display = 'none';
        } else {
            tabKelola.style.display = 'none';
            tabPinjam.style.display = 'block';
        }

        // Reset to first tab when role changes
        document.querySelector('.nav-tab[data-tab="daftar"]').click();
    };

    roleSelector.addEventListener('change', updateUI);
    updateUI(); // Initial run
}

// Initialize Tab Switching
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state in UI
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Switch views
            const target = tab.getAttribute('data-tab');
            document.getElementById('daftarBukuView').style.display = target === 'daftar' ? 'block' : 'none';
            document.getElementById('pinjamBukuView').style.display = target === 'pinjam' ? 'block' : 'none';
            document.getElementById('kelolaBukuView').style.display = target === 'kelola' ? 'block' : 'none';
            document.getElementById('riwayatView').style.display = target === 'riwayat' ? 'block' : 'none';

            if (target === 'daftar' || target === 'kelola' || target === 'pinjam') {
                loadBooks();
            } else if (target === 'riwayat') {
                loadBorrowHistory();
            }
        });
    });
}

// Load all books from API
async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE}/books`);
        const data = await response.json();

        if (data.success) {
            allBooks = data.data;
            renderBooks(allBooks);
        }
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('booksList').innerHTML = '<p class="loading">Gagal memuat buku. Pastikan server berjalan.</p>';
    }
}

// Render books to the list
function renderBooks(books) {
    const list = document.getElementById('booksList');
    const manageTableBody = document.getElementById('manageBooksTableBody');
    const select = document.getElementById('borrowBookId');

    if (list) {
        if (books.length > 0) {
            // Render Public/User List
            list.innerHTML = books.map(book => `
                <div class="book-item">
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p>Penulis: ${book.author}</p>
                    </div>
                    <div class="book-status">
                        ${book.stock} tersedia
                    </div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p class="loading">Tidak ada buku yang ditemukan.</p>';
        }
    }

    if (manageTableBody) {
        if (books.length > 0) {
            // Render Admin Management Table
            manageTableBody.innerHTML = books.map(book => `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.stock}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-edit" onclick="editBook(${book.id})">Edit</button>
                            <button class="btn-hapus" onclick="deleteBook(${book.id})">Hapus</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            manageTableBody.innerHTML = '<tr><td colspan="5" class="loading">Belum ada data buku.</td></tr>';
        }
    }

    // Render Select Options for Pinjam
    if (select) {
        select.innerHTML = '<option value="">Pilih Buku yang ingin dipinjam</option>' +
            books.filter(b => b.stock > 0).map(book => `
                <option value="${book.id}">${book.title} (${book.stock} tersedia)</option>
            `).join('');
    }
}

// Filter books based on search input
function filterBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allBooks.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
    renderBooks(filtered);
}

// Helper for API Headers based on selected role
function getHeaders() {
    const roleSelector = document.getElementById('userRole');
    const role = roleSelector ? roleSelector.value : 'user';

    return {
        'Content-Type': 'application/json',
        'x-user-role': role,
        'x-user-id': '1' // Default dev user ID
    };
}

// Handle Save Book (Create or Update)
async function handleSaveBook() {
    const id = document.getElementById('editBookId').value;
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const stock = document.getElementById('bookStock').value;

    if (!title || !author) {
        alert('Judul dan Penulis harus diisi!');
        return;
    }

    const bookData = {
        title,
        author,
        stock: parseInt(stock) || 0
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/books/${id}` : `${API_BASE}/books`;

        const response = await fetch(url, {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify(bookData)
        });

        const data = await response.json();

        if (data.success) {
            alert(id ? 'Buku berhasil diperbarui!' : 'Buku berhasil ditambahkan!');
            cancelEdit(); // Reset form
            loadBooks();
        } else {
            alert('Gagal: ' + (data.message || data.error));
        }
    } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
    }
}

// Edit Book (Fill form)
function editBook(id) {
    const book = allBooks.find(b => b.id === id);
    if (!book) return;

    document.getElementById('editBookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookStock').value = book.stock;

    document.getElementById('formTitle').innerText = 'Edit Buku';
    document.getElementById('btnCancelEdit').style.display = 'block';

    // Smooth scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Cancel Edit
function cancelEdit() {
    document.getElementById('editBookId').value = '';
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookStock').value = '';

    document.getElementById('formTitle').innerText = 'Tambah Buku';
    document.getElementById('btnCancelEdit').style.display = 'none';
}

// Delete Book
async function deleteBook(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;

    try {
        const response = await fetch(`${API_BASE}/books/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const data = await response.json();

        if (data.success) {
            alert('Buku berhasil dihapus!');
            loadBooks();
        } else {
            alert('Gagal: ' + (data.message || data.error));
        }
    } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
    }
}

// Borrow book (User)
async function testBorrowBook() {
    const bookId = document.getElementById('borrowBookId').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!bookId || !latitude || !longitude) {
        alert('Silakan pilih buku dan pastikan lokasi terisi!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/borrow`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                bookId: parseInt(bookId),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Buku berhasil dipinjam!');
            loadBooks();
            loadBorrowHistory(); // Refresh history
        } else {
            alert('Gagal: ' + (data.message || data.error));
        }
    } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
    }
}

// Load Borrow History
async function loadBorrowHistory() {
    const historyList = document.getElementById('borrowHistory');
    if (!historyList) return;

    try {
        const response = await fetch(`${API_BASE}/borrow/history`, {
            headers: getHeaders()
        });
        const data = await response.json();

        if (data.success) {
            renderBorrowHistory(data.data);
        }
    } catch (error) {
        console.error('Error loading history:', error);
        historyList.innerHTML = '<p class="loading">Gagal memuat riwayat.</p>';
    }
}

// Render Borrow History
function renderBorrowHistory(history) {
    const list = document.getElementById('borrowHistory');
    if (!list) return;

    if (history.length > 0) {
        list.innerHTML = history.map(item => `
            <div class="book-item">
                <div class="book-info">
                    <h3>${item.book ? item.book.title : 'Buku dihapus'}</h3>
                    <p>Dipinjam pada: ${new Date(item.borrowDate).toLocaleString('id-ID')}</p>
                    <p style="font-size: 11px; margin-top: 4px;">📍 Lat: ${item.latitude}, Lon: ${item.longitude}</p>
                </div>
                <div class="book-status" style="background: #6366f1;">
                    Dipinjam
                </div>
            </div>
        `).join('');
    } else {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Belum ada riwayat peminjaman.</p>';
    }
}

// Get Geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
                document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
                alert('Lokasi berhasil didapatkan!');
            },
            (error) => {
                alert('Gagal mendapatkan lokasi: ' + error.message);
            }
        );
    } else {
        alert('Geolocation tidak didukung oleh browser ini.');
    }
}
