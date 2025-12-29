async function publishPost() {
  const title = document.getElementById("title").value;
  let slug = document.getElementById("slug").value || generateSlug(title);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  const path = `news/${year}/${month}/${slug}.html`;

  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;
  const applyLink = document.getElementById("apply_link").value;
  const content = convertMarkdownToHtml(document.getElementById("content").value);

  // Load template
  let template = await fetch('/templates/post-template.html').then(r => r.text());

  // Replace placeholders
  template = template
    .replace(/{{TITLE}}/g, title)
    .replace(/{{DESCRIPTION}}/g, description)
    .replace(/{{H1}}/g, title)
    .replace(/{{IMAGE}}/g, image)
    .replace(/{{IMAGE_ALT}}/g, title)
    .replace(/{{APPLY_LINK}}/g, applyLink)
    .replace(/{{APPLY_TEXT}}/g, `Apply Now`)
    .replace(/{{CONTENT}}/g, content);

  // GitHub push logic
  const token = "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN";
  const repo = "username/repo";

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Add: ${title}`,
      content: btoa(unescape(encodeURIComponent(template))),
      branch: 'main'
    })
  });

  if(response.ok) alert("Post published successfully!");
  else alert("Error publishing post!");
}

document.getElementById("publish").onclick = publishPost;
