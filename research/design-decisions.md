# Design Decisions

Date: 2026-05-15
Goal: Capture architectural decisions made during the research and design phase, before implementation.

---

## Decision 001: AGENTS.md Structure

**Date**: 2026-05-15
**Status**: Decided

### Context
A project-level entrypoint file is needed so agents can orient themselves quickly at session start. Options considered included merging project-structure.md directly into AGENTS.md, duplicating README.md content, or other approaches.

### Decision
AGENTS.md should be a **minimal directory index** — pointers only, no duplicated content. It contains:

- Pointer to human-facing README.md, ROADMAP.md, CHANGELOG.md
- Pointer to .docs/project-structure.md for framework conventions
- Pointer to the current active sprint codename (so Team Lead can quickly find it)
- Pointer to agent definitions directory

### Rationale
- README.md already has build/test/run commands — duplicating in AGENTS.md is redundant and creates sync drift
- project-structure.md is framework boilerplate, not project-specific — loading it every session wastes tokens when the agent isn't planning
- Sprint codename pointer replaces STATE.md — no need for a separate state file when the Team Lead can infer position from the sprint phases
- AGENTS.md is 3-5 lines; agents read it instantly and follow pointers as needed (progressive disclosure)

### Related files
- AGENTS.md (to be created)
- .docs/project-structure.md (exists, may evolve)
- README.md (to be created by project owner)
- ROADMAP.md, CHANGELOG.md (to be created by project owner)

---

## Decision 002: No STATE.md File

**Date**: 2026-05-15
**Status**: Decided

### Context
State files track current session position, pending decisions, last session timestamp. GSD uses STATE.md heavily.

### Decision
Do not create STATE.md. The planning files ARE the state. The Team Lead reads `.planning/sprints/<current>/phases.md` at session start — task statuses (`done/in-progress/planned`) encode position. Ephemeral session metadata belongs in conversation context or memory system, not a file that can drift out of sync.

### Rationale
- Planning files are the source of truth for task status — duplicating into STATE.md creates sync problems
- The project is simpler than GSD (sequential phases, single orchestrator) — STATE.md doesn't earn its keep
- GSD needs STATE.md because it has parallel workstreams, 30+ sub-agents, and cross-session state management at scale
- If a need arises for ephemeral context resumption, the memory system (if available) handles it

### Related files
- .planning/sprints/<codename>/phases.md

---

## Decision 003: Project-specific Knowledge in `.docs/`, Not AGENTS.md

**Date**: 2026-05-15
**Status**: Decided

### Context
Project identity (outline, design decisions, architecture, component docs) needs a home.

### Decision
Keep `.docs/` as the project knowledge store. AGENTS.md points to it. Structure:

```
.docs/
├── outline.md              # High-level project overview
├── design.md               # Visual design strategy (if applicable)
├── project-structure.md    # Framework conventions (this file as template)
├── SECURITY.md             # Security model and threat considerations
└── components/
    └── <component-id>.md   # Per-component: summary, research, design decisions
```

### Rationale
- Separates project identity from planning (`.planning/`) — different concerns, different change frequencies
- AGENTS.md is too small to hold detailed docs — it's a pointer, not a container
- Component docs with research/decisions sections match the Architect's workflow

### Related files
- .docs/ directory structure
- AGENTS.md (pointer to .docs/)

---

## Decision 004: Initialization Flow — Hybrid (Team Lead prompts `/init`, Researcher executes)

**Date**: 2026-05-16
**Status**: Decided

### Context
When a project is uninitialized (no `.planning/`, no `.docs/`, no AGENTS.md), the system needs to start initialization. Three options were considered:

- **Option A**: Team Lead delegates to Researcher via Task tool (subagent). Researcher handles the full init discussion, creates files, reports back. No command needed.
- **Option B**: `/init` command routed to Researcher as primary agent. No Team Lead involvement.
- **Option C (chosen)**: Team Lead detects uninitialized state, informs user to type `/init`. Command routes to Researcher with init instructions.

