let trips = JSON.parse(localStorage.getItem('trips')) || [
  { id: 1, from: 'Tunis', to: 'Ariana', driver: 'Ahmed', seats: 3 },
  { id: 2, from: 'Sfax', to: 'Tunis', driver: 'Ali', seats: 2 },
];

// SAVE TO STORAGE
function saveTrips() {
  localStorage.setItem('trips', JSON.stringify(trips));
}

/* =========================
   DISPLAY TRIPS
========================= */
function displayTrips(list) {
  const container = document.getElementById('results');
  if (!container) return;

  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p>Aucun trajet trouvé</p>';
    return;
  }

  list.forEach((trip) => {
    const isFull = trip.seats <= 0;

    const div = document.createElement('div');
    div.className = 'trip-card';

    div.innerHTML = `
      <h3>🚗 ${trip.from} → ${trip.to}</h3>
      <p>👤 Conducteur: ${trip.driver}</p>
      <p>🪑 Places: ${isFull ? 'COMPLET ❌' : trip.seats}</p>

      <div class="actions">
        <a href="trip-details.html?id=${trip.id}">
          Voir détails
        </a>

        <button 
          onclick="joinTrip(${trip.id})"
          ${isFull ? 'disabled' : ''}
        >
          ${isFull ? 'Complet' : 'Rejoindre'}
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

/* =========================
   SEARCH
========================= */
function searchTrips() {
  const from = document.getElementById('from').value.toLowerCase();
  const to = document.getElementById('to').value.toLowerCase();

  const filtered = trips.filter(
    (t) =>
      t.from.toLowerCase().includes(from) && t.to.toLowerCase().includes(to),
  );

  displayTrips(filtered);
}

/* =========================
   JOIN TRIP
========================= */
function joinTrip(id) {
  const trip = trips.find((t) => t.id === id);
  if (!trip) return;

  if (trip.seats > 0) {
    trip.seats -= 1;

    saveTrips();

    alert('Tu as rejoint le trajet 🚗');

    displayTrips(trips);
  } else {
    alert('Trajet complet ❌');
  }
}

/* =========================
   PUBLISH TRIP
========================= */
const form = document.getElementById('tripForm');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const seats = parseInt(document.getElementById('seats').value);

    const newTrip = {
      id: Date.now(),
      from,
      to,
      driver: 'You',
      seats,
    };

    trips.push(newTrip);
    saveTrips();

    document.getElementById('msg').innerText = 'Trajet publié avec succès ✅';

    form.reset();
  });
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
  displayTrips(trips);
});
