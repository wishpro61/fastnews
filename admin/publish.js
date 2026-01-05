function preview() {
  const w = window.open();
  w.document.write(editor.innerHTML);
}

function publish() {
  const post = {
    title: title.value,
    slug: slug.value,
    category: category.value,
    tags: tags.value.split(","),
    thumbnail: thumbnail.value,
    thumbAlt: thumbAlt.value,
    content: editor.innerHTML,
    date: new Date().toISOString()
  };

  console.log(post);
  alert("Post data ready — next step me auto generate kara denge");
}
