const editor = document.getElementById("editor");
const title = document.getElementById("title");
const slug = document.getElementById("slug");
const category = document.getElementById("category");
const tags = document.getElementById("tags");
const thumbnail = document.getElementById("thumbnail");
const thumbAlt = document.getElementById("thumbAlt");

/* Auto slug */
title.addEventListener("input", () => {
  slug.value = title.value
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
});

/* Editor commands */
function cmd(c) {
  document.execCommand(c, false, null);
}

function heading(tag) {
  document.execCommand("insertHTML", false, `<${tag}>${document.getSelection()}</${tag}>`);
}

function addLink() {
  const url = prompt("Enter URL");
  if (url) document.execCommand("createLink", false, url);
}

function addImage() {
  const url = prompt("Image URL");
  const alt = prompt("ALT text");
  if (!url) return;
  document.execCommand(
    "insertHTML",
    false,
    `<img src="${url}" alt="${alt || ""}">`
  );
}

function addButton() {
  const text = prompt("Button Text");
  const link = prompt("Button URL");
  if (!text || !link) return;
  document.execCommand(
    "insertHTML",
    false,
    `<a href="${link}" class="btn">${text}</a>`
  );
}

/* Load categories */
fetch("/data/categories.json")
  .then(r => r.json())
  .then(data => {
    category.innerHTML = `<option value="">Select category</option>`;
    data.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.slug;
      opt.textContent = c.name;
      category.appendChild(opt);
    });
  })
  .catch(() => {
    category.innerHTML = `<option>Error loading categories</option>`;
  });
