// Load Navbar
fetch('../components/navbar.html')
  .then((res) => res.text())
  .then((data) => {
    document.getElementById('navbar').innerHTML = data;
  });

// Load Footer
fetch('../components/footer.html')
  .then((res) => res.text())
  .then((data) => {
    document.getElementById('footer').innerHTML = data;
  });


  confirmEmailInput = document.querySelector('input[name="confirmEmail"]');
  if (confirmEmailInput) {
    confirmEmailInput.addEventListener('input', function() {
      const emailInput = document.querySelector('input[name="email"]');
      if (emailInput.value !== this.value) {
        this.setCustomValidity("Les emails ne correspondent pas.");
      } else {
        this.setCustomValidity("");
      }
    });
  }