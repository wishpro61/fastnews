function buildHTML() {

  const now = new Date();
  const date = now.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const tagsHTML = tags.value
    .split(",")
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `<a href="/tag.html?tag=${t}" class="tag-chip">${t}</a>`)
    .join("");

  return fetch("/templates/post-template.html")
    .then(res => res.text())
    .then(template => {

      return template
        .replace(/{{title}}/g, title.value)
        .replace(/{{content}}/g, editor.innerHTML)
        .replace(/{{thumbnail}}/g, thumbnail.value)
        .replace(/{{thumbAlt}}/g, thumbAlt.value)
        .replace(/{{author}}/g, "Ncertcollege")
        .replace(/{{date}}/g, date)
        .replace(/{{category}}/g, category.value)
        .replace(/{{tags}}/g, tagsHTML);
    });
}

/* 🔍 TEMPLATE PREVIEW */
async function preview() {
  const html = await buildHTML();
  const w = window.open();
  w.document.write(html);
  w.document.close();
}

/* 💾 SAVE LOCAL FILE */
async function saveLocal() {

  const html = await buildHTML();

  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = `${slug.value}.html`;

  a.click();
  URL.revokeObjectURL(a.href);

  alert("✅ HTML file downloaded — move it to news/YYYY/MM/");
}
