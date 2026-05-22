const params = new URLSearchParams(window.location.search);

const tripId = params.get('id');

async function loadTripDetails() {
  const response = await fetch(
    `../../backend/controllers/GetTripController.php?id=${tripId}`,
  );

  const trip = await response.json();

  const container = document.getElementById('trip-content');

  container.innerHTML = `

        <div class="trip-card">

            <h2>
                ${trip.lieuDepart}
                →
                ${trip.destination}
            </h2>

            <p>
                Conducteur:
                ${trip.nom}
            </p>

            <p>
                Date:
                ${trip.dateHeure}
            </p>

            <p>
                Prix:
                ${trip.prixParPlace} DT
            </p>

            <p>
                Places disponibles:
                ${trip.placesDisponibles}
            </p>

            <form
                action="../../backend/controllers/ReservationController.php"
                method="POST"
            >

                <input
                    type="hidden"
                    name="idTrajet"
                    value="${trip.id}"
                >

                <input
                    type="number"
                    name="nombrePlaces"
                    min="1"
                    max="${trip.placesDisponibles}"
                    placeholder="Nombre de places"
                    required
                >

                <button type="submit">
                    Réserver
                </button>

            </form>

        </div>

    `;
}

loadTripDetails();
