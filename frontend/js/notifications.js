async function loadUnreadCount() {
  const response = await fetch(
    '../../backend/controllers/GetUnreadCountController.php',
  );

  const data = await response.json();

  const badge = document.getElementById('unread-count');

  if (!badge) return;

  if (data.total > 0) {
    badge.innerText = `(${data.total})`;
  } else {
    badge.innerText = '';
  }
}

loadUnreadCount();

setInterval(loadUnreadCount, 3000);
