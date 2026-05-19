const params = new URLSearchParams(window.location.search);

const recepteurId = params.get('id');

const chatBox = document.getElementById('chat-box');

async function checkChatAccess() {
  const response = await fetch(
    `../../backend/controllers/CanChatController.php?user_id=${recepteurId}`,
  );

  const data = await response.json();

  if (!data.allowed) {
    alert('Chat non autorisé.');

    window.location.href = 'messages.html';
  }
}

checkChatAccess();

async function loadMessages() {
  const response = await fetch(
    `../../backend/controllers/GetMessagesController.php?recepteur_id=${recepteurId}`,
  );

  const data = await response.json();

  const currentUser = data.currentUser;

  const messages = data.messages;

  chatBox.innerHTML = '';

  messages.forEach((message) => {
    const isMine = message.expediteur_id == currentUser;

    chatBox.innerHTML += `

            <div class="
                message
                ${isMine ? 'mine' : 'other'}
            ">

                <p>
                    ${message.contenu}
                </p>

                <small>
                    ${message.dateEnvoi}
                </small>

            </div>

        `;
  });

  // AUTO SCROLL
  chatBox.scrollTop = chatBox.scrollHeight;
}

document
  .getElementById('message-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = document.getElementById('message-input');

    const contenu = input.value;

    await fetch('../../backend/controllers/SendMessageController.php', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: `recepteur_id=${recepteurId}&contenu=${encodeURIComponent(contenu)}`,
    });

    input.value = '';

    loadMessages();
  });

loadMessages();

setInterval(loadMessages, 2000);
