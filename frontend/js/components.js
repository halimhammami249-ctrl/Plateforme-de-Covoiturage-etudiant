// Load Navbar
fetch('../components/navbar.html?v=' + Date.now())
  .then((res) => res.text())
  .then((data) => {
    document.getElementById('navbar').innerHTML = data;

    // LOAD NOTIFICATIONS AFTER NAVBAR EXISTS
    const script = document.createElement('script');

    script.src = '../js/notifications.js?v=' + Date.now();

    document.body.appendChild(script);
  });

// Load Footer
fetch('../components/footer.html?v=' + Date.now())
  .then((res) => res.text())
  .then((data) => {
    document.getElementById('footer').innerHTML = data;
  });

confirmEmailInput = document.querySelector('input[name="confirmEmail"]');

if (confirmEmailInput) {
  confirmEmailInput.addEventListener('input', function () {
    const emailInput = document.querySelector('input[name="email"]');

    if (emailInput.value !== this.value) {
      this.setCustomValidity('Les emails ne correspondent pas.');
    } else {
      this.setCustomValidity('');
    }
  });
}
