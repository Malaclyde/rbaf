# Comparative Analysis: Project Structure & Agent Behavior Frameworks

Date: 2026-05-15
Goal: Compare the project idea against state-of-the-art community projects, identify gaps, and propose improvements.

---

## 1. The Landscape: What Exists

### 1.1 Entrypoint Files (Universal Convention)

Every major framework uses a root-level Markdown file as an agent entrypoint:

| File | Used By | Status |
|------|---------|--------|
| `AGENTS.md` | Cursor, Codex, Copilot, OpenCode, Gemini CLI, Windsurf, Aider, 60K+ projects | **De facto standard** — stewarded by Agentic AI Foundation (Linux Foundation) |
| `CLAUDE.md` | Claude Code, Claude Desktop | Claude-specific but converging on AGENTS.md support |
| `GEMINI.md` | Gemini CLI | Google-specific |
| `.cursor/rules/` | Cursor | IDE-specific — `.mdc` files with YAML frontmatter |
| `.claude/rules/` | Claude Code | Path-gated YAML + Markdown |
| `.windsurf/rules/` | Windsurf | Manual/Model/Glob activation modes |
| `.clinerules/` | Cline | Path-based + open-tabs aware |
| `.github/copilot-instructions.md` | Copilot | Microsoft — glob-scoped |
| `.openhands/microagents/` | OpenHands | Persistent knowledge docs |

**Key insight**: AGENTS.md is replacing fragmented conventions. The Agentic AI Foundation (Linux Foundation), `.agents` protocol (dotagentsprotocol.com), and OpenCode itself all support it. Any new framework MUST either adopt AGENTS.md or justify why not.

### 1.2 Project Structure Frameworks

Three tiers of project structure frameworks exist:

| Framework | Stars | Philosophy | Structure Convention |
|---|---|---|---|
| **GSD** | 62K | Heavy ceremony, 30+ workflows, full lifecycle | `.planning/` with PROJECT.md, ROADMAP.md, STATE.md, REQUIREMENTS.md, MILESTONES.md, config.json, phases/ |
| **Spec Kit** (GitHub) | 100K | Spec-driven development with slash commands | `.specify/` with constitution.md, specs/, templates/ |
| **OpenSpec** (Fission-AI) | 48K | Lighter SDD, "fluid not rigid" | `openspec/changes/` with proposal.md, specs/, design.md, tasks.md |
| **BMAD Method** | 47K | Agile AI-Driven Development, 12+ agents | Module ecosystem with party mode |
| **Living Docs** | 15 | Governance-based docs, one file owns each rule | `agent.md` → `docs/` with registry |
| **MetaGPT** | 68K | Multi-agent software company simulation | One-line requirement → full artifacts |
| **GPT Pilot** | 34K | Step-by-step multi-agent development | Internal pipeline, no `.md` conventions |

### 1.3 Behavioral Frameworks

| Framework | Approach | Key Mechanism |
|---|---|---|
| **GSD** (temp/) | Heavy formal process | 30+ specialized sub-agent prompts, phase-gated workflows, adversarial verification |
| **Caveman** (temp/) | Output compression | 6 intensity levels, hook-based activation, MCP proxy, auto-clarity safety |
| **Squire** (community) | Behavioral rule set | 63 commands, 318 skills, 23 agents, each addressing a specific failure mode |

---

## 2. How This Project Compares

### 2.1 Positioning

```
Caveman ←──── [THIS PROJECT] ────→ GSD
(terse       (behavioral     (heavy ceremony,
 responses)   framework        30+ workflows,
              with structure)   adversarial verif.)
```

The target is well-chosen. Caveman optimizes output. GSD optimizes process. This project optimizes **agent behavior definition + project knowledge structure** without ceremony overload.

### 2.2 What This Project Does Well

