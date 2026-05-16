/**
 * admin-dashboard.js — Dashboard administrateur
 * Données démo (localStorage) — prêt pour branchement API PHP
 */

const ADMIN_STORAGE = {
  users: "admin_users",
  trips: "admin_trips",
  reports: "admin_signalements",
  session: "admin_session",
};

const SECTION_META = {
  overview: {
    title: "Vue d'ensemble",
    desc: "Statistiques et activité de la plateforme",
  },
  users: {
    title: "Utilisateurs",
    desc: "Supprimer et gérer les comptes étudiants",
  },
  trips: {
    title: "Trajets",
    desc: "Supprimer et modérer les trajets publiés",
  },
  reports: {
    title: "Signalements",
    desc: "Traiter, rejeter ou supprimer les signalements",
  },
};

/* ——— Données initiales ——— */
const seedUsers = () => [
  {
    id: 1,
    nom: "Ben Ali",
    prenom: "Ahmed",
    email: "ahmed@univ.tn",
    telephone: "22123456",
    dateInscription: "2025-09-12",
  },
  {
    id: 2,
    nom: "Trabelsi",
    prenom: "Sami",
    email: "sami@univ.tn",
    telephone: "55887766",
    dateInscription: "2025-10-03",
  },
  {
    id: 3,
    nom: "Mansour",
    prenom: "Leila",
    email: "leila@univ.tn",
    telephone: "99887744",
    dateInscription: "2026-01-15",
  },
  {
    id: 4,
    nom: "Gharbi",
    prenom: "Karim",
    email: "karim@univ.tn",
    telephone: "22334455",
    dateInscription: "2026-02-20",
  },
];

const seedTrips = () => [
  {
    id: 1,
    idUtilisateur: 1,
    conducteur: "Ahmed Ben Ali",
    lieuDepart: "Tunis",
    destination: "Ariana",
    dateHeure: "2026-05-18",
    prixParPlace: 5,
    nombrePlaces: 3,
    placesDisponibles: 2,
    statut: "actif",
  },
  {
    id: 2,
    idUtilisateur: 2,
    conducteur: "Sami Trabelsi",
    lieuDepart: "Sfax",
    destination: "Tunis",
    dateHeure: "2026-05-20",
    prixParPlace: 12,
    nombrePlaces: 4,
    placesDisponibles: 0,
    statut: "complet",
  },
  {
    id: 3,
    idUtilisateur: 3,
    conducteur: "Leila Mansour",
    lieuDepart: "Manouba",
    destination: "ESPRIT",
    dateHeure: "2026-05-22",
    prixParPlace: 4,
    nombrePlaces: 2,
    placesDisponibles: 1,
    statut: "actif",
  },
];

const seedReports = () => [
  {
    id: 1,
    idUtilisateur: 2,
    utilisateur: "Sami Trabelsi",
    motif: "Comportement inapproprié",
    description: "Conducteur en retard de 40 minutes sans prévenir.",
    dateSignalement: "2026-05-14",
    statut: "en_attente",
  },
  {
    id: 2,
    idUtilisateur: 4,
    utilisateur: "Karim Gharbi",
    motif: "Annulation abusive",
    description: "Trajet annulé 10 min avant le départ.",
    dateSignalement: "2026-05-15",
    statut: "en_attente",
  },
  {
    id: 3,
    idUtilisateur: 1,
    utilisateur: "Ahmed Ben Ali",
    motif: "Faux profil",
    description: "Photo de profil ne correspond pas.",
    dateSignalement: "2026-05-10",
    statut: "traite",
  },
];

