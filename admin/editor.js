const editor = document.getElementById("editor");
const output = document.getElementById("output");

const titleEl = document.getElementById("title");
const slugEl = document.getElementById("slug");
const catEl = document.getElementById("category");
const tagsEl = document.getElementById("tags");
const thumbEl = document.getElementById("thumbnail");
const altEl = document.getElementById("thumbAlt");
const authorEl = document.getElementById("author");

/* Auto slug */
titleEl.addEventListener("input", () => {
  slugEl.value = titleEl.value
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
});

/* Load categories */
fetch("/data/categories.json")
.then(r=>r.json())
.then(cats=>{
  cats.forEach(c=>{
    const o=document.createElement("option");
    o.value=c.slug;
    o.textContent=c.name;
    catEl.appendChild(o);
  });
});

/* Toolbar */
function cmd(c){ document.execCommand(c,false,null); }
function heading(h){
  document.execCommand("formatBlock",false,h);
}
function addLink(){
  const u=prompt("URL");
  if(u) document.execCommand("createLink",false,u);
}
function addImage(){
  const u=prompt("Image URL");
  if(u) document.execCommand("insertImage",false,u);
}

/* Preview */
function preview(){
  const w=window.open();
  w.document.write(buildHTML());
}

/* Build HTML */
function buildHTML(){
  return `<!DOCTYPE html>
<html>
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

<div class="meta">✍️ ${authorEl.value} • ${new Date().toLocaleDateString()}</div>

<div class="post-content">
${editor.innerHTML}
</div>
</main>

<div id="footer"></div>

<script src="/assets/js/include.js"></script>
</body>
</html>`;
}

/* Copy HTML */
function generateHTML(){
  output.value = buildHTML();
  output.select();
  document.execCommand("copy");
  alert("✅ HTML copied. Paste into news/YYYY/MM/slug.html");
}

/* Generate posts.json block */
function generateJSON(){
  const now = new Date();
  const block = {
    title: titleEl.value,
    slug: slugEl.value,
    url: `/news/${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,"0")}/${slugEl.value}.html`,
    category: catEl.value,
    tags: tagsEl.value.split(",").map(t=>t.trim()),
    thumbnail: thumbEl.value,
    lastDate: now.toISOString().split("T")[0]
  };

  output.value = JSON.stringify(block, null, 2);
  output.select();
  document.execCommand("copy");
  alert("✅ posts.json entry copied");
}
