// Load categories
fetch("../data/categories.json")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("category");
    data.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.slug;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
  });

// Slug auto generate
document.getElementById("title").addEventListener("input", e => {
  document.getElementById("slug").value =
    e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
});

// TinyMCE
tinymce.init({
  selector: "#editor",
  height: 500,
  menubar: false,
  plugins: "link image lists code media",
  toolbar:
    "undo redo | bold italic underline | " +
    "blocks | bullist numlist | link image media | code",

  block_formats:
    "Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6",

  image_title: true,
  automatic_uploads: true,
  media_live_embeds: true,

  content_style:
    "body { font-family: Arial; line-height: 1.7; }"
});
