const API_BASE = 'http://localhost:3000/api';

// Load books on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    updateStats();
});

// Update statistics
async function updateStats() {
    try {
        const response = await fetch(`${API_BASE}/books`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('totalBooks').textContent = data.data.length;

            // Calculate total stock
            const totalStock = data.data.reduce((sum, book) => sum + book.stock, 0);
            document.getElementById('totalBorrows').textContent = totalStock;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Load all books
async function loadBooks() {
    const booksList = document.getElementById('booksList');

    try {
        const response = await fetch(`${API_BASE}/books`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            booksList.innerHTML = data.data.map(book => `
                <div class="book-card">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-stock">📦 Stock: ${book.stock}</div>
                </div>
            `).join('');
        } else {
            booksList.innerHTML = '<p class="loading">Belum ada buku. Tambahkan buku menggunakan endpoint Admin!</p>';
        }
    } catch (error) {
        booksList.innerHTML = '<p class="loading">Error loading books</p>';
        displayResponse({ success: false, error: error.message });
    }
}

// Display API response
function displayResponse(data) {
    const output = document.getElementById('responseOutput');
    output.textContent = JSON.stringify(data, null, 2);
}

// Test GET /api/books
async function testGetBooks() {
    try {
        const response = await fetch(`${API_BASE}/books`);
        const data = await response.json();
        displayResponse(data);
        loadBooks();
        updateStats();
    } catch (error) {
        displayResponse({ success: false, error: error.message });
    }
}

// Test GET /api/books/:id
async function testGetBookById() {
    const bookId = document.getElementById('bookIdInput').value;

    if (!bookId) {
        alert('Masukkan Book ID!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/books/${bookId}`);
        const data = await response.json();
        displayResponse(data);
    } catch (error) {
        displayResponse({ success: false, error: error.message });
    }
}

// Test POST /api/books (Admin)
async function testCreateBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const stock = document.getElementById('bookStock').value;

    if (!title || !author) {
        alert('Title dan Author harus diisi!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-role': 'admin'
            },
            body: JSON.stringify({
                title,
                author,
                stock: parseInt(stock) || 0
            })
        });

        const data = await response.json();
        displayResponse(data);

        if (data.success) {
            // Clear form
            document.getElementById('bookTitle').value = '';
            document.getElementById('bookAuthor').value = '';
            document.getElementById('bookStock').value = '';

            // Reload books
            loadBooks();
            updateStats();
        }
    } catch (error) {
        displayResponse({ success: false, error: error.message });
    }
}

// Test POST /api/borrow (User)
async function testBorrowBook() {
    const bookId = document.getElementById('borrowBookId').value;
    const userId = document.getElementById('borrowUserId').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!bookId || !userId || !latitude || !longitude) {
        alert('Semua field harus diisi!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/borrow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-role': 'user',
                'x-user-id': userId
            },
            body: JSON.stringify({
                bookId: parseInt(bookId),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            })
        });

        const data = await response.json();
        displayResponse(data);

        if (data.success) {
            // Clear form
            document.getElementById('borrowBookId').value = '';

            // Reload books to show updated stock
            loadBooks();
            updateStats();
        }
    } catch (error) {
        displayResponse({ success: false, error: error.message });
    }
}

// Get user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
                document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
                alert('Lokasi berhasil didapatkan!');
            },
            (error) => {
                alert('Error getting location: ' + error.message);
            }
        );
    } else {
        alert('Geolocation tidak didukung oleh browser Anda');
    }
}
