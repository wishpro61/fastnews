async function loadPartials() {
  try {
    // HEADER
    const headerRes = await fetch('/partials/header.html');
    if (headerRes.ok) {
      const headerHTML = await headerRes.text();
      const headerEl = document.getElementById('header');
      if (headerEl) headerEl.innerHTML = headerHTML;
    }

    // COMMON SECTION
    const commonRes = await fetch('/partials/common-section.html');
    if (commonRes.ok) {
      const commonHTML = await commonRes.text();
      const commonEl = document.getElementById('common-section');
      if (commonEl) commonEl.innerHTML = commonHTML;
    }

    // FOOTER
    const footerRes = await fetch('/partials/footer.html');
    if (footerRes.ok) {
      const footerHTML = await footerRes.text();
      const footerEl = document.getElementById('footer');
      if (footerEl) footerEl.innerHTML = footerHTML;
    }

    // 🔥 header load hone ke baad init
    if (typeof initMenu === "function") initMenu();
    if (typeof initSearch === "function") initSearch();

  } catch (err) {
    console.error("Partial load error:", err);
  }
}

loadPartials();
