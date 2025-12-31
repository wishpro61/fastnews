// URL se category slug nikalo
// /category/technology  → technology
function getCategorySlug() {
  const parts = window.location.pathname.split("/");
  return parts[2] || null;
}

const cat = getCategorySlug();

const titleEl = document.getElementById("categoryTitle");
const container = document.getElementById("categoryPosts");

if (!cat) {
  container.innerHTML = "<p>Category not found.</p>";
} else {
  titleEl.innerText = cat.replace(/-/g, " ").toUpperCase();

  fetch("/data/posts.json")
    .then(res => res.json())
    .then(posts => {
      const filtered = posts.filter(p => p.category === cat);

      if (!filtered.length) {
        container.innerHTML = "<p>No posts found.</p>";
        return;
      }

      container.innerHTML = "";

      filtered.forEach(post => {
        container.innerHTML += `
          <article class="post-card">
            <h2>
              <a href="${post.url}">${post.title}</a>
            </h2>
            <div class="meta">
              📅 ${post.lastDate} • ${post.category}
            </div>
          </article>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Error loading posts.</p>";
    });
}