| Strength | How It's Implemented | Community Validation |
|---|---|---|
| **Tool-agnostic agent prompts** | Agents reference "available tools" generically, not specific tool names | Universal best practice — Anthropic, OpenAI, Google all recommend this |
| **Project structure in project file** | `project-structure.md` lives in `.docs/`, not in prompts | GSD does this identically. Spec Kit does similarly. Key principle: structure should evolve per-project |
| **File-per-unit context isolation** | Phases, specs, requirements, milestones, components each in separate files | GSD's core innovation. Spec Kit divides specs/tasks. Community has validated this pattern |
| **Agent delegation tree** | Team Lead → Planner/Researcher/Verifier/Coders/Task Tracker/Ad-Hoc | Matches the "manager pattern" recommended by OpenAI. Matches GSD's executor/planner/verifier split |
| **Separation of planning from docs** | `.planning/` vs `.docs/` | GSD does this identically. Sensible separation of "what we're doing" from "what we are" |
| **Mode toggle** | `mode.md` — human-in-the-loop vs autonomous | GSD has `config.json` with `mode` field. Valuable for hybrid autonomy |
| **Requirement typing** | feature/bugfix/research/discussion | GSD has similar categorization. OpenSpec has proposal types |
| **Definition of Done** | Per-requirement checkboxes | Spec Kit enforces this. Adopted from Scrum — proven effective |
| **Milestone versioning** | Semantic versioning vX.Y.Z | Standard in every framework |

### 2.3 How It Differs from GSD (and Why That's Good)

| Aspect | GSD | This Project |
|---|---|---|
| **Agent definitions** | Hardcoded job-specific tool access. 30+ specialized sub-agents. | 10 role-based agents with behavioral guidance. Tool access left to harness. |
| **Workflow system** | 30+ slash commands, strict phase pipeline | Implicit in team lead's coordination logic |
| **Verification** | Goal-backward with 5 thinking models + Nyquist auditor | Verifier agent (stub — undefined) |
| **State persistence** | STATE.md <100 lines, 7 stats tracked | Memory system (referenced in prompts, not project-level file) |
| **Config** | config.json with 10+ settings | mode.md with 2 values |
| **Entrypoint** | Auto-assembled CLAUDE.md from 7 marker-bounded sections | None (gap) |
| **Learnings** | RETROSPECTIVE.md / LEARNINGS.md cross-milestone | None (gap) |
| **Parallel execution** | Wave-based with dependency graph | Implicit: multiple tasks in a phase = parallel. No mechanism defined. |

---

## 3. Logic Gaps & `[research needed]` Markers

### 3.1 Critical Gaps (Architectural)

#### Gap 1: No Agent Entrypoint File

Every major framework uses AGENTS.md, CLAUDE.md, or GEMINI.md as an entrypoint. This project has no equivalent. Without an entrypoint:
- Agents don't know where to start reading project context
- There's no "onboarding document" for agents unfamiliar with the project
- Cross-session continuity depends entirely on the agent reading all `.planning/` and `.docs/` files

**Recommendation**: Add an entrypoint file convention. This could be AGENTS.md (adopted by OpenCode) that points agents to `.planning/` and `.docs/` as progressive disclosure layers.

#### Gap 2: No State/Memory File

GSD's STATE.md is critical for session continuity — it captures current position, pending decisions, metrics, and session pointers. This project references a "memory system" in agent prompts but has no project-level state file. How does the Team Lead know:
- What was the last completed task?
- What decisions are pending?
- Where did the last session leave off?

**Recommendation**: Add a STATE.md or equivalent in `.planning/` that survives context resets. This is the single most-requested feature across all agent platforms.

#### Gap 3: No Configuration File

`mode.md` captures 1 dimension (human vs autonomous). But what about:
- How many parallel coding agents can the team lead spawn?
- Should verification be required before implementation?
- What is the safety threshold for autonomous execution?
- Which model powers which agent?

GSD addresses this with `config.json`. Spec Kit uses `.specify/memory/constitution.md`.

**Recommendation**: Either expand `mode.md` or add a `config.json`/`config.md` to `.planning/`.

#### Gap 4: No Rules/Conventions System

