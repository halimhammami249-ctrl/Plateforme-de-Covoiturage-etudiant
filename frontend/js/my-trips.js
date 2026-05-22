async function loadMyTrips() {
  // TRAJETS PUBLIÉS
  const createdResponse = await fetch(
    '../../backend/controllers/GetMyTripsController.php',
  );

  const createdTrips = await createdResponse.json();

  const createdContainer = document.getElementById('created-trips');

  createdContainer.innerHTML = '';

  createdTrips.forEach((trip) => {
    createdContainer.innerHTML += `

      <div class="trip-card">

        <h3>
          ${trip.lieuDepart}
          →
          ${trip.destination}
        </h3>

        <p>
          Places restantes:
          ${trip.placesDisponibles}
        </p>

        <p>
          Prix:
          ${trip.prixParPlace} DT
        </p>

        <p>
          Date:
          ${trip.dateHeure}
        </p>

      </div>

    `;
  });

  // TRAJETS REJOINTS
  const joinedResponse = await fetch(
    '../../backend/controllers/GetJoinedTripsController.php',
  );

  const joinedTrips = await joinedResponse.json();

  const joinedContainer = document.getElementById('joined-trips');

  joinedContainer.innerHTML = '';

  joinedTrips.forEach((trip) => {
    joinedContainer.innerHTML += `

      <div class="trip-card">

        <h3>
          ${trip.lieuDepart}
          →
          ${trip.destination}
        </h3>

        <p>
          Conducteur:
          ${trip.nom}
        </p>

        <p>
          Places réservées:
          ${trip.nombrePlaces}
        </p>

        <form
          action="../../backend/controllers/CancelReservationController.php"
          method="POST"
        >

          <input
            type="hidden"
            name="id"
            value="${trip.reservationId}"
          >

          <button type="submit">
            Annuler réservation
          </button>

        </form>

      </div>

    `;
  });
}

loadMyTrips();
