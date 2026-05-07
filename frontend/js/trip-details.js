const trips = JSON.parse(localStorage.getItem('trips')) || [];

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));

const trip = trips.find((t) => t.id === id);

const container = document.getElementById('trip-content');

if (!trip) {
  container.innerHTML = '<p>❌ Trajet introuvable</p>';
} else {
  const isFull = trip.seats <= 0;

  container.innerHTML = `
    <div class="trip-card">

      <h2>🚗 ${trip.from} → ${trip.to}</h2>

      <div class="trip-info">
        <p>👤 <span>Conducteur:</span> ${trip.driver}</p>
        <p>🪑 <span>Places:</span> ${isFull ? 'COMPLET ❌' : trip.seats}</p>
        <p>📍 <span>Départ:</span> ${trip.from}</p>
        <p>📍 <span>Destination:</span> ${trip.to}</p>
      </div>

      <button 
        class="join-btn"
        ${isFull ? 'disabled' : ''}
        onclick="alert('Join sera connecté plus tard')"
      >
        ${isFull ? 'Trajet complet' : 'Rejoindre le trajet'}
      </button>

    </div>
  `;
}
