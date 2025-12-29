const searchInput = document.getElementById("siteSearch");

if (searchInput) {
  searchInput.addEventListener("input", async (e) => {
    const q = e.target.value.toLowerCase();
    if (q.length < 2) return;

    const res = await fetch("/data/posts.json");
    const posts = await res.json();

    const found = posts.find(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    if (found) {
      window.location.href = found.url;
    }
  });
}