### Decision
Use **Option C** — Hybrid approach:

1. Team Lead detects uninitialized project at session start
2. Team Lead informs the user: "This project is not initialized. Please type `/init` to run initialization."
3. User types `/init`
4. `commands/initialize-project.md` has `agent: researcher` frontmatter, routing the command to the Researcher agent
5. Researcher reads the command body and handles the full initialization discussion and file creation
6. After initialization, the user switches to Team Lead via Tab for ongoing development

### Rationale
- OpenCode does not support programmatic primary agent handoff — one agent cannot "switch to another." Only the user can do this via Tab.
- OpenCode does support command routing via `agent:` frontmatter — `/init` can spawn the right agent automatically.
- The Team Lead's prompt already acknowledges this limitation with the `[research needed]` note: "can the team lead spawn the researcher [...] or does the user have to manually switch the agent."
- GSD uses a similar pattern: the orchestrator stays in charge and spawns sub-agents via the Task tool, never switching primary agents.
- This gives the user a clear, explicit action ("type `/init`") rather than a magical auto-switch.

### Related files
- commands/initialize-project.md (will contain project-structure and AGENTS.md templates)
- agents/TEAM_LEAD.md (already mentions uninitialized → switch to researcher)
- agents/RESEARCHER.md (will execute initialization)

---

## Decision 005: Project Structure and AGENTS.md Templates Live Inside `commands/initialize-project.md`

**Date**: 2026-05-16
**Status**: Decided

### Context
Separate project-structure.md and AGENTS.md files at the framework level create maintenance overhead and redundancy. The initialize command needs to create these files in the target project anyway.

### Decision
The project-structure template and AGENTS.md template will be embedded directly inside `commands/initialize-project.md`. No separate AGENTS.md or project-structure.md files will exist at the framework root.

The command body will contain:
1. Initialization instructions for the Researcher
2. Inline template for the project-structure.md to create in `.docs/project-structure.md`
3. Inline template for AGENTS.md to create at project root

### Rationale
- Eliminates file proliferation at the framework level
- The command IS the template — one file, one source of truth
- The Researcher creates these files in the target project, not in the framework repo
- GSD follows a similar pattern: templates live in `templates/` and workflows reference them inline
- Reduces the number of `[research needed]` markers that need resolution

### Related files
- commands/initialize-project.md (will contain both templates inline)

---

## Decision 006: Resolve `[research needed]` for README.md

**Date**: 2026-05-16
**Status**: Decided

### Context

`project-structure.md` line 21 had a `[research needed]` marker asking how README.md should be structured based on common community patterns, while properly reflecting this project's structure.

### Decision

Use the template below as the README.md template. The Researcher agent customizes it during initialization based on user discussion and project type.

Key design choices:
- **Planning & Roadmap section** points humans to CHANGELOG.md and ROADMAP.md (public-facing artifacts). `.planning/` is mentioned in one sentence to explain its purpose as agent-internal granular tracking — it is not exposed as primary human navigation.
- **Documentation Map table** (GSD pattern) surfaces `.docs/` contents so humans know where to find design docs, component docs, etc.

```markdown
# {{Project Name}}

{{One-line description: what does this project do and who is it for?}}

![CI]({{ci-badge-url}}) ![Version]({{version-badge-url}}) ![License]({{license-badge-url}})

## Table of Contents

- [Description](#description)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Planning & Roadmap](#planning--roadmap)
- [Documentation](#documentation)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Description

{{2-3 paragraphs: project motivation, what problem it solves, key capabilities.}}

## Quick Start

```bash
{{install command}}
```

{{brief instructions to get from zero to running}}

## Usage

{{core workflow, CLI examples, code snippets, screenshots.}}

## Planning & Roadmap

See [CHANGELOG.md](./CHANGELOG.md) for version history and [ROADMAP.md](./ROADMAP.md) for planned milestones.

Development agents use `.planning/` for granular task tracking, sprint planning, and phase specifications. That directory is not intended for human readers -- agents will reference it automatically during development.

## Documentation

| File | Purpose |
|------|---------|
| `.docs/outline.md` | High-level project overview and component architecture |
| `.docs/design.md` | Design strategy (visual/architectural) |
| `.docs/project-structure.md` | Development conventions and project structure rules |
| `.docs/components/` | Per-component details: summary, research, design decisions |
| {{`.docs/other-file.md`}} | {{purpose}} |

## Configuration

{{key settings, environment variables, configuration files.}}

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on the contribution process and code of conduct.

## License

{{SPDX identifier}} -- see [LICENSE](./LICENSE) for details.
```

