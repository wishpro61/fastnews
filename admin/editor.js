function generateSlug(title) {
  return title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
}

// Simple Markdown to HTML conversion using marked.js CDN
function convertMarkdownToHtml(markdown) {
  if(typeof marked !== "undefined") return marked(markdown);
  return markdown.replace(/\n/g, "<br>");
}

document.getElementById("preview").onclick = () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const html = convertMarkdownToHtml(content);
  alert("Preview ready! Check console for HTML");
  console.log(html);
};
