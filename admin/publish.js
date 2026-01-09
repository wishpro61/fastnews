async function preview() {

  const res = await fetch("/templates/post-template.html");
  let html = await res.text();

  html = html
    .replace(/{{title}}/g, title.value)
    .replace(/{{thumbnail}}/g, thumbnail.value)
    .replace(/{{thumbAlt}}/g, thumbAlt.value)
    .replace(/{{author}}/g, author.value)
    .replace(/{{date}}/g, new Date(date.value).toLocaleDateString("hi-IN"))
    .replace(/{{content}}/g, editor.innerHTML);

  const w = window.open();
  w.document.write(html);
  w.document.close();
}

async function saveLocal() {

  const res = await fetch("/data/posts.json");
  const posts = await res.json();

  posts.unshift({
    title: title.value,
    slug: slug.value,
    category: category.value,
    author: author.value,
    date: new Date(date.value).toISOString(),
    tags: tags.value.split(",").map(t => t.trim()),
    thumbnail: thumbnail.value,
    alt: thumbAlt.value
  });

  const blob = new Blob(
    [JSON.stringify(posts, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "posts.json";
  a.click();

  alert("posts.json downloaded – git commit ready");
}
