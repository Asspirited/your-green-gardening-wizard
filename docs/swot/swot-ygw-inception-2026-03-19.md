# SWOT — Your Green Gardening Wizard Inception
**Date:** 2026-03-19
**Source:** Jerry Maynard five-model analysis (WhatsApp thread, 19/03/2026)
**Models analysed:** D2C Consumer, B2B Landscapers, B2B Designers, Hybrid/White-Label, Garden-in-a-Box
**Recommended first build:** Consumer Advisor (agreed Day One build)

---

## Five Models Assessed

| Model | Description |
|-------|-------------|
| D2C Consumer | Homeowners, affordable professional-quality guidance |
| B2B Landscapers | SaaS for design generation without hiring designers |
| B2B Designers | Workflow automation for technical outputs |
| Hybrid/White-Label | Via garden centres, nurseries, retailers |
| Garden-in-a-Box | Curated physical + digital product |

**Jerry's recommendation:** B2B SaaS for Landscapers
**Agreed Day One build:** Consumer Advisor (validates knowledge engine first)

---

## SWOT

### Strengths
- AI-first from day one — no legacy tech debt
- Conversational UX lowers barrier vs. complex design software
- UK-first positioning (underserved vs. US-centric tools)
- LeanSpirited delivery framework enables rapid validated iteration
- Co-founder network (Oz, Jerry) provides commercial pressure and domain challenge

### Weaknesses
- No existing user base or brand recognition
- Garden domain is deep — risk of shallow AI recommendations undermining trust
- Single founder coding capacity — Rod has limited coding skills
- No proprietary data on UK gardens at launch

### Opportunities
- Large addressable market: 27m UK gardens, majority without professional advice
- B2B upsell path (landscapers, designers) once consumer knowledge engine is validated
- White-label demand from garden centres / nurseries if product proves
- No clear AI-native competitor in UK consumer garden advice

### Threats
- Large incumbents (RHS, Gardeners' World) could add AI features
- LLM hallucination on plant advice could cause real harm (wrong plants for soil/climate)
- Users may not trust AI for garden decisions without proof of accuracy
- API costs at scale if usage exceeds projections

---

## CD3 Phase 1 Sequencing

| Item | Customer Value | Dependencies | Complexity | SWOT Weight | Priority Score |
|------|---------------|--------------|------------|-------------|----------------|
| CF Worker API proxy | 3 | 5 | 2 | 3 | 10.5 |
| Garden profile capture | 5 | 5 | 2 | 4 | 14 |
| Plant recommendations | 5 | 4 | 3 | 4 | 12 |

**Phase 1 sequence:** YGW-001 → YGW-002 → YGW-003

---

## Phase 1 Hypothesis

*"A conversational garden advisor that remembers your garden profile will provide enough value to retain users and validate the knowledge engine before building spatial tools."*

---

## Next SWOT Trigger

Phase transition to Phase 2 (B2B Landscapers) or when first 10 users provide feedback.
