const editor = document.getElementById("editor");

const titleEl = document.getElementById("title");
const slugEl = document.getElementById("slug");
const catEl = document.getElementById("category");
const tagsEl = document.getElementById("tags");
const thumbEl = document.getElementById("thumbnail");
const altEl = document.getElementById("thumbAlt");
const authorEl = document.getElementById("author");
const dateEl = document.getElementById("date");

// Auto-generate slug
titleEl.addEventListener("input", () => {
  slugEl.value = titleEl.value
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
});

// Load categories
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

// Toolbar commands
function cmd(c){ document.execCommand(c,false,null); }
function heading(h){ document.execCommand("formatBlock",false,h); }
function addLink(){ const u=prompt("URL"); if(u) document.execCommand("createLink",false,u); }
function addImage(){ const u=prompt("Image URL"); if(u) document.execCommand("insertImage",false,u); }
function addButton(){ 
  const t=prompt("Button Text"); 
  const l=prompt("Button Link"); 
  if(t && l) {
    const btn = `<a class="btn" href="${l}">${t}</a>`;
    document.execCommand("insertHTML", false, btn);
  }
}

// Build final HTML with partials
async function buildHTML() {
  const [header, common, footer] = await Promise.all([
    fetch("/partials/header.html").then(r=>r.text()),
    fetch("/partials/common-section.html").then(r=>r.text()),
    fetch("/partials/footer.html").then(r=>r.text())
  ]);

  const postHTML = `
<main class="post-container">
  <h1 class="post-title">${titleEl.value}</h1>
  <img src="${thumbEl.value}" alt="${altEl.value}" class="post-image">
  <div class="meta">✍️ ${authorEl.value} • ${dateEl.value ? new Date(dateEl.value).toLocaleDateString() : new Date().toLocaleDateString()}</div>
  <div class="post-content">
    ${editor.innerHTML}
  </div>
</main>`;

  return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>${titleEl.value}</title>
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>

${header}
${postHTML}
${common}
${footer}

<script src="/assets/js/include.js"></script>
</body>
</html>`;
}

// Preview
async function preview() {
  const html = await buildHTML();
  const w = window.open();
  w.document.write(html);
  w.document.close();
}

// Copy HTML to clipboard
async function copyHTML() {
  const html = await buildHTML();
  const temp = document.createElement("textarea");
  temp.value = html;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
  alert("✅ Full HTML (with header/footer/common) copied!");
}

// Download HTML
async function downloadHTML() {
  const html = await buildHTML();
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${slugEl.value || "post"}.html`;
  a.click();
}

// Copy JSON
function copyJSON() {
  const now = new Date();
  const block = {
    title: titleEl.value,
    slug: slugEl.value,
    url: `/news/${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,"0")}/${slugEl.value}.html`,
    category: catEl.value,
    author: authorEl.value,
    date: dateEl.value ? new Date(dateEl.value).toISOString() : new Date().toISOString(),
    tags: tagsEl.value.split(",").map(t=>t.trim()),
    thumbnail: thumbEl.value,
    alt: altEl.value
  };
  const temp = document.createElement("textarea");
  temp.value = JSON.stringify(block, null, 2);
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
  alert("✅ posts.json entry copied!");
}

// Download JSON
function downloadJSON() {
  const now = new Date();
  const block = {
    title: titleEl.value,
    slug: slugEl.value,
    url: `/news/${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,"0")}/${slugEl.value}.html`,
    category: catEl.value,
    author: authorEl.value,
    date: dateEl.value ? new Date(dateEl.value).toISOString() : new Date().toISOString(),
    tags: tagsEl.value.split(",").map(t=>t.trim()),
    thumbnail: thumbEl.value,
    alt: altEl.value
  };
  const blob = new Blob([JSON.stringify([block], null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "posts.json";
  a.click();
  alert("✅ posts.json downloaded – git commit ready");
}

// Combined download: HTML + JSON
async function downloadBoth() {
  await downloadHTML();
  downloadJSON();
}
