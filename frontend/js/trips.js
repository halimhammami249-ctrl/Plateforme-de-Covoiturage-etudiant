async function searchTrips() {
  const from = document.getElementById('from').value;

  const to = document.getElementById('to').value;

  const response = await fetch(
    `../../backend/controllers/SearchTrajetsController.php?depart=${from}&destination=${to}`,
  );

  const trips = await response.json();

  const results = document.getElementById('results');

  results.innerHTML = '';

  trips.forEach((trip) => {
    results.innerHTML += `

            <div class="trip-card">

                <h3>
                    ${trip.lieuDepart}
                    →
                    ${trip.destination}
                </h3>

                <p>
                    Prix:
                    ${trip.prixParPlace} DT
                </p>

                <p>
                    Places:
                    ${trip.placesDisponibles}
                </p>

                <a href="trip-details.html?id=${trip.id}">
                    Voir détails
                </a>

            </div>

        `;
  });
}
