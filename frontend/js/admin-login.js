/**
 * admin-login.js — Connexion administrateur (démo)
 */

const ADMIN_SESSION_KEY = "admin_session";
const DASHBOARD_URL = "admin-dashboard.html";
const DEMO_EMAIL = "admin@covoiturage.tn";
const DEMO_PASSWORD = "admin123";

const saveSession = (data) => {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(data));
};

const goToDashboard = () => {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  const target =
    redirect && redirect.endsWith(".html") ? redirect : DASHBOARD_URL;
  window.location.href = target;
};

const showLoginNotice = (message, type = "info") => {
  let notice = document.getElementById("adminLoginNotice");
  if (!notice) {
    notice = document.createElement("p");
    notice.id = "adminLoginNotice";
    notice.className = "admin-login-notice";
    document.getElementById("adminLoginForm")?.prepend(notice);
  }
  notice.textContent = message;
  notice.className = "admin-login-notice admin-login-notice--" + type;
};

const initLoginPage = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("logout") === "1") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    showLoginNotice("Vous êtes déconnecté.", "success");
    return;
  }

  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return;

  try {
    const session = JSON.parse(raw);
    showLoginNotice(
      "Vous êtes déjà connecté (" + (session.name || "Admin") + ").",
      "info"
    );

    let link = document.getElementById("goDashboardLink");
    if (!link) {
      link = document.createElement("a");
      link.id = "goDashboardLink";
      link.className = "admin-login-dashboard-link";
      link.href = DASHBOARD_URL;
      link.textContent = "→ Aller au dashboard admin";
      document.querySelector(".admin-login-card")?.appendChild(link);
    }
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};

document.getElementById("adminLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    saveSession({
      email,
      name: "Admin Principal",
      role: "administrateur",
      demo: false,
      loginAt: new Date().toISOString(),
    });
    goToDashboard();
    return;
  }

  showLoginNotice("Email ou mot de passe incorrect.", "error");
});

document.getElementById("demoAccessBtn")?.addEventListener("click", () => {
  saveSession({
    email: "demo@admin.tn",
    name: "Admin Démo",
    role: "administrateur",
    demo: true,
  });
  window.location.href = DASHBOARD_URL + "?demo=1";
});

initLoginPage();
