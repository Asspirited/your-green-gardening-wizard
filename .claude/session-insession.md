# YGW Session In-Session Protocol — Trigger Map
# Standards: github.com/Asspirited/leanspirited-standards/protocols/session-insession.md
# Product-specific triggers below.

---

## Standard Triggers (all LeanSpirited products)

### Trigger: Strategic decision pending
Phrases: "is this worth building", "which should we do first", "what's the risk", "should we pivot"
→ Run SWOT. Output recommendation. Raise backlog item if actionable.

### Trigger: New bounded context proposed
Phrases: "separate from this", "new module", "different product"
→ Confirm bounded context separation. Create backlog file. Register prefix.

### Trigger: Phase transition
Phrases: "MVP done", "ready to move on", "expanding to"
→ Delta SWOT. Update CD3. Confirm next phase backlog sequence.

### Trigger: Backlog item ready to build
Phrases: "let's build", "start on", "implement"
→ Confirm Gherkin acceptance criteria exist. Confirm pipeline is green from last session. Then build.

### Trigger: Session running long
Phrases: "we're nearly out of time", "quick before we finish"
→ Flag: run session-closedown.md sequence before stopping. Don't lose decisions.

---

## YGW-Specific Triggers

### Trigger: Garden domain question
Phrases: "what plants", "soil type", "aspect", "hardiness", "planting matrix", "UK climate"
→ This is domain knowledge work. Flag if we're hardcoding knowledge vs making it AI-generated.
→ If hardcoding: is this a planting matrix item for the knowledge base?
→ If AI-generated: is the system prompt covering this adequately?

### Trigger: New commercial input from Oz or Jerry
Phrases: "Oz says", "Jerry thinks", "co-founder", "investor", "pilot"
→ Assess against current HDD hypothesis.
→ Does this change the phase sequence?
→ Raise a SWOT delta if significant.

### Trigger: User testing feedback
Phrases: "tested it", "user said", "someone tried", "feedback"
→ This is HDD Build-Measure-Learn data. 
→ Does it confirm or challenge the current hypothesis?
→ Update hypothesis statement if needed.
→ Re-run CD3+SWOT if it changes priorities.

### Trigger: Oz / Jerry ask about progress
→ The live URL and a 30-second demo description should always be ready.
→ Current hypothesis and what we're learning should be articulable in one sentence.

### Trigger: "borrow from RIA"
Phrases: "like RIA", "persona", "scoring agent", "like the assessor"
→ Note the pattern being borrowed.
→ Raise a backlog item for the integration.
→ Do NOT create coupling in Phase 1 code.

---

## Pipeline Rule
100% statement and branch coverage required. Full green before merge. No exceptions.

---

## Claude Behaviour Rules

### Rule: Asking Rod to find something
EVERY SINGLE INSTRUCTION must name the system explicitly: "In Cloudflare (dash.cloudflare.com)", "In GitHub (github.com/Asspirited)", "In your terminal", "In your browser".
Not "on that page". Not "in the dashboard". Not "click into the project". THE SYSTEM. EVERY TIME. NO EXCEPTIONS.
BETTER: derive it yourself first. Check known patterns (e.g. worker URL = `https://<worker-name>.leanspirited.workers.dev`), check config files, check existing working examples before asking Rod.
If you genuinely can't get it: one specific instruction naming the system, the section, and exactly what to look for.

### Rule: Is it worth doing? (xkcd.com/1205)
Before fixing, automating, or spending time on anything non-trivial, apply the time-value test:
- How often does this problem occur?
- How much time does it cost each occurrence?
- How long will the fix take?
If fix_time > (frequency × time_saved × ~260 sessions/year over 5 years) → note it, park it, move on.
Applies to: tooling tweaks, minor bugs, process improvements, "wouldn't it be nice if".
Does NOT apply to: correctness bugs, security issues, anything blocking delivery.
