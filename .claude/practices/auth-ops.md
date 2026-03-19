# Auth Operations — YGW
# Last updated: 2026-03-19
# NEVER deviate from this. Every deviation has cost hours and money.

---

## Cloudflare — THE ONLY METHOD THAT WORKS IN WSL

NEVER use `wrangler login` — it does not work in WSL. Full stop.

The only working method:
1. Go to dash.cloudflare.com (leanspirited@gmail.com)
2. My Profile (top right) → API Tokens → Create Token
3. Select "Edit Cloudflare Workers" template → Continue → Create Token
4. Copy the token
5. In WSL terminal: `export CLOUDFLARE_API_TOKEN=<paste token>`
6. Verify: `wrangler whoami` — must show leanspirited@gmail.com

Token expired? Repeat steps 1-6. Takes 2 minutes.

To make it persistent across WSL sessions (do this once):
```
echo 'export CLOUDFLARE_API_TOKEN=<your-token>' >> ~/.bashrc
source ~/.bashrc
```

---

## Anthropic API Key — THE ONLY SAFE METHOD

NEVER put the Anthropic key in:
- Any .js or .html file
- Any .env file not in .gitignore
- Any git commit, ever, for any reason

If a key touches git history even briefly — even in a deleted commit — it WILL be silently revoked by Anthropic's scanner. No email. No alert. Users hit errors, you find out the hard way.

The only safe storage: Cloudflare Worker secret.

To set or rotate:
```
export CLOUDFLARE_API_TOKEN=<cf-token>
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN wrangler secret put ANTHROPIC_API_KEY --name ygw-api-proxy
# paste key when prompted — it never touches the filesystem
```

---

## Canary rule

Pipeline starts with `bash scripts/check-auth.sh`. If it exits 1 — STOP.
No "I'll fix it after". No "it's probably fine". STOP and fix auth first.
A WARN that is ignored always becomes a RED within 48 hours.

---

## Worker URLs

- YGW API proxy: https://ygw-api-proxy.leanspirited.workers.dev
- YGW site (GitHub Pages): https://asspirited.github.io/your-green-gardening-wizard/
- OLD broken URL (needs redirect worker deployed): https://your-green-gardening-wizard.leanspirited.workers.dev
- Cusslab worker: https://cusslab-api.leanspirited.workers.dev

---

## To deploy redirect for old YGW URL

Once a valid token is set:
```
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN npx wrangler deploy \
  --config /home/rodent/your-green-gardening-wizard/redirect-worker/wrangler.toml
```
This is a 3-line worker that redirects old URL → GitHub Pages. One command. Done.
