---
description: Initialize a new project with the framework structure and agent configuration
agent: researcher
---

# session start

Familiarize yourself with the environment — scan the project root for existing documentation files, configuration, and code. A project is initialized if it has enough structure for agents to understand what the project is, what state it is in, and what to work on next.

A well-initialized project typically contains some or all of the following. The names are examples — the same information could live in differently named files, but the key information should be present:

- `AGENTS.md` at the project root — entrypoint for agents pointing to project state
- `.docs/` directory with project overview, design docs, and component descriptions
- `.planning/` directory with current state, settings, and sprint structure
- `README.md`, `CHANGELOG.md`, `ROADMAP.md` — public-facing artifacts

If some of these exist but are incomplete, that is a partially initialized project. Your job is to identify what is missing and fix it, rather than rerunning the full initialization from scratch.

If none of these exist — regardless of whether the project already has a codebase — the project is uninitialized.

## initialized projects

If the project is already initialized (the structure exists and is complete enough for agents to work), inform the user and describe what you found:

```
This project is already initialized. I found:
  - AGENTS.md
  - .docs/ with project overview
  - .planning/ with current state
  - Public-facing docs (README, CHANGELOG)

What would you like to do?
```

If the user requests changes to the existing structure, discuss their needs and make the necessary updates. Do not run the full initialization flow.

## partially initialized projects

If the project has some structure but is incomplete — for example it has a codebase and a README but no AGENTS.md, or it has `.planning/` but no sprints — your task is to identify each gap, discuss with the user what needs to be added, and bring the project to a fully initialized state. Skip any initialization steps that are already complete and only run the steps needed to fill the gaps.

## uninitialized projects

If the project has no documentation structure at all, full initialization is required. This is a process built around a discussion with the user to understand their vision and project goals. You must capture:

- **Project type** — what kind of project this is (library, application, CLI, service, etc.)
- **Necessary components** — the building blocks that make the project work
- **High-level design view** — how the components relate to each other
- **Complexity of documentation** — how detailed the planning and progress tracking should be

### step-by-step

Follow these steps in order:

**1. Codebase scan** — If the project already has code, scan it to extract: project type, building blocks and components, design decisions already made, languages, frameworks, libraries, patterns. Do not rely on the user to tell you what already exists — read the code.

**2. User discussion** — Discuss the areas that the codebase scan could not clarify. During the discussion:

   1. Extract the project type from the user's description
   2. Split their requirements into logical components (frontend/backend, networking layer, database, etc.) — the user will not structure their input this way
   3. Based on the project type, research community best practices and typical component architectures
   4. Note whether the project will have a visual/UI layer — if yes, the design will need to be addressed later (see design.md in the Docs section below)
   5. Ask about development preferences: how much human oversight is needed (human-in-the-loop vs autonomous), how strict verification should be (skip, auto, strict), and how many tasks can run in parallel (max_parallel_tasks). These go into `.planning/settings.json`.
   6. Ask about git: is the repository remote already configured, or does the user plan to add one later? Is the main branch protected from direct pushes?
   7. Track discussion progress and decisions in a temporary file to prevent context loss
   8. Ask about licensing (MIT, Apache, GPL, etc.) and whether a Code of Conduct file is wanted. Create `LICENSE` and `CODE_OF_CONDUCT.md` if the user wants them.

   After the discussion, you should clearly agree on: overall goal, project type, components, and high-level design view.

**3. Create structure** — Based on everything gathered, create the project structure using the layout defined in the standard project structure section below. This includes `AGENTS.md` at the project root (see agents.md template), all `.docs/` files, `.planning/` with `settings.json`. Reason about whether the standard layout fits this project — smaller projects may need less, larger projects may need more. Document the chosen structure in `.docs/project-structure.md` so future agents know the conventions. After creating the structure, delete the temporary discussion file — all its content has been transferred to the project files. Write a summary of the project's structure conventions to `.docs/project-structure.md` — capturing what was actually decided for this project, not a copy of the standard template.

