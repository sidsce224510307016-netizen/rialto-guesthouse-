const API_URL = "https://script.google.com/macros/s/AKfycbxKQleaKdw-0yiFno0yuF-lssFE0KaLQnuSDVfyqAjB99Y-qnabqNPOdAi0n_x_jx_S/exec"; // Replace this!

const floors = {
  1: [101, 102, 103],
  2: [201, 202, 203],
  3: [301, 302, 303],
  4: [401, 402, 403]
};

let selectedRoom = null;
const floorSelect = document.getElementById("floorSelect");
const roomGrid = document.getElementById("roomGrid");
const modal = document.getElementById("bookingModal");
const bookBtn = document.getElementById("bookBtn");

// Initialize Floor Options
Object.keys(floors).forEach(f => {
  const option = document.createElement("option");
  option.value = f;
  option.textContent = "Floor " + f;
  floorSelect.appendChild(option);
});

floorSelect.addEventListener("change", renderRooms);
bookBtn.addEventListener("click", submitBooking);

async function fetchRooms() {
  try {
    const response = await fetch(`${API_URL}?action=getRooms`, {
      method: "GET",
      mode: "cors",
      redirect: "follow"
    });
    return await response.json();
  } catch (err) {
    console.error("CORS or Network Error:", err);
    return [];
  }
}

async function renderRooms() {
  const floor = floorSelect.value;
  const roomData = await fetchRooms();
  roomGrid.innerHTML = "";

  floors[floor].forEach(roomNumber => {
    const roomInfo = roomData.find(r => r.room_id == roomNumber);
    const div = document.createElement("div");
    
    // Apply classes based on status
    div.className = "room " + (roomInfo ? roomInfo.color : "white");
    div.textContent = roomNumber;

    if (!roomInfo || roomInfo.status === "AVAILABLE") {
      div.style.cursor = "pointer";
      div.onclick = () => openModal(roomNumber);
    } else {
      div.style.opacity = "0.6";
      div.style.cursor = "not-allowed";
    }

    roomGrid.appendChild(div);
  });
}

function openModal(room) {
  selectedRoom = room;
  document.getElementById("roomTitle").textContent = "Booking Room " + room;
  modal.style.display = "flex";
}

async function submitBooking() {
  const btn = document.getElementById("bookBtn");
  btn.disabled = true;
  btn.textContent = "Processing...";

  const data = {
    room_id: selectedRoom,
    name: document.getElementById("name").value,
    mobile: document.getElementById("mobile").value,
    total_days: parseInt(document.getElementById("days").value)
  };

  try {
    const res = await fetch(`${API_URL}?action=createBooking`, {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.success) {
      alert("Success!");
      modal.style.display = "none";
      renderRooms();
    } else {
      alert("Error: " + result.error);
    }
  } catch (err) {
    alert("Submission failed. Check console.");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Book Now";
  }
}

// Initial Load
renderRooms();