const params = new URLSearchParams(window.location.search);
const cat = params.get("cat");

const titleEl = document.getElementById("categoryTitle");
const container = document.getElementById("categoryPosts");

if (cat) {
  titleEl.innerText = cat.toUpperCase();

  fetch("/data/posts.json")
    .then(res => res.json())
    .then(posts => {
      const filtered = posts.filter(p => p.category === cat);

      if (!filtered.length) {
        container.innerHTML = "<p>No posts found.</p>";
        return;
      }

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
    });
}