### Rationale

- Section order follows community consensus (Make a README, Standard README spec, Open Source Guide): title → description → quick start → usage → deeper docs → license
- Planning section decouples human-facing artifacts (CHANGELOG, ROADMAP) from agent-internal planning (`.planning/`), avoiding confusion
- Documentation table modeled after GSD's pattern — gives readers a map of `.docs/` without reading every file
- `{{placeholder}}` markers let the Researcher fill in project-specific content based on user discussion, without hardcoding assumptions

### Related files
- project-structure.md (line 21 marker resolved)
- commands/initialize-project.md (template will be embedded here)
- agents/RESEARCHER.md (executes init, fills in placeholders)

---

## Decision 007: Resolve `[research needed]` for CONTRIBUTING.md

**Date**: 2026-05-16
**Status**: Decided

### Context

`project-structure.md` line 27 had a `[research needed]` marker asking how CONTRIBUTING.md should be structured based on common community patterns, while accounting for the project structure and AI-assisted development.

### Decision

Use the template below as the CONTRIBUTING.md template. The Researcher agent customizes it during initialization.

Key design choices:
- **Standard OSS sections** (CoC, bug reports, feature requests, PR process, commit conventions, coding standards) follow community consensus from GitHub, Open Source Guide, and the nayafia template used by 10K+ star projects
- **AI-Assisted Contributions section** references AGENTS.md rather than embedding agent instructions directly — AGENTS.md is the single entrypoint for agent-specific rules, avoiding duplication and sync drift
- **Conventional Commits** for commit messages (universally adopted across agent-focused and traditional OSS projects)

```markdown
# Contributing

Thank you for considering contributing to {{Project Name}}.

## Code of Conduct

This project follows a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold it.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone {{repo-url}}`
3. Install dependencies: `{{install command}}`
4. Run tests: `{{test command}}`
5. Create a branch: `git checkout -b {{branch-naming-convention}}`

## How to Report Bugs

Open an issue with the **bug** label. Include:
- A clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, version, browser if applicable)

For security vulnerabilities, email {{security-email}} instead of opening an issue.

## How to Suggest Features

Open an issue with the **feature** label. Include:
- What problem the feature solves
- How you envision it working
- Any relevant context or examples

Feature requests may be discussed and moved to `.planning/requirements/` if accepted.

## Pull Request Process

1. Ensure the issue your PR addresses has an approved ticket
2. Keep PRs focused on a single concern
3. Run the full test suite and linter before submitting
4. Update documentation if your change affects public APIs or behavior
5. Mark the PR as **Ready for Review** once CI passes

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login redirect loop
docs: update API reference
refactor: extract validation logic
test: add unit tests for auth service
```

## Coding Standards

- **Language/Framework**: {{language and framework versions}}
- **Formatting**: {{formatter config -- e.g. Prettier, rustfmt}}
- **Linting**: {{linter rules -- e.g. ESLint, ruff}}
- **Testing**: {{test framework and coverage expectations}}
- **Naming**: {{naming conventions}}

## AI-Assisted Contributions

If you use an AI coding assistant (including but not limited to OpenCode, Claude Code, Cursor, Copilot):

1. Read [AGENTS.md](./AGENTS.md) at the project root before starting a session -- it contains the entrypoint for project context, active sprint, and agent coordination rules
2. Respect the project structure documented in `.docs/project-structure.md` -- agents should update `.planning/` files as work progresses
3. Disclose AI assistance in your PR description
4. Verify that AI-generated code follows project conventions and passes all tests

## Recognition

Contributors are acknowledged in {{location -- e.g. a CONTRIBUTORS.md file, the README, or GitHub Insights}}.
```

