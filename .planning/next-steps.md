# Open Issues — Design Phase

Goal: Track architectural holes and unresolved design questions discovered during the research phase that need discussion before the init procedure is polished.

---

## Unresolved Holes

### Hole 8: Agent Communication in Autonomous Mode

**Severity**: Medium
**What**: `mode: autonomous` means "discussion takes place between agents." But the conversation protocol is undefined:
- How does the Researcher discuss with the Planner?
- How does the Team Lead mediate an agent-agent discussion?
- Where are discussion conclusions captured?

**Decided so far**: Not discussed in detail. Decision 004 only says the Team Lead spawns sub-agents via the Task tool.

**Needs**: Define the inter-agent communication protocol for autonomous mode.

---

### Hole 9: codebase scan (?)

should we use a mature coding scan solution like tree sitter + AST - how to approach this

---

### Hole 10: memory system

- what do you think about existing memory tools?

---

### Hole 11: Agent Overzealousness — Scope Creep During Task Execution

**Severity**: Medium
**What**: During the design phase, the implementing agent repeatedly performed actions beyond what was explicitly asked — adding more content than requested, editing files before getting permission, and anticipating next steps instead of waiting for the user. This manifested as:
- Writing full sections when only a heading was requested
- Moving or restructuring content without instruction
- Adding design decisions or templates before the user told them to

**Decided so far**: Not discussed in agent prompts. The existing agent .md files have no clause preventing this behavior.

**Needs**: All agent .md files need a clause explicitly forbidding overzealous behavior. The agent must execute only what is explicitly asked, wait for confirmation before taking action, and never anticipate or expand scope without instruction. This is especially critical for the Team Lead (which spawns sub-agents) and the Researcher (which handles discussion).

---

### Hole 12: Standalone Code Review (not in implementation loop)

**Severity**: Low
**What**: The verifier is only mentioned in the context of the implementation loop. There is no defined flow for when someone asks for a code review outside of a task — e.g. reviewing existing code, reviewing a PR before merging, or auditing a specific module.

**Needs**: Define how the Team Lead handles standalone code review requests. Should it spawn the verifier with a review request? Should there be a command?

---

## Resolved Holes

### Hole 1: Sprint Lifecycle (Complete/Transition) ✅

**Resolution**: Sprint is complete when all tasks in all phases are `done`. All notes from the sprint's phases and tasks are reviewed with the user to discuss impact on further development. Milestones are complete when all their requirements are done. Transition to the next sprint is triggered by the Team Lead.

### Hole 2: Requirement Type "discussion" Format ✅

**Resolution**: Discussion requirements use the same structure as all other types (definition + tasks + DoD + notes). The difference is in content: tasks describe conversation topics to resolve, and DoD is a documented decision with rationale. Both feature and discussion examples are now in init.md.

### Hole 3: No Retrospective/Learnings Mechanism ✅

**Resolution**: Retro happens at sprint completion — all notes from phases and tasks are collected and discussed with the user about how they impact further development. No separate retro file needed; the discussion itself is the retro mechanism.

### Hole 4: No Backlog for Unscheduled Ideas ✅

**Resolution**: `.planning/backlog.md` added to the project structure. A simple bullet-list file with no formal structure — ideas can be promoted to formal requirements when ready.

### Hole 5: Component Docs — Who Creates Them, When? ✅

**Resolution**: Component docs are created and refined during user discussion — they capture decisions made about each component. They may be amended after implementation if the actual implementation diverges from the discussed design. The `.docs/components/` directory can start empty and be populated as discussions progress.

### Hole 6: Init Procedure Inconsistencies (Mismatch with Decisions) ✅

**Resolution**: `commands/init.md` has been fully rewritten as a self-contained initiation procedure. All templates are embedded inline. All design decisions (001-015) are reflected. AGENTS.md, backlog, settings.json, model discovery, and design.md flag are all covered.

### Hole 7: settings.json Has No Guidance for Agents ✅

**Resolution**: Settings capture was added to Step 2 of the user discussion (mode, verification, max_parallel_tasks). The remaining piece — how agents read and act on these values — belongs in the agent prompts, to be written in a later phase.

---

## Init.md Review Findings (All Resolved)

| Finding | Resolution |
|---|---|
| Finding 1: outline.md template missing | Full template added with Overview, Goals, Architecture, Components, Tech stack, Design decisions, Open decisions |
| Finding 2: settings.json in discussion | Added bullet 5 to Step 2 asking about mode, verification, parallelism |
| Finding 3: no-jq fallback impractical | No-jq path now uses agent training knowledge + plain model list |
| Finding 4: "mode of operation" misleading | Renamed to `# session start` |
| Finding 5: "see design.md" reference vague | Changed to "see design.md in the Docs section below" |
| Finding 6: /init restart bug | Removed "run /init again" from finalize step |
| Finding 7: structure conflates instruction/content | `project-structure.md` is now project-specific summary, not a template copy |
| Finding 8: temp file not cleaned up | Added cleanup instruction at end of Step 3 |
| Finding 9: CODE_OF_CONDUCT / LICENSE missing | Added bullet 7 to Step 2 asking about licensing and CoC |

---

## Recently Resolved

| Issue | Resolution |
|---|---|
| DESIGN.md format | Decision 015 — Google's DESIGN.md format |
| Model discovery during init | Decision 013 — 7-step flow, jq/no-jq, 3 tiers |
| Agent config in opencode.json | Decision 013 — per-agent model assignment |
| design.md file | Decision 014 — relative paths from project root |
| Per-task spec splitting | Decision 012 — always split into per-task files |
| Sprint codenames | Decision 011 — model-generated adjective_scientist |
| settings.json | Decision 010 — mode, verification, max_parallel_tasks |
| Contribute.md template | Decision 007 — conventional commits, AI-assisted section |
| README.md template | Decision 006 — standard OSS + planning pointer |
| Init flow | Decision 004 — Team Lead prompts user for /init |
| No STATE.md | Decision 002 — planning files ARE the state |
| AGENTS.md pointer file | Decision 001 — minimal directory index |
| Discussion requirement format | Same structure as all types, examples in init.md |
| No backlog | .planning/backlog.md added |
| Sprint lifecycle / retro | Sprint complete when all tasks done, notes reviewed with user |
