---
name: init
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

**3. Research phase** — Based on project type and user's tech choices: investigate best practices, frameworks, libraries. Validate tech choices against project requirements. Produce recommendations for architecture, libraries, and development approach.

**4. Fill in project files** — Based on discussion and research, update all template files copied by install.js to reflect the project's actual conventions and decisions. Create any missing files. After filling in, verify the result mirrors `.docs/project-structure.md`.

   For each file:

   **AGENTS.md** — Replace `{{sprint-codename}}` with: `<!-- SPRINT-CODENAME-PLACEHOLDER — planner should be spawned to plan sprints and update this file -->`. Do not invent a sprint name — only the planner creates sprints.

   **README.md** — Fill in project name, one-line description, the 2-3 paragraph overview, and the documentation map table. For sections requiring implementation to exist (Quick Start, Usage, Configuration): leave `<!-- WORK IN PROGRESS — fill in after initial implementation -->`. Omit or leave empty any root-level badges (CI, Version) — they require a live project to be accurate.

   **CONTRIBUTING.md** — Fill in language/framework, test command, formatter, linter, naming conventions. Ensure branch naming and commit convention sections are complete.

   **CHANGELOG.md** — Keep as template with `[Unreleased]` section. Add initial version entry only if a release is imminent.

   **ROADMAP.md** — Fill in version names and goals for first two milestones based on discussion. Each version entry should link to its corresponding `.planning/milestones/vX.Y.Z.md`. Add `Beyond the Roadmap` section with aspirational ideas discussed.

   **`.docs/outline.md`** — Write the full project overview: Overview paragraph, Goals, Architecture description, Components (one section per component with purpose, tech stack, responsibilities, interactions), Tech stack table with rationale, Design decisions, Open decisions (note if UI design is pending — Designer agent will create `.docs/design.md` later).

   **`.docs/project-structure.md`** — Document the actual project conventions decided during discussion. This is NOT a copy of the standard template — capture what was decided for this project: which directories exist, how they are organized, naming conventions, any deviations from the standard layout. Agents read this at session start.

   **`.planning/settings.json`** — Write the values agreed during discussion. If any value was not discussed, use: mode = human-in-the-loop, verification = auto, max_parallel_tasks = 5, remote_configured = false, gh_cli_available = false, main_protected = true, use_pr = true.

   **`.gitignore`** — Ensure it exists with standard entries: `node_modules/`, `dist/`, `build/`, `.env`, `worktree/`. Add framework-specific entries if needed (e.g. `__pycache__/`, `.next/`, `target/`).

   **LICENSE and CODE_OF_CONDUCT.md** — Create if the user requested them during discussion.

   After all files are filled in, verify the project structure mirrors `.docs/project-structure.md`. If any expected file or directory is missing: create it. If any placeholder remains unfilled: flag it to the user and ask for the missing information.

   Delete the temporary discussion tracking file.

**5. Model configuration** — See model configuration section below. Must be absolute last step — after this, user restarts OpenCode for changes to take effect.

# model configuration

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
      "hidden": true,
      "permission": {
        "task": "deny"
      }
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
