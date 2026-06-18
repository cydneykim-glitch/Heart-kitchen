// This runs on Netlify's servers, not in the visitor's browser - so the
// API key here stays private even though the site itself is public.
exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: { message: "Server is missing ANTHROPIC_API_KEY. Add it under Site settings > Environment variables in Netlify." },
      }),
    };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: event.body,
    });
    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: { message: String(e) } }),
    };
  }
};