### Rationale

- AI-Assisted Contributions section is a novel addition (GSD was the first project to address this in CONTRIBUTING.md). Our template improves on GSD's approach by referencing AGENTS.md as a single entrypoint rather than duplicating agent instructions inline
- Standard sections follow the well-established pattern from GitHub's OSS guides, ensuring familiarity for human contributors
- `.planning/requirements/` mention in feature requests ties the contribution workflow to the project structure without requiring contributors to understand the full agent system
- `{{placeholder}}` markers let the Researcher fill in project-specific details (language, test framework, security contact) during initialization

### Related files
- project-structure.md (line 27 marker resolved)
- commands/initialize-project.md (template will be embedded here)
- AGENTS.md (referenced by the AI-Assisted Contributions section)

---

## Decision 008: ROADMAP.md Template — Milestone-Linked, Public-Facing

**Date**: 2026-05-16
**Status**: Decided

### Context

The project structure defines ROADMAP.md as a public file listing planned milestones. No single universal standard exists (unlike Keep a Changelog for CHANGELOG.md), but the community consensus pattern across OpenHands, Sigstore, Dovyski/template, and GSD is milestone-based with theme descriptions.

### Decision

Use a milestone-linked ROADMAP template where each entry:
- Maps to one `.planning/milestones/vX.Y.Z.md` file via a relative Markdown link
- States a quarterly target (not a fixed date — avoids commitment to hard deadlines)
- Has a thematic name and 2–3 bullet summary of expected scope
- Includes a "Beyond the Roadmap" section for aspirational ideas (lightweight backlog reference)

```markdown
# Roadmap

This file provides an overview of the direction this project is heading.
Planned milestones are listed below in approximate order. Each milestone
links to its detailed requirement breakdown in `.planning/milestones/`.

## [v0.1.0] - Initial Foundation

*Target: Q1 202X*

The first usable release. Focus on core infrastructure and basic functionality.

Expected scope:
- (feature summary bullet)
- (feature summary bullet)

→ See [`.planning/milestones/v0.1.0.md`](.planning/milestones/v0.1.0.md) for requirements

## [v0.2.0] - (Theme Name)

*Target: Q2 202X*

(Thematic description of what this milestone achieves.)

Expected scope:
- (feature summary bullet)
- (feature summary bullet)

→ See [`.planning/milestones/v0.2.0.md`](.planning/milestones/v0.2.0.md) for requirements

## Beyond the Roadmap

Ideas under consideration for future milestones:

- (aspirational idea)
- (aspirational idea)
```

### Rationale

- Relative links from project root are portable across machines and survive `cd`
- ROADMAP is public-facing (human stakeholders); `.planning/milestones/` is agent-internal (detailed requirements) — the link bridges them without duplicating content
- Quarterly targets instead of dates follow the OSS community consensus (Open Source Guide, GitHub community health files)
- The agent creates/updates ROADMAP entries when a new milestone is created in `.planning/milestones/`

### Related files

- project-structure.md (line 24 — roadmap section)
- commands/initialize-project.md (template will be embedded here)

---

## Decision 009: CHANGELOG.md Template — Keep a Changelog, Milestone-Linked

**Date**: 2026-05-16
**Status**: Decided

### Context

