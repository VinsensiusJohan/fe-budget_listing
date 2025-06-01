const API_BASE = "https://budget-listing.onrender.com"; 

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "dashboard.html";
      } else {
        alert("Login gagal!");
      }
    });
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(res => {
    if (res.status === 201) {
      alert("Registrasi sukses, silakan login.");
    } else {
      alert("Registrasi gagal.");
    }
  });
}

function loadTransaksi() {
  fetch(`${API_BASE}/transactions`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("transaksi-list");
      div.innerHTML = data.map(t => `
        <p><strong>${t.category}</strong> - ${t.type} - ${t.amount} - ${t.date}</p>
      `).join("");
    });
}

function tambahTransaksi() {
  const payload = {
    amount: parseFloat(document.getElementById("amount").value),
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
    description: document.getElementById("desc").value
  };

  fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(payload)
  }).then(res => {
    if (res.status === 201) {
      alert("Transaksi ditambahkan.");
      loadTransaksi();
    } else {
      alert("Gagal menambahkan.");
    }
  });
}

if (window.location.pathname.includes("dashboard")) {
  loadTransaksi();
}
