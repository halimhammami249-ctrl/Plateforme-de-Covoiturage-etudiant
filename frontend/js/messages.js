async function loadUsers() {
  const response = await fetch(
    '../../backend/controllers/GetUsersController.php',
  );

  const users = await response.json();

  const container = document.getElementById('users-list');

  container.innerHTML = '';

  users.forEach((user) => {
    container.innerHTML += `

            <a
                href="chat.html?id=${user.id}"
                class="user-card"
            >

                <h3>
                    ${user.nom}
                    ${user.prenom}
                </h3>

                <p>
                    ${user.email}
                </p>

            </a>

        `;
  });
}

loadUsers();