Every major tool has a rules system:
- Cursor: `.cursor/rules/*.mdc` (YAML frontmatter + content)
- Claude Code: `.claude/rules/*.md` (path-gated)
- Windsurf: `.windsurf/rules/*.md` (manual/model/glob activation)
- Cline: `.clinerules/*.md` (path + open-tabs aware)
- Copilot: `.github/copilot-instructions.md` (glob-scoped)

This project has NO rules system. Project-specific coding conventions, architectural rules, and framework preferences have nowhere to live. Agents either need them hardcoded in prompts (bad) or there's no mechanism.

**Recommendation**: Add a `.rules/` directory or integrate with AGENTS.md + progressive disclosure.

#### Gap 5: PLANNER.md is Empty

The planner is the second most important agent after the Team Lead. Without its definition, the entire planning phase is undefined. The planner needs to:
- Create requirements from project vision
- Structure requirements into tasks
- Order tasks into phases and sprints
- Handle re-planning when bugs reveal design issues
- Create discussion requirements when design decisions need rethinking

The Team Lead already references "planner" 7 times in its prompt. The empty file means these references are unresolved.

**Recommendation**: Highest priority fill.

#### Gap 6: No Git/Worktree Strategy

GSD has extensive worktree safety guards (branch protection, cwd-drift detection, absolute-path safety). Aider pioneered git-as-safety with auto-commit per edit. The Team Lead references `[NEEDED: an agent to prepare the development environment - github WORKTREES]` but this is never resolved.

Without git integration:
- How are AI changes isolated from human work?
- How is undo handled?
- How do parallel coding agents avoid conflicts?

**Recommendation**: Add git workflow conventions and worktree strategy.

#### Gap 7: No Parallel Execution Mechanism

Phases can contain multiple tasks (implying parallelism). But:
- How does the Team Lead spawn parallel agents?
- How does it collect and merge results?
- How does it handle conflicts between parallel coders?
- What's the maximum concurrency?

GSD uses explicit wave-based parallelism with dependency graphs. This project has the concept but no implementation.

**Recommendation**: Define parallelism constraints in config + team lead behavior.

#### Gap 8: No Learnings/Retrospective Mechanism

GSD has RETROSPECTIVE.md and LEARNINGS.md that feed back into future planning. This project's phases.md has a `notes` field "for retro" but no mechanism for:
- Where retro findings are stored
- How they influence future planning
- How the planner consumes past learnings

**Recommendation**: Add learnings capture to `.planning/` structure.

### 3.2 Agent Stubs (Need Completion)

The following agents are stub definitions that need full behavioral prompts:

| Agent | Current State | What's Missing |
|---|---|---|
| **PLANNER.md** | Empty | Complete behavioral definition |
| **IMPLEMENTATION_SPEC.md** | 2 lines | Bridge between requirements and coding agents. Needs to define how to split work between mid/weak coders |
| **MID-CODER.md** | 2 lines | Behavioral definition. What model? What tools expected? How to verify own work? |
| **WEAK-CODER.md** | 3 lines | Define "simple, non-long, non-important" concretely. Cost/quality tradeoffs. |
| **DESIGNER.md** | 1 line | Design.md format, decision capture, how to interface with implementation spec |
| **VERIFIER.md** | 1 line | Verification methodology. What does "verify" mean? Black-box vs white-box? Test-based vs review-based? |
| **TASK_TRACKER.md** | 2 lines | What files to update? What format? How to mark phase/task status transitions? |
| **AD-HOC.md** | 4 lines | Model tier? Tool access? When to use vs when to escalate? |

### 3.3 `[research needed]` Markers in `project-structure.md`

Six markers need resolution:

1. **README.md structure** (line 21) — Community standards: README typically contains project title, description, installation, usage, contributing link, license. AGENTS.md has largely replaced custom README patterns for agents.

2. **CONTRIBUTING.md structure** (line 27) — Typically covers: code of conduct, PR process, development setup, coding standards, commit conventions, testing requirements.

