/**
 * admin-dashboard.js — Dashboard administrateur
 * Utilise uniquement les données backend via AdminController.php
 */

const ADMIN_STORAGE = {
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
let users = [];
let trips = [];
let reports = [];

let pendingConfirm = null;

/* ——— Auth ——— */
const DASHBOARD_URL = "admin-dashboard.html";
const API_BASE = "../../backend/controllers/AdminController.php";

const ensureAdminSession = () => {
  const raw = localStorage.getItem(ADMIN_STORAGE.session);

  if (raw) {
    try {
      const session = JSON.parse(raw);
      return { ok: true, session };
    } catch {
      localStorage.removeItem(ADMIN_STORAGE.session);
    }
  }

  const page = window.location.pathname.split("/").pop() || DASHBOARD_URL;
  window.location.href =
    "admin-login.html?redirect=" + encodeURIComponent(page);
  return { ok: false };
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
let deleteUser = (id) => {
  users = users.filter((u) => u.id !== id);
  trips = trips.filter((t) => t.idUtilisateur !== id);
  showToast("Utilisateur supprimé");
  refreshAll();
};

let deleteTrip = (id) => {
  trips = trips.filter((t) => t.id !== id);
  showToast("Trajet supprimé");
  refreshAll();
};

let updateReportStatus = (id, statut) => {
  reports = reports.map((r) => (r.id === id ? { ...r, statut } : r));
  showToast(
    statut === "traite" ? "Signalement traité" : "Signalement rejeté",
    "success"
  );
  refreshAll();
};

let deleteReport = (id) => {
  reports = reports.filter((r) => r.id !== id);
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

  const apiGet = (action) =>
    fetch(`${API_BASE}?action=${encodeURIComponent(action)}`, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    }).then((r) => r.json());

  const apiPost = (action, data) => {
    const body = new URLSearchParams({ action, ...data });
    return fetch(API_BASE, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: body.toString(),
    }).then((r) => r.json());
  };

  Promise.all([apiGet("stats"), apiGet("users"), apiGet("trips"), apiGet("reports")])
    .then(([statsRes, usersRes, tripsRes, reportsRes]) => {
      if (statsRes && statsRes.success && statsRes.data) {
        const s = statsRes.data;
        $("#statUsers").textContent = s.utilisateurs ?? 0;
        $("#statTrips").textContent = s.trajets ?? 0;
        $("#statReports").textContent = s.signalements_en_attente ?? 0;
        $("#statReservations").textContent = s.reservations ?? 0;
      }

      users = usersRes && usersRes.success ? usersRes.data : [];
      trips = tripsRes && tripsRes.success ? tripsRes.data : [];
      reports = reportsRes && reportsRes.success ? reportsRes.data : [];

      deleteUser = (id) => {
        apiPost("delete_user", { id })
          .then((res) => {
            if (res && res.success) {
              users = users.filter((u) => u.id !== id);
              trips = trips.filter((t) => t.idUtilisateur !== id);
              showToast("Utilisateur supprimé");
              refreshAll();
            } else {
              showToast("Erreur suppression utilisateur", "error");
            }
          })
          .catch(() => showToast("Erreur réseau", "error"));
      };

      deleteTrip = (id) => {
        apiPost("delete_trip", { id })
          .then((res) => {
            if (res && res.success) {
              trips = trips.filter((t) => t.id !== id);
              showToast("Trajet supprimé");
              refreshAll();
            } else {
              showToast("Erreur suppression trajet", "error");
            }
          })
          .catch(() => showToast("Erreur réseau", "error"));
      };

      updateReportStatus = (id, statut) => {
        apiPost("update_report", { id, statut })
          .then((res) => {
            if (res && res.success) {
              reports = reports.map((r) => (r.id === id ? { ...r, statut } : r));
              showToast(statut === "traite" ? "Signalement traité" : "Signalement rejeté", "success");
              refreshAll();
            } else {
              showToast("Erreur mise à jour signalement", "error");
            }
          })
          .catch(() => showToast("Erreur réseau", "error"));
      };

      deleteReport = (id) => {
        apiPost("delete_report", { id })
          .then((res) => {
            if (res && res.success) {
              reports = reports.filter((r) => r.id !== id);
              showToast("Signalement supprimé");
              refreshAll();
            } else {
              showToast("Erreur suppression signalement", "error");
            }
          })
          .catch(() => showToast("Erreur réseau", "error"));
      };

      bindEvents();
      loadSidebar().then(refreshAll);
    })
    .catch((err) => {
      console.error("Erreur chargement admin data:", err);
      showToast("Impossible de charger les données administrateur", "error");
      users = [];
      trips = [];
      reports = [];
      bindEvents();
      loadSidebar().then(refreshAll);
    });
};

document.addEventListener("DOMContentLoaded", init);
