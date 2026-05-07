const user = JSON.parse(localStorage.getItem('user')) || {
  name: 'Étudiant',
  email: 'student@mail.com',
};

// display user
document.getElementById('name').innerText = user.name;
document.getElementById('email').innerText = user.email;

// update UI only (no backend yet)
function updateProfile() {
  const newName = document.getElementById('newName').value;
  const newEmail = document.getElementById('newEmail').value;

  if (newName) user.name = newName;
  if (newEmail) user.email = newEmail;

  // save locally for now
  localStorage.setItem('user', JSON.stringify(user));

  // update UI
  document.getElementById('name').innerText = user.name;
  document.getElementById('email').innerText = user.email;

  alert('Profil mis à jour (frontend only)');
}
