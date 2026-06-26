# Product Design Fundamentals, Interview & Case-Study Primer
Built for your FieldFlō interviews · June 26, 2026

The goal of this doc isn't to turn you into a textbook PM. You already have the craft. This gives you the **language and process spine** to articulate what you already do intuitively, a **2-hour runbook** for the case study, and the **AI-native angle** that's your actual differentiator here. Skim it, don't study it.

---

## 0. How to use this today

- **10 minutes before the interview:** read §1 (the reframe) and §8 (the one-pager). That's the whole thing compressed.
- **During the 2-hour case study:** run §4 as a checklist. Keep it open in a second window.
- **If they ask "what's your process / why did you choose this":** §5 has the answer structures.
- **The differentiator they care about:** §6. Don't skip it. "AI-savvy + real design judgment" is the exact thing they're hiring for.

---

## 1. The reframe that makes you sound senior

The single most important mental shift to project in interviews:

> **Product design isn't making screens. It's closing the gap between what a user is trying to do and what the system forces them to do.** Screens are just one output.

Junior designers talk about what they made. Senior designers talk about the problem, the constraints, the options they considered, and why they chose what they chose. That last part is literally what Alan said they'll grill you on.

A clean way to frame "good product design" out loud, the four lenses (from IDEO / standard product thinking):

| Lens | The question | Who usually owns it |
|---|---|---|
| **Desirable** | Do users actually want this? | Design / research |
| **Usable** | Can they figure it out under real conditions? | Design |
| **Viable** | Does it make business sense? | Product / business |
| **Feasible** | Can we actually build it? | Engineering |

Your edge: you cover **desirable + usable** at a high craft level, and you can hold the other two in your head. Corey said he wants a designer stronger than himself who can also think through flows. This framing is you saying exactly that without bragging.

---

## 2. The canon, distilled

The "why behind good design." You don't need to read these books before today. Here's the usable core of each.

### Don Norman, The Design of Everyday Things (how humans actually use things)
The vocabulary here is gold in interviews because it's precise:

- **Affordance**, what an object lets you do (a button affords pressing). **Signifier**, the cue that tells you it's there (the way it looks pressable). Most "confusing UI" is a missing signifier.
- **Mapping**, controls match their effects in a natural way (volume slider goes up = louder).
- **Feedback**, every action gets an immediate, visible response. Field software lives or dies here (did my time entry save? did it sync?).
- **Constraints**, design that makes the wrong action impossible beats design that warns you after.
- **Conceptual model**, the user's mental story of how the thing works. Your job is to make the interface match the story in their head, not the database schema.
- **Gulf of Execution / Gulf of Evaluation**, the distance between what I want to do and figuring out how, and between what happened and understanding it. Good design shrinks both gulfs.
- The ethos: **"When people have trouble with something, it isn't their fault, it's bad design."** Say something like this and you sound user-centered to the bone.

### Jakob Nielsen, 10 Usability Heuristics (your highest-ROI interview vocabulary)
These are the industry's shared checklist. Name-dropping two or three precisely when critiquing a design makes you sound fluent. Memorize the gist:

1. **Visibility of system status**, always show what's happening (saving, syncing, loading).
2. **Match between system and real world**, speak the user's language, not the system's.
3. **User control and freedom**, easy undo / exit; no dead ends.
4. **Consistency and standards**, follow platform conventions; don't reinvent.
5. **Error prevention**, stop mistakes before they happen (the best error message is none).
6. **Recognition rather than recall**, show options; don't make people remember.
7. **Flexibility and efficiency**, shortcuts for pros, simple paths for novices.
8. **Aesthetic and minimalist design**, every extra element competes with the essential ones.
9. **Help users recognize, diagnose, recover from errors**, plain-language errors with a way out.
10. **Help and documentation**, ideally unneeded, but available and searchable.

For FieldFlō specifically, #1 (status/sync), #2 (crew language, not accounting language), #5 (error prevention for gloved, distracted users), and #6 (recognition over recall) are the ones that bite hardest in the field.

### Dieter Rams, 10 Principles (you watched these, here's how to use them at FieldFlō)
You've got the list. The move in the interview isn't to recite them, it's to apply one or two to FieldFlō's context. Field software for crews in harsh, time-pressured, low-connectivity environments is almost a perfect Rams problem:

- **Useful + Understandable**, a foreman in the sun with gloves on has zero patience for a clever interface. Self-evident wins.
- **Unobtrusive**, the software should get out of the way of the actual work (pouring concrete, abatement), not demand attention.
- **As little design as possible**, every field a crew member has to fill is friction and a place to fail. Ruthless reduction is the whole game in field adoption.
- **Thorough down to the last detail**, offline states, sync conflicts, the 2% edge cases are the product in the field. This is where you show senior-level thinking.
- **Honest**, no dark patterns. Relevant to AI features especially (see §6).

