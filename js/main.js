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

  var railSteps = {
    principios: document.getElementById("rail-step-principios"),
    datos: document.getElementById("rail-step-datos"),
    envio: document.getElementById("rail-step-envio")
  };

  function setRailState(states) {
    Object.keys(railSteps).forEach(function (key) {
      var el = railSteps[key];
      if (!el) return;
      var state = states[key] || "";
      el.classList.toggle("is-current", state === "current");
      el.classList.toggle("is-done", state === "done");
    });
  }

  var accept = document.getElementById("accept-principios");
  var formSection = document.getElementById("formulario-afiliacion");
  var acceptBox = document.querySelector(".principios-accept");
  var hint = document.getElementById("principios-hint");
  if (accept && formSection) {
    function unlockForm(ok) {
      formSection.classList.toggle("is-locked", !ok);
      formSection.classList.toggle("is-unlocked", ok);
      formSection.setAttribute("aria-hidden", ok ? "false" : "true");
      if (ok) {
        formSection.removeAttribute("inert");
      } else {
        formSection.setAttribute("inert", "");
      }
      if (acceptBox) acceptBox.classList.toggle("is-accepted", ok);
      if (hint) {
        hint.textContent = ok
          ? "Principios aceptados. Completa el formulario a continuación."
          : "Marca la casilla para desbloquear el formulario de afiliación.";
      }
      setRailState(
        ok
          ? { principios: "done", datos: "current" }
          : { principios: "current" }
      );
      if (ok) {
        window.requestAnimationFrame(function () {
          formSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
    }
    accept.addEventListener("change", function () {
      unlockForm(accept.checked);
    });
    unlockForm(accept.checked);
  }

  var afilForm = document.getElementById("afiliacion-form");
  if (afilForm) {
    var submitBtn = document.getElementById("afiliacion-submit");
    var successEl = document.getElementById("afiliacion-success");
    var errorEl = document.getElementById("afiliacion-error");
    var errorMsg = document.getElementById("afiliacion-error-msg");
    var defaultBtnLabel = submitBtn ? submitBtn.textContent : "";
    var requiredFields = [
      "nombre_apellidos",
      "email",
      "ciudad_pais",
      "telefono",
      "aporte_comision",
      "edad",
      "membresia_economica",
      "accept_privacidad"
    ];

    function setFieldError(name, message) {
      var field = afilForm.querySelector('[name="' + name + '"]');
      var wrap = field ? field.closest(".form-field") : null;
      if (name === "accept_privacidad") {
        wrap = document.getElementById("accept_privacidad");
        wrap = wrap ? wrap.closest(".form-field") : null;
      }
      if (name === "membresia_economica") {
        wrap = afilForm.querySelector(".radio-fieldset");
      }
      var err = document.getElementById("err-" + name);
      if (wrap) wrap.classList.toggle("is-invalid", !!message);
      if (err) {
        err.hidden = !message;
        err.textContent = message || "";
      }
    }

    function clearErrors() {
      requiredFields.forEach(function (n) {
        setFieldError(n, "");
      });
      if (errorEl) errorEl.hidden = true;
    }

    function validateEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function selectedMembresia() {
      var checked = afilForm.querySelector('input[name="membresia_economica"]:checked');
      return checked ? checked.value : "";
    }

    function parseApiError(data, status) {
      if (!data) return status === 429
        ? "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo."
        : "Ha ocurrido un error. Inténtalo de nuevo.";
      var detail = data.detail;
      if (typeof detail === "string" && detail.trim()) return detail;
      if (Array.isArray(detail) && detail.length) {
        return detail.map(function (item) {
          if (typeof item === "string") return item;
          if (item && item.msg) return item.msg;
          return JSON.stringify(item);
        }).join(" ");
      }
      if (typeof data.error === "string" && data.error.trim()) return data.error;
      if (typeof data.message === "string" && data.message.trim()) return data.message;
      if (status === 429) return "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.";
      return "Ha ocurrido un error. Inténtalo de nuevo.";
    }

    function validate() {
      clearErrors();
      var ok = true;
      var nombre = (afilForm.nombre_apellidos.value || "").trim();
      var email = (afilForm.email.value || "").trim();
      var ciudadPais = (afilForm.ciudad_pais.value || "").trim();
      var telefono = (afilForm.telefono.value || "").trim();
      var aporte = (afilForm.aporte_comision.value || "").trim();
      var edad = (afilForm.edad.value || "").trim();
      var membresia = selectedMembresia();
      var priv = afilForm.accept_privacidad.checked;

      if (!nombre) { setFieldError("nombre_apellidos", "Indica tu nombre y apellidos."); ok = false; }
      if (!email) { setFieldError("email", "Indica tu correo electrónico."); ok = false; }
      else if (!validateEmail(email)) { setFieldError("email", "El correo no parece válido."); ok = false; }
      if (!ciudadPais) { setFieldError("ciudad_pais", "Indica tu ciudad/país."); ok = false; }
      if (!telefono) { setFieldError("telefono", "Indica tu número de teléfono."); ok = false; }
      if (!aporte) { setFieldError("aporte_comision", "Indica qué puedes aportar y en qué comisión te gustaría integrarte."); ok = false; }
      if (!edad) { setFieldError("edad", "Indica tu edad."); ok = false; }
      if (!membresia) { setFieldError("membresia_economica", "Selecciona una opción de membresía económica."); ok = false; }
      if (!priv) { setFieldError("accept_privacidad", "Debes aceptar el tratamiento de datos."); ok = false; }

      if (!ok) {
        var firstInvalid = afilForm.querySelector(
          ".is-invalid input, .is-invalid textarea"
        );
        if (firstInvalid) firstInvalid.focus();
      }
      return ok;
    }

    requiredFields.forEach(function (name) {
      afilForm.querySelectorAll('[name="' + name + '"]').forEach(function (field) {
        var event = field.type === "checkbox" || field.type === "radio" ? "change" : "input";
        field.addEventListener(event, function () {
          if (field.closest(".is-invalid")) setFieldError(name, "");
        });
      });
    });

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.classList.toggle("is-loading", loading);
      submitBtn.setAttribute("aria-busy", loading ? "true" : "false");
      submitBtn.textContent = loading ? "Enviando…" : defaultBtnLabel;
    }

    afilForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (successEl) successEl.hidden = true;

      var honeypot = (afilForm.website && afilForm.website.value) || "";
      if (honeypot.trim()) {
        if (successEl) {
          successEl.hidden = false;
          afilForm.hidden = true;
          setRailState({ principios: "done", datos: "done", envio: "current" });
        }
        return;
      }

      if (!validate()) return;

      var payload = {
        nombre_apellidos: (afilForm.nombre_apellidos.value || "").trim(),
        email: (afilForm.email.value || "").trim(),
        ciudad_pais: (afilForm.ciudad_pais.value || "").trim(),
        telefono: (afilForm.telefono.value || "").trim(),
        aporte_comision: (afilForm.aporte_comision.value || "").trim(),
        edad: (afilForm.edad.value || "").trim(),
        membresia_economica: selectedMembresia(),
        accept_principios: !!(accept && accept.checked),
        accept_privacidad: !!afilForm.accept_privacidad.checked,
        website: ""
      };

      setLoading(true);
      fetch("/api/afiliacion", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { status: res.status, okHttp: res.ok, data: data };
          });
        })
        .then(function (result) {
          setLoading(false);
          if (result.data && result.data.ok === true) {
            if (errorEl) errorEl.hidden = true;
            if (successEl) successEl.hidden = false;
            afilForm.hidden = true;
            setRailState({ principios: "done", datos: "done", envio: "current" });
            if (successEl) successEl.focus && successEl.focus();
            return;
          }
          var msg = parseApiError(result.data, result.status);
          if (errorMsg) errorMsg.textContent = msg;
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        })
        .catch(function () {
          setLoading(false);
          if (errorMsg) errorMsg.textContent = "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.";
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
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
