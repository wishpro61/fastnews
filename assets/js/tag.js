const tag = new URLSearchParams(location.search).get('tag');

fetch('/data/posts.json')
  .then(r => r.json())
  .then(posts => {
    const filtered = posts.filter(p => p.tags.includes(tag));
    let html = '';
    filtered.forEach(p => {
      html += `<p><a href="${p.url}">${p.title}</a></p>`;
    });
    document.getElementById('list').innerHTML = html || 'No news';
  });
