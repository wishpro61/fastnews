fetch('/data/posts.json')
  .then(r => r.json())
  .then(posts => {
    let html = '';
    posts.forEach(p => {
      html += `<article>
        <a href="${p.url}">${p.title}</a>
      </article>`;
    });
    document.getElementById('news').innerHTML = html;
  });
