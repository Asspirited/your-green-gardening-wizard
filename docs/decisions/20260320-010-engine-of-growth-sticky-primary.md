# ADR-010: Engine of Growth — Sticky primary, B2B2C referral tail

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** product, strategy

## Context

The architecture review, session protocol, and strategy discussion all independently converged on the same question: which Engine of Growth is primary? Three options were evaluated — Viral (users share output, others find the product directly), Sticky (retention drives repeat use and word-of-mouth through professional relationships), and Paid (CAC < LTV via subscription). The product now has two personas: amateur/enthusiast (consumer) and landscaper (B2B). Oz's network consists of landscapers, estate agents, and end clients — a professional trust graph, not a social sharing graph. Growth will travel through professional relationships, not social feeds.

## Decision

The primary Engine of Growth for The Green Wizard is **Sticky**, operating via a **B2B2C referral loop**: landscaper uses The Green Wizard → produces a better client proposal → client sees the output quality → client finds or is referred to The Green Wizard, or refers the landscaper to another client. Retention of the landscaper is the acquisition channel. This is confirmed by Oz's network profile and the HDD-001 hypothesis (landscapers pay if output quality passes the Ollie test).

Viral mechanics are not abandoned but are secondary and should work *through* the Sticky engine rather than competing with it. The primary viral instrument is YGW-074 (Powered by The Green Wizard footer in landscaper PDF proposals) — a passive B2B2C loop that costs one line of text in the proposal template.

Pure Viral features (shareable consumer card, social image exports) are valid for the amateur persona but do not come before the landscaper sticky-engine features.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Viral primary | Oz's network is a trust graph, not a social sharing graph. Share buttons drive acquisition only if output is visually shareable — that prerequisite is not yet validated. |
| Paid primary | CAC < LTV cannot be validated until first paying customers. Stripe gate (YGW-064) is a measurement instrument for this hypothesis, not the engine itself. |
| Viral + Sticky equally weighted | Creates priority confusion in the backlog. Both can coexist, but only one can drive ordering decisions. Sticky wins because the landscaper persona is the primary commercial validation target (HDD-001). |

## Consequences

**Positive:** Backlog priority is now unambiguous. Landscaper features (YGW-066, YGW-071, YGW-074) come before pure-Viral consumer features (YGW-072, YGW-073). Oz's interview programme focuses on landscaper retention signals, not social sharing metrics.

**Negative / trade-offs:** Amateur/consumer persona features deprioritised until HDD-001 is validated. This is intentional — if HDD-001 fails, the consumer persona may become primary and this decision may be revisited.

**Neutral:** YGW-074 (footer watermark) is the bridge between Sticky and Viral — it belongs in the same build slot as YGW-071 (Quick Quote Helper) regardless of engine ordering.

## Linked items

- Backlog: YGW-066 (Plant Palette Generator — primary HDD-001 instrument)
- Backlog: YGW-071 (Quick Quote Helper — sticky engine, landscaper)
- Backlog: YGW-074 (Powered by footer — passive viral, B2B2C loop)
- Related: ADR-008 (HDD persona guard — landscaper primary until validated)
- Related: HDD-001 (Landscapers will pay if output quality passes the Ollie test)
