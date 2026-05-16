/**
 * ui-enhancements.js — Améliorations visuelles (fichier additionnel)
 * N'écrase aucun fichier existant. S'ajoute en complément de components.js
 */

(function () {
  "use strict";

  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

  function init() {
    document.body.classList.add("app-modern");
    injectAmbientBackground();
    injectScrollProgress();
    initScrollProgress();
    initBackToTop();
    initScrollReveal();
    enhanceAuthBox();
    enhanceDashboardCards();
    enhanceEmptyStates();
    enhancePublishForm();
    watchNavbarAndFooter();
    enhanceTripCards();
    observeTripResults();
  }

  function injectAmbientBackground() {
    if (document.querySelector(".ambient-bg")) return;
    const bg = document.createElement("div");
    bg.className = "ambient-bg";
    bg.setAttribute("aria-hidden", "true");
    document.body.prepend(bg);
  }

  function injectScrollProgress() {
    if (document.querySelector(".scroll-progress")) return;
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.prepend(bar);
  }

  function initScrollProgress() {
    const bar = document.querySelector(".scroll-progress");
    if (!bar) return;

    window.addEventListener(
      "scroll",
      () => {
        const doc = document.documentElement;
        const scrolled =
          doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1);
        bar.style.width = Math.min(100, scrolled * 100) + "%";
      },
      { passive: true }
    );
  }

  function initBackToTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Retour en haut");
    btn.innerHTML = "↑";
    document.body.appendChild(btn);

    window.addEventListener(
      "scroll",
      () => {
        btn.classList.toggle("is-visible", window.scrollY > 400);
      },
      { passive: true }
    );

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initScrollReveal() {
    const targets = document.querySelectorAll(
      ".card, .trip-card, .profile-card, .auth-box, .stat, section, .filters"
    );

    targets.forEach((el) => el.classList.add("reveal-on-scroll"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => io.observe(el));
  }

  function setActiveNavLink() {
    const nav = document.querySelector("#navbar .nav-links");
    if (!nav) return;

    nav.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const isActive =
        href === currentPage ||
        (currentPage === "login.html" && href === "dashboard.html");
      link.classList.toggle("nav-active", isActive);
    });
  }

  function enhanceFooter() {
    const footer = document.querySelector("#footer .footer");
    if (!footer || footer.classList.contains("is-enhanced")) return;

    footer.classList.add("is-enhanced");
    const year = new Date().getFullYear();
    const brand = document.createElement("p");
    brand.className = "footer-brand";
    brand.textContent = "Covoiturage Étudiant";

    const links = document.createElement("ul");
    links.className = "footer-links";
    links.innerHTML = `
      <li><a href="dashboard.html">Accueil</a></li>
      <li><a href="search-trip.html">Rechercher</a></li>
      <li><a href="publish-trip.html">Publier</a></li>
      <li><a href="profile.html">Profil</a></li>
    `;

    const copy = footer.querySelector("p");
    if (copy) copy.textContent = "© " + year + " — Plateforme de Covoiturage Étudiant";

    footer.insertBefore(links, copy);
    footer.insertBefore(brand, links);
  }

  function enhanceAuthBox() {
    document.querySelectorAll(".auth-box").forEach((box) => {
      box.classList.add("is-enhanced", "reveal-on-scroll");
    });
  }

  function enhanceDashboardCards() {
    document.querySelectorAll(".card.offer, .card.find").forEach((card) => {
      card.classList.add("is-enhanced", "reveal-on-scroll");
    });

    const welcome = document.querySelector(".welcome-box");
    if (welcome && !welcome.querySelector(".badge-live")) {
      const badge = document.createElement("span");
      badge.className = "badge badge-live";
      badge.textContent = "Plateforme active";
      welcome.insertBefore(badge, welcome.firstChild);
    }
  }

  function enhanceEmptyStates() {
    document.querySelectorAll(".empty").forEach((el) => {
      el.classList.add("is-enhanced");
    });
  }

  function enhancePublishForm() {
    const form = document.getElementById("tripForm");
    if (form) form.classList.add("is-enhanced");
  }

  function enhanceSingleTripCard(card) {
    if (!card || card.classList.contains("is-enhanced")) return;
    card.classList.add("is-enhanced", "reveal-on-scroll");

    const seatsText = card.querySelector("p:nth-of-type(2)");
    if (seatsText && !card.querySelector(".trip-card-meta")) {
      const meta = document.createElement("div");
      meta.className = "trip-card-meta";
      const isFull = /complet/i.test(seatsText.textContent);
      const badge = document.createElement("span");
      badge.className = "badge " + (isFull ? "badge-full" : "badge-seats");
      badge.textContent = isFull ? "Complet" : seatsText.textContent.trim();
      meta.appendChild(badge);
      card.insertBefore(meta, card.querySelector(".actions") || null);
    }
  }

  function enhanceTripCards() {
    document.querySelectorAll(".trip-card").forEach(enhanceSingleTripCard);
  }

  function observeTripResults() {
    const results = document.getElementById("results");
    if (!results) return;

    const mo = new MutationObserver(() => {
      results.querySelectorAll(".trip-card").forEach(enhanceSingleTripCard);
      initScrollReveal();
    });
    mo.observe(results, { childList: true, subtree: true });
  }

  function watchNavbarAndFooter() {
    const run = () => {
      setActiveNavLink();
      enhanceFooter();
    };

    run();

    const navbarHost = document.getElementById("navbar");
    const footerHost = document.getElementById("footer");

    [navbarHost, footerHost].forEach((host) => {
      if (!host) return;
      const mo = new MutationObserver(run);
      mo.observe(host, { childList: true, subtree: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
