// Cloudflare Worker — YGW API proxy
// Proxies requests to Anthropic API using server-side secret.
// Users never need an API key. Key is never exposed to the browser.
//
// Deploy:    wrangler deploy
// Set key:   wrangler secret put ANTHROPIC_API_KEY
//            (paste key when prompted — never commit it)

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: { message: 'API key not configured on server' } }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const body = await request.text();

    if (!body) {
      return new Response(
        JSON.stringify({ error: { message: 'Request body is required' } }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': env.ANTHROPIC_API_KEY,
      },
      body,
    });

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
