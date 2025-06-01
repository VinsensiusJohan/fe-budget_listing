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
    note: document.getElementById("desc").value
  };

  fetch(`${API_BASE}/api/transactions`, {
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
