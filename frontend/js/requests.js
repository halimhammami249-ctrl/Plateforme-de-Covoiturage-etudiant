async function loadRequests() {
  const response = await fetch(
    '../../backend/controllers/GetRequestsController.php',
  );

  const requests = await response.json();

  const container = document.getElementById('requests-container');

  container.innerHTML = '';

  if (requests.length === 0) {
    container.innerHTML = '<p>Aucune demande en attente.</p>';

    return;
  }

  requests.forEach((request) => {
    container.innerHTML += `

            <div class="request-card">

                <h3>
                    ${request.nom}
                    ${request.prenom}
                </h3>

                <p>
                    Trajet:
                    ${request.lieuDepart}
                    →
                    ${request.destination}
                </p>

                <p>
                    Places demandées:
                    ${request.nombrePlaces}
                </p>

                <p>
                    Statut:
                    ${request.statut}
                </p>

                <div class="buttons">

                    <form
                        action="../../backend/controllers/AcceptReservationController.php"
                        method="POST"
                    >

                        <input
                            type="hidden"
                            name="id"
                            value="${request.reservationId}"
                        >

                        <button type="submit">
                            Accepter
                        </button>

                    </form>

                    <form
                        action="../../backend/controllers/RefuseReservationController.php"
                        method="POST"
                    >

                        <input
                            type="hidden"
                            name="id"
                            value="${request.reservationId}"
                        >

                        <button type="submit">
                            Refuser
                        </button>

                    </form>

                </div>

            </div>

        `;
  });
}

loadRequests();
