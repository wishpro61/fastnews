export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const data = await request.json();

      return new Response(
        JSON.stringify({
          success: true,
          received: data
        }),
        { headers: { "Content-Type": "application/json" } }
      );

    } catch (e) {
      return new Response(
        JSON.stringify({ error: e.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};
