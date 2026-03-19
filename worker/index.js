/**
 * worker/index.js — Your Green Gardening Wizard
 * Routes: POST /messages | POST /save-profile | GET /load-profile | POST /analytics
 */

const ALLOWED_ORIGINS = [
  'https://asspirited.github.io',
  'https://your-green-gardening-wizard.pages.dev',
];
const ALLOWED_ORIGINS_DEV = ['http://localhost','http://localhost:8080','http://127.0.0.1','null'];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const isDev = env.ENVIRONMENT === 'development';
    const allowed = isDev ? [...ALLOWED_ORIGINS, ...ALLOWED_ORIGINS_DEV] : ALLOWED_ORIGINS;
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

    const url = new URL(request.url);
    try {
      if (url.pathname === '/messages'      && request.method === 'POST') return handleMessages(request, env, corsHeaders);
      if (url.pathname === '/save-profile'  && request.method === 'POST') return handleSaveProfile(request, env, corsHeaders);
      if (url.pathname === '/load-profile'  && request.method === 'GET')  return handleLoadProfile(request, env, corsHeaders);
      if (url.pathname === '/analytics'     && request.method === 'POST') return handleAnalytics(request, env, corsHeaders);
      return new Response('Not found', { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Worker error', detail: err.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }
};

async function handleMessages(request, env, corsHeaders) {
  const body = await request.json();
  const safe = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: Math.min(body.max_tokens || 1600, 2000),
    system: typeof body.system === 'string' ? body.system : undefined,
    messages: Array.isArray(body.messages) ? body.messages.slice(0, 10) : [],
  };
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(safe),
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleSaveProfile(request, env, corsHeaders) {
  if (!env.YGW_PROFILES) return new Response(JSON.stringify({ error: 'KV not configured', code: 'KV_NOT_BOUND' }),
    { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  const { email, profile, uuid, result } = await request.json();
  if (!email || !profile || !uuid) return new Response(JSON.stringify({ error: 'Missing: email, profile, uuid' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  const record = { email, profile, result: result || null, savedAt: new Date().toISOString(), uuid };
  await env.YGW_PROFILES.put(`profile:${uuid}`, JSON.stringify(record), { expirationTtl: 31536000 });
  await env.YGW_PROFILES.put(`email:${email.toLowerCase()}`, uuid, { expirationTtl: 31536000 });
  if (env.EMAIL_API_KEY) await sendWelcomeEmail(email, uuid, profile, env).catch(e => console.error('Email error:', e));
  return new Response(JSON.stringify({ success: true, uuid }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleLoadProfile(request, env, corsHeaders) {
  if (!env.YGW_PROFILES) return new Response(JSON.stringify({ error: 'KV not configured' }),
    { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  const uuid = new URL(request.url).searchParams.get('id');
  if (!uuid) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  const raw = await env.YGW_PROFILES.get(`profile:${uuid}`);
  if (!raw) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  return new Response(raw, { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleAnalytics(request, env, corsHeaders) {
  const { event, metadata = {}, ts } = await request.json().catch(() => ({}));
  if (event && env.YGW_EVENTS) {
    try { env.YGW_EVENTS.writeDataPoint({ blobs: [event, JSON.stringify(metadata)], doubles: [ts || Date.now()], indexes: [event] }); }
    catch (e) { console.error('Analytics error:', e); }
  }
  return new Response('{}', { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function sendWelcomeEmail(email, uuid, profile, env) {
  const url = `https://your-green-gardening-wizard.pages.dev/?profile=${uuid}`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.EMAIL_API_KEY}` },
    body: JSON.stringify({
      from: 'Your Green Gardening Wizard <hello@yourgreengardeningwizard.co.uk>',
      to: email,
      subject: `Your ${profile.location || 'garden'} plan is saved 🌿`,
      text: `Your garden plan is saved. Return to it anytime:\n\n${url}\n\nTo unsubscribe reply "unsubscribe".\n\nMade with care by LeanSpirited 🌱`,
    }),
  });
}
