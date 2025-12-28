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
