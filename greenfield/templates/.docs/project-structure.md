# Project Structure

This document defines the standard project structure and conventions for greenfield projects. Agents read this file at session start to understand how the project is organized.

## Directory Layout

```
project-root/
├── AGENTS.md                     Entrypoint for AI agents
├── README.md                     Public project description
├── CONTRIBUTING.md               Commit and PR conventions
├── CHANGELOG.md                  Version history
├── ROADMAP.md                    Planned milestones
├── .gitignore                    Git ignore rules (includes worktree/)
├── opencode.json                 Agent configuration
├── .planning/
│   ├── settings.json             Agent behavior settings
│   ├── backlog.md                Unscheduled ideas and tasks
│   ├── requirements/
│   │   └── <type>_<component-id>_<N>.md
│   ├── sprints/
│   │   └── <sprint-codename>/
│   │       ├── phases.md         Phase list with task status
│   │       └── spec/
│   │           └── phase-<N>/
│   │               ├── task-<M>.md   Implementation spec per task
│   │               └── _shared.md    Cross-cutting context (optional)
│   └── milestones/
│       └── vX.Y.Z.md             Milestone requirements
├── .docs/
│   ├── outline.md                Project overview and architecture
│   ├── design.md                 Visual design tokens (if applicable)
│   ├── project-structure.md      This file
│   ├── components/
│   │   └── <component-id>.md     Per-component docs (summary, research, design decisions)
│   └── research/
│       └── <topic>.md            Research findings
└── .opencode/
    ├── agents/                   Agent prompt files
    └── commands/                 Slash command files
```

## Planning Terminology

The project uses **sprints** as logical planning units. Each sprint has a codename following the `adjective_scientist` pattern (e.g. `admiring_archimedes`, `brave_bohr`).

- **Sprint**: A time-boxed unit containing phases of work. All phases complete = sprint done.
- **Phase**: A sequential group of tasks within a sprint. Phases executed in order.
- **Task**: A single unit of work within a phase. Multiple tasks in one phase run in parallel.

## File Conventions

### Naming
- Sprints: `adjective_scientist` format, lowercase, underscores allowed (e.g. `admiring_archimedes`)
- Phases: `phase-<N>` where N starts at 1 and increments
- Tasks: `task-<M>` where M starts at 1 and increments
- Requirements: `<type>_<component-id>_<N>.md` (e.g. `feature_DSGN_01.md`, `bugfix_AUTH_01.md`)
- Milestones: `vX.Y.Z.md` following semantic versioning

### Status Markers

Phases, tasks, and milestones use these status values:

- `planned` — Not yet started
- `in-progress` — Currently being implemented
- `done` — Implementation complete and verified

### Requirement Types

- **feature** — New functionality. Tasks describe code changes. DoD is checklist of deliverables.
- **bugfix** — Corrective work. Tasks describe diagnosis and fix. DoD is bug resolved.
- **research** — Investigative work. Tasks describe what to investigate. DoD is documented findings.
- **discussion** — Pre-planning clarification. Tasks describe what needs deciding. DoD is documented decision.

## Requirements

Each requirement describes a unit of work needing planning and execution. Filed in `.planning/requirements/` with filename pattern `<type>_<component-id>_<N>.md` (e.g. `feature_DSGN_01.md`, `discussion_DB_01.md`).

All types share the same structure — definition, tasks, definition of done, notes. The difference is in what tasks and DoD contain:

- **feature** — implementation work. Tasks describe code changes. DoD is checklist of deliverables.
- **bugfix** — corrective work. Tasks describe diagnosis and fix. DoD is bug resolved.
- **research** — investigative work. Tasks describe what to investigate. DoD is documented findings and recommendations.
- **discussion** — pre-planning clarification. Tasks describe what needs deciding. DoD is documented decision with rationale. Executed through conversation with user, produces resolution enabling concrete planning.

### Requirement File Format

```markdown
# definition

[detailed description of what this requirement is about — for discussion requirements this describes what needs to be decided and why]

# tasks

## task-<N>
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

### Example — Feature Requirement

```markdown
# definition

The application needs a user registration endpoint that accepts email and password, validates input, creates a user record, and returns a confirmation token.

# tasks

## task-1
Implement the POST /api/auth/register endpoint with input validation (email format, password length requirements) and user creation in the database.

## task-2
Add email confirmation logic: generate a confirmation token, store it, and return it in the response.

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

### Example — Discussion Requirement

