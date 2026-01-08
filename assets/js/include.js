// ===============================
// GLOBAL PARTIAL LOADER (FINAL)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");

  includes.forEach(async (el) => {
    const file = el.getAttribute("data-include");

    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(file + " not found");

      const html = await res.text();
      el.innerHTML = html;

      // ✅ Footer year auto-fix (after load)
      const yearEl = el.querySelector("#year");
      if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
      }

      // ✅ Header / Search init (safe)
      if (typeof initMenu === "function") initMenu();
      if (typeof initSearch === "function") initSearch();

    } catch (err) {
      console.error("❌ Include error:", err.message);
    }
  });
});
