document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('logout');

  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    try {
      const response = await fetch(
        '../backend/controllers/LogoutController.php',
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      const result = await response.text();

      if (result === 'OK') {
        window.location.href = 'login.html';
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error logging out');
    }
  });
});
