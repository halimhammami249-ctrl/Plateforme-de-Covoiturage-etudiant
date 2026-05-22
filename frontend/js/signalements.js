/**
 * signalements.js — Frontend pour signalController.php / Signalement
 * Fichier additionnel : ne modifie aucun backend ni fichier existant de l'équipe.
 */

const API = "../../backend/controllers/signalController.php";

let allSignalements = [];
let activeFilter = "all";
let pendingDeleteId = null;

const escapeHtml = (str) => {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const statusLabel = (statut) => {
  const map = {
    en_attente: { label: "En attente", class: "status-badge--pending" },
    traite: { label: "Traité", class: "status-badge--done" },
    rejete: { label: "Rejeté", class: "status-badge--rejected" },
  };
  const key = (statut || "").toLowerCase().replace(/\s/g, "_");
  return map[key] || { label: statut || "Inconnu", class: "status-badge--pending" };
};

const showToast = (message, type = "success") => {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(24px)";
    toast.style.transition = "0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

const updateStats = (items) => {
  const total = items.length;
  const pending = items.filter(
    (s) => (s.statut || "").toLowerCase() === "en_attente"
  ).length;
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-pending").textContent = pending;
};

const filteredItems = () => {
  if (activeFilter === "all") return allSignalements;
  return allSignalements.filter(
    (s) => (s.statut || "").toLowerCase() === activeFilter
  );
};

const renderList = () => {
  const container = document.getElementById("signalements-list");
  const items = filteredItems();

  if (items.length === 0) {
    const emptyMsg =
      activeFilter === "all"
        ? "Vous n'avez encore envoyé aucun signalement."
        : "Aucun signalement pour ce filtre.";
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3>Aucun signalement</h3>
        <p>${escapeHtml(emptyMsg)}</p>
      </div>`;
    return;
  }

  container.innerHTML = items
    .map((item, i) => {
      const st = statusLabel(item.statut);
      return `
        <article class="report-card" style="animation-delay:${i * 0.05}s" data-id="${item.id}">
          <div class="report-card-header">
            <h3 class="report-motif">${escapeHtml(item.motif)}</h3>
            <span class="status-badge ${st.class}">${escapeHtml(st.label)}</span>
          </div>
          <p class="report-meta">${formatDate(item.dateSignalement)}</p>
          <p class="report-description">${escapeHtml(item.description)}</p>
          <div class="report-card-footer">
            <span class="report-id">#${item.id}</span>
            <button type="button" class="btn-delete" data-delete-id="${item.id}" data-motif="${escapeHtml(item.motif)}">
              Supprimer
            </button>
          </div>
        </article>`;
    })
    .join("");
};

const setListLoading = () => {
  document.getElementById("signalements-list").innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner" aria-hidden="true"></div>
      <p>Chargement de vos signalements…</p>
    </div>`;
};

const setListError = () => {
  document.getElementById("signalements-list").innerHTML = `
    <div class="error-state">
      <h3>Erreur de chargement</h3>
      <p>Impossible de récupérer vos signalements. Vérifiez votre connexion.</p>
    </div>`;
};

const checkAuth = async () => {
  const res = await fetch("../../backend/controllers/CheckAuthController.php", {
    credentials: "same-origin",
  });
  const data = await res.json();
  if (!data.connected) {
    window.location.href = "login.html";
    return false;
  }
  return true;
};

const loadSignalements = async () => {
  setListLoading();
  try {
    const res = await fetch(`${API}?action=list`, { credentials: "same-origin" });
    const json = await res.json();

    if (!json.success) {
      if (res.status === 401) {
        window.location.href = "login.html";
        return;
      }
      setListError();
      showToast(json.message || "Erreur de chargement", "error");
      return;
    }

    allSignalements = json.data || [];
    updateStats(allSignalements);
    renderList();
  } catch (err) {
    console.error(err);
    setListError();
    showToast("Erreur réseau", "error");
  }
};

const createSignalement = async (motif, description) => {
  const formData = new FormData();
  formData.append("action", "create");
  formData.append("motif", motif);
  formData.append("description", description);

  const res = await fetch(API, {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });
  return res.json();
};

const deleteSignalement = async (id) => {
  const formData = new FormData();
  formData.append("action", "delete");
  formData.append("id", String(id));

  const res = await fetch(API, {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });
  return res.json();
};

const bindForm = () => {
  const form = document.getElementById("signalement-form");
  const description = document.getElementById("description");
  const charCount = document.getElementById("char-count");
  const submitBtn = document.getElementById("submit-btn");
  const btnLabel = submitBtn.querySelector(".btn-label");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");

  description.addEventListener("input", () => {
    charCount.textContent = description.value.length;
  });

  document.getElementById("reset-form").addEventListener("click", () => {
    form.reset();
    charCount.textContent = "0";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const motif = document.getElementById("motif").value.trim();
    const desc = description.value.trim();

    if (!motif || !desc) {
      showToast("Motif et description sont requis.", "error");
      return;
    }

    submitBtn.disabled = true;
    btnSpinner.hidden = false;
    btnLabel.textContent = "Envoi en cours…";

    try {
      const json = await createSignalement(motif, desc);
      if (json.success) {
        showToast(json.message || "Signalement créé");
        form.reset();
        charCount.textContent = "0";
        await loadSignalements();
      } else {
        showToast(json.message || "Échec de l'envoi", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'envoi", "error");
    } finally {
      submitBtn.disabled = false;
      btnSpinner.hidden = true;
      btnLabel.textContent = "Envoyer le signalement";
    }
  });
};

const bindFilters = () => {
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeFilter = chip.dataset.filter;
      renderList();
    });
  });
};

const bindDeleteModal = () => {
  const modal = document.getElementById("delete-modal");

  document.getElementById("signalements-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-delete-id]");
    if (!btn) return;
    pendingDeleteId = btn.dataset.deleteId;
    document.getElementById("delete-modal-text").textContent =
      `Supprimer le signalement « ${btn.dataset.motif} » ? Cette action est définitive.`;
    modal.showModal();
  });

  document.getElementById("cancel-delete").addEventListener("click", () => {
    pendingDeleteId = null;
    modal.close();
  });

  document.getElementById("confirm-delete").addEventListener("click", async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    modal.close();

    try {
      const json = await deleteSignalement(id);
      if (json.success) {
        showToast(json.message || "Signalement supprimé");
        await loadSignalements();
      } else {
        showToast(json.message || "Suppression impossible", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la suppression", "error");
    }
    pendingDeleteId = null;
  });
};

const init = async () => {
  const ok = await checkAuth();
  if (!ok) return;

  bindForm();
  bindFilters();
  bindDeleteModal();

  document.getElementById("refresh-list").addEventListener("click", loadSignalements);

  await loadSignalements();
};

init();
