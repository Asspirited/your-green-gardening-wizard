# Deploy Your Green Gardening Wizard

Two things to deploy: the Worker (API proxy) and the Pages site (front end).
Do the Worker first — you need its URL before the front end is wired up.

---

## 1. Deploy the Cloudflare Worker

### Via the dashboard (no CLI needed):

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → log in as Leanspirited@gmail.com
2. **Workers & Pages** → **Create** → **Create Worker**
3. Name it: `ygw-api-proxy`
4. Click **Deploy** (ignore the default code for now)
5. Click **Edit code** → paste the entire contents of `worker/index.js` → **Deploy**
6. **Settings** → **Variables and Secrets** → **Add secret**
   - Name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
   - Click **Encrypt** then **Save**

Your Worker URL will be something like:
`https://ygw-api-proxy.YOUR-SUBDOMAIN.workers.dev`

---

## 2. Wire the Worker URL into index.html

Open `index.html` and find this line near the top of the `<script>`:

```javascript
const WORKER_URL = 'YOUR_CLOUDFLARE_WORKER_URL';
```

Replace it with your actual Worker URL:

```javascript
const WORKER_URL = 'https://ygw-api-proxy.your-subdomain.workers.dev';
```

Also update the CORS allowed origins in `worker/index.js` once you know your Pages URL.

---

## 3. Deploy to Cloudflare Pages

1. Push the repo to GitHub: `git push origin main`
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select: `Asspirited/your-green-gardening-wizard`
4. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/` (root)
5. **Save and Deploy**

You'll get a URL like: `https://your-green-gardening-wizard.pages.dev`

---

## 4. Final wiring

- Update `worker/index.js` CORS allowed origins with your `.pages.dev` URL
- Redeploy the Worker (paste updated code)
- Visit your Pages URL and test the full flow

---

## Local testing (before deploying)

Open `index.html` directly in a browser. The API call will fail until the Worker is wired up.

For a quick local test with a direct API call:
- Find `'REPLACE_WITH_KEY_FOR_LOCAL_TEST_ONLY'` in index.html
- Temporarily replace with your Anthropic API key
- **Never commit this** — revert before pushing to GitHub

---

## What to check after deploy

- [ ] Hero page loads and CTA button works
- [ ] All 4 wizard steps complete without errors
- [ ] API call returns a result (check browser console if not)
- [ ] Share button copies text to clipboard
- [ ] "Full plan — £9.99" button opens the modal
- [ ] "Join the waitlist" button shows confirmation message
- [ ] Works on mobile (test on your phone)

---

## AARRR tracking (Phase 1 instrumentation)

The fake door test is already wired up. In `index.html`, find:

```javascript
console.log('[AARRR Revenue] Fake door clicked — upgrade intent registered');
console.log('[AARRR Revenue] Waitlist joined — strong purchase intent');
```

Replace these `console.log` calls with your analytics events when ready
(Google Analytics, Plausible, Cloudflare Analytics, or just a Cloudflare Worker KV counter).
