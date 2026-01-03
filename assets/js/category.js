// ===============================
// CATEGORY PAGE JS
// ===============================

// Extract category slug from URL
// Example: /technology/index.html → "technology"
const parts = window.location.pathname.split("/");
const cat = parts[1] || null; // Corrected for your folder structure

const titleEl = document.getElementById("categoryTitle");
const container = document.getElementById("categoryPosts");

if (!cat) {
  container.innerHTML = "<p>Category not found.</p>";
} else {
  // Convert slug to Proper Case
  const toTitleCase = str => str.replace(/\b\w/g, c => c.toUpperCase());
  titleEl.innerText = toTitleCase(cat.replace(/-/g, " "));

  // Fetch posts
  fetch("/data/posts.json")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.json();
    })
    .then(posts => {
      // Filter posts by this category & latest first
      const filtered = posts
        .filter(p => p.category === cat)
        .sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));

      if (!filtered.length) {
        container.innerHTML = "<p>No posts found in this category.</p>";
        return;
      }

      // Render posts efficiently
      container.innerHTML = filtered.map(post => `
        <article class="post-card">
          <img src="${post.image}" alt="${post.title}" class="post-image"/>
          <h2><a href="${post.url}">${post.title}</a></h2>
          <div class="meta">📅 ${post.lastDate} • ${toTitleCase(post.category.replace(/-/g, " "))}</div>
        </article>
      `).join('');
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Error loading posts.</p>";
    });
}
