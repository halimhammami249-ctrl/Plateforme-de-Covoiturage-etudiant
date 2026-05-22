window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);

  const recepteurId = params.get('id');

  const chatBox = document.getElementById('chat-box');

  const typingIndicator = document.getElementById('typing-indicator');

  // CHECK ACCESS
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

  // LOAD MESSAGES
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

  // SEND MESSAGE
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

  // TYPING DETECTION
  let typingTimeout;

  document
    .getElementById('message-input')
    .addEventListener('input', async () => {
      console.log('typing...');

      clearTimeout(typingTimeout);

      // USER IS TYPING
      await fetch('../../backend/controllers/TypingController.php', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },

        body: 'typing=1',
      });

      // STOP TYPING AFTER 1 SECOND
      typingTimeout = setTimeout(async () => {
        await fetch('../../backend/controllers/TypingController.php', {
          method: 'POST',

          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },

          body: 'typing=0',
        });
      }, 1000);
    });

  // LOAD TYPING STATUS
  async function loadTypingStatus() {
    const response = await fetch(
      `../../backend/controllers/GetTypingController.php?user_id=${recepteurId}`,
    );

    const data = await response.json();

    console.log('Typing status:', data);

    const indicator = document.getElementById('typing-indicator');

    if (!indicator) {
      console.log('Indicator not found');

      return;
    }

    if (parseInt(data.isTyping) === 1) {
      console.log('SHOWING TYPING');

      indicator.innerHTML = 'Écrit...';

      indicator.style.display = 'block';

      indicator.style.color = 'red';

      indicator.style.fontSize = '20px';
    } else {
      console.log('HIDING TYPING');

      indicator.innerHTML = '';
    }
  }
  // INITIAL LOAD
  loadMessages();

  // AUTO REFRESH
  setInterval(loadMessages, 2000);

  setInterval(loadTypingStatus, 1000);
});
