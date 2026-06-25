window.addEventListener("load", () => {
      setTimeout(() => document.getElementById("loader").classList.add("hide"), 450);
    });

    const glow = document.getElementById("cursorGlow");
    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });

    const backTop = document.getElementById("backTop");
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("show", window.scrollY > 550);
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), index * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", (e) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    function sendMessage(event) {
      event.preventDefault();
      const msg = document.getElementById("successMessage");
      const lang = localStorage.getItem("portfolio_lang") || "fr";
      msg.textContent = msg.getAttribute("data-" + lang);
      msg.style.display = "block";
      event.target.reset();
    }

    /* ============================================================
       LANGUAGE SWITCHER
    ============================================================ */
    const LANG_KEY = "portfolio_lang";

    function applyLang(lang) {
      document.documentElement.lang = lang;
      document.getElementById("langFR").classList.toggle("active", lang === "fr");
      document.getElementById("langEN").classList.toggle("active", lang === "en");

      document.querySelectorAll("[data-fr][data-en]").forEach(el => {
        el.textContent = el.getAttribute("data-" + lang);
      });

      document.querySelectorAll("[data-fr-html],[data-en-html]").forEach(el => {
        const val = el.getAttribute("data-" + lang + "-html");
        if (val) el.innerHTML = val;
      });

      document.querySelectorAll("[data-fr-placeholder],[data-en-placeholder]").forEach(el => {
        const val = el.getAttribute("data-" + lang + "-placeholder");
        if (val) el.placeholder = val;
      });

      localStorage.setItem(LANG_KEY, lang);
    }

    document.getElementById("langToggle").addEventListener("click", () => {
      const current = localStorage.getItem(LANG_KEY) || "fr";
      applyLang(current === "fr" ? "en" : "fr");
    });

    applyLang(localStorage.getItem(LANG_KEY) || "fr");