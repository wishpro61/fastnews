// category load
fetch("../data/categories.json")
.then(res => res.json())
.then(data => {
  const select = document.getElementById("category");
  data.forEach(c => {
    const o = document.createElement("option");
    o.value = c.slug;
    o.textContent = c.name;
    select.appendChild(o);
  });
});

// slug auto
title.oninput = () => {
  slug.value = title.value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};

function cmd(command) {
  document.execCommand(command, false, null);
}

function heading(tag) {
  document.execCommand("formatBlock", false, tag);
}

function addLink() {
  const url = prompt("Enter URL");
  if (url) document.execCommand("createLink", false, url);
}

function addImage() {
  const url = prompt("Image URL");
  const alt = prompt("ALT text");
  if (url) {
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${url}" alt="${alt}" title="${alt}" loading="lazy">`
    );
  }
}

function addButton() {
  const text = prompt("Button Text");
  const url = prompt("Button URL");
  if (text && url) {
    document.execCommand(
      "insertHTML",
      false,
      `<a href="${url}" class="btn">${text}</a>`
    );
  }
}

function addEmbed() {
  const code = prompt("Paste embed iframe");
  if (code) {
    document.execCommand("insertHTML", false, code);
  }
}
