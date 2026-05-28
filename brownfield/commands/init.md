---
description: Initialize a new project with the framework structure and agent configuration
agent: researcher
---

# session start

Familiarize with environment — scan project root for existing docs, config, code. Project initialized if structure exists for agents to understand project, state, and what to work on next.

Well-initialized project typically contains (names are examples — same info could live in differently named files):

- `AGENTS.md` at project root — entrypoint for agents
- `.docs/` directory with project overview, design docs, component descriptions
- `.planning/` directory with current state, settings, sprint structure
- `README.md`, `CHANGELOG.md`, `ROADMAP.md` — public-facing artifacts

If some exist but incomplete: partially initialized. Identify what missing, fix gaps. Do not rerun full init from scratch.

If none exist (regardless of whether project has codebase): uninitialized.

## initialized projects

If project already initialized (structure complete enough for agents to work): inform user, describe what found:

```
This project already initialized. I found:
  - AGENTS.md
  - .docs/ with project overview
  - .planning/ with current state
  - Public-facing docs (README, CHANGELOG)

What would you like to do?
```

If user requests changes to existing structure: discuss needs, make necessary updates. Do not run full init flow.

## partially initialized projects

If project has some structure but incomplete — e.g. codebase and README but no AGENTS.md, or `.planning/` but no sprints: identify each gap, discuss with user what needs adding, bring project to fully initialized state. Skip completed steps. Only run steps to fill gaps.

## uninitialized projects

If no documentation structure at all: full init required. Process built around discussion with user to understand vision and goals. Capture:

- **Project type** — library, application, CLI, service, etc.
- **Necessary components** — building blocks
- **High-level design view** — how components relate
- **Complexity of documentation** — how detailed planning and tracking should be

### step-by-step

Follow steps in order:

**1. Codebase scan** — If project has code: scan to extract project type, building blocks, components, design decisions, languages, frameworks, libraries, patterns. Do not rely on user to describe what exists — read code.

**2. User discussion** — Discuss areas codebase scan could not clarify:

   1. Extract project type from user description
   2. Split requirements into logical components (frontend/backend, networking, database, etc.) — user will not structure input this way
   3. Based on the project type, research community best practices and typical component architectures
   4. Note whether the project will have a visual/UI layer — if yes, the design will need to be addressed later (see design.md in the Docs section below)
   5. Ask about development preferences: how much human oversight is needed (human-in-the-loop vs autonomous), how strict verification should be (skip, auto, strict), and how many tasks can run in parallel (max_parallel_tasks). These go into `.planning/settings.json`.
   6. Ask about git: is the repository remote already configured, or does the user plan to add one later? Is the main branch protected from direct pushes?
   7. Track discussion progress and decisions in a temporary file to prevent context loss
   8. Ask about licensing (MIT, Apache, GPL, etc.) and whether a Code of Conduct file is wanted. Create `LICENSE` and `CODE_OF_CONDUCT.md` if the user wants them.

   After discussion: agree on overall goal, project type, components, high-level design view.

**3. Create structure** — Based on gathered info: create project structure using layout defined below. Include `AGENTS.md` (see template), `.docs/` files, `.planning/` with `settings.json`. Assess whether standard layout fits — smaller projects may need less, larger may need more. Document chosen structure in `.docs/project-structure.md` so future agents know conventions. After creating structure: delete temporary discussion file. Write summary of structure conventions to `.docs/project-structure.md` — capturing what actually decided, not copy of standard template.

**4. Git capability detection** — After project structure exists, detect git environment:

   1. If directory not yet git repository: run `git init`.
   2. Check if remote configured: `git remote -v`. If no remote: set `remote_configured: false` in settings. If user said one will be added later: keep `false` for now.
   3. Check if `gh` CLI available: `command -v gh`. Set `gh_cli_available` accordingly.
   4. Determine `main_protected`:
      - If `gh_cli_available` true and remote configured: check via `gh api repos/:owner/:repo/branches/main/protection`. If fails (no protection): set to `false`.
      - Otherwise: rely on what user said during discussion. If they did not know: default to `true` (safer).
   5. Determine `use_pr`:
      - If `main_protected` true: set `use_pr: true` (mandatory).
      - Otherwise: ask user "When work done, should agent create PR for review, or merge directly? Direct merges faster but skip review." Set accordingly.
   6. Write all git settings to `.planning/settings.json`.

**5. Present to user** — Show created structure, ask for feedback.

**6. Adjust if needed** — If user wants changes: discuss but do not be eager to introduce modifications. Cross-check suggestions against what best for project.

**7. Model configuration** — See model configuration section below. Must be absolute last step — after this, user restarts OpenCode for changes to take effect.

### what to document

When done, ensure following in place:

- **`AGENTS.md`** at project root — entrypoint for agents
- **Project overview** in `.docs/outline.md` — high-level description, components, interactions, selected languages and frameworks
- **Design decisions** captured in relevant `.docs/` files — language, framework, architectural choices
- **Project structure rules** in `.docs/project-structure.md` — how project organizes planning and docs so agents can navigate
- **Note about UI design** in `.docs/outline.md` if project requires visual layer — picked up later by Planner

Task ends when documentation structure in place and agents can orient themselves.

---

# standard project structure

Standard layout for projects using this framework. When creating structure in Step 3: use as starting point. Assess whether it fits — smaller projects may need less, larger may need more. Document chosen structure in `.docs/project-structure.md` so future agents know conventions.

## Documentation structure

Project documentation should:
- avoid repetition between sections
- have public section visible in project root dir
- have section for agents nested inside specific folders
- be written in human-readable well-known format
- be auditable by humans
- be git-safe (no secrets, etc.)
- properly capture planning and project history (what implemented, what planned next — so history does not die with LLM context)

All public-facing documentation (README, CONTRIBUTING, CHANGELOG, ROADMAP) must be written in standard English — full sentences, proper grammar, no abbreviations beyond common technical terms. These are for human readers. Agent-facing files (planning, specs, internal docs) use compressed style.

## The public section

Saved in project root directory:

- `AGENTS.md` — entrypoint for agents; points to project state, active sprint, agent definitions
- `README.md` — project card; how to run; who this is for, etc.
- `CHANGELOG.md` — changes included in project milestones
- `ROADMAP.md` — planned milestones
- `CONTRIBUTING.md` — contributing rules, commit and PR structure

### readme

README follows standard open-source template with documentation map table. Create with structure below, filling `{{placeholders}}` based on discussion. Section order: title → description → quick start → usage → planning → docs map → configuration → contributing → license.

```markdown
# {{Project Name}}

{{One-line description: what does this project do and who is it for?}}

![CI]({{ci-badge-url}}) ![Version]({{version-badge-url}}) ![License]({{license-badge-url}})

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

Development agents use `.planning/` for granular task tracking, sprint planning, and phase specifications. That directory is not intended for human readers — agents will reference it automatically during development.

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

{{SPDX identifier}} — see [LICENSE](./LICENSE) for details.
```

