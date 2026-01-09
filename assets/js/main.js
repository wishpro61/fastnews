/* ===============================
   H1 ONLY ON HOMEPAGE (SEO SAFE)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.querySelector("[data-home-title]");
  const isHome =
    location.pathname === "/" ||
    location.pathname === "/index.html";

  if (titleEl && isHome) {
    const h1 = document.createElement("h1");
    h1.className = "site-title";
    h1.textContent = titleEl.textContent.trim();
    titleEl.replaceWith(h1);
  }
});

/* ===============================
   LOAD PARTIALS
   Header, Common Section, Footer
================================ */
async function loadPartials() {
  const partials = [
    { id: "header", file: "/partials/header.html" },
    { id: "common-section", file: "/partials/common-section.html" },
    { id: "footer", file: "/partials/footer.html" }
  ];

  for (const p of partials) {
    try {
      const res = await fetch(p.file);
      if (!res.ok) throw new Error(p.file);
      const html = await res.text();
      const el = document.getElementById(p.id);
      if (el) el.innerHTML = html;
    } catch (e) {
      console.error("❌ Partial load failed:", e);
    }
  }

  // Initialize menu & search after partials load
  if (typeof initMenu === "function") initMenu();
  if (typeof initSearch === "function") initSearch();

  // Initialize push button after footer is loaded
  if (typeof window.enablePush === "function") {
    const btn = document.getElementById("push-enable-btn");
    const banner = document.getElementById("push-banner");

    if (btn) btn.addEventListener("click", window.enablePush);

    if (localStorage.getItem("push-enabled") === "true" && banner) {
      banner.style.display = "none";
    }
  }
}

loadPartials();

/* ===============================
   HOMEPAGE POSTS (AUTO CATEGORY)
================================ */
fetch("/data/posts.json")
  .then(res => res.json())
  .then(posts => {
    const container = document.getElementById("homeCategories");
    if (!container) return;

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const categories = {
      "sarkari-yojana": "सरकारी योजनाएं",
      "education": "शिक्षा अपडेट",
      "jobs-career": "सरकारी नौकरी & करियर",
      "health-tips": "स्वास्थ्य टिप्स",
      "technology": "टेक्नोलॉजी न्यूज़"
    };

    for (const slug in categories) {
      const catPosts = posts.filter(p => p.category === slug);
      if (!catPosts.length) continue;

      let html = `
        <section class="category-card">
          <h2 class="category-title">${categories[slug]}</h2>
      `;

      catPosts.slice(0, 5).forEach(post => {
        html += `
          <article class="post">
            <h3>
              <a href="${post.url}">${post.title}</a>
            </h3>
          </article>
        `;
      });

      html += `
          <a class="read-more" href="/${slug}/">
            Read More →
          </a>
        </section>
      `;

      container.insertAdjacentHTML("beforeend", html);
    }
  })
  .catch(err => console.error("❌ posts.json load error:", err));

/* ===============================
   MOBILE MENU INIT
================================ */
function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");

  if (!menuBtn || !mobileMenu || !closeMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("show");
  });

  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("show");
  });
}

/* ===============================
   TAGS RENDER
================================ */
(function () {
  const boxes = document.querySelectorAll(".post-tags[data-tags]");
  if (!boxes.length) return;

  boxes.forEach(box => {
    const raw = box.getAttribute("data-tags");
    if (!raw) return;

    box.innerHTML = "";
    raw.split(",").forEach(tag => {
      const slug = tag.trim().toLowerCase().replace(/\s+/g, "-");
      const a = document.createElement("a");
      a.href = `/tag/${slug}/`;
      a.className = "tag-chip";
      a.textContent = `#${tag.trim()}`;
      box.appendChild(a);
    });
  });
})();

/* ===============================
   TOP MESSAGE TIMER (OPTIONAL)
================================ */
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("from") !== "dirtypush") return;
  if (!document.referrer.includes("dirtypush")) return;

  const topMessage = document.getElementById("topMessage");
  const timeSpan = document.getElementById("timeSpent");
  if (!topMessage || !timeSpan) return;

  topMessage.style.display = "block";

  let seconds = Number(localStorage.getItem("dirtypush_timer")) || 0;
  timeSpan.textContent = seconds;

  const timer = setInterval(() => {
    seconds++;
    localStorage.setItem("dirtypush_timer", seconds);
    timeSpan.textContent = seconds;

    if (seconds >= 20) {
      topMessage.textContent = "🎉 आपने 20 सेकंड पूरा कर लिया!";
      clearInterval(timer);
    }
  }, 1000);
})();

/* ===============================
   PWA INSTALL BANNER (FIXED)
================================ */
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const waitForBanner = setInterval(() => {
    const banner = document.getElementById("installBanner");

    if (banner && !window.matchMedia("(display-mode: standalone)").matches) {
      banner.style.display = "block";
      clearInterval(waitForBanner);
    }
  }, 300);
});

/* Install button click */
document.addEventListener("click", async (e) => {
  if (e.target.id === "installBtn" && deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      document.getElementById("installBanner")?.remove();
    }
    deferredPrompt = null;
  }
});

/* Already installed → hide banner */
if (window.matchMedia("(display-mode: standalone)").matches) {
  document.getElementById("installBanner")?.remove();
}
