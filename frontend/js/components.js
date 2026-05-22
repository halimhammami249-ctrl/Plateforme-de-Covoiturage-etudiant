fetch('../components/navbar.html?v=' + Date.now())
  .then((res) => res.text())
  .then((data) => {
    document.getElementById('navbar').innerHTML = data;

    // LOAD NOTIFICATIONS
    const script = document.createElement('script');
    script.src = '../js/notifications.js?v=' + Date.now();
    document.body.appendChild(script);

    // ✅ ADD LOGOUT HERE (IMPORTANT FIX)
    const logoutBtn = document.getElementById('logout');

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        try {
          const response = await fetch(
            '../../backend/controllers/LogoutController.php',
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
    }
  });