### changelog

Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) with [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Each version entry links to corresponding milestone file. "Unreleased" section tracks changes-in-progress.

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (new features go here during development)

### Fixed

- (bug fixes)

## [v0.1.0] - YYYY-MM-DD

### Added

- (first release features, derived from the completed milestone's requirements)

See [`.planning/milestones/v0.1.0.md`](.planning/milestones/v0.1.0.md) for the full requirements breakdown.
```

### roadmap

A milestone-linked roadmap. Each entry maps to a `.planning/milestones/vX.Y.Z.md` file, states a quarterly target, and includes a "Beyond the Roadmap" section for aspirational ideas.

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

### contributing

Standard open-source contributing guide with conventional commit conventions and PR checklist.

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

## Pull Request Process

1. Ensure your PR addresses a clear need — reference the relevant planning file or issue
2. Keep PRs focused on a single concern
3. Run the full test suite and linter before submitting
4. Update documentation if your change affects public APIs or behavior
5. Include a summary of what changed and why (not how)
6. Mark the PR as **Ready for Review** once CI passes

Before submitting:
- [ ] Tests pass
- [ ] Linter passes
- [ ] Documentation updated (if applicable)
- [ ] Changes scoped to a single concern

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat: add user authentication
feat(auth): add user authentication
fix: resolve login redirect loop
fix(api): resolve login redirect loop
docs: update API reference
refactor: extract validation logic
test: add unit tests for auth service
chore: update dependencies
style: format according to project conventions
perf: optimize query performance
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`
Scope is optional — use it to indicate the component or module affected.

## Coding Standards

- **Language/Framework**: {{language and framework versions}}
- **Formatting**: {{formatter config — e.g. Prettier, rustfmt}}
- **Linting**: {{linter rules — e.g. ESLint, ruff}}
- **Testing**: {{test framework and coverage expectations}}
- **Naming**: {{naming conventions}}

## Recognition

Contributors are acknowledged in {{location — e.g. a CONTRIBUTORS.md file, the README, or GitHub Insights}}.
```

### agents.md

Minimal directory index helping agents orient at session start. Created at project root.

```markdown
# AGENTS.md

Project entrypoint for AI agents.

## Quick reference

- **Project overview**: [README.md](./README.md)
- **Version history**: [CHANGELOG.md](./CHANGELOG.md)
- **Planned milestones**: [ROADMAP.md](./ROADMAP.md)
- **Framework conventions**: [.docs/project-structure.md](.docs/project-structure.md)
- **Agents**: [.opencode/agents/](.opencode/agents/)

## Active sprint

{{sprint-codename}} — see [.planning/sprints/{{sprint-codename}}/phases.md](.planning/sprints/{{sprint-codename}}/phases.md)
```

`{{sprint-codename}}` placeholder filled by Planner when first sprint created. Remains placeholder until then.

## Planning

Located in the `.planning` folder. Contains the following structure:

```
<project-root>/
├── .gitignore
└── .planning/
    ├── settings.json
    ├── sprints/
    │   └── <sprint-codename>/
    │       ├── phases.md
    │       └── spec/
    │           └── phase-<N>/
    │               ├── task-<M>.md
    │               └── _shared.md          (optional)
    ├── backlog.md
    ├── requirements/
    │   └── <type>_<component-id>_<N>.md
    └── milestones/
        └── vX.Y.Z.md
```

### .gitignore

Standard `.gitignore` at project root. Must include worktree directory:

```
node_modules/
dist/
build/
.env
worktree/
```

Add framework-specific entries as needed (e.g. `__pycache__/`, `.next/`, `target/`).

### settings.json

Project-level settings controlling how agents operate. Located at `.planning/settings.json`.

```json
{
  "mode": "human-in-the-loop",
  "verification": "auto",
  "max_parallel_tasks": 5,
  "git": {
    "remote_configured": false,
    "gh_cli_available": false,
    "main_protected": true,
    "use_pr": true
  }
}
```

**mode** (`human-in-the-loop` / `autonomous`): Controls whether Team Lead involves user in decisions or self-directs.

**verification** (`skip` / `auto` / `strict`): Controls verification. `skip` = none; `auto` = coder spawned to implement, separate coder session verifies; `strict` = Verifier agent spawned for independent verification.

**max_parallel_tasks** (integer, default `5`): How many tasks within phase can execute concurrently. `1` = purely sequential.

**git.remote_configured** (boolean): Whether repo has remote. Detected during init. If false: git agent creates branches and worktrees locally but never pushes.

**git.gh_cli_available** (boolean): Whether `gh` CLI installed. Detected during init. If true: git agent can create PRs. If false: generates PR descriptions for manual creation.

**git.main_protected** (boolean): Whether main branch protected from direct pushes. Established via detection or user confirmation. If true: all changes go through PR. If false: direct merge possible.

**git.use_pr** (boolean): User preference. When `main_protected` false and `gh_cli_available` true: controls whether to use PRs despite direct merge possible. When `main_protected` true: forced to true.

### Sprints

Sprint is planning entity annotating current task list — what currently being developed. Each sprint has codename (`adjective_scientist` pattern, e.g. `admiring_archimedes`, `brave_bohr`), list of phases, and spec directory.

`phases.md` contains logical ordering of tasks pulled from requirements definitions and implementation status. `spec` directory provides implementation specs for each phase.

#### phases.md

List of phases — each phase is unit guiding implementation. Groups requirement tasks to denote implementation order. Each phase has sequential number and list of links to tasks from requirements. Phases executed sequentially; if phase contains more than one task, tasks implemented in parallel.

```markdown
# phase-<number>

- status: done | in-progress | planned
- notes:
- tasks:
  - [task-<number>](.planning/requirements/<requirement-name>.md#task-<number>)
    - status: done | in-progress | planned
    - notes:

# phase-<number>
...
```

`notes` section denotes only problems occurring during implementation — for status: use `status` field.

#### spec

Implementation plans for each phase. Each task gets dedicated file within phase directory.

```
.planning/sprints/<codename>/spec/phase-<N>/
├── _shared.md          (optional — cross-cutting context)
└── task-<M>.md         (one per task pulled into this phase)
```

Each `task-<M>.md` contains:

```markdown
# task-<M>

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

`_shared.md` optional — created only when tasks share architectural context, constraints, or conventions that would otherwise need duplication.

Implementing agent handling single task should receive two files as context: task instructions (`task-<M>.md`) and if present, shared context (`_shared.md`) for phase. Agent should not load other task files.

### sprint lifecycle and retro

Sprint complete when all tasks in all phases have status `done`. Once complete: all notes collected from phases and tasks reviewed and discussed with user — how they impact further development and whether any process or direction changes needed.

### Requirements

Each requirement describes unit of work needing planning and execution. Filed in `.planning/requirements/` with filename pattern `<type>_<component-id>_<number>.md` (e.g. `feature_DSGN_01.md`, `discussion_DB_01.md`).

All types share same structure — definition, tasks, definition of done, notes. Difference is in what tasks and DoD contain:

- **feature** — implementation work. Tasks describe code changes. DoD is checklist of deliverables.
- **bugfix** — corrective work. Tasks describe diagnosis and fix. DoD is bug resolved.
- **research** — investigative work. Tasks describe what to investigate. DoD is documented findings and recommendations.
- **discussion** — pre-planning clarification. Tasks describe what needs deciding. DoD is documented decision with rationale. Executed through conversation with user, produces resolution enabling concrete planning.

Structure:

```markdown
# definition

[detailed description of what this requirement is about — for discussion requirements this describes what needs to be decided and why]

# tasks

## task-<number>
[detailed description of the task scope — for discussion tasks this is a specific question or topic to resolve with the user]
[this is the unit that gets pulled into a specific sprint]

## ... [next tasks]

# definition-of-done

[detailed bullet point list — for discussion requirements this is the decision criteria, not feature deliverables]
- [ ] dod-1 ...
- [ ] dod-2 ...

# notes

[caveats, additional information, deferred decisions, follow-ups]
```

**Example — feature requirement:**
```markdown
# definition

The application needs a user registration endpoint that accepts email and password,
validates input, creates a user record, and returns a confirmation token.

# tasks

## task-1
Implement the POST /api/auth/register endpoint with input validation
(email format, password length requirements) and user creation in the database.

## task-2
Add email confirmation logic: generate a confirmation token, store it,
and return it in the response.

# definition-of-done

- [ ] POST /api/auth/register returns 201 with confirmation token on success
- [ ] Invalid email returns 400 with validation error message
- [ ] Duplicate email returns 409 with conflict message
- [ ] Password shorter than 8 characters returns 400
- [ ] Unit tests cover success and error paths
- [ ] Integration test confirms user is persisted

# notes

Email delivery is out of scope for this requirement — will be handled separately.
```

**Example — discussion requirement:**
```markdown
# definition

The project needs a caching strategy for the database layer. The approach
needs to be determined through discussion — which caching library,
invalidation strategy, and data to cache — before implementation tasks
can be planned.

# tasks

## task-1
Discuss caching library selection (Redis vs in-memory vs CDN) —
evaluate tradeoffs for the expected query patterns and data size.

## task-2
Discuss invalidation strategy — TTL-based vs event-driven invalidation,
and how cache invalidation interacts with the existing data model.

## task-3
Document the agreed decisions and produce a recommendation that can
be used to create implementation tasks.

# definition-of-done

- [ ] Caching library is selected with documented rationale
- [ ] Invalidation strategy is decided and fits the data model
- [ ] All decisions are documented in this requirement file
- [ ] Implementation tasks can be created from the documented decisions

# notes

The discussion should reference the expected query volume and data size
from the project's performance requirements (see .docs/outline.md).
```

### Milestones

Each milestone represents a version of the project using semantic versioning (vX.Y.Z). A milestone is a group of requirements.

```markdown
vX.Y.Z
requirements:
- [requirement-name](requirement-file-path)
```

### Backlog

Located at `.planning/backlog.md`. Simple list of ideas, feature suggestions, improvements not yet planned for any sprint. No formal structure — bullet list sufficient. Items promoted to formal requirements when ready.

```markdown
# Backlog

- idea or suggestion description
- another idea
```

## Docs

Located in `.docs` folder, contains:

```
<project-root>/
└── .docs/
    ├── outline.md
    ├── design.md                      (if applicable)
    ├── project-structure.md
    └── components/
        └── <component-id>.md
```

### outline.md

High-level project overview. Describes goals, components, interactions, selected languages and frameworks. Created during init. Template — adjust to fit project needs.

```markdown
# {{Project Name}} — Outline

## Overview

{{2-3 sentences: what this project does, who it is for, and the core problem it solves.}}

## Goals

- {{primary goal}}
- {{secondary goal}}
- {{...}}

## Architecture

{{How the components fit together. Include a description of the component relationships and data flow.}}

## Components

### {{component-id}}

**Purpose**: {{what this component does}}
**Tech stack**: {{language, framework, key libraries}}
**Responsibilities**: {{what it owns and is responsible for}}
**Interactions**: {{which other components it talks to and how}}

### {{next component}}
{{...}}

## Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| {{e.g. Frontend}} | {{e.g. React 19}} | {{why this was chosen}} |
| {{e.g. Backend}} | {{e.g. Go 1.24}} | {{why this was chosen}} |
| {{e.g. Database}} | {{e.g. PostgreSQL 17}} | {{why this was chosen}} |

## Design decisions

- {{key architectural decision and rationale}}
- {{...}}

## Open decisions

Items that need further discussion before planning can begin. May include:
- {{UI design needed — spawn Designer to create design.md}}
- {{other pending decisions}}
```

### design.md

Describes the design strategy scoped on the whole project. This is about the visual layer (if the project has one). Uses Google's open-source DESIGN.md format (YAML front matter for design tokens + Markdown body for design rationale). Created by the Designer agent when needed — not during initialization.

### project-structure.md

Documents structure conventions established for this specific project — not copy of standard template. After user discussion: capture what decided — which directories exist, how organized, what each file means in this project context, deviations from standard layout. Future agents read this file to understand how project organized.

### components

Each component has description with three parts:

```markdown
# summary
detailed description of the component

# research
information acquired during research

# design decisions
important design decisions. Contains:
- graphic design (following google's design.md)
- architectural design (used libraries, frameworks, etc.)
```

Component docs created and refined during discussion — capture decisions made about each component. May need amendment after implementation if actual implementation diverged from discussed design.

---

# model configuration

Last step of init: configuring which models power each agent role. Guided discussion with user.

## ask user preference

Tell user OpenCode needs model assignments for each agent role. Ask if they have preference:

```
I need to set up which models power each agent role.
Do you already have specific models in mind, or should I
look at your configured providers and propose something?
```

If user has preferences: discuss, skip to mapping step.
If they want you to propose: proceed to list providers.

## list configured providers

Run `opencode providers list` to show user available providers.

Ask: "Which providers would you like to use?"

Wait for response before proceeding.

## discover available models

Check if `jq` installed: `which jq`.

**If jq available:**

Write verbose model output to temp file, use jq to extract clean summary:

```bash
opencode models --verbose > /tmp/opencode-models.json
grep -v '^[a-zA-Z0-9._/~:-]\+\/[a-zA-Z0-9._/~:-]\+$' /tmp/opencode-models.json \
  | jq -s -c '.[] | {id: (.providerID + "/" + .id), name, cost: {input: .cost.input, output: .cost.output}}'
```

Produces one compact JSON line per model with id, name, input cost, output cost.

**If jq not available:**

Run `opencode models` for plain list of model IDs. Use training knowledge of model pricing and capability to classify. If need to verify pricing for specific model:

```bash
opencode models --verbose | grep -A 15 "^$MODEL_ID$" | grep -E "(name|cost)"
```

## classify models into three tiers

From output, identify three tiers:

- **Powerful model** — planning, research, architecture, complex reasoning, verification. Highest capability, cost. Typically Opus, GPT high-end, Gemini Pro.
- **Mid model** — implementation, coding, design. Good balance. Typically Sonnet, GPT base, Gemini Flash.
- **Weak model** — simple tasks, docs, status tracking, small bugfixes. Lowest cost. Typically Haiku, Nano, Mini, Flash-lite.

Heuristics:
- Look at `name` field — "Opus", "Pro", "Max", "Ultra" tend powerful; "Sonnet", base variants tend mid; "Haiku", "Nano", "Mini", "Flash", "Lite" tend weak
- Compare `cost.input` and `cost.output` prices — tiers should have noticeably different price points
- If only one model configured: use for all three tiers
- If only two models available: one fills both powerful and mid roles

Select best value in each tier — not absolute cheapest or most expensive. Consider both capability and cost.

## propose mapping

Present proposal:

```
I found these model tiers available from your configured providers:

  Powerful: anthropic/claude-opus-4-5     ($5.00/$25.00 per 1M tokens)
  Mid:      anthropic/claude-sonnet-4-5   ($3.00/$15.00 per 1M tokens)
  Weak:     anthropic/claude-haiku-4-5    ($1.00/$5.00 per 1M tokens)

I propose:
  - Powerful model → team lead, researcher, planner, verifier
  - Mid model     → implementation spec, mid-coder, designer, ad-hoc
  - Weak model    → weak-coder, utility, git

Would you like to:
  1. Accept this proposal
  2. Use same model for all agents (simpler, no cost optimization)
  3. Choose different models manually
```

## generate opencode.json

Based on agreed mapping: create or update `opencode.json` in project root using template below. Replace `$POWERFUL_MODEL`, `$MID_MODEL`, `$WEAK_MODEL` with actual model IDs.

If `opencode.json` already exists (pre-existing config): merge agent section into it rather than overwriting.

### template

```json
{
  "$schema": "https://opencode.ai/config.json",
  "default_agent": "team-lead",
  "agent": {
    "build": {
      "disable": true
    },
    "plan": {
      "disable": true
    },
    "team-lead": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/TEAM_LEAD.md}"
    },
    "v-planner": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/PLANNER.md}"
    },
    "v-researcher": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/RESEARCHER.md}"
    },
    "v-ad-hoc": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/AD-HOC.md}"
    },
    "v-designer": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/DESIGNER.md}"
    },
    "planner": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/PLANNER.md}",
      "hidden": true,
      "permission": {
        "task": "deny"
      }
    },
    "researcher": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/RESEARCHER.md}",
      "hidden": true
    },
    "implementation-spec": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/IMPLEMENTATION_SPEC.md}",
      "hidden": true,
      "permission": {
        "task": "deny"
      }
    },
    "designer": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/DESIGNER.md}",
      "hidden": true,
      "permission": {
        "bash": "deny",
        "task": "deny"
      }
    },
    "mid-coder": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/CODER.md}",
      "hidden": true,
      "permission": {
        "task": "deny"
      }
    },
    "weak-coder": {
      "model": "$WEAK_MODEL",
      "prompt": "{file:.opencode/agents/CODER.md}",
      "hidden": true,
      "permission": {
        "task": "deny"
      }
    },
    "verifier": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/VERIFIER.md}",
      "hidden": true,
      "permission": {
        "write": "deny",
        "edit": "deny",
        "task": "deny"
      }
    },
    "utility": {
      "model": "$WEAK_MODEL",
      "prompt": "{file:.opencode/agents/UTILITY.md}",
      "hidden": true,
      "permission": {
        "bash": "deny",
        "task": "deny"
      }
    },
    "git": {
      "model": "$WEAK_MODEL",
      "prompt": "{file:.opencode/agents/GIT.md}",
      "hidden": true,
      "permission": {
        "write": "deny",
        "edit": "deny",
        "task": "deny"
      }
    },
    "ad-hoc": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/AD-HOC.md}",
      "hidden": true
    }
  }
}
```

## finalize

Tell user to restart OpenCode:

```
OpenCode configuration has been created at opencode.json.

IMPORTANT: You must restart OpenCode for these changes to take effect.
Press Ctrl+C, then reopen OpenCode.
```
