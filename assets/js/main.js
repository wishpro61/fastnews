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
   HOMEPAGE POSTS LOAD
================================ */
fetch('/data/posts.json')
  .then(res => res.json())
  .then(posts => {

    // 🔥 Latest post first
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
  });

/* ===============================
   MOBILE MENU INIT
   (called from include.js)
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
/*===============================
comon area about 
==============================*/
function load(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = data;
    });
}

load("header", "/header.html");
load("common-section", "/common-section.html");
load("footer", "/footer.html");

// ========== GLOBAL TAG RENDER ==========
(function () {
  const box = document.querySelector(".post-tags[data-tags]");
  if (!box) return;

  const raw = box.getAttribute("data-tags");
  if (!raw) return;

  const tags = raw.split(",").map(t => t.trim());

  box.innerHTML = "";

  tags.forEach(tag => {
    const slug = tag
      .toLowerCase()
      .replace(/\s+/g, "-");

    const a = document.createElement("a");
    a.href = `/tag/${slug}/`;
    a.className = "tag-chip";
    a.textContent = `#${tag}`;

    box.appendChild(a);
  });
})();
