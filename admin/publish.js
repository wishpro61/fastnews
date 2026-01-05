function previewPost() {
  const html = tinymce.get("editor").getContent();
  const win = window.open("", "_blank");
  win.document.write(html);
}

function publishPost() {
  const post = {
    title: title.value,
    slug: slug.value,
    category: category.value,
    tags: tags.value.split(",").map(t => t.trim()),
    thumbnail: thumbnail.value,
    thumbAlt: thumbAlt.value,
    thumbTitle: thumbTitle.value,
    content: tinymce.get("editor").getContent(),
    date: new Date().toISOString()
  };

  console.log("POST DATA:", post);

  alert("Static site hai 🙂 \n\nIs data ko:\n1. posts.json me add karo\n2. template se HTML generate karo\n\nYe next step me automate kar denge.");
}