3. **Sprint codename generation** (line 59) — Docker uses adjective-animal naming. Common approach: random adjective-noun from curated wordlists. Could also use semantic names (the feature being built).

4. **Per-task spec splitting** (line 59) — GSD uses per-plan files (not per-task). The tradeoff: per-task = better context isolation, per-phase = less file proliferation. Decision depends on task size and agent granularity.

5. **Absolute vs relative paths** (line 68) — Relative paths are portable within the repo. Absolute paths survive `cd` but break on different machines. Community consensus: relative from project root (e.g., `.planning/requirements/feature_X_01.md`).

6. **design.md format** (line 147) — Reference: https://github.com/google-labs-code/design.md. Also: Cursor uses `.mdc` with YAML frontmatter. The format should be tool-agnostic Markdown.

### 3.4 Structural Gaps in the Framework

#### Gap 9: No Backlog

Where do half-baked ideas go? Not every idea is a requirement yet. GSD has BACKLOG.md. Spec Kit has a "backlog" concept. This project requires every task to stem from a formal requirement — there's no "maybe later" space.

**Recommendation**: Add BACKLOG.md to `.planning/`.

#### Gap 10: No Skills/Microagents Pattern

Claude Code has skills (`SKILL.md` in `.claude/skills/`). OpenHands has microagents (`.openhands/microagents/repo.md`). These are lightweight context injections that load when relevant — domain knowledge without modifying core prompts.

This project could benefit from a skills/microagents convention for project-specific domain knowledge (e.g., "how our auth system works", "our Stripe integration patterns").

**Recommendation**: Add a skills/microagents directory and loading convention.

#### Gap 11: No Discovery/Research Output Structure

The Researcher agent conducts research. Where do the results go? The `.docs/components/<id>.md` has a `# research` section, but there's no dedicated location for:
- Technology feasibility studies
- Library comparison research
- Architecture decision records (ADRs)

GSD has `research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`, `SUMMARY.md`. The initialize-project command mentions "research the best community practices" but the output location is undefined.

**Recommendation**: Add `.docs/research/` or structure `.docs/components/` research sections more concretely.

#### Gap 12: No DISCUSSION Handling Protocol

The project has a "discussion" requirement type and a human-vs-autonomous mode toggle. In autonomous mode, agents must discuss with each other. But:
- How does the Team Lead initiate an agent-agent discussion?
- What's the discussion protocol (question → research → response → counter)?
- How are discussion conclusions captured?

GSD has `discuss-phase` with Socratic interview (up to 6 rounds, rotating perspectives). This project has no defined discussion mechanism.

**Recommendation**: Add a discussion protocol to the Researcher or a dedicated agent.

#### Gap 13: No Security Threat Modeling

GSD has STRIDE threat modeling and ASVS levels. Spec Kit has security checklists. This project has no mention of security in the agent prompts or project structure.

**Recommendation**: Add a SECURITY.md template to `.docs/` or integrate security considerations into the verifier.

#### Gap 14: `.docs/` vs AGENTS.md Tension

The `.docs/` directory (outline.md, design.md, project-structure.md, components/) stores project identity. AGENTS.md has become the universal entrypoint. These overlap conceptually — both describe "what this project is."

Should `.docs/` be replaced by AGENTS.md + progressive disclosure? Or should AGENTS.md be added as a pointer to `.docs/`? The current structure has neither.

**Recommendation**: Add AGENTS.md as entrypoint that points to `.docs/` and `.planning/`. Keep `.docs/` as the detailed knowledge store.

---

## 4. What State-of-the-Art Projects Do That This Doesn't

### 4.1 Progressive Context Loading

AGENTS.md (entrypoint) → `.docs/` (project understanding) → `.planning/` (current state) → `phase spec` (implementation details).

This project has the files but no loading convention. Agents don't know what to read first or what's optional.

### 4.2 Adversarial Verification

GSD's verifier, plan-checker, and code reviewer ALL start with the assumption that the artifact is wrong. This "adversarial stance" dramatically improves bug detection.

This project's verifier is a 1-line stub with no methodology.

