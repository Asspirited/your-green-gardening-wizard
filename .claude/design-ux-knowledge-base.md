# Design Thinking & UX Knowledge Base
# LeanSpirited — append to .claude/claude.md or session-insession.md
# Produced March 2026

---

## Part 1: Design Thinking Frameworks

### 1. Stanford d.school — 5-Stage Design Thinking
**Source:** dschool.stanford.edu | Hasso-Plattner Institute of Design at Stanford
**Nature:** Non-linear, iterative. Stages are modes, not sequential steps.

| Stage | What it means for us |
|---|---|
| **Empathise** | Understand users through observation, interview, immersion — not assumption. Oz's field interviews live here. |
| **Define** | Distil findings into a clear, user-centred problem statement. "How might we...?" questions. The pivot this session is a Define moment. |
| **Ideate** | Diverge — quantity over quality. Backlog ideation sessions. No constraints yet. |
| **Prototype** | Build to think, not to ship. Feature branches are prototypes until validated. |
| **Test** | Validate with real users. The Ollie test is a Test stage activity. |

**Key principle:** Bias toward doing. Design thinking is a misnomer — it is more about making than thinking.

---

### 2. Design Council — Double Diamond
**Source:** designcouncil.org.uk | UK Design Council, 2004/2019/2023
**Nature:** Diverge → converge, twice. Problem space first, solution space second.

```
PROBLEM SPACE          |  SOLUTION SPACE
Discover → Define      |  Develop → Deliver
(diverge) (converge)   |  (diverge) (converge)
```

**Four phases:**
- **Discover:** Explore widely. Don't assume the problem. User research, observation, market research.
- **Define:** Converge on the real problem. Challenge definition, insight synthesis.
- **Develop:** Explore solutions. Ideation, prototyping, co-design.
- **Deliver:** Converge on a solution. Test, iterate, ship small, measure.

**Critical note (2019 update):** The Design Council acknowledged the original was too linear. The updated framework is iterative — teams regularly loop back from Develop to Discover when new evidence demands it. This maps directly onto our HDD outer loop.

**Honest flag:** The Double Diamond has no built-in measurement loop. This is why we layer HDD on top — the validated learning cycle provides what the Diamond omits.

---

### 3. IDEO — Inspiration → Ideation → Implementation
**Source:** ideo.com | David Kelley / Tim Brown
**Nature:** Cyclical, learning-oriented.

- **Inspiration:** Understand the problem space through user immersion.
- **Ideation:** Synthesise insights into creative solutions.
- **Implementation:** Prototype, test, iterate, ship.

**Useful distinction from d.school:** IDEO emphasises *ongoing evolution* — products are never finished, they continuously incorporate learning. This aligns with our Build-Measure-Learn HDD loop.

---

### 4. Jobs to Be Done (JTBD)
**Sources:** Tony Ulwick (Outcome-Driven Innovation, Strategyn) / Clayton Christensen (Harvard) / Bob Moesta (Demand-Side Sales)
**Nature:** Lens, not a process. Reframes what a product *is* and who it competes with.

**Core idea:** Customers don't buy products — they *hire* them to make progress in their lives. The job is stable; the solution changes. (Records → cassettes → CDs → streaming are all hired for the same job: music on the go.)

**Applied to YGW:**

| Persona | Functional job | Emotional job | Social job |
|---|---|---|---|
| Skilled amateur | Plan my garden so it looks good | Feel confident and competent | Show others I have good taste |
| Landscaper | Produce a credible client proposal quickly | Feel like a professional, not an amateur | Impress clients, win more work |

**Ulwick's Outcome-Driven Innovation (ODI):** Break the job into steps. For each step, identify the outcome statement the user uses to measure success. Find which outcomes are underserved. Build for those.

**Practical use in session:** Before designing a feature, ask: *what job does this hire the product to do?* If the answer is the same job an existing feature already does, you don't need the feature.

**Key quote (Levitt via Christensen):** "People don't want to buy a quarter-inch drill. They want a quarter-inch hole." The hole is the job.

---

## Part 2: UX & Usability Sources

### 5. Nielsen Norman Group — 10 Usability Heuristics
**Source:** nngroup.com | Jakob Nielsen & Rolf Molich, 1990/1994, updated 2024
**Nature:** 10 broad rules of thumb. Not prescriptive guidelines — diagnostic lens.

| # | Heuristic | Applied to YGW |
|---|---|---|
| 1 | Visibility of system status | Loading states, generation progress, "Wizard thinking..." feedback |
| 2 | Match between system and real world | Use gardening language, not AI/technical language |
| 3 | User control and freedom | "Start again" always visible; undo brief inputs |
| 4 | Consistency and standards | Plant cards, proposal outputs — consistent layout every time |
| 5 | Error prevention | Validate brief fields before API call; don't let empty briefs generate |
| 6 | Recognition over recall | Show brief summary alongside results; don't make user remember what they entered |
| 7 | Flexibility and efficiency | Landscapers need shortcuts (saved briefs, templates); amateurs need the full wizard |
| 8 | Aesthetic and minimalist design | Proposal output: remove everything the client doesn't need to see |
| 9 | Help users recognise/recover from errors | Clear error messages; retry on API fail; never silent failures |
| 10 | Help and documentation | Tooltips on less obvious fields (soil type, aspect) — not help docs, inline hints |

**Practical use in session:** When reviewing any new feature, run a heuristic pass against these 10. Takes 10 minutes. Catches obvious problems before build.

---

