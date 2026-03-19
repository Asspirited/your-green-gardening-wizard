# Your Green Gardening Wizard

AI-powered garden design advisor for consumers, amateur gardeners, and low-end professionals.

**Owner:** LeanSpirited (Tom Roden / Rod)  
**Co-founders:** Oz, Jerry Maynard  
**Standards:** [github.com/Asspirited/leanspirited-standards](https://github.com/Asspirited/leanspirited-standards)  
**Backlog prefix:** `YGW-`

---

## Vision

A knowledgeable friend with a sketchpad — personalised garden advice based on your soil, climate, aspect, and goals. No expensive software. No designer required.

Target markets (per Jerry Maynard's inception analysis, 2026-03-19):
1. **D2C consumers** — homeowners wanting affordable professional-quality guidance
2. **Landscapers** — B2B SaaS for design generation without hiring designers
3. **Garden designers** — workflow automation for technical outputs
4. **Hybrid/white-label** — via garden centres, nurseries, retailers

---

## Current Phase

**Phase 1 MVP — Consumer Advisor (Day One)**  
Single-page conversational garden advisor. Captures garden profile, returns personalised recommendations.

---

## Repo Structure

```
/
├── index.html              # Main application entry point
├── .claude/
│   ├── claude.md           # Claude orchestration (references leanspirited-standards)
│   ├── session-startup.md
│   ├── session-insession.md
│   └── session-closedown.md
├── docs/
│   ├── ygw-backlog.md
│   └── swot/
│       └── swot-ygw-inception-2026-03-19.md
└── worker/
    └── index.js            # Cloudflare Worker — Anthropic API proxy
```

---

## Tech Stack

- Vanilla JS, single HTML file (no framework)
- Anthropic API via Cloudflare Worker proxy (no API key exposed)
- Deployed via Cloudflare Pages
- Cloudflare account: Leanspirited@gmail.com

---

## Delivery Framework

TDD-BDD-DDD-HDD four-loop framework.  
See [leanspirited-standards/framework/four-loops.md](https://github.com/Asspirited/leanspirited-standards/blob/main/framework/four-loops.md)

---

## Session Protocol

**Mandatory:** Fetch `.claude/session-startup.md` in full before any work begins.  
Fetch `.claude/session-closedown.md` in full at session end. No exceptions.