### 4.3 Context Budget Awareness

GSD tracks context consumption as currency. Tasks sized at 10-30%. Plans at ~50%. Quality degrades at 70%+. Sub-agents get fresh context.

This project mentions "your context is extremely precious" in Team Lead but has no budgeting mechanism.

### 4.4 Persistent Session State

GSD's STATE.md survives context resets. DEBUG.md has persistent status machine (gathering→investigating→fixing→verifying→resolved). UAT.md tracks testing across sessions.

This project has no equivalent. The memory system is referenced but not integrated into project files.

### 4.5 Checkpoint/Rollback Strategy

Aider: every edit = git commit → instant undo. Cline: checkpoints per tool use. GSD: worktree branches + atomic execution.

This project has no rollback strategy.

### 4.6 Explicit Failure Mode Handling

GSD auto-deviation rules (executor can fix bugs without permission). Caveman auto-clarity (drops compression for safety-critical contexts). Squire addresses 9 documented failure modes.

This project's Team Lead has a debugging escalation tree but no pre-emptive failure handling.

---

## 5. Recommendations

### Priority 1 — Immediate (blocking other work)

1. **Write PLANNER.md** — The second most important agent. Define its planning methodology, requirement creation, task decomposition, sprint ordering logic.

2. **Add AGENTS.md convention** — Entrypoint file that agents read first. Points to `.docs/` and `.planning/`. Should include: build/dev commands, tech stack, architecture overview, agent coordination rules.

3. **Add STATE.md to `.planning/`** — Short file capturing: current sprint/phase/task, last session timestamp, pending decisions, blockers. Survives context resets.

4. **Resolve `[research needed]` markers** in `project-structure.md` — These are architectural decisions that affect agent behavior.

### Priority 2 — Important (strengthen the framework)

5. **Write VERIFIER.md** — Define verification methodology. Black-box testing from DoD. Test execution. Bug classification (compilation vs logic). When to escalate to researcher.

6. **Write IMPLEMENTATION_SPEC.md** — Define the bridge between requirements and code. Task splitting logic for mid vs weak coders.

7. **Add git/worktree conventions** — How agents isolate changes. How undo works. Parallel agent safety.

8. **Add BACKLOG.md** — For half-baked ideas that aren't yet requirements.

### Priority 3 — Enhancement (raise quality ceiling)

9. **Add learnings/retrospective capture** — How the project learns from past phases and feeds that into planning.

10. **Add skills/microagents directory** — For project-specific domain knowledge that loads on demand.

11. **Add security consideration** — Where do security requirements live? How does verification check for vulnerabilities?

12. **Add discussion protocol** — How agent-agent discussions work in autonomous mode.

13. **Define parallelism constraints** — Max concurrent agents, conflict detection, merge strategy.

14. **Consider adopting the `.agents` protocol** — If OpenCode supports it, this provides MCP config, model presets, sub-agent profiles, skills, and scheduled tasks in one directory convention.

---

## 6. Conclusion

The project's core architecture is sound: **behavioral agent prompts that are tool-agnostic + project structure that lives in the project itself**. This aligns with universal best practices across Anthropic, OpenAI, Google, and the open-source community.

The main gaps are not in the architecture but in completeness:
- **3 of 10 agent files are empty or 1-line stubs**
- **No entrypoint file for agents** (AGENTS.md is the universal convention)
- **No state/memory persistence file** (essential for multi-session projects)
- **No rules/conventions system** (all major tools have one)
- **6 `[research needed]` markers unresolved** in the project structure
- **No git safety strategy** (critical for agentic coding)
- **No parallel execution mechanism** (concept exists, implementation missing)

The good news: none of these gaps require architectural redesign. They're fill-in-the-blank items within the existing framework design.

The closest analog in the community is GSD at the heavy end and Caveman at the light end. This project correctly targets the middle — more behavioral scaffolding than Caveman, less ceremonial overhead than GSD. The challenge is completing the scaffolding without drifting toward GSD's complexity.
