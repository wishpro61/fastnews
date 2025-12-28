fetch('/partials/header.html')
  .then(r => r.text())
  .then(d => document.getElementById('header').innerHTML = d);

fetch('/partials/footer.html')
  .then(r => r.text())
  .then(d => document.getElementById('footer').innerHTML = d);
