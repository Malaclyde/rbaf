# Implementation Plan: Project Restructure & Bugfixes

## Phase 0 — Config Fixes in `commands/init.md` (opencode.json template only)

### 0.1 — Reinforce restart message at end of init flow

Change finalize message to explicitly tell user to restart OpenCode.

### 0.2 — Add `/research` and `/design` commands

**`commands/research.md`** — User-facing command routing to researcher. Accepts `$ARGUMENTS`. Steps: use provided context as starting point, research docs/best practices/patterns, present findings with comparison and recommendation.

**`commands/design.md`** — User-facing command routing to designer. Accepts `$ARGUMENTS`. Steps: use provided context, research platform conventions, discuss direction with user, create or update `design.md`.

## Phase 1 — opencode.json Template Update

### 1.1 — Set default agent and disable built-ins

```json
{
  "default_agent": "team-lead",
  "agent": {
    "build": { "disable": true },
    "plan": { "disable": true },
    ...
  }
}
```

### 1.2 — Add visible v-agents

Entries in opencode.json for user-facing agent access — no new .md files needed. Same prompts as hidden counterparts:

```
v-planner      → PLANNER.md           (visible)
v-researcher   → RESEARCHER.md        (visible)
v-ad-hoc       → AD-HOC.md            (visible)
v-designer     → DESIGNER.md          (visible)
```

### 1.3 — Make all sub-agents hidden

Set `"hidden": true` on: planner, researcher, ad-hoc, designer, implementation-spec, mid-coder, weak-coder, verifier, utility, git.

### 1.4 — Consolidate coders into one `CODER.md`

- Delete `agents/MID-CODER.md` and `agents/WEAK-CODER.md`
- Create `agents/CODER.md` — merged prompt from both (identical prompts). Both `mid-coder` and `weak-coder` reference `{file:.opencode/agents/CODER.md}` with different `model` values.

## Phase 2 — Restructure Directories

### 2.1 — Create directory structure

```
brownfield/
├── agents/         → all current .md files moved here
└── commands/       → all current .md files moved here

greenfield/
├── agents/         → initially empty, populated later
└── commands/       → initially empty, populated later
```

### 2.2 — Move current files

- `agents/*.md` → `brownfield/agents/` (except MID-CODER.md, WEAK-CODER.md — deleted)
- `commands/*.md` → `brownfield/commands/`
- Add `CODER.md` to brownfield agents.

### 2.3 — Populate greenfield

Copy brownfield agents/commands to greenfield as starting point. Greenfield versions will be rewritten in Phase 5.

## Phase 3 — Interactive Install Script

### 3.1 — Add project type prompt

```
Project type:
  1) Brownfield  — existing project, unknown structure (agents discover conventions)
  2) Greenfield  — new project, standard structure (agents know layout)

Which type? [1/2]:
```

### 3.2 — Brownfield mode

Same as current: copy from `brownfield/agents/` and `brownfield/commands/` to `.opencode/`.

### 3.3 — Greenfield mode

Copy from `greenfield/` directories AND generate project skeleton:

Files to create in project root:
- `AGENTS.md` — standard template
- `README.md` — standard open-source template
- `CONTRIBUTING.md` — commit + PR conventions
- `CHANGELOG.md` — keep a changelog format
- `ROADMAP.md` — milestones template
- `.gitignore` — with `worktree/` entry
- `.planning/settings.json` — default settings
- `.planning/backlog.md` — empty backlog
- `.planning/milestones/` — directory
- `.docs/outline.md` — project overview template
- `.docs/project-structure.md` — full rules: sprint structure, phase structure, task structure, naming conventions, status markers
- `.docs/components/` — directory
- `opencode.json` — complete config: default_agent, disabled build/plan, all agents + v-agents, models

## Phase 4 — Simplify `/init` Command for Greenfield

### 4.1 — Brownfield `/init`

Keep current version (discovers structure, handles partially initialized projects, user discussion, model config). Stays in `brownfield/commands/init.md`.

### 4.2 — Greenfield `/init`

Becomes initial research round:
1. Codebase scan (project may have code).
2. User discussion — project type, components, goals, design preferences.
3. Research phase — investigate libraries, frameworks, best practices. Validate technology choices. Produce recommendations.
4. Model configuration (same as current).
5. Tell user to restart OpenCode.

No project structure creation — install script already did that. No git capability detection — install script already did that.

**Restart emphasis at end:** The finalize message must be prominent and unambiguous:
```
OpenCode configuration has been created at opencode.json.

IMPORTANT: You must restart OpenCode for these changes to take effect.
Type Ctrl+C, then reopen OpenCode.
```

## Phase 5 — Create Greenfield-Specialized Agents

### 5.1 — Starting point

Copy brownfield agents to greenfield. Then modify for project-structure-aware behavior.

### 5.2 — Agent changes (greenfield only)

**PLANNER.md**: Add explicit rule:
```
Sprint names follow adjective_scientist pattern (e.g. admiring_archimedes, brave_bohr).
Generate sprint names automatically. Never ask user for sprint names.
```

**TEAM_LEAD.md**: In human-in-the-loop scenarios, reference user-facing commands:
- Instead of "spawn the researcher", tell user: "Run `/research {topic}`"
- Instead of "spawn the designer", tell user: "Run `/design {context}`"
- Instead of "spawn the planner", tell user: "Run `/plan {context}`"
- Instead of "spawn researcher for discussion", tell user: "Run `/discuss {topic}`"

**All greenfield agents**: Reference `.planning/sprints/`, `.docs/outline.md`, `.docs/project-structure.md` as known concrete paths. Remove "discover the structure" language — structure is guaranteed.

**init.md (greenfield)**: Research-only. Remove steps 3 (create structure), 4 (git capability detection). Simplify to: codebase scan → user discussion → preliminary research → model config → restart.

## Phase 6 — Update Install Script for Greenfield opencode.json

Greenfield mode install script generates `opencode.json` with:
- `default_agent: "team-lead"`
- `build` and `plan` disabled
- All agents configured with model placeholders and file paths
- v-agents defined (visible, no hidden)
- All sub-agents `hidden: true`
- Team-lead agent visible

## Files to Create

| # | File | Description |
|---|------|-------------|
| 1 | `commands/research.md` | New user-facing research command |
| 2 | `commands/design.md` | New user-facing design command |
| 3 | `agents/CODER.md` | Consolidated coder prompt (replaces MID-CODER + WEAK-CODER) |
| 4 | `brownfield/agents/*.md` | All current agent files moved here |
| 5 | `brownfield/commands/*.md` | All current command files moved here |
| 6 | `greenfield/agents/*.md` | Specialized greenfield copies |
| 7 | `greenfield/commands/*.md` | Specialized greenfield command copies |

## Files to Delete

| # | File | Reason |
|---|------|--------|
| 1 | `agents/MID-CODER.md` | Consolidated into CODER.md |
| 2 | `agents/WEAK-CODER.md` | Consolidated into CODER.md |

## Files to Modify

| # | File | Change |
|---|------|--------|
| 1 | `commands/init.md` | Add restart emphasis; greenfield version becomes research-only |
| 2 | `bin/install.js` | Interactive prompt, brownfield/greenfield paths, skeleton generation |
| 3 | `README.md` | Update with new structure, v-agents, new commands |
| 4 | `agents/TEAM_LEAD.md` (greenfield) | Reference `/research`, `/design`, `/plan`, `/discuss` commands |
| 5 | `agents/PLANNER.md` (greenfield) | Add sprint name generation rule |
