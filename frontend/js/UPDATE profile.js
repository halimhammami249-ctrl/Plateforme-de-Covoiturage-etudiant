async function loadProfile() {
  const response = await fetch(
    '../../backend/controllers/GetProfileController.php',
  );

  const data = await response.json();

  if (!data.success) {
    alert('Utilisateur non connecté');

    window.location.href = 'login.html';

    return;
  }

  const user = data.user;

  // HEADER
  document.getElementById('name').innerText = `${user.nom} ${user.prenom}`;

  document.getElementById('email').innerText = user.email;

  // INFO
  document.getElementById('nom-info').innerText = user.nom;

  document.getElementById('prenom-info').innerText = user.prenom;

  document.getElementById('telephone-info').innerText = user.telephone || '-';

  document.getElementById('email-info').innerText = user.email;

  // AVATAR LETTER
  document.getElementById('avatar-letter').innerText = user.nom
    .charAt(0)
    .toUpperCase();

  // PREFILL FORM
  document.getElementById('newName').value = user.nom;

  document.getElementById('newPrenom').value = user.prenom;

  document.getElementById('newEmail').value = user.email;

  document.getElementById('newPhone').value = user.telephone || '';
}

document
  .getElementById('profile-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('nom', document.getElementById('newName').value);

    formData.append('prenom', document.getElementById('newPrenom').value);

    formData.append('email', document.getElementById('newEmail').value);

    formData.append('telephone', document.getElementById('newPhone').value);

    const response = await fetch(
      '../../backend/controllers/UpdateProfileController.php',
      {
        method: 'POST',
        body: formData,
      },
    );

    const result = await response.text();

    document.body.innerHTML += result;
  });

loadProfile();
