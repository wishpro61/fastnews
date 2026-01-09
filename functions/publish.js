export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { filePath, content, message } = data;

    const apiUrl = `https://api.github.com/repos/${env.GITHUB_USER}/${env.GITHUB_REPO}/contents/${filePath}`;

    let sha = null;

    // Check if file already exists
    const check = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${env.GITHUB_TOKEN}`,
        "User-Agent": "Cloudflare-Pages"
      }
    });

    if (check.ok) {
      const json = await check.json();
      sha = json.sha;
    }

    const body = {
      message: message || "New post publish",
      content: btoa(unescape(encodeURIComponent(content))),
      branch: "main"
    };

    if (sha) body.sha = sha;

    const push = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!push.ok) {
      return new Response(
        JSON.stringify({ error: "GitHub push failed" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
