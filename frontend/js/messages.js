async function loadConversations() {
  const usersList = document.getElementById('users-list');

  try {
    const response = await fetch(
      '../../backend/controllers/GetConversationsController.php',
    );

    const users = await response.json();

    usersList.innerHTML = '';

    // EMPTY STATE
    if (users.length === 0) {
      usersList.innerHTML = `

        <div class="empty-state">

          <h2>
            Aucune conversation
          </h2>

          <p>
            Vos conversations
            apparaîtront ici.
          </p>

        </div>

      `;

      return;
    }

    users.forEach((user) => {
      usersList.innerHTML += `

        <a
          href="chat.html?id=${user.id}"
          class="conversation-card"
        >

          <div class="conversation-info">

            <h2>
              ${user.nom}
              ${user.prenom}
            </h2>

            <p class="last-message">

              ${user.lastMessage || 'Commencer la conversation'}

            </p>

          </div>

          <div class="conversation-meta">

            ${
              user.unreadCount > 0
                ? `

              <span class="unread-badge">
                ${user.unreadCount}
              </span>

              `
                : ''
            }

          </div>

        </a>

      `;
    });
  } catch (error) {
    usersList.innerHTML = `

      <div class="error-state">

        <h2>
          Erreur
        </h2>

        <p>
          Impossible de charger
          les conversations.
        </p>

      </div>

    `;

    console.error(error);
  }
}

loadConversations();
