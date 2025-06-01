const API_BASE = "https://budget-listing.onrender.com"; 

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        alert("Login gagal!");
      }
    });
}

function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  }).then(res => {
    if (res.status === 201) {
      alert("Registrasi sukses, silakan login.");
    } else {
      alert("Registrasi gagal.");
    }
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
      alert(id ? "Transaksi diupdate." : "Transaksi ditambahkan.");
      clearForm();
      loadTransaksi();
      loadSummary();
    } else {
      alert("Gagal menyimpan.");
    }
  });
}

function hapusTransaksi(id) {
  if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
  fetch(`${API_BASE}/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  }).then(res => {
    if (res.ok) {
      alert("Transaksi dihapus.");
      loadTransaksi();
      loadSummary();
    } else {
      alert("Gagal menghapus.");
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

document.getElementById("logout-btn").addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

if (window.location.pathname.includes("dashboard")) {
  loadTransaksi();
  loadSummary();
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
});
