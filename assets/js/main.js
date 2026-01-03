/* ===============================
   H1 ONLY ON HOMEPAGE (SEO SAFE)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.querySelector('[data-home-title]');
  if (titleEl) {
    if (location.pathname === '/' || location.pathname === '/index.html') {
      const h1 = document.createElement('h1');
      h1.className = 'site-title';
      h1.innerText = titleEl.innerText;
      titleEl.replaceWith(h1);
    }
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
      if (res.ok) {
        const html = await res.text();
        const el = document.getElementById(p.id);
        if (el) el.innerHTML = html;
      } else {
        console.error(`Failed to load ${p.file}: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error loading ${p.file}:`, err);
    }
  }

  // Initialize menu and search after header loads
  if (typeof initMenu === "function") initMenu();
  if (typeof initSearch === "function") initSearch();
}

loadPartials();

/* ===============================
   HOMEPAGE POSTS LOAD
================================ */
fetch('/data/posts.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  })
  .then(posts => {

    // Latest post first
    posts.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));

    const container = document.getElementById('homeCategories');
    if (!container) return;

    const grouped = {};

    posts.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });

    Object.keys(grouped).forEach(cat => {
      let html = `
        <div class="category-card">
          <div class="category-title">${cat.toUpperCase()}</div>
      `;

      grouped[cat].slice(0, 5).forEach(post => {
        html += `
          <div class="post">
            <h4>
              <a href="${post.url}">${post.title}</a>
            </h4>
            <div class="meta">
              🟢 ${post.status} • Last Date: ${post.lastDate}
            </div>
          </div>
        `;
      });

      html += `
          <a class="read-more" href="/category.html?cat=${cat}">
            Read More →
          </a>
        </div>
      `;

      container.innerHTML += html;
    });
  })
  .catch(err => console.error("Failed to load posts.json:", err));

/* ===============================
   MOBILE MENU INIT
================================ */
function initMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');

  if (!menuBtn || !mobileMenu || !closeMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('show');
  });

  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
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

    const tags = raw.split(",").map(t => t.trim());
    box.innerHTML = "";

    tags.forEach(tag => {
      const slug = tag.toLowerCase().replace(/\s+/g, "-");
      const a = document.createElement("a");
      a.href = `/tag/${slug}/`;
      a.className = "tag-chip";
      a.textContent = `#${tag}`;
      box.appendChild(a);
    });
  });
})();

/* ===============================
   TOP MESSAGE TIMER + REFERRER CHECK
================================ */
(function () {
  const params = new URLSearchParams(window.location.search);
  const fromA = params.get("from") === "dirtypush";
  const cameFromDirtypush = document.referrer.includes("dirtypush");

  if (!fromA || !cameFromDirtypush) return;

  const topMessage = document.getElementById("topMessage");
  const timeSpan = document.getElementById("timeSpent");
  if (!topMessage || !timeSpan) return;

  topMessage.style.display = "block";

  const storageKey = "dirtypush_timer_seconds";
  let seconds = parseInt(localStorage.getItem(storageKey)) || 0;
  timeSpan.innerText = seconds;

  const timer = setInterval(() => {
    seconds++;
    localStorage.setItem(storageKey, seconds);
    timeSpan.innerText = seconds;

    if (seconds >= 20) {
      topMessage.innerHTML = "🎉 आपने 20 सेकंड पूरा कर लिया!";
      clearInterval(timer);
    }
  }, 1000);
})();
