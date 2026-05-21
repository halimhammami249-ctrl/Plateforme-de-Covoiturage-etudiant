async function loadRequests() {
  const container = document.getElementById('requests-container');

  try {
    const response = await fetch(
      '../../backend/controllers/GetRequestsController.php',
    );

    const requests = await response.json();

    container.innerHTML = '';

    // EMPTY STATE
    if (requests.length === 0) {
      container.innerHTML = `

        <div class="empty-state">

          <h2>
            Aucune demande
          </h2>

          <p>
            Vous n'avez reçu
            aucune demande
            pour le moment.
          </p>

        </div>

      `;

      return;
    }

    requests.forEach((request) => {
      let statusClass = '';

      if (request.statut === 'Acceptée') {
        statusClass = 'accepted';
      } else if (request.statut === 'Refusée') {
        statusClass = 'refused';
      } else {
        statusClass = 'pending';
      }

      container.innerHTML += `

        <div class="request-card">

          <div class="request-header">

            <h2>
              ${request.nom}
              ${request.prenom}
            </h2>

            <span class="
              status
              ${statusClass}
            ">
              ${request.statut}
            </span>

          </div>

          <div class="request-body">

            <p>
              <strong>Trajet :</strong>
              ${request.lieuDepart}
              →
              ${request.destination}
            </p>

            <p>
              <strong>Places :</strong>
              ${request.nombrePlaces}
            </p>

            <p>
              <strong>Date :</strong>
              ${request.dateReservation}
            </p>

          </div>

          ${
            request.statut === 'En attente'
              ? `

            <div class="request-actions">

              <form
                action="../../backend/controllers/AcceptReservationController.php"
                method="POST"
              >

                <input
                  type="hidden"
                  name="id"
                  value="${request.id}"
                />

                <button
                  class="accept-btn"
                  type="submit"
                >
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
                  value="${request.id}"
                />

                <button
                  class="refuse-btn"
                  type="submit"
                >
                  Refuser
                </button>

              </form>

            </div>

            `
              : ''
          }

        </div>

      `;
    });
  } catch (error) {
    container.innerHTML = `

      <div class="error-state">

        <h2>
          Erreur
        </h2>

        <p>
          Impossible de charger
          les demandes.
        </p>

      </div>

    `;

    console.error(error);
  }
}

loadRequests();
