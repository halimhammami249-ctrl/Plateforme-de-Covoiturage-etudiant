const trips = [
  { from: 'Tunis', to: 'Ariana', driver: 'Ahmed', seats: 3 },
  { from: 'Sfax', to: 'Tunis', driver: 'Ali', seats: 2 },
  { from: 'Bizerte', to: 'Manouba', driver: 'Sara', seats: 4 },
];

// show all by default
window.onload = () => {
  displayTrips(trips);
};

function searchTrips() {
  const from = document.getElementById('from').value.toLowerCase();
  const to = document.getElementById('to').value.toLowerCase();

  const filtered = trips.filter(
    (t) =>
      t.from.toLowerCase().includes(from) && t.to.toLowerCase().includes(to),
  );

  displayTrips(filtered);
}

function displayTrips(list) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p>Aucun trajet trouvé</p>';
    return;
  }

  list.forEach((trip) => {
    const div = document.createElement('div');
    div.className = 'trip-card';

    div.innerHTML = `
      <h3>🚗 ${trip.from} → ${trip.to}</h3>
      <p>👤 Conducteur: ${trip.driver}</p>
      <p>🪑 Places: ${trip.seats}</p>
      <button onclick="joinTrip()">Rejoindre</button>
    `;

    container.appendChild(div);
  });
}

function joinTrip() {
  alert('Tu as rejoint le trajet 🚗');
}
