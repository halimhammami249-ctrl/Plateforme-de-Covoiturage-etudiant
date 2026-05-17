async function checkAuth() {
  const response = await fetch(
    '../../backend/controllers/CheckAuthController.php',
  );

  const data = await response.json();

  if (!data.connected) {
    window.location.href = 'login.html';
  }
}

checkAuth();
