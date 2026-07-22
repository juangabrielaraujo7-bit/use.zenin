/* =========================================================
   ZENIN — Interações
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Header: estado ao rolar ---------- */
  var header = document.querySelector(".header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Dropdown "Serviços" no mobile abre por toque
    var dropdownToggle = nav.querySelector(".has-dropdown > .nav-link");
    var dropdownParent = nav.querySelector(".has-dropdown");
    if (dropdownToggle && dropdownParent) {
      dropdownToggle.addEventListener("click", function (e) {
        if (window.innerWidth <= 960) {
          e.preventDefault();
          dropdownParent.classList.toggle("is-open");
        }
      });
    }

    // Fecha o menu ao clicar em um link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 960 && !link.closest(".has-dropdown > .nav-link")) {
          nav.classList.remove("is-open");
          toggle.classList.remove("is-open");
        }
      });
    });
  }

  /* ---------- Contagem animada (data-count) ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    var duration = 900;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Animações ao rolar (fade / slide) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.querySelectorAll("[data-count]").forEach(animateCount);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
      el.querySelectorAll("[data-count]").forEach(animateCount);
    });
  }

  /* ---------- Ano automático no footer ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Formulário de contato -> WhatsApp ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name").value.trim();
      var email = form.querySelector("#email").value.trim();
      var whatsapp = form.querySelector("#whatsapp").value.trim();
      var message = form.querySelector("#message").value.trim();

      var text =
        "Olá Zenin, quero saber mais sobre os serviços.\n\n" +
        "Nome: " + name + "\n" +
        "E-mail: " + email + "\n" +
        "WhatsApp: " + whatsapp +
        (message ? "\nMensagem: " + message : "");

      var url = "https://wa.me/5511921589949?text=" + encodeURIComponent(text);

      var successBox = document.querySelector("#form-success");
      if (successBox) {
        successBox.classList.add("is-visible");
      }

      window.open(url, "_blank", "noopener");
      form.reset();
    });
  }
})();
