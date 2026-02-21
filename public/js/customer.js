const floors = {
  1: [101,102,103],
  2: [201,202,203],
  3: [301,302,303],
  4: [401,402,403]
};

let selectedRoom = null;

const floorSelect = document.getElementById("floorSelect");
const roomGrid = document.getElementById("roomGrid");
const modal = document.getElementById("bookingModal");
const bookBtn = document.getElementById("bookBtn");

Object.keys(floors).forEach(f => {
  const option = document.createElement("option");
  option.value = f;
  option.textContent = "Floor " + f;
  floorSelect.appendChild(option);
});

floorSelect.value = 1;

floorSelect.addEventListener("change", renderRooms);
bookBtn.addEventListener("click", submitBooking);

async function fetchRooms() {
  const res = await fetch(API_URL + "?action=getRooms");
  return await res.json();
}

async function renderRooms() {
  const floor = floorSelect.value;
  const roomData = await fetchRooms();
  roomGrid.innerHTML = "";

  floors[floor].forEach(roomNumber => {
    const roomInfo = roomData.find(r => r.room_id == roomNumber);
    const div = document.createElement("div");
    div.className = "room " + (roomInfo ? roomInfo.color : "white");
    div.textContent = roomNumber;

    if (roomInfo && roomInfo.status === "AVAILABLE") {
      div.onclick = () => openModal(roomNumber);
    }

    roomGrid.appendChild(div);
  });

  animateRooms();
}

function openModal(room) {
  selectedRoom = room;
  document.getElementById("roomTitle").textContent = "Booking Room " + room;
  modal.style.display = "flex";
  animateModalOpen();
}

async function submitBooking() {
  const data = {
    room_id: selectedRoom,
    name: document.getElementById("name").value,
    mobile: document.getElementById("mobile").value,
    address: document.getElementById("address").value,
    purpose: document.getElementById("purpose").value,
    total_days: parseInt(document.getElementById("days").value)
  };

  const res = await fetch(API_URL + "?action=createBooking", {
    method: "POST",
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.success) {
    alert("Booking Successful!");
    modal.style.display = "none";
    renderRooms();
  } else {
    alert(result.error);
  }
}

renderRooms();
setInterval(renderRooms, 30000);