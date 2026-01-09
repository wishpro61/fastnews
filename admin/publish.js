async function publish() {

  const now = new Date();
  const payload = {
    title: title.value,
    slug: slug.value,
    content: editor.innerHTML,
    year: now.getFullYear(),
    month: String(now.getMonth() + 1).padStart(2, "0")
  };

  const res = await fetch("/functions/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  // 🔥 SAFETY CHECK
  if (!res.ok) {
    const text = await res.text();
    console.error("Server Error:", text);
    alert("❌ Function error – console dekho");
    return;
  }

  const result = await res.json();
  console.log("Success:", result);
  alert("✅ Function connected successfully");
}