```markdown
# definition

The project needs a caching strategy for the database layer. The approach needs to be determined through discussion — which caching library, invalidation strategy, and data to cache — before implementation tasks can be planned.

# tasks

## task-1
Discuss caching library selection (Redis vs in-memory vs CDN) — evaluate tradeoffs for the expected query patterns and data size.

## task-2
Discuss invalidation strategy — TTL-based vs event-driven invalidation, and how cache invalidation interacts with the existing data model.

## task-3
Document the agreed decisions and produce a recommendation that can be used to create implementation tasks.

# definition-of-done

- [ ] Caching library is selected with documented rationale
- [ ] Invalidation strategy is decided and fits the data model
- [ ] All decisions are documented in this requirement file
- [ ] Implementation tasks can be created from the documented decisions

# notes

The discussion should reference the expected query volume and data size from the project's performance requirements (see .docs/outline.md).
```

## phases.md Format

Each sprint has a `phases.md` file that lists phases and their tasks. Tasks link to their originating requirement file.

```markdown
# phase-<N>

- status: planned | in-progress | done
- notes:
- tasks:
  - [task-<N>](.planning/requirements/<requirement-file>.md#task-<N>)
    - status: planned | in-progress | done
    - notes:
```

## Milestone Format

Each milestone represents a version of the project using semantic versioning (vX.Y.Z). A milestone groups requirements.

```markdown
vX.Y.Z
requirements:
- [requirement-name](requirement-file-path)
```

## Backlog

Located at `.planning/backlog.md`. A simple list of ideas, feature suggestions, and improvements not yet planned for any sprint. No formal structure — a bullet list is sufficient. Items are promoted to formal requirement files in `.planning/requirements/` when they are ready for planning.

## Implementation Spec Format

Each `task-<M>.md` in `spec/phase-<N>/` contains the detailed implementation steps for a single task.

```markdown
# task-<M>

## implementation
1. step <number>
  <description>
*note*: always includes creating/updating tests and running linters

## verification
1. step <number>
  <description>
```

The optional `_shared.md` file contains cross-cutting context shared by tasks in a phase — created only when tasks share architectural context, constraints, or conventions that would otherwise need duplication.

## Component Docs

Each component file at `.docs/components/<component-id>.md` follows a three-part format:

1. **Summary** — What the component is, its responsibilities, and its public API or interface.
2. **Research** — Findings, comparisons, and analysis that informed the component design.
3. **Design Decisions** — Key decisions made, alternatives considered, tradeoffs, and rationale.

## Sprint Lifecycle and Retro

A sprint is complete when all tasks in all phases have status `done`. Once complete:

1. Collect all notes from phases and tasks.
2. Review and discuss with user — how findings impact further development, whether any process or direction changes are needed.
3. Update project documentation and planning files based on retro findings.

## Git Conventions

### Branch Names
```
<type>/<sprint-codename>/<short-description>
```
- Type: `feat`, `fix`, `research`, `discuss`, `chore`
- Sprint codename: current sprint (e.g. `admiring_archimedes`)
- Description: 2-4 hyphen-separated words

### Worktrees
- Created in `worktree/<branch-name>/`
- Always created on a new branch from main
- Branch pushed to origin immediately if remote configured

### Commits
Follow conventional commits:
```
<type>(<scope>): <description>
```
Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

### Workflow
1. Parallel tasks use separate worktrees with separate branches
2. Sequential tasks use branches in the main workspace
3. On success: merge to main, clean up branch + worktree
4. On failure: abandon branch, remove worktree, researcher investigates

## Agent Behavior

### Communication
All agent output uses compressed style: no articles, filler, pleasantries, or hedging. Full sentences for: README, CONTRIBUTING, CHANGELOG, and user-facing output in human-in-the-loop mode.

### Verification
Controlled by `settings.json` verification field:
- `skip`: no verification
- `auto`: coder implements, then separate coder session verifies
- `strict`: Verifier agent performs independent review

### Modes
- `human-in-the-loop`: User confirms decisions via slash commands (/plan, /discuss, /research, /design)
- `autonomous`: Team Lead spawns agents directly using task tool

## Settings Reference

`.planning/settings.json`:

| Field | Values | Purpose |
|-------|--------|---------|
| mode | human-in-the-loop / autonomous | User involvement level |
| verification | skip / auto / strict | How implementations verified |
| max_parallel_tasks | number | Max concurrent task executions |
| git.remote_configured | boolean | Whether remote exists |
| git.gh_cli_available | boolean | Whether gh CLI installed |
| git.main_protected | boolean | Whether main branch protected |
| git.use_pr | boolean | Prefer PRs or direct merge |