### 6. Steve Krug — Don't Make Me Think
**Source:** *Don't Make Me Think* (2000, revised 2014) | Steve Krug
**Nature:** Practical web usability. Written for practitioners, not academics.

**Core principle:** A person of average (or below average) ability and experience can figure out how to use a product to accomplish something without it being more trouble than it's worth.

**Rules most relevant to YGW:**
- Every page/screen should be self-evident. If it requires thought, redesign it.
- Omit needless words. Cut instructional text in half, then cut it again.
- Design for scanning, not reading. Users scan; they don't read.
- The first question on every screen: "Where am I? What can I do here? Where do I go next?" — answer all three without asking the user to think.
- Conventions exist for a reason. Don't break them unless your alternative is dramatically better.

**Applied to YGW amateur persona:** The wizard steps should require zero reading. Labels, selects, a button. Done. If a user needs to read instructions, the step is too complex.

---

### 7. Don Norman — The Design of Everyday Things
**Source:** *The Design of Everyday Things* (1988, revised 2013) | Don Norman
**Nature:** Foundational cognitive science of design. More conceptual than Krug but essential.

**Key concepts for our work:**
- **Affordances:** Design should make it obvious what actions are possible. A "Generate Plant Palette" button should look like a button.
- **Feedback:** Every action needs a response. API calls need visible loading states.
- **Slips vs Mistakes:** Slips are execution errors (tapped wrong thing); mistakes are knowledge errors (chose wrong option because they misunderstood). Design prevents both differently.
- **Mental models:** Users build a model of how the system works. YGW's wizard should confirm and reinforce the model at every step — not surprise users.
- **Error-centred design:** If a user makes an error, the design is at fault, not the user.

---

### 8. Additional UX sources — recommended additions

**Currently covered:** Nielsen/Norman heuristics, Krug (usability), Norman (cognitive).

**Gaps worth filling for YGW specifically:**

| Source | Why relevant |
|---|---|
| *Hooked* — Nir Eyal (2014) | Habit formation in products. Directly relevant to sticky engine. Trigger → Action → Variable Reward → Investment loop. |
| *Continuous Discovery Habits* — Teresa Torres (2021) | Modern product discovery. Opportunity solution trees. Weekly user interviews as standard practice. Oz's interview programme maps here. |
| *The Mom Test* — Rob Fitzpatrick (2013) | How to run customer interviews without getting lies. Essential for Oz. Most interview feedback is useless unless asked correctly. |
| Baymard Institute (baymard.com) | Evidence-based UX research. Conversion optimisation. Checkout and form design patterns. Relevant when YGW adds payment flows. |
| Google HEART framework | Happiness/Engagement/Adoption/Retention/Task Success. Pairs well with AARRR for measuring UX quality at product level. |

**Immediate recommendation:** *The Mom Test* for Oz before his next round of landscaper interviews. The four landscaper pains Oz surfaced this session may or may not be real — The Mom Test would tell him whether his questions were leading or honest.

---

## Part 3: How These Frameworks Nest with TDD-BDD-DDD-HDD

```
HDD (outer loop — Eric Ries Build-Measure-Learn)
│   ← JTBD tells us WHICH job to solve
│   ← Double Diamond keeps us in the problem space long enough
│
├── DDD (design loop — session to session)
│   ← d.school Empathise/Define modes operate here
│   ← Nielsen heuristics applied during design review
│   ← Norman: affordances, feedback, mental models in every design decision
│
├── BDD (session loop — acceptance criteria)
│   ← d.school Prototype/Test modes operate here
│   ← Krug: every AC should include "does the user need to think?"
│   ← Session ACs must include what we expect to learn (validated learning)
│
└── TDD (code loop — seconds/minutes)
    ← Implementation detail only
    ← No design framework applies here — this is green pipeline territory
```

---

## Part 4: Session Protocol Triggers (append to session-insession.md)

### New trigger: DESIGN_REVIEW

**When to fire:** Before any feature is built. After any prototype or mockup is produced.

**Sequence:**
1. Run JTBD check: what job does this hire YGW to do? Is it underserved?
2. Run Double Diamond check: are we in the right diamond? (Are we defining the problem or delivering a solution?)
3. Run Nielsen heuristic pass: scan all 10 against the proposed interface. Flag any violations.
4. Run Krug check: can a user figure this out without reading instructions?
5. Log findings as named notes against the backlog item before build begins.

### New trigger: INTERVIEW_PREP

**When to fire:** Before Oz runs any customer interview session.

**Sequence:**
1. Apply Mom Test principle: reframe all questions to ask about past behaviour, not hypothetical future behaviour.
2. Apply JTBD frame: ask what job the user is currently hiring an alternative product to do, not what features they want.
3. Define what validated learning would look like from this session — what would change our HDD hypothesis?
4. Log interview questions as a BDD scenario: `Given [context], When [question asked], Then [what answer would validate / invalidate hypothesis]`.

### New trigger: FEATURE_IDEATION

**When to fire:** When generating new feature ideas (as in this session).

**Sequence:**
1. Apply JTBD: frame each idea as a job story — `When [situation], I want to [motivation], so I can [expected outcome]`.
2. Apply engine check: does this feature serve the Viral engine, Sticky engine, or both? Features that serve neither are backlog noise.
3. Apply Double Diamond: is this a Discover/Define idea (we need to learn more) or a Develop/Deliver idea (we know enough to build)?
4. Score with CD3 before committing to Gherkin.

---

*Produced March 2026 · LeanSpirited · Applies across YGW and Cusslab projects*
*Commit to: .claude/design-ux-knowledge-base.md in Asspirited/cusslab*
