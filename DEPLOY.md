# Deploy Your Green Gardening Wizard

Two components: the Worker (API proxy) and the GitHub Pages site (front end).

---

## Live URLs

- **Site:** https://asspirited.github.io/your-green-gardening-wizard/
- **API Worker:** https://ygw-api-proxy.leanspirited.workers.dev

---

## Front end — GitHub Pages

Hosted from the `main` branch root. Deploys automatically on every `git push`.

No manual steps needed. GitHub Pages is enabled at:
**github.com/Asspirited/your-green-gardening-wizard → Settings → Pages**

---

## API Worker — Cloudflare

Worker: `ygw-api-proxy` on account `Leanspirited@gmail.com`

To redeploy after changes to `worker/index.js`:

In **your terminal**:
```bash
CLOUDFLARE_API_TOKEN=<token> wrangler deploy --config worker/wrangler.toml
```

Get the token from **Cloudflare (dash.cloudflare.com)** → My Profile → API Tokens.

CORS already allows `https://asspirited.github.io` — no change needed for normal deploys.

The `ANTHROPIC_API_KEY` secret is already set on the worker. Do not reset it unless it has been rotated.

---

## After deploying the worker

- [ ] Hero page loads, CTA works
- [ ] All 4 wizard steps complete
- [ ] AI returns a result
- [ ] Share buttons work (copy text + share as image)
- [ ] "Full plan — £9.99" modal opens
- [ ] Works on mobile
