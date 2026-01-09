/* ===============================
   PREVIEW POST
================================ */
function preview() {
  const w = window.open("", "_blank");
  w.document.open();
  w.document.write(`
    <html>
      <head>
        <title>Preview</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/assets/css/style.css">
      </head>
      <body>
        ${editor.innerHTML}
      </body>
    </html>
  `);
  w.document.close();
}

/* ===============================
   PUBLISH POST
================================ */
async function publish() {
  if (!title.value || !slug.value || !category.value) {
    alert("❌ Title, Slug aur Category required hai");
    return;
  }

  const now = new Date();
  const year = now.getFullYear();            // 2026
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 01

  const postData = {
    title: title.value.trim(),
    slug: slug.value.trim(),
    category: category.value,
    tags: tags.value
      .split(",")
      .map(t => t.trim())
      .filter(Boolean),

    thumbnail: thumbnail.value.trim(),
    thumbAlt: thumbAlt.value.trim(),

    content: editor.innerHTML,

    author: "Ncertcollege",
    date: now.toISOString(),
    year,
    month
  };

  try {
    const res = await fetch("/functions/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });

    const result = await res.json();

    if (!res.ok) {
      console.error(result);
      alert("❌ Publish failed: " + (result.message || "Unknown error"));
      return;
    }

    alert("✅ Post successfully published!\n\nURL:\n" + result.url);

    // Optional: reset editor
    // document.getElementById("postForm").reset();
    // editor.innerHTML = "";

  } catch (err) {
    console.error(err);
    alert("❌ Network / Server error while publishing");
  }
}
