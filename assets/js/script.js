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

    async function sendMessage(event) {
      event.preventDefault();
      const form = event.target;
      const btn  = form.querySelector("button[type='submit']");
      const msg  = document.getElementById("successMessage");
      const lang = localStorage.getItem("portfolio_lang") || "fr";

      btn.disabled  = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      try {
        const payload = Object.fromEntries(new FormData(form));
        const res     = await fetch("https://api.web3forms.com/submit", {
          method  : "POST",
          headers : { "Content-Type": "application/json", "Accept": "application/json" },
          body    : JSON.stringify(payload)
        });
        const json = await res.json();

        if (json.success) {
          msg.style.color   = "var(--green)";
          msg.textContent   = lang === "fr"
            ? "Message envoyé avec succès ✅"
            : "Message sent successfully ✅";
          msg.style.display = "block";
          form.reset();
        } else {
          throw new Error(json.message || "Web3Forms error");
        }
      } catch (err) {
        msg.style.color   = "#ff6b6b";
        msg.textContent   = lang === "fr"
          ? "Une erreur est survenue, veuillez réessayer ❌"
          : "An error occurred, please try again ❌";
        msg.style.display = "block";
        console.error("Web3Forms:", err);
      } finally {
        btn.disabled  = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span data-fr="Envoyer" data-en="Send">'
          + (lang === "fr" ? "Envoyer" : "Send") + '</span>';
      }
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

    /* ============================================================
       HAMBURGER MENU
    ============================================================ */
    (function () {
      const btn     = document.getElementById("hamburger");
      const overlay = document.getElementById("mobileOverlay");
      if (!btn || !overlay) return;

      function openMenu() {
        overlay.classList.add("show");
        requestAnimationFrame(() => overlay.classList.add("visible"));
        btn.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }

      function closeMenu() {
        overlay.classList.remove("visible");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        overlay.addEventListener("transitionend", () => {
          overlay.classList.remove("show");
        }, { once: true });
      }

      btn.addEventListener("click", () => {
        btn.classList.contains("open") ? closeMenu() : openMenu();
      });

      /* Close on nav link click */
      overlay.querySelectorAll("a").forEach(a =>
        a.addEventListener("click", closeMenu)
      );

      /* Close on Escape key */
      document.addEventListener("keydown", e => {
        if (e.key === "Escape" && btn.classList.contains("open")) closeMenu();
      });

      /* Close when resizing to desktop width */
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && btn.classList.contains("open")) closeMenu();
      });
    })();

    /* ============================================================
       SERVICES — click any item → scroll to contact + pre-fill
    ============================================================ */
    document.querySelectorAll(".services-list li").forEach(li => {
      li.addEventListener("click", () => {
        const lang   = localStorage.getItem(LANG_KEY) || "fr";
        const span   = li.querySelector("span");
        const name   = span
          ? (span.getAttribute("data-" + lang) || span.textContent.trim())
          : li.textContent.trim();
        const prefix = lang === "fr" ? "Demande de service : " : "Service request: ";
        const topic  = document.querySelector('input[name="topic"]');
        if (topic) topic.value = prefix + name;
        document.querySelector("#contact").scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => { if (topic) topic.focus(); }, 700);
      });
    });