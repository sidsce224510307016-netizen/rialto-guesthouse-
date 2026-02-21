let token = sessionStorage.getItem("token");
let chart;

async function login() {
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL + "?action=login", {
    method: "POST",
    body: JSON.stringify({ password })
  });

  const result = await res.json();

  if (result.token) {
    sessionStorage.setItem("token", result.token);
    showDashboard();
  } else {
    alert("Invalid password");
  }
}

function showDashboard() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  loadDashboard();
  loadRooms();
  setInterval(loadDashboard, 30000);
  setInterval(loadRooms, 30000);
}

async function loadDashboard() {
  const res = await fetch(API_URL + "?action=dashboard");
  const data = await res.json();

  animateCounter("revenue", data.revenue_today);
  animateCounter("bookings", data.bookings_today);
  animateCounter("available", data.available_rooms);

  renderChart(data.available_rooms, data.occupied_rooms);
}

function animateCounter(id, value) {
  gsap.to("#" + id, {
    innerText: value,
    duration: 1,
    snap: { innerText: 1 }
  });
}

function renderChart(available, occupied) {
  const ctx = document.getElementById("roomChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Available", "Occupied"],
      datasets: [{
        data: [available, occupied],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    }
  });
}

async function loadRooms() {
  const res = await fetch(API_URL + "?action=getRooms");
  const rooms = await res.json();

  const grid = document.getElementById("roomGrid");
  grid.innerHTML = "";

  rooms.forEach(room => {
    const div = document.createElement("div");
    div.className = "room " + room.color;
    div.textContent = room.room_id;

    if (room.status === "OCCUPIED") {
      div.onclick = () => checkout(room.current_booking_id, room.room_id);
    }

    grid.appendChild(div);
  });

  gsap.from(".room", { opacity: 0, y: 30, stagger: 0.05 });
}

async function checkout(bookingId, roomId) {
  if (!confirm("Checkout this room?")) return;

  await fetch(API_URL + "?action=checkout", {
    method: "POST",
    body: JSON.stringify({
      booking_id: bookingId,
      room_id: roomId
    })
  });

  loadDashboard();
  loadRooms();
}

if (token) {
  showDashboard();
}