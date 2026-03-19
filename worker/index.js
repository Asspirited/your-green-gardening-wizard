// Your Green Gardening Wizard — Cloudflare Worker
// Proxies requests to Anthropic API. API key stored as Worker secret, never exposed client-side.
//
// Deploy:
//   1. wrangler secret put ANTHROPIC_API_KEY
//   2. wrangler deploy
//
// Or via Cloudflare dashboard:
//   Workers & Pages → Create Worker → paste this code
//   Settings → Variables → Add secret: ANTHROPIC_API_KEY

export default {
  async fetch(request, env) {

    // CORS — allow your Pages domain and localhost for dev
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = [
      'https://your-green-gardening-wizard.pages.dev',
      'https://your-green-gardening-wizard.leanspirited.workers.dev',
      'http://localhost',
      'http://127.0.0.1',
      'null' // file:// during local dev
    ];

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const rawBody = await request.text();
    if (!rawBody) {
      return new Response(
        JSON.stringify({ error: { message: 'Request body is required' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const body = JSON.parse(rawBody);

      // Enforce model and token limits (prevent abuse)
      const safeBody = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: Math.min(body.max_tokens || 1200, 1500),
        system: body.system,
        messages: body.messages,
      };

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(safeBody),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Worker error', detail: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
};