/* ——— Storage ——— */
const load = (key, seedFn) => {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  const data = seedFn();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

let users = [];
let trips = [];
let reports = [];

let pendingConfirm = null;

/* ——— Auth ——— */
const DASHBOARD_URL = "admin-dashboard.html";

const ensureAdminSession = () => {
  const params = new URLSearchParams(window.location.search);
  const raw = localStorage.getItem(ADMIN_STORAGE.session);

  if (raw) {
    try {
      const session = JSON.parse(raw);
      return { ok: true, session, demo: !!session.demo };
    } catch {
      localStorage.removeItem(ADMIN_STORAGE.session);
    }
  }

  if (params.get("demo") === "1") {
    const demoSession = {
      email: "demo@admin.tn",
      name: "Admin Démo",
      role: "administrateur",
      demo: true,
    };
    localStorage.setItem(ADMIN_STORAGE.session, JSON.stringify(demoSession));
    return { ok: true, session: demoSession, demo: true };
  }

  const page = window.location.pathname.split("/").pop() || DASHBOARD_URL;
  window.location.href =
    "admin-login.html?redirect=" + encodeURIComponent(page);
  return { ok: false };
};

const showDemoBanner = () => {
  if (document.getElementById("adminDemoBanner")) return;

  const banner = document.createElement("div");
  banner.id = "adminDemoBanner";
  banner.className = "admin-demo-banner";
  banner.innerHTML = `
    <span>Mode démo — connectez-vous pour un accès administrateur complet</span>
    <a href="admin-login.html?logout=1">Page de connexion admin</a>
  `;
  document.querySelector(".admin-main")?.prepend(banner);
};

/* ——— UI helpers ——— */
const $ = (sel) => document.querySelector(sel);

const showToast = (message, type = "success") => {
  const toast = $("#adminToast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = "admin-toast is-visible admin-toast--" + type;
  setTimeout(() => toast.classList.remove("is-visible"), 3200);
};

const openConfirm = (title, message, onOk) => {
  $("#confirmTitle").textContent = title;
  $("#confirmMessage").textContent = message;
  pendingConfirm = onOk;
  $("#confirmModal").classList.add("is-open");
};

const closeConfirm = () => {
  pendingConfirm = null;
  $("#confirmModal").classList.remove("is-open");
};

const statusBadge = (statut) => {
  const map = {
    en_attente: ["admin-badge--pending", "En attente"],
    traite: ["admin-badge--resolved", "Traité"],
    rejete: ["admin-badge--rejected", "Rejeté"],
    actif: ["admin-badge--active", "Actif"],
    complet: ["admin-badge--pending", "Complet"],
    annule: ["admin-badge--rejected", "Annulé"],
  };
  const [cls, label] = map[statut] || ["admin-badge--ghost", statut];
  return `<span class="admin-badge ${cls}">${label}</span>`;
};

/* ——— Stats & chart ——— */
const renderStats = () => {
  const pending = reports.filter((r) => r.statut === "en_attente").length;
  const reservations = trips.reduce(
    (acc, t) => acc + (t.nombrePlaces - t.placesDisponibles),
    0
  );

  $("#statUsers").textContent = users.length;
  $("#statTrips").textContent = trips.filter((t) => t.statut === "actif").length;
  $("#statReports").textContent = pending;
  $("#statReservations").textContent = reservations;

  const badge = $("#reportsBadge");
  if (badge) badge.textContent = pending;
};

const renderChart = () => {
  const chart = $("#activityChart");
  if (!chart) return;

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const values = [12, 19, 15, 28, 22, 35, 18];
  const max = Math.max(...values);

  chart.innerHTML = days
    .map((label, i) => {
      const h = Math.round((values[i] / max) * 100);
      return `
        <div class="admin-bar-wrap">
          <div class="admin-bar" style="height:${h}%"></div>
          <span class="admin-bar-label">${label}</span>
        </div>`;
    })
    .join("");
};

/* ——— Tables ——— */
const renderRecentReports = () => {
  const tbody = $("#recentReportsBody");
  const recent = [...reports]
    .sort((a, b) => new Date(b.dateSignalement) - new Date(a.dateSignalement))
    .slice(0, 5);

  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty">Aucun signalement</td></tr>`;
    return;
  }

  tbody.innerHTML = recent
    .map(
      (r) => `
    <tr>
      <td>#${r.id}</td>
      <td>${r.utilisateur}</td>
      <td>${r.motif}</td>
      <td>${r.dateSignalement}</td>
      <td>${statusBadge(r.statut)}</td>
    </tr>`
    )
    .join("");
};

const renderUsers = (filter = "") => {
  const q = filter.toLowerCase();
  const list = users.filter(
    (u) =>
      !q ||
      u.nom.toLowerCase().includes(q) ||
      u.prenom.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  );

  const tbody = $("#usersTableBody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="admin-empty">Aucun utilisateur</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map(
      (u) => `
    <tr>
      <td>#${u.id}</td>
      <td>${u.prenom} ${u.nom}</td>
      <td>${u.email}</td>
      <td>${u.telephone || "—"}</td>
      <td>${u.dateInscription}</td>
      <td>
        <div class="admin-actions">
          <button type="button" class="admin-btn admin-btn--danger" data-delete-user="${u.id}">
            Supprimer
          </button>
        </div>
      </td>
    </tr>`
    )
    .join("");
};

const renderTrips = (filter = "") => {
  const q = filter.toLowerCase();
  const list = trips.filter(
    (t) =>
      !q ||
      t.lieuDepart.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.conducteur.toLowerCase().includes(q)
  );

  const tbody = $("#tripsTableBody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="admin-empty">Aucun trajet</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map(
      (t) => `
    <tr>
      <td>#${t.id}</td>
      <td><strong>${t.lieuDepart} → ${t.destination}</strong></td>
      <td>${t.conducteur}</td>
      <td>${t.placesDisponibles}/${t.nombrePlaces}</td>
      <td>${t.prixParPlace} DT</td>
      <td>${statusBadge(t.statut)}</td>
      <td>
        <div class="admin-actions">
          <button type="button" class="admin-btn admin-btn--danger" data-delete-trip="${t.id}">
            Supprimer
          </button>
        </div>
      </td>
    </tr>`
    )
    .join("");
};

const renderReports = (filter = "") => {
  const q = filter.toLowerCase();
  const list = reports.filter(
    (r) =>
      !q ||
      r.motif.toLowerCase().includes(q) ||
      r.utilisateur.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
  );

  const tbody = $("#reportsTableBody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="admin-empty">Aucun signalement</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map((r) => {
      const actions =
        r.statut === "en_attente"
          ? `
          <button type="button" class="admin-btn admin-btn--success" data-resolve-report="${r.id}">Traiter</button>
          <button type="button" class="admin-btn admin-btn--ghost" data-reject-report="${r.id}">Rejeter</button>
          <button type="button" class="admin-btn admin-btn--danger" data-delete-report="${r.id}">Supprimer</button>`
          : `<button type="button" class="admin-btn admin-btn--danger" data-delete-report="${r.id}">Supprimer</button>`;

      return `
    <tr>
      <td>#${r.id}</td>
      <td>${r.utilisateur}</td>
      <td>${r.motif}</td>
      <td>${r.description.slice(0, 60)}${r.description.length > 60 ? "…" : ""}</td>
      <td>${r.dateSignalement}</td>
      <td>${statusBadge(r.statut)}</td>
      <td><div class="admin-actions">${actions}</div></td>
    </tr>`;
    })
    .join("");
};

