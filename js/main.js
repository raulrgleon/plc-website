(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      toggle.textContent = open ? "✕" : "☰";
      if (!open) {
        nav.querySelectorAll(".nav-dropdown.is-open").forEach(function (d) {
          d.classList.remove("is-open");
          var t = d.querySelector(".dropdown-trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        });
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 860px)").matches) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Abrir menú");
          toggle.textContent = "☰";
        }
      });
    });
  }

  document.querySelectorAll(".nav-dropdown").forEach(function (dd) {
    var trigger = dd.querySelector(".dropdown-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function (e) {
      if (!window.matchMedia("(max-width: 860px)").matches) return;
      e.preventDefault();
      var open = dd.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.querySelectorAll(".faq-item").forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      document.querySelectorAll(".faq-item").forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  var accept = document.getElementById("accept-principios");
  var continueBtn = document.getElementById("btn-continuar");
  if (accept && continueBtn) {
    function sync() {
      var ok = accept.checked;
      continueBtn.classList.toggle("disabled", !ok);
      continueBtn.setAttribute("aria-disabled", ok ? "false" : "true");
    }
    accept.addEventListener("change", sync);
    sync();
    continueBtn.addEventListener("click", function (e) {
      if (continueBtn.classList.contains("disabled")) e.preventDefault();
    });
  }

  var tabs = document.querySelectorAll("[data-tab]");
  var panels = document.querySelectorAll("[data-panel]");
  if (tabs.length && panels.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.getAttribute("data-tab");
        tabs.forEach(function (t) {
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute("data-panel") !== id;
        });
      });
    });
  }

  var newsRoot = document.getElementById("noticias-list");
  if (newsRoot && newsRoot.dataset.source) {
    fetch(newsRoot.dataset.source)
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (items) {
        if (!Array.isArray(items) || !items.length) return;
        newsRoot.innerHTML = "";
        items.forEach(function (n) {
          var art = document.createElement("article");
          art.className = "card accent";
          art.innerHTML =
            '<p class="section-label">' + (n.date || "") + "</p>" +
            "<h3>" + (n.title || "") + "</h3>" +
            "<p>" + (n.excerpt || "") + "</p>" +
            (n.url ? '<a class="btn outline" href="' + n.url + '">Leer más</a>' : "");
          newsRoot.appendChild(art);
        });
      })
      .catch(function () { /* keep empty state */ });
  }
})();
