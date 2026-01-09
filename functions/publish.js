export default {
  async fetch(request, env) {

    // ❌ POST ke alawa sab block
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const post = await request.json();

      if (!post.title || !post.slug || !post.content) {
        return new Response(
          JSON.stringify({ error: "Invalid post data" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const year = post.year;
      const month = post.month;

      const filePath = `news/${year}/${month}/${post.slug}.html`;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Post received successfully",
          url: `https://ncertcollege.com/${filePath}`
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );

    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "Server error",
          details: err.message
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
};