The project structure defines CHANGELOG.md as the record of completed milestones. The de facto community standard is Keep a Changelog (https://keepachangelog.com), used by GSD, the Linux kernel, and thousands of projects. It pairs with Semantic Versioning (already adopted by the milestones system).

### Decision

Adopt Keep a Changelog format with a milestone link in each version entry. Key design choices:
- "Unreleased" section at the top for changes-in-progress
- Standard categories: Added, Changed, Deprecated, Removed, Fixed, Security
- Each version entry links to `.planning/milestones/vX.Y.Z.md` for the full requirements breakdown
- The agent fills entries from completed milestone requirements and DoD items — one bullet per meaningful user-facing change, not one per task

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (new features go here during development)

### Changed

- (changes to existing functionality)

### Fixed

- (bug fixes)

### Security

- (vulnerability fixes)

## [v0.1.0] - YYYY-MM-DD

### Added

- (first release features, derived from the completed milestone's requirements)

See [`.planning/milestones/v0.1.0.md`](.planning/milestones/v0.1.0.md) for the full requirements breakdown.
```

### Rationale

- Keep a Changelog is universally recognized and parsable — no need to invent a new format
- Milestone links prevent duplication: CHANGELOG is the human-readable summary, the milestone file has the detailed requirement/task breakdown
- The agent workflow is: complete milestone → consolidate changes into CHANGELOG entry → update milestone file status
- Relative paths from project root are portable (same rationale as ROADMAP)

### Related files

- project-structure.md (line 23 — changelog section)
- commands/initialize-project.md (template will be embedded here)

---

---

## Decision 010: settings.json — Mode, Verification, Max Parallel Tasks

**Date**: 2026-05-16
**Status**: Decided

### Context

The project structure previously used `mode.md` with two values (`human-in-the-loop` / `autonomous`). GSD uses a `config.json` with ~15 settings. OpenCode does not support dynamic model routing per task, so a model_tier setting would not be actionable by the harness. The `confirm_destructive` setting is also unnecessary because OpenCode already manages permission approvals via its own permission system.

### Decision

Replace `mode.md` with a `settings.json` file in `.planning/` containing three fields:

```json
{
  "mode": "human-in-the-loop",
  "verification": "auto",
  "max_parallel_tasks": 1
}
```

**mode** (`human-in-the-loop` / `autonomous`):
- Controls whether the Team Lead involves the user in discussions and approvals, or self-directs

**verification** (`skip` / `auto` / `strict`):
- `skip` — no verification step; coder's own testing is sufficient
- `auto` — coder verifies own work before marking phase complete
- `strict` — spawn Verifier agent for independent verification

**max_parallel_tasks** (integer, default `1`):
- Controls how many tasks within a phase can execute concurrently
- `1` = purely sequential execution
- Higher values enable parallel agent spawns (Team Lead spawns multiple coders)
- The Team Lead reads this setting before delegating tasks

### Rationale

- mode replaces mode.md with the same two values but in a structured format that can coexist with future settings
- model_tier omitted because OpenCode assigns models statically per agent definition — a runtime tier toggle would have no effect
- confirm_destructive omitted because OpenCode's built-in permission system already handles this; the team lead's prompts should encourage yolo-mode execution
- verification is placed in settings rather than agent prompts so it can change per-project without modifying agent definitions
- max_parallel_tasks is a simple integer that's easy for agents to read and act upon

### Related files

- .planning/settings.json (to be created by initialize-project.md)
- .planning/mode.md (removed)
- agents/TEAM_LEAD.md (reads this file)
- commands/initialize-project.md (creates this file with default values)

---

## Decision 011: Sprint Codename Generation — Model-Generated `adjective_scientist`

**Date**: 2026-05-16
**Status**: Decided

### Context

`project-structure.md` line 59 had a `[research needed]` marker asking how to quickly generate sprint codenames in a similar way to Docker, without hardcoding wordlists or introducing external dependencies.

Research showed:
- Docker uses `adjective_scientist` (e.g. `admiring_archimedes`, `brave_bohr`) from two hardcoded arrays in `pkg/namesgenerator/names-generator.go`
- No stable free API exists for this pattern — Heroku-hosted word APIs are defunct, API Ninjas requires a paid key for word-type filtering
- Libraries exist (Go `namesgenerator`, JS `moniker`, PHP `names-generator-php`) but all embed their own wordlists, adding dependencies

### Decision

The agent creating the sprint (typically the Planner) generates the codename from its training knowledge. No external wordlists, APIs, scripts, or files are needed. The instruction is:

> Generate a codename following the pattern `adjective_scientist` (e.g. `admiring_archimedes`, `brave_bohr`, `ecstatic_curie`). Scan existing sprint directories in `.planning/sprints/` before naming to avoid duplicates. If a collision occurs, pick a different adjective-scientist pair. Use exactly two words joined by an underscore — no numbers, no hyphens, no extra words.

### Rationale

- Model weights already encode the Docker naming convention — no need to duplicate wordlists in the project
- Zero-dependency approach aligns with the project's tool-agnostic philosophy
- Scanning `.planning/sprints/` prevents collisions without external state
- The naming instruction lives in the agent prompt (PLANNER.md) and the project structure documentation (project-structure.md section 3.2.1), not in a separate file
- The codename is persisted in the sprint directory name and `phases.md`, so it survives context resets

### Related files

- project-structure.md (line 59 marker resolved — section to be added as "Sprint Naming" subsection under Sprints)
- agents/PLANNER.md (agent that applies the naming instruction)

---

## Decision 012: Per-Task Spec Files (Always Split)

**Date**: 2026-05-16
**Status**: Decided

### Context

`project-structure.md` line 59 had a `[research needed]` marker asking whether per-task spec files would be better than per-phase spec files. The original design stored one `spec/phase-<N>.md` file per phase, with multiple task sections inside it. When a phase contained parallel tasks, each agent had to load the entire phase spec and "find its section."

Research showed:
- **GSD** uses a middle-ground: per-phase SPEC.md/CONTEXT.md/RESEARCH.md, but multiple PLAN.md files per phase (2–3 tasks each), never per-task
- **Aider** passes plans entirely in-context between architect and editor — no spec files
- **SWE-agent** injects the problem description directly into the prompt — no spec files

Key tradeoffs considered:

| Dimension | Per-phase (one `phase-N.md`) | Per-task (`phase-N/task-M.md`) |
|---|---|---|
| File count | Low | Higher |
| Context isolation | Poor — agent loads unrelated tasks | Perfect — agent loads only its task |
| Parallel execution | Agent must "find its section" | Agent loads exactly its task file |
| Shared context | Natural (same file) | Lives in `_shared.md` |
| Reordering | Edit one file | Move files |

### Decision

Adopt per-task spec files **always** — no threshold, no exceptions. The structure becomes:

```
.planning/sprints/<codename>/
  spec/
    phase-<N>/
      _shared.md      ← (optional) cross-cutting context for the phase
      task-<M>.md     ← one file per task pulled into this phase
      ...
```

Each `task-<M>.md` contains:

```markdown
# task-<M>: <brief title>

## implementation
1. step <number>
  <implementation-details>
...
*note*: always includes creating/updating tests and running linters

## verification
1. step <number>
  <verification-details>
...
```

The `_shared.md` file is optional — created only when tasks share architectural context, constraints, or conventions that would otherwise need duplication.

The task links in `phases.md` point to these files directly (e.g., `[task-1](spec/phase-1/task-1.md)`), replacing the fragment-only links (`phase-1.md#task-1`) that were needed under the old single-file layout.

### Rationale

- Removes the "find your section" cognitive step for parallel agents — each agent loads exactly one file
- The cost of file proliferation is negligible: a phase with 3 tasks creates 3 files + optionally 1 `_shared.md`
- Simpler to reason about: one file = one task = one agent assignment
- `_shared.md` prevents the duplication problem that was the main argument against per-task splitting
- The directory tree becomes self-documenting: `ls spec/phase-2/` immediately shows all 4 tasks in that phase
- Reordering a phase means reordering entries in `phases.md` (the source of truth for ordering), not renaming files — so the file-move cost of reordering is unrelated to the split decision

### Changes Required in `project-structure.md`

Three areas need updating:

1. **Directory tree** (line 42): `spec/phase-<number>.md` → `spec/phase-<number>/task-<number>.md`

2. **Sprints paragraph** (line 59):
   - Change "the implementation specification is also split into separate files for each logical ordering unit from the phases.md document" — this described per-phase splitting, now it should say: the spec splits tasks across separate files within a phase directory
   - Remove the caveat: "*Caveat*: when a phase contains multiple tasks which will be executed in parallel by different agents, each of those agets reads the spec for the whole phase implementation and finds the parts that regard their assigned task" — this is no longer relevant
   - Remove the `[research needed]` marker

3. **Spec section** (lines 76–90):
   - "Each phase has its own dedicated file" → "Each task has its own dedicated file within a phase directory"
   - "Each file is scoped into sections that map directly to tasks" → removed (the file IS one task)
   - The file template changes from one file with `# task-N` sections to individual `<task-N>.md` files each with `## implementation` and `## verification`
   - Directory structure changes from `spec/phase-<number>` to `spec/phase-<number>/task-<number>.md`
   - Add a note about the optional `_shared.md` for phase-level context

### Related files

- project-structure.md (directory tree line 42, paragraph line 59, spec section lines 76–90)
- commands/initialize-project.md (directory creation logic)
- agents/PLANNER.md (creates spec files during planning)
- agents/IMPLEMENTATION_SPEC.md (writes per-task spec files)
- agents/TEAM_LEAD.md (assigns tasks, no longer needs to tell agents to "find their section")

---

---

## Decision 013: Model Discovery Flow During Init — Three-Tier With User Discussion

**Date**: 2026-05-16
**Status**: Decided

### Context

The init process needs to configure model assignments for each agent in `opencode.json`. Models vary per user (different providers, different budgets). A hardcoded template would not work. The Researcher needs a structured flow to discover available models, classify them, discuss with the user, and generate the configuration.

### Decision

The final step of the init process follows this 7-step flow:

1. **Ask preference** — Researcher asks if the user already has models in mind, or should propose
2. **List providers** — Run `opencode providers list` and ask which providers to use
3. **Discover models** — Check if `jq` is installed
   - **With jq**: write verbose output to temp file, extract id/name/cost via `jq -s`
   - **Without jq**: use plain `opencode models` list, then `grep -A 15` for individual model pricing
4. **Classify into three tiers** — Identify powerful, mid, and weak models based on name and cost heuristics
5. **Propose mapping** — Present tiers with proposed agent assignments, offer 3 options (accept / same-model / manual)
6. **Generate opencode.json** — Replace `$POWERFUL_MODEL`, `$MID_MODEL`, `$WEAK_MODEL` placeholders with agreed models
7. **Finalize** — Tell user to restart OpenCode for changes to take effect

Mapping (tier → agents):
- **Powerful** → team-lead, researcher, planner, verifier
- **Mid** → implementation-spec, mid-coder, designer, ad-hoc
- **Weak** → weak-coder, task-tracker

Fallbacks:
- 1 model only → all three tiers use the same model
- 2 models only → powerful and mid share one, weak gets the other

### Rationale

- Three tiers match the agent hierarchy already defined in the project (powerful agents for planning/research/verification, mid for coding/design, weak for simple tasks)
- User discussion first prevents agent from guessing wrong about budget priorities
- jq path for structured extraction, fallback path for systems without it
- Writing to temp file avoids pipe truncation of large verbose output
- Restart requirement is necessary because OpenCode reads agent config at startup

### Related files

- research/init-model-config-instruction.md (full instruction and template)
- commands/initialize-project.md (will embed this flow)
- agents/RESEARCHER.md (executes this flow)
- .opencode/agents/ (agent .md files referenced by opencode.json)

---

## Decision 014: Relative Paths from Project Root for All Links

**Date**: 2026-05-16
**Status**: Decided

### Context

`project-structure.md` line 68 had a `[research needed]` marker asking whether links between planning files should use absolute or relative paths.

### Decision

Use **relative paths from project root** for all cross-file links. Example:

```markdown
[task-1](.planning/requirements/feature_X_01.md#task-1)
```

Not:

```markdown
[task-1](/Users/brotholomew/workdir/project/.planning/requirements/feature_X_01.md#task-1)
```

Anchor fragments (`#task-<number>`) are included for human readability on GitHub, but agents should not rely on them — agents read the target file in full and locate the relevant task section by matching the task heading content.

### Rationale

- Absolute paths embed machine-specific state (`/Users/...`) — they break on different machines, different checkout locations, CI runners, and cannot be committed to a repo
- GSD, Spec Kit, and every major framework uses relative paths from project root — universal convention
- Agents resolve relative paths from the project root by default (OpenCode, Claude Code, Cline, Cursor all do this)
- GitHub renders relative paths as clickable links within the repo — bonus for human reviewers
- Anchor fragments are a free addition since `#task-<number>` is already the task heading format

### Related files

- project-structure.md (line 68 marker resolved)
- commands/initialize-project.md (templates will use relative paths)

---

---

## Decision 015: DESIGN.md Format — Google's DESIGN.md Spec, Flagged via outline.md

**Date**: 2026-05-16
**Status**: Decided

### Context

`project-structure.md` line 147 had a `[research needed]` marker asking how `.docs/design.md` should be structured, referencing `https://github.com/google-labs-code/design.md`. For UI projects, a standard format is needed so the Designer agent can produce consistent, agent-readable design specifications.

### Decision

Use Google's open-source DESIGN.md format (13.9K stars, Apache 2.0) as the `.docs/design.md` specification. The format combines YAML front matter (design tokens) with Markdown body (design rationale) across 8 standard sections.

The Researcher flags design needs during init:

1. **Researcher** (during `init`) — discusses the project with the user. If the project requires a UI, the Researcher: (1) includes a line in `.docs/outline.md` noting that UI design is pending and that the Designer should be spawned, (2) uses a `design:` field or similar annotation in the outline so the Planner can detect it programmatically
2. **Planner** (when creating plans) — reads `outline.md`, detects the UI design flag → creates a `discussion_design` requirement
3. **Team Lead** — pulls the discussion requirement → spawns Designer agent
4. **Designer** — discusses with user, researches patterns, produces `.docs/design.md` in Google's DESIGN.md format, which agents can read as persistent design context

If no UI is needed, no annotation is added. The flag only exists for projects with a visual layer.

### Rationale

- Google's DESIGN.md is the de facto industry standard — 13.9K stars, open source, backed by a linter/CLI, Tailwind/DTCG export support
- No need to invent a custom format — adoption eliminates fragmentation
- The flag-in-outline.md pattern keeps detection passive: the Researcher doesn't create requirements, just annotates. The Planner interprets annotations as work items
- This respects role boundaries: Researcher flags → Planner schedules → Team Lead delegates → Designer executes

### Related files

- project-structure.md (line 147 marker resolved)
- .docs/outline.md (contains the UI design flag when applicable)
- agents/RESEARCHER.md (creates the flag during init)
- agents/PLANNER.md (detects the flag, creates requirement)
- agents/DESIGNER.md (creates .docs/design.md)
- agents/TEAM_LEAD.md (delegates to Designer)

---

## Template for Future Decisions

```markdown
## Decision NNN: Title

**Date**: YYYY-MM-DD
**Status**: Decided / Draft / Superseded

### Context
[Description of the problem, constraints, and alternatives considered]

### Decision
[The chosen approach]

### Rationale
[Why this choice over alternatives]

### Related files
[Files affected by this decision]
```
