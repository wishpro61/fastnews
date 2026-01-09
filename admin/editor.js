const editor = document.getElementById("editor");

const titleEl = document.getElementById("title");
const slugEl = document.getElementById("slug");
const catEl = document.getElementById("category");
const tagsEl = document.getElementById("tags");
const thumbEl = document.getElementById("thumbnail");
const altEl = document.getElementById("thumbAlt");
const authorEl = document.getElementById("author");
const dateEl = document.getElementById("date");

/* Auto slug */
titleEl.addEventListener("input", () => {
  slugEl.value = titleEl.value
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
});

/* Load categories */
fetch("/data/categories.json")
  .then(r => r.json())
  .then(cats => {
    cats.forEach(c => {
      const o = document.createElement("option");
      o.value = c.slug;
      o.textContent = c.name;
      catEl.appendChild(o);
    });
  });

/* Toolbar */
function cmd(c) { document.execCommand(c, false, null); }
function heading(h) { document.execCommand("formatBlock", false, h); }
function addLink() {
  const u = prompt("URL");
  if (u) document.execCommand("createLink", false, u);
}
function addImage() {
  const u = prompt("Image URL");
  if (u) document.execCommand("insertImage", false, u);
}
function addButton() {
  const t = prompt("Button Text");
  const u = prompt("Button URL");
  if (t && u) {
    const btn = `<a href="${u}" class="btn">${t}</a>`;
    document.execCommand("insertHTML", false, btn);
  }
}

/* Build HTML */
function buildHTML() {
  const publishDate = dateEl.value ? new Date(dateEl.value).toLocaleDateString("hi-IN") : new Date().toLocaleDateString("hi-IN");
  return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>${titleEl.value}</title>
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<div id="header"></div>

<main class="post-container">
<h1 class="post-title">${titleEl.value}</h1>
<img src="${thumbEl.value}" alt="${altEl.value}" class="post-image">
<div class="meta">✍️ ${authorEl.value} • ${publishDate}</div>
<div class="post-content">${editor.innerHTML}</div>
</main>

<div id="footer"></div>
<script src="/assets/js/include.js"></script>
</body>
</html>`;
}

/* Build JSON */
function buildJSON() {
  const now = dateEl.value ? new Date(dateEl.value) : new Date();
  return {
    title: titleEl.value,
    slug: slugEl.value,
    url: `/news/${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,"0")}/${slugEl.value}.html`,
    category: catEl.value,
    tags: tagsEl.value.split(",").map(t => t.trim()),
    thumbnail: thumbEl.value,
    alt: altEl.value,
    author: authorEl.value,
    date: now.toISOString()
  };
}

/* Preview */
function preview() {
  const w = window.open();
  w.document.write(buildHTML());
  w.document.close();
}

/* Copy HTML to clipboard */
function copyHTML() {
  const html = buildHTML();
  navigator.clipboard.writeText(html).then(() => {
    alert("✅ HTML copied to clipboard!");
  });
}

/* Copy JSON to clipboard */
function copyJSON() {
  const json = JSON.stringify(buildJSON(), null, 2);
  navigator.clipboard.writeText(json).then(() => {
    alert("✅ JSON copied to clipboard!");
  });
}

/* Download both HTML and JSON as files */
function downloadBoth() {
  // HTML
  const htmlBlob = new Blob([buildHTML()], { type: "text/html" });
  const htmlA = document.createElement("a");
  htmlA.href = URL.createObjectURL(htmlBlob);
  htmlA.download = `${slugEl.value}.html`;
  htmlA.click();

  // JSON
  const jsonBlob = new Blob([JSON.stringify(buildJSON(), null, 2)], { type: "application/json" });
  const jsonA = document.createElement("a");
  jsonA.href = URL.createObjectURL(jsonBlob);
  jsonA.download = `posts.json`;
  jsonA.click();

  alert("✅ HTML and JSON downloaded!");
}

/* Save posts.json locally (prepend new post) */
async function saveLocal() {
  try {
    const res = await fetch("/data/posts.json");
    const posts = await res.json();
    posts.unshift(buildJSON());

    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "posts.json";
    a.click();

    alert("✅ posts.json downloaded – git commit ready");
  } catch (err) {
    console.error(err);
    alert("❌ Error fetching posts.json");
  }
}
