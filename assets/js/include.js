// ===============================
// GLOBAL PARTIAL LOADER
// ===============================

async function loadPartials() {
  try {
    // ================= HEADER =================
    const headerRes = await fetch("/partials/header.html");
    if (headerRes.ok) {
      const headerHTML = await headerRes.text();
      const headerEl = document.getElementById("header");
      if (headerEl) headerEl.innerHTML = headerHTML;
    } else {
      console.warn("header.html not found");
    }

    // ================= COMMON SECTION =================
    const commonRes = await fetch("/partials/common-section.html");
    if (commonRes.ok) {
      const commonHTML = await commonRes.text();
      const commonEl = document.getElementById("common-section");
      if (commonEl) commonEl.innerHTML = commonHTML;
    } else {
      console.warn("common-section.html not found");
    }

    // ================= FOOTER =================
    const footerRes = await fetch("/partials/footer.html");
    if (footerRes.ok) {
      const footerHTML = await footerRes.text();
      const footerEl = document.getElementById("footer");
      if (footerEl) footerEl.innerHTML = footerHTML;
    } else {
      console.warn("footer.html not found");
    }

    // ================= INIT FUNCTIONS =================
    // ⚠️ header/footer load hone ke baad hi call honge
    if (typeof initMenu === "function") {
      initMenu();
    }

    if (typeof initSearch === "function") {
      initSearch();
    }

  } catch (err) {
    console.error("❌ Partial load error:", err);
  }
}

// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", loadPartials);
