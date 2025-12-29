async function loadPartials() {
  const headerRes = await fetch('/partials/header.html');
  const headerHTML = await headerRes.text();
  document.getElementById('header').innerHTML = headerHTML;

  const footerRes = await fetch('/partials/footer.html');
  const footerHTML = await footerRes.text();
  document.getElementById('footer').innerHTML = footerHTML;

  // 🔥 header load hone ke baad menu + search init
  initMenu();
  initSearch();
}

loadPartials();