If you connect Rams' "as little design as possible" to FieldFlō's field-adoption problem, you'll sound like you already work there.

### Laws of UX, Jon Yablonski (cognitive load & friction)
Psychology principles with memorable names. Useful for explaining why a choice reduces friction:

- **Hick's Law**, more choices = slower decisions. Reduce options on field screens.
- **Fitts's Law**, targets that are bigger and closer are faster to hit. Big tap targets for gloved hands.
- **Jakob's Law**, users expect your product to work like the other products they already know. Don't make crews relearn.
- **Miller's Law**, people hold ~7 items in working memory. Chunk information.
- **Tesler's Law (conservation of complexity)**, complexity can't be eliminated, only moved. Every step you remove from the user, someone (the system, the admin) absorbs. Senior insight: decide who should carry the complexity.
- **Doherty Threshold**, keep system response under ~400ms or people disengage. Perceived performance is a design problem.
- **Aesthetic-Usability Effect**, people perceive attractive interfaces as more usable and forgive minor issues. This is the literal business case for your craft, useful to name when talking to Corey.
- **Peak-End Rule**, people judge an experience by its peak and its end, not the average. Design the moments that matter.

### Steve Krug, Don't Make Me Think (the field-software mantra)
The whole book in three lines: **people don't read, they scan. They don't make optimal choices, they satisfice (pick the first thing that works). Self-evident beats clever.** This is the mindset for blue-collar field users. "Don't make me think" should basically be your design north star for FieldFlō's field side.

### Accessibility & context-of-use (your quiet FieldFlō edge)
Most designers treat accessibility as compliance. Reframe it as **designing for real conditions**: sunlight glare, gloves, noise, one free hand, dust, spotty signal, fatigue, varying literacy and language. High-contrast, large targets, minimal typing, offline-first, forgiving inputs. If you bring up "context of use" for field crews, you're demonstrating exactly the empathy that separates office-software designers from people who can design for the field.

---

## 3. The process spine (the engine for your case study)

You already do this intuitively. Here's the named version so you can narrate it.

### The Double Diamond (the backbone of any case-study story)
Two diamonds, each diverging then converging:

1. **Discover** (diverge), explore the problem space. Who's the user, what's actually going wrong, what's the context?
2. **Define** (converge), frame the one problem worth solving. Output: a sharp problem statement.
3. **Develop** (diverge), generate many solution options. Sketch broadly before committing.
4. **Deliver** (converge), refine, build, validate the chosen direction.

The senior move is naming which diamond you're in and **why you narrowed where you did.** "I generated four directions, then converged on this one because [constraint + user + business]."

### Jobs To Be Done (JTBD), frame the user's actual goal
> When [situation], I want to [motivation], so I can [expected outcome].

e.g. "When I finish a job site at end of day, I want to log crew hours in under a minute, so I can leave without paperwork following me home." JTBD keeps you focused on the outcome, not the feature. Drop one of these in the case study and it signals maturity.

