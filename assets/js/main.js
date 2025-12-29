// H1 only on homepage
const titleEl = document.querySelector('[data-home-title]');
if (titleEl) {
  if (location.pathname === '/' || location.pathname === '/index.html') {
    const h1 = document.createElement('h1');
    h1.className = 'site-title';
    h1.innerText = titleEl.innerText;
    titleEl.replaceWith(h1);
  }
}

fetch('/data/posts.json')
  .then(res => res.json())
  .then(posts => {
    const container = document.getElementById('homeCategories');
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
            <h4><a href="${post.url}">${post.title}</a></h4>
            <div class="meta">🟢 ${post.status} • Last Date: ${post.lastDate}</div>
          </div>
        `;
      });

      html += `
          <a class="read-more" href="/category.html?cat=${cat}">Read More →</a>
        </div>
      `;

      container.innerHTML += html;
    });
  });
posts.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

menuBtn?.addEventListener("click", () => {
  mobileMenu.classList.add("show");
});

closeMenu?.addEventListener("click", () => {
  mobileMenu.classList.remove("show");
});