const refreshAll = () => {
  renderStats();
  renderChart();
  renderRecentReports();
  renderUsers($("#searchUsers")?.value || "");
  renderTrips($("#searchTrips")?.value || "");
  renderReports($("#searchReports")?.value || "");
};

/* ——— Actions CRUD ——— */
const deleteUser = (id) => {
  users = users.filter((u) => u.id !== id);
  trips = trips.filter((t) => t.idUtilisateur !== id);
  save(ADMIN_STORAGE.users, users);
  save(ADMIN_STORAGE.trips, trips);
  showToast("Utilisateur supprimé");
  refreshAll();
};

const deleteTrip = (id) => {
  trips = trips.filter((t) => t.id !== id);
  save(ADMIN_STORAGE.trips, trips);
  showToast("Trajet supprimé");
  refreshAll();
};

const updateReportStatus = (id, statut) => {
  reports = reports.map((r) => (r.id === id ? { ...r, statut } : r));
  save(ADMIN_STORAGE.reports, reports);
  showToast(
    statut === "traite" ? "Signalement traité" : "Signalement rejeté",
    "success"
  );
  refreshAll();
};

const deleteReport = (id) => {
  reports = reports.filter((r) => r.id !== id);
  save(ADMIN_STORAGE.reports, reports);
  showToast("Signalement supprimé");
  refreshAll();
};