### Problem framing tools
- **"How Might We…"**, turn a problem into an open design question. "How might we let a foreman log hours without typing?"
- **First-principles / 5 Whys**, keep asking why until you hit the real constraint, not the requested feature.
- **Reframing**, the requested solution is rarely the real problem. Show you can tell the difference (gently, don't reject their prompt, expand it).

### The artifact ladder (low → high fidelity, cheap → expensive)
Proto-persona → journey map → **user flow / wireflow** → low-fi wireframes → interaction/prototype → hi-fi visual → validation. The principle: **stay low-fidelity as long as possible.** You validate the thinking before you spend time on pixels. For a 2-hour case study this discipline is survival.

### Validation
- **Heuristic evaluation**, check your own design against Nielsen's 10.
- **Usability testing**, even imagining "I'd put this in front of 3 foremen and watch where they hesitate" shows you don't fall in love with your own work.

### What to leave behind (your AI-native instinct, per your own framing)
Bring the thinking, drop the bureaucracy: heavyweight waterfall deliverables, exhaustive upfront research when a quick test would answer it, pixel-perfect comps before the concept is validated, and ego about hand-crafting every artifact. Modern + AI-native means you compress the ladder, not skip the rigor.

---

## 4. The 2-hour case-study runbook

Alan's intel: ~2-hour window, real FieldFlō project, complex prompt (read it 2-3x), they want **1.5 hrs on interaction/UX, last 0.5 hr on design flair close to the FF aesthetic**, and leaning on Claude is encouraged. Here's a timebox that maps to that and to the questions they'll ask.

| Time | Phase | What you produce | Notes |
|---|---|---|---|
| **0:00-0:15** | **Understand** | Re-read prompt 2x. Write the problem in your own words + who the user is + the context-of-use + constraints + what success looks like. | This 15 min is the "how did you understand the problem" answer. Use Claude to pressure-test your read of the prompt, not to do your thinking. |
| **0:15-0:30** | **Frame** | One sharp problem statement + 1-2 JTBD statements + a short list of "How Might We." Note assumptions explicitly. | Naming assumptions is a senior tell. |
| **0:30-1:00** | **Diverge** | 3-4 rough solution directions (boxes-and-arrows / quick sketches). Pick one and write why, tie to user + constraint + business. | The "why you chose what you chose" answer is written here, in real time. Keep the rejected options, they're proof of rigor. |
| **1:00-1:30** | **Flows & interaction** | The core user flow end-to-end + key screens as wireframes. Handle the unhappy paths: empty, error, offline, edge cases. | This is the 1.5-hr "interaction" focus Alan flagged. Edge/error states are where you out-design most candidates. |
| **1:30-2:00** | **Craft pass** | Apply FF visual aesthetic to the hero screens. Polish hierarchy, spacing, the peak moment. | The 0.5-hr "flair." Don't gold-plate everything, make the 1-2 screens that matter shine (Peak-End Rule). |
| (rolling) | **Narrate** | Keep a running 5-8 line log of decisions + tradeoffs. | This becomes your walkthrough script. Decisions you can't explain don't count. |

**How to use Claude honestly inside it** (they want to see this): use it to pressure-test your problem framing, generate option breadth fast, draft microcopy/error states, and sanity-check against Nielsen's heuristics, then **say out loud where your judgment overrode it.** "I had Claude generate six empty-state options; I killed five because they added words a foreman doesn't need." That sentence is the whole job description in one breath.

---

## 5. Interview articulation

### The three questions they will ask (Alan told you these)
1. **What was your process?** → walk the Double Diamond, briefly, with your decisions at each step.
2. **How did you come to understand the design problem?** → the 0:00-0:30 work: re-reading, reframing, naming the user + context + constraints + assumptions.
3. **Why did you come up with what you came up with?** → the decision log: options considered → the one you chose → the tradeoff you accepted.

### The answer structure (use for almost any design question)
> **Problem → Constraints → Options I considered → Decision + why → Tradeoff I accepted → How I'd validate.**

That sequence makes you sound senior every time. Most candidates skip "options I considered" and "tradeoff I accepted", those two are what signal judgment.

### Read the room: Atul vs. Corey
- **Atul (CPO, ex-engineer, built FieldRoutes/ServiceTitan, serious, listens deeply, PM rigor).** Lead with the **problem, constraints, tradeoffs, and feasibility.** Be concise; he weighs his words and respects people who do too. Don't oversell, he'll spot it. If you're unsure, say so and reason out loud; he values thinking over polish.
- **Corey (wants a designer stronger than himself, craft-oriented).** Show **taste, systems thinking, and detail**, talk hierarchy, restraint, the aesthetic-usability effect, how you'd build a consistent component language across ~13 modules. He'll enjoy a peer-level craft conversation.

### Vocabulary cheat sheet (so the "lingo" is fluent, not forced)
Affordance · signifier · conceptual model · mental model · information architecture (IA) · user flow / wireflow · progressive disclosure · happy path / unhappy path · edge case · empty / error / loading state · error prevention vs. recovery · heuristic evaluation · fidelity (low/hi) · design system / tokens / components · cognitive load · friction · north-star metric · guardrails · jobs-to-be-done · divergent/convergent.

### Honest-positioning lines (your rule)
- "My visual craft is the strength; I'm sharpening the formal product-process vocabulary, but the flows-and-systems thinking is already how I work."
- "Claude is my second brain for breadth and speed. The problem-framing, the judgment, and the quality bar are mine, I'm deliberate about not outsourcing those." (This mirrors your own 'don't let my brain turn to mush' instinct, it'll read as genuine, because it is.)

---

## 6. The AI-native fusion (your real differentiator)

FieldFlō is explicitly AI-native and hiring people "savvy with AI." But the trap is sounding like AI replaces design thinking. The winning narrative is the opposite: **AI raises the premium on fundamentals.** Here's the thesis, backed by where the field actually is in 2026:

**From making → deciding.** When AI can generate dozens of UI options in minutes, your value moves from producing screens to deciding which problem is worth solving and which option is right. The bottleneck is judgment, not production.

**Taste becomes the filter.** When anything can be built, not everything should be. AI generates endlessly; restraint ("as little design as possible", Rams) is now a competitive advantage, not a nicety.

**AI gets you ~60%, you own the last 40%.** AI is strongest early, beating the blank canvas, ideation, first drafts. The polish, the nuance, the edge cases, the conceptual coherence, still human. Say this; it's the current consensus and it's true.

**Frame the problem before you prompt.** The skill is stating the right problem, constraints, and success criteria so AI generates something useful. Garbage framing in, garbage options out. Your process spine (§3) is exactly what makes your prompting good.

### Map each fundamental to the AI workflow

| Fundamental | How it shows up in AI-native work |
|---|---|
| Problem framing / JTBD | The input quality that determines whether AI output is useful at all. You own it. |
| Divergence (Double Diamond) | AI is a divergence engine, generate 10 directions fast. But **you converge** using heuristics + taste. |
| Nielsen heuristics / Rams | Your rubric for editing AI output, killing the bloat, catching the dishonest pattern, keeping the essential. |
| Edge / error / offline states | What AI consistently under-designs. This is where you visibly add value. |
| Conceptual model coherence | AI optimizes locally per screen; you keep the whole system telling one coherent story. |
| Honesty / anti-dark-patterns | Matters more with generative UIs, AI can confidently produce manipulative or misleading flows. You're the guardrail. |
| Accessibility / context-of-use | AI doesn't know a foreman is wearing gloves in the sun with no signal. You do. |

### What AI is still bad at (own these out loud)
Knowing which problem to solve · edge/error/failure states · keeping a system coherent across modules · real context-of-use empathy · taste and restraint · ethics. These are your moat.

### The one honest sentence to land it
> "I use AI to expand options and move fast, but the fundamentals are what let me tell the good options from the bad ones, and that gap gets more valuable, not less, as the tools get better."

---

## 7. Resource map (tiered for your actual timeline, today)

You don't have time to read books before this interview. Here's the triage.

### If you have 10 minutes right now
- **Nielsen's 10 Usability Heuristics**, NN/g (nngroup.com). Skim the list, internalize 3. Highest interview ROI per minute.
- **Laws of UX**, lawsofux.com. One-line-per-law site; skim for the named principles in §2.
- **Re-read §8 of this doc.** Honestly the best use of the 10 minutes.

### After today / this week (to actually deepen)
- **The Shape of AI**, shapeof.ai. The reference library of UX patterns for AI products (onboarding, trust, failure states, human-in-the-loop). Directly relevant to FieldFlō's AI features. Browse it before the case study if you have an hour.
- **Google PAIR, People + AI Guidebook** (pair.withgoogle.com/guidebook), the practical playbook for designing AI/probabilistic features (trust, errors, feedback). Pairs perfectly with your AI-native pitch.
- **Teresa Torres, Continuous Discovery Habits**, the modern answer to "how do I keep talking to users and tie decisions to outcomes." This is the process language Atul will respect.

### The deeper canon (durable, post-interview)
- **Don Norman, The Design of Everyday Things**, the foundation. If you read one design book ever, this.
- **Steve Krug, Don't Make Me Think**, short, practical, perfect for field-software thinking.
- **Cooper, Reimann et al., About Face**, comprehensive interaction-design reference.
- **Jon Yablonski, Laws of UX**, the book version of the site; psychology of design.
- **Lidwell et al., Universal Principles of Design**, 125 principles, great browse-and-reference.
- (Skim, don't revere: **Hooked** (Eyal) and **Lean UX** (Gothelf/Seiden), useful vocabulary, but you don't need them for this.)

### Watch / listen (passive, good for commute-before-interview)
- The **vaexperience** Rams video you already watched, you've got it; §2 shows how to apply it.
- **NN/g YouTube**, short, rigorous clips on specific heuristics and methods.

---

## 8. One-page "say this" cheat sheet

**The reframe:** Product design is closing the gap between what users want to do and what the system makes them do. I think in problems and flows; screens are the output.

**5 principles to have on the tongue:**
1. Don't make me think, self-evident beats clever (Krug).
2. As little design as possible, reduction is the job (Rams).
3. Match the user's mental model, not the database (Norman).
4. The best error message is the error that can't happen (Nielsen #5).
5. Edge cases, error and offline states are the product in the field.

**The process in one line:** Understand → frame the one problem worth solving → diverge on options → converge with reasons → design the flow incl. unhappy paths → validate. (Double Diamond.)

**Any design answer, this structure:** Problem → Constraints → Options I considered → Decision + why → Tradeoff I accepted → How I'd validate.

**The three questions they'll ask:** What was your process? How did you understand the problem? Why this solution? Answer all three from your live decision log.

**AI-native one-liner:** "AI expands my options and speed; fundamentals are how I tell good options from bad ones, and that gap gets more valuable as the tools improve."

**Tone:** Concise with Atul (problem, constraints, tradeoffs, he listens hard). Craft with Corey (taste, systems, detail). Honest with both, the strength is your craft; the process vocabulary is sharpening; the judgment is yours.

**You've got this.**
