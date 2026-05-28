# Research Based Agentic Framework (RBAF)

A behavioral framework for OpenCode that defines how AI agents research, plan, implement, verify, and maintain software projects. Supports two modes: **brownfield** for existing codebases where agents discover conventions dynamically, and **greenfield** for new projects where agents know the exact structure upfront.

## Installation

```bash
# Local install (current project's .opencode/)
npx -y github:Malaclyde/rbaf

# Global install (~/.config/opencode/)
npx -y github:Malaclyde/rbaf --global
```

Installs 11 agent definitions and 5 slash commands into your OpenCode configuration. During installation, it prompts interactively for brownfield (existing codebase) or greenfield (new project) mode. Safe to re-run -- existing files are not overwritten unless `--force` is passed.

## What You Get

### Agents

| Agent | Mode | Role |
|-------|------|------|
| `TEAM_LEAD` | primary | Orchestrates development -- spawns subagents, manages workflow, drives sessions |
| `PLANNER` | subagent | Creates plans, defines requirements, organizes work into sprints |
| `RESEARCHER` | subagent | Deep research, project initialization, debugging, technical discussions |
| `IMPLEMENTATION_SPEC` | subagent | Writes detailed implementation specifications from sprint plans |
| `CODER` | subagent | Implements tasks from specifications with tests (replaces MID-CODER + WEAK-CODER) |
| `VERIFIER` | subagent | Independent verification and code review against specifications |
| `DESIGNER` | subagent | Creates UI design specifications (Google DESIGN.md format) |
| `GIT` | subagent | Git operations -- worktrees, commits, branches, pull requests |
| `V-*` | variant | User-facing agent variants (e.g. V-CODER, V-RESEARCHER) for direct interactive access |
| `AD-HOC` | subagent | Generalist problem solver -- quick changes, bugfixes, unforeseen tasks |
| `UTILITY` | subagent | Project maintenance -- planning files, documentation, changelogs |

### Commands

| Command | Agent | Purpose |
|---------|-------|---------|
| `/init` | researcher | Initialize project structure and agent configuration |
| `/plan` | planner | Create next sprint or phase with task breakdown |
| `/discuss` | researcher | Research and discuss a design decision |
| `/research` | researcher | Conduct deep research on a specific topic |
| `/design` | designer | Create a design specification (Google DESIGN.md format) |

## How It Works

The framework defines a complete software development lifecycle managed by AI agents:

```
Uninitialized
    │ run /init
    ▼
┌─────────────────────────────────────────────┐
│          /init prompts for mode              │
│  Brownfield (existing)  or  Greenfield (new) │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
    ┌─────────────────────────────┐
    │ Brownfield: Researcher      │
    │ discovers conventions from  │
    │ existing codebase, docs,    │
    │ git history                 │
    └─────────────┬───────────────┘
                  │
    ┌─────────────────────────────┐
    │ Greenfield: Agent knows     │
    │ the exact project structure │
    │ upfront, no discovery phase │
    └─────────────┬───────────────┘
                  │
                  ▼
    Initialized project
    │ run /plan
    ▼
Planning phase ─── Planner creates sprints with phases of tasks
    │
    ▼
Task execution ─── Team Lead orchestrates:
    │   1. Implementation Spec → detailed spec from task
    │   2. CODER → implement on branch
    │   3. Verifier (if strict) or CODER (if auto) → verify
    │   4. Utility → update docs and status
    │   5. Git → commit, merge, clean up branch
    │
    ▼
Debugging ─── If implementation fails → Researcher investigates
    │         → fix via Ad-Hoc or amend plan via Planner
    ▼
Next sprint
```

Each task runs in an isolated git worktree. The main context window stays small -- the heavy work happens in disposable subagent contexts.

### Settings (`.planning/settings.json`)

| Field | Values | What it controls |
|-------|--------|-----------------|
| `mode` | `human-in-the-loop` / `autonomous` | Whether the user is involved in decisions |
| `verification` | `skip` / `auto` / `strict` | How implementations are verified |
| `max_parallel_tasks` | number | Maximum concurrent task executions |
| `git.remote_configured` | boolean | Whether the repo has a remote configured |
| `git.gh_cli_available` | boolean | Whether the `gh` CLI is installed |
| `git.main_protected` | boolean | Whether main branch is protected from direct pushes |
| `git.use_pr` | boolean | Preference for PRs vs direct merge |

## Philosophy

This framework sits between two extremes:

```
Caveman ←── [THIS FRAMEWORK] ──→ GSD
(terse        (behavioral     (heavy ceremony,
 responses)    framework        30+ workflows,
               with structure)  adversarial verif.)
```

**Caveman** optimizes output tokens. **GSD** optimizes process with 30+ workflow files and adversarial verification. This framework optimizes **agent behavior definitions** and **project knowledge structure** without ceremony overload.

Key architectural decisions (15 total, documented in `research/design-decisions.md`):

| Area | Decision |
|------|----------|
| Entrypoint | AGENTS.md as minimal directory index (pointers only, no duplicated content) |
| State | No STATE.md file -- planning files are the state |
| Knowledge | Project knowledge in `.docs/`, not in prompts |
| Init flow | Team Lead prompts user for `/init`, Researcher executes |
| Templates | Embedded in `commands/init.md`, not separate files |
| Specifications | Always per-task (never per-phase) |
| Design format | Google's DESIGN.md (YAML frontmatter + Markdown body) |

## Documentation

| File | Purpose |
|------|---------|
| `research/design-decisions.md` | 15 formal architecture decisions |
| `research/comparative-analysis.md` | Comparison with GSD, Caveman, and other frameworks |
| `research/agentic-coding-frameworks.md` | Landscape analysis of behavioral frameworks |
| `agents/*.md` | Per-agent behavior definitions |
| `commands/*.md` | Per-command definitions with frontmatter |

## License

MIT