/* ——— Navigation ——— */
const switchSection = (section) => {
  document.querySelectorAll(".admin-nav-item").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.section === section);
  });

  document.querySelectorAll(".admin-section").forEach((el) => {
    el.classList.toggle("is-visible", el.dataset.section === section);
  });

  const meta = SECTION_META[section];
  if (meta) {
    $("#adminPageTitle").textContent = meta.title;
    $("#adminPageDesc").textContent = meta.desc;
  }

  document.getElementById("adminSidebar")?.classList.remove("is-open");
};

/* ——— Sidebar load ——— */
const loadSidebar = () =>
  fetch("../components/admin-sidebar.html")
    .then((res) => res.text())
    .then((html) => {
      const host = $("#adminSidebarHost");
      host.insertAdjacentHTML("beforebegin", html);
      host.remove();
      bindSidebarEvents();
    });

const bindSidebarEvents = () => {
  document.querySelectorAll(".admin-nav-item").forEach((btn) => {
    btn.addEventListener("click", () => switchSection(btn.dataset.section));
  });

  $("#adminLogout")?.addEventListener("click", () => {
    localStorage.removeItem(ADMIN_STORAGE.session);
    window.location.href = "admin-login.html?logout=1";
  });
};

/* ——— Event delegation ——— */
const bindEvents = () => {
  $("#confirmCancel")?.addEventListener("click", closeConfirm);
  $("#confirmOk")?.addEventListener("click", () => {
    if (pendingConfirm) pendingConfirm();
    closeConfirm();
  });

  $("#confirmModal")?.addEventListener("click", (e) => {
    if (e.target.id === "confirmModal") closeConfirm();
  });

  $("#searchUsers")?.addEventListener("input", (e) => renderUsers(e.target.value));
  $("#searchTrips")?.addEventListener("input", (e) => renderTrips(e.target.value));
  $("#searchReports")?.addEventListener("input", (e) => renderReports(e.target.value));

  $("#adminMenuToggle")?.addEventListener("click", () => {
    document.getElementById("adminSidebar")?.classList.toggle("is-open");
  });

  document.body.addEventListener("click", (e) => {
    const t = e.target.closest("[data-delete-user]");
    if (t) {
      const id = Number(t.dataset.deleteUser);
      openConfirm(
        "Supprimer l'utilisateur",
        "Cette action supprimera aussi ses trajets associés.",
        () => deleteUser(id)
      );
      return;
    }

    const tripBtn = e.target.closest("[data-delete-trip]");
    if (tripBtn) {
      const id = Number(tripBtn.dataset.deleteTrip);
      openConfirm("Supprimer le trajet", "Ce trajet sera définitivement supprimé.", () =>
        deleteTrip(id)
      );
      return;
    }

    const resolveBtn = e.target.closest("[data-resolve-report]");
    if (resolveBtn) {
      updateReportStatus(Number(resolveBtn.dataset.resolveReport), "traite");
      return;
    }

    const rejectBtn = e.target.closest("[data-reject-report]");
    if (rejectBtn) {
      updateReportStatus(Number(rejectBtn.dataset.rejectReport), "rejete");
      return;
    }

    const delReportBtn = e.target.closest("[data-delete-report]");
    if (delReportBtn) {
      const id = Number(delReportBtn.dataset.deleteReport);
      openConfirm("Supprimer le signalement", "Cette action est irréversible.", () =>
        deleteReport(id)
      );
    }
  });
};

/* ——— Init ——— */
const init = () => {
  const auth = ensureAdminSession();
  if (!auth.ok) return;

  if (auth.demo) showDemoBanner();

  users = load(ADMIN_STORAGE.users, seedUsers);
  trips = load(ADMIN_STORAGE.trips, seedTrips);
  reports = load(ADMIN_STORAGE.reports, seedReports);

  const session = auth.session || {};
  if (session.name) {
    const initials = session.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const av = $("#adminAvatar");
    if (av) av.textContent = initials;
  }

  bindEvents();
  loadSidebar().then(refreshAll);
};

document.addEventListener("DOMContentLoaded", init);