**4. Git capability detection** — After the project structure exists, detect the git environment:

   1. If the directory is not yet a git repository, run `git init`.
   2. Check if a remote is configured: `git remote -v`. If no remote, set `remote_configured: false` in settings. If the user said one will be added later, keep it `false` for now.
   3. Check if `gh` CLI is available: `command -v gh`. Set `gh_cli_available` accordingly.
   4. Determine `main_protected`:
      - If `gh_cli_available` is true and a remote is configured, check via: `gh api repos/:owner/:repo/branches/main/protection`. If that fails (meaning no protection), set to `false`.
      - Otherwise, rely on what the user said during the discussion. If they did not know, default to `true` (assume protected — safer).
   5. Determine `use_pr`:
      - If `main_protected` is true, set `use_pr: true` (mandatory).
      - Otherwise, ask the user: "When work is done, should the agent create a pull request for review, or merge directly? Direct merges are faster but skip review." Set accordingly.
   6. Write all git settings to `.planning/settings.json`.

**5. Present to user** — Show the created structure and ask for feedback.

**6. Adjust if needed** — If the user wants changes, discuss them but do not be eager to introduce modifications. Cross-check what the user suggests against what is best for the project.

**7. Model configuration** — See the model configuration section below. This must be the absolute last step — after this, the user restarts OpenCode for the changes to take effect.

### what to document

When done, the following should be in place:

- **`AGENTS.md`** at the project root — entrypoint for agents
- **Project overview** in `.docs/outline.md` — high-level description, components, how they interact, selected languages and frameworks
- **Design decisions** captured in the relevant `.docs/` files — language, framework, architectural choices
- **Project structure rules** in `.docs/project-structure.md` — how this project organizes its planning and documentation so agents can navigate it
- **A note about UI design** in `.docs/outline.md` if the project requires a visual layer — this will be picked up later by the Planner

Your task is not to create plans for future development. Your job ends when the documentation structure is in place and agents can orient themselves.

---

# standard project structure

The following is the standard layout for projects using this framework. When creating the structure in Step 3, use this as a starting point. Reason about whether it fits your project — smaller projects may need less, larger projects may need more. Document the chosen structure in `.docs/project-structure.md` so future agents know the conventions.

## Documentation structure

The project documentation should be structured in a way that:
- tries to avoid repetition between different sections
- has a public section visible in the project root dir
- has a section for the agents that is nested inside specific folders
- all documentation is written in human-readable well-known format
- all documentation is auditable by humans
- all documentation is git-safe (no secrets, etc.)
- the purpose of the section for the agents is to properly capture planning and project history (what has already been implemented, what is planned as next - so that the project history would not die with the context of an editing llm)

## The public section

Saved in the project root directory:

- `AGENTS.md` - entrypoint for agents; points to project state, active sprint, and agent definitions
- `README.md` - project card; how to run the project; who this is for, etc.
- `CHANGELOG.md` - changes included in the project's milestones
- `ROADMAP.md` - planned milestones
- `CONTRIBUTING.md` - contributing rules, commit and PR structure

### readme

The README follows the standard open-source template format with a documentation map table. Create it with the structure below, filling in `{{placeholders}}` based on your discussion with the user. The section order is: title → description → quick start → usage → planning → docs map → configuration → contributing → license.

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

Follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format with [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Each version entry links to the corresponding milestone file. The "Unreleased" section tracks changes-in-progress.

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

A minimal directory index that helps agents orient themselves at the start of a session. Created at the project root.

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

The `{{sprint-codename}}` placeholder is filled in by the Planner when the first sprint is created. Until then, it remains as a placeholder.

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

Standard `.gitignore` at the project root. Must include the worktree directory:

```
node_modules/
dist/
build/
.env
worktree/
```

Add framework-specific entries as needed (e.g. `__pycache__/`, `.next/`, `target/`).

### settings.json

Project-level settings that control how agents operate. Located at `.planning/settings.json`. Contains three fields:

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

**mode** (`human-in-the-loop` / `autonomous`): Controls whether the Team Lead involves the user in discussions and approvals, or self-directs.

**verification** (`skip` / `auto` / `strict`): Controls whether completed work is verified. `skip` means no verification step; `auto` means a coder is spawned to implement and a separate coder session verifies; `strict` means the Verifier agent is spawned for independent verification.

**max_parallel_tasks** (integer, default `5`): Controls how many tasks within a phase can execute concurrently. `1` means purely sequential execution.

**git.remote_configured** (boolean): Whether the repository has a remote. Detected during init. If false, the git agent creates branches and worktrees locally but never pushes.

**git.gh_cli_available** (boolean): Whether the `gh` CLI is installed. Detected during init. If true, the git agent can create PRs. If false, it generates PR descriptions for manual creation.

**git.main_protected** (boolean): Whether the main branch is protected from direct pushes. Established during init via detection or user confirmation. If true, all changes go through a PR. If false, direct merge is possible.

**git.use_pr** (boolean): User preference. When `main_protected` is false and `gh_cli_available` is true, this controls whether to use PRs despite direct merge being possible. When `main_protected` is true, this is forced to true.

### Sprints

A sprint is a planning entity used to annotate the current task list — what is currently being developed. Each sprint has a codename (following the pattern `adjective_scientist`, e.g. `admiring_archimedes`, `brave_bohr`), a list of phases, and a spec directory.

The `phases.md` file contains information about the logical ordering of tasks pulled into this sprint from requirements definitions and the status of implementation. The `spec` directory provides implementation specifications for each phase.

#### phases.md

A list of phases — each phase is a unit that guides implementation. It groups requirement tasks to denote the ordering in which the tasks should be implemented. Each phase has a sequential number and a list of links to the tasks from a certain requirement. Phases are executed sequentially; if a phase contains more than one task, those tasks should be implemented in parallel.

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

The `notes` section should denote only problems that occurred during implementation — for status information, use the `status` field.

#### spec

Implementation plans for each phase. Each task gets its own dedicated file within a phase directory.

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

The `_shared.md` file is optional — created only when tasks share architectural context, constraints, or conventions that would otherwise need duplication.

An implementing agent handling a single task should receive two files as context: the task instructions (`task-<M>.md`) and, if present, the shared context (`_shared.md`) for the phase it belongs to. The agent should not load other tasks' files.

### sprint lifecycle and retro

A sprint is complete when all tasks in all its phases have status `done`. Once a sprint is complete, all notes collected from the sprint's phases and tasks should be reviewed and discussed with the user — how they impact further project development and if any changes to the process or project direction are necessary.

### Requirements

Each requirement describes a unit of work that needs to be planned and executed. Requirements are filed in `.planning/requirements/` with the filename pattern `<type>_<component-id>_<number>.md` (e.g. `feature_DSGN_01.md`, `discussion_DB_01.md`).

All requirement types share the same structure — definition, tasks, definition of done, notes. The difference is in what the tasks and DoD contain:

- **feature** — implementation work. Tasks describe code changes. DoD is a checklist of deliverables.
- **bugfix** — corrective work. Tasks describe diagnosis and fix. DoD is the bug being resolved.
- **research** — investigative work. Tasks describe what to investigate. DoD is documented findings and recommendations.
- **discussion** — pre-planning clarification. Tasks describe what needs to be decided. DoD is a documented decision with rationale. This type of task is executed through conversation with the user and produces a resolution that enables concrete planning.

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

Located at `.planning/backlog.md`. A simple list of ideas, feature suggestions, and improvements that are not yet planned for any sprint. No formal structure is required — a bullet list is sufficient. Items can be promoted to formal requirements when they are ready to be scheduled.

```markdown
# Backlog

- idea or suggestion description
- another idea
```

## Docs

Located in the `.docs` folder, contains the following structure:

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

A high-level overview of the project. Describes goals, components, how they interact, selected languages and frameworks. Created during initialization. This is a template — adjust it to fit the project's needs.

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

Documents the structure conventions established for this specific project — not a copy of the standard template. After the user discussion, capture what was decided: which directories exist, how they are organized, what each file means in this project's context, and any deviations from the standard layout. Future agents read this file to understand how this project is organized.

### components

Each component has a description with three parts:

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

Component docs are created and refined during discussion — they capture the decisions made about each component. They may also need to be amended after implementation if the actual implementation diverged from the discussed design.

---

# model configuration

The last step of initialization is configuring which models power each agent role. This is a guided discussion with the user.

## ask user preference

Tell the user that OpenCode needs to be configured with model assignments for each agent role. Ask if they already have a preference:

```
I need to set up which models power each agent role.
Do you already have specific models in mind, or should I
look at your configured providers and propose something?
```

If the user has preferences, discuss and skip to the mapping step.
If they want you to propose, proceed to list providers.

## list configured providers

Run `opencode providers list` to show the user which providers are available.

Ask: "Which providers would you like to use?"

Wait for their response before proceeding.

## discover available models

Check if `jq` is installed by running `which jq`.

**If jq is available:**

Write the verbose model output to a temp file, then use jq to extract a clean summary:

```bash
opencode models --verbose > /tmp/opencode-models.json
grep -v '^[a-zA-Z0-9._/~:-]\+\/[a-zA-Z0-9._/~:-]\+$' /tmp/opencode-models.json \
  | jq -s -c '.[] | {id: (.providerID + "/" + .id), name, cost: {input: .cost.input, output: .cost.output}}'
```

This produces one compact JSON line per model with id, name, input cost, and output cost.

**If jq is not available:**

Run `opencode models` to get the plain list of model IDs. Use your training knowledge of model pricing and capability to classify models into tiers — you already know which model families (Claude Sonnet, GPT, Gemini Pro) are capable vs which are cheap variants (Haiku, Nano, Flash). If you need to verify pricing for a specific model, run:

```bash
opencode models --verbose | grep -A 15 "^$MODEL_ID$" | grep -E "(name|cost)"
```

## classify models into three tiers

From the output, identify three tiers:

- **Powerful model** — For planning, research, architecture decisions, complex reasoning, verification. Highest capability, highest cost. Typically Opus, GPT high-end, Gemini Pro, or similar top-tier coding models.
- **Mid model** — For most implementation, coding, design work. Good balance of capability and cost. Typically Sonnet, GPT base, Gemini Flash class.
- **Weak model** — For simple tasks, documentation updates, status tracking, small bugfixes. Lowest cost. Typically Haiku, Nano, Mini, Flash-lite class.

Heuristics for classification:
- Look at the `name` field from model info — names containing "Opus", "Pro", "Max", "Ultra" tend to be powerful; "Sonnet", base variants tend to be mid; "Haiku", "Nano", "Mini", "Flash", "Lite" tend to be weak
- Compare `cost.input` and `cost.output` prices — the tiers should have noticeably different price points
- If only one model is configured, use it for all three tiers
- If only two models are available, one fills both the powerful and mid roles

Select the best value in each tier — not the absolute cheapest or most expensive. Consider both capability and cost.

## propose mapping to the user

Present the proposal:

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
  2. Use the same model for all agents (simpler, no cost optimization)
  3. Choose different models manually
```

## generate opencode.json

Based on the agreed mapping, create or update `opencode.json` in the project root using the template below. Replace `$POWERFUL_MODEL`, `$MID_MODEL`, and `$WEAK_MODEL` with the actual model IDs from the discussion.

If `opencode.json` already exists (user had pre-existing configuration), merge the agent section into it rather than overwriting.

### template

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "team-lead": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/TEAM_LEAD.md}"
    },
    "researcher": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/RESEARCHER.md}"
    },
    "planner": {
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/PLANNER.md}",
      "hidden": true,
      "permission": {
        "task": "deny"
      }
    },
    "implementation-spec": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/IMPLEMENTATION_SPEC.md}",
      "hidden": true,
      "permission": {
        "task": "deny"
      }
    },
    "mid-coder": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/MID-CODER.md}",
      "hidden": true,
      "permission": {
        "task": "deny"
      }
    },
    "weak-coder": {
      "model": "$WEAK_MODEL",
      "prompt": "{file:.opencode/agents/WEAK-CODER.md}",
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
    "designer": {
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/DESIGNER.md}",
      "hidden": true,
      "permission": {
        "bash": "deny",
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

Tell the user:

```
OpenCode configuration has been created/updated at opencode.json.
Please restart OpenCode for the changes to take effect.
```
