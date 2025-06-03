const API_BASE = "https://budget-listing.onrender.com";

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.token) {
        localStorage.setItem("token", body.token);
        Swal.fire("Berhasil", body.message || "Login berhasil!", "success").then(() => {
          window.location.href = "dashboard.html";
        });
      } else {
        Swal.fire("Gagal", body.message || "Login gagal!", "error");
      }
    })
    .catch(() => {
      Swal.fire("Error", "Terjadi kesalahan saat login.", "error");
    });
}

function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 201 && body.token) {
        Swal.fire("Berhasil", body.message || "Registrasi berhasil!", "success");
      } else {
        Swal.fire("Gagal", body.message || "Registrasi gagal.", "error");
      }
    })
    .catch(() => {
      Swal.fire("Error", "Terjadi kesalahan saat registrasi.", "error");
    });
}


function loadTransaksi() {
  fetch(`${API_BASE}/api/transactions`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("transaksi-list");
      div.innerHTML = data.transactions.map(t => `
        <p>
          <strong>${t.category}</strong> - ${t.type} - ${t.amount} - ${t.date}<br>
          <button onclick="isiForm(${t.id}, '${t.type}', '${t.category}', ${t.amount}, '${t.date}', '${t.note || ''}')">Edit</button>
          <button onclick="hapusTransaksi(${t.id})">Hapus</button>
        </p>
      `).join("");
    });
}

function loadSummary() {
  fetch(`${API_BASE}/api/transactions/summary`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("summary").innerText = `
        Pemasukan: ${data.income_total} | 
        Pengeluaran: ${data.expense_total} | 
        Saldo: ${data.balance}
      `;
    });
}

function simpanTransaksi() {
  const id = document.getElementById("id").value;
  const payload = {
    amount: parseFloat(document.getElementById("amount").value),
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
    note: document.getElementById("desc").value
  };

  const method = id ? "PUT" : "POST";
  const url = id
    ? `${API_BASE}/api/transactions/${id}`
    : `${API_BASE}/api/transactions`;

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(payload)
  }).then(res => {
    if (res.ok) {
      Swal.fire("Sukses", id ? "Transaksi diperbarui." : "Transaksi ditambahkan.", "success");
      clearForm();
      loadTransaksi();
      loadSummary();
    } else {
      Swal.fire("Gagal", "Gagal menyimpan transaksi.", "error");
    }
  });
}

function hapusTransaksi(id) {
  Swal.fire({
    title: "Yakin hapus transaksi ini?",
    text: "Tindakan ini tidak bisa dibatalkan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal"
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`${API_BASE}/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        if (res.ok) {
          Swal.fire("Berhasil", "Transaksi dihapus.", "success");
          loadTransaksi();
          loadSummary();
        } else {
          Swal.fire("Gagal", "Gagal menghapus transaksi.", "error");
        }
      });
    }
  });
}

function isiForm(id, type, category, amount, date, note) {
  document.getElementById("id").value = id;
  document.getElementById("amount").value = amount;
  document.getElementById("type").value = type;
  document.getElementById("category").value = category;
  document.getElementById("date").value = date;
  document.getElementById("desc").value = note;
}

function clearForm() {
  document.getElementById("id").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("type").value = "";
  document.getElementById("category").value = "";
  document.getElementById("date").value = "";
  document.getElementById("desc").value = "";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  if (window.location.pathname.includes("dashboard")) {
    loadTransaksi();
    loadSummary();
  }
});

function checkLogin() {
  const token = localStorage.getItem('token');
  if (!token) {
    handleNotLoggedIn();
    return;
  }

  fetch(`${API_BASE}/api/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (res.status === 200) {
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ) {
          window.location.href = 'dashboard.html';
        }
      } else {
        handleNotLoggedIn();
      }
    })
    .catch(() => {
      handleNotLoggedIn();
    });
}

function handleNotLoggedIn() {
  if (window.location.pathname.endsWith('dashboard.html')) {
    window.location.href = 'index.html';
  }
}

checkLogin();

