# Model Configuration During Initialization

Goal: Define how the Researcher discovers available models, proposes a mapping to the user, and generates the opencode.json file.

---

## Instruction for the Researcher (to be embedded in `commands/initialize-project.md`)

### Step 1: Ask User Preference

Tell the user that OpenCode needs to be configured with model assignments for each agent role. Ask if they already have a preference:

```
I need to set up which models power each agent role.
Do you already have specific models in mind, or should I
look at your configured providers and propose something?
```

If the user has preferences, discuss and skip to Step 4.
If they want you to propose, proceed to Step 2.

### Step 2: List Configured Providers

Run `opencode providers list` to show the user which providers are available.

Ask: "Which providers would you like to use?"

Wait for their response before proceeding.

### Step 3: Discover Available Models

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

Run `opencode models` to get the plain list of model IDs. Then for any model you want to check the price of, run:

```bash
opencode models --verbose | grep -A 15 "^$MODEL_ID$" | grep -E "(name|cost)"
```

This extracts just the pricing info for that specific model.

### Step 4: Classify Models into Three Tiers

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

### Step 5: Propose Mapping to the User

Present the proposal:

```
I found these model tiers available from your configured providers:

  Powerful: anthropic/claude-opus-4-5     ($5.00/$25.00 per 1M tokens)
  Mid:      anthropic/claude-sonnet-4-5   ($3.00/$15.00 per 1M tokens)
  Weak:     anthropic/claude-haiku-4-5    ($1.00/$5.00 per 1M tokens)

I propose:
  - Powerful model → team lead, researcher, planner, verifier
  - Mid model     → implementation spec, mid-coder, designer, ad-hoc
  - Weak model    → weak-coder, task-tracker

Would you like to:
  1. Accept this proposal
  2. Use the same model for all agents (simpler, no cost optimization)
  3. Choose different models manually
```

### Step 6: Generate opencode.json

Based on the agreed mapping, create or update `opencode.json` in the project root using the template below. Replace `$POWERFUL_MODEL`, `$MID_MODEL`, and `$WEAK_MODEL` with the actual model IDs from the discussion.

If `opencode.json` already exists (user had pre-existing configuration), merge the agent section into it rather than overwriting.

### Step 7: Finalize

Tell the user:

```
OpenCode configuration has been created/updated at opencode.json.
Please restart OpenCode for the changes to take effect.
Then run this command again if you need to continue initialization:
  /init
```

---

## Template for opencode.json

Note: The agent-specific model assignments, mode (primary/subagent), and visibility (hidden) below are **design decisions that depend on the final agent prompts**. The schema and placeholder values are structurally correct.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "team-lead": {
      "description": "Orchestrates the development team, delegates work to sub-agents, and tracks project progress.",
      "mode": "primary",
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/TEAM_LEAD.md}"
    },
    "researcher": {
      "description": "Deep research and user discussions. Handles project initialization, technology research, and debugging investigations.",
      "mode": "primary",
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/RESEARCHER.md}"
    },
    "planner": {
      "description": "Creates tasks, requirements, milestones, and sprint plans from project vision and documentation.",
      "mode": "subagent",
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/PLANNER.md}",
      "hidden": true
    },
    "implementation-spec": {
      "description": "Writes implementation specifications based on requirements, splitting work into mid-coder and weak-coder tasks.",
      "mode": "subagent",
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/IMPLEMENTATION_SPEC.md}",
      "hidden": true
    },
    "mid-coder": {
      "description": "Implements larger, more important coding tasks based on implementation plans.",
      "mode": "subagent",
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/MID-CODER.md}",
      "hidden": true
    },
    "weak-coder": {
      "description": "Implements small, simple, non-critical coding tasks that follow clear instructions.",
      "mode": "subagent",
      "model": "$WEAK_MODEL",
      "prompt": "{file:.opencode/agents/WEAK-CODER.md}",
      "hidden": true
    },
    "verifier": {
      "description": "Verifies completed work matches the definition of done through independent review.",
      "mode": "subagent",
      "model": "$POWERFUL_MODEL",
      "prompt": "{file:.opencode/agents/VERIFIER.md}",
      "hidden": true
    },
    "task-tracker": {
      "description": "Updates planning documentation after tasks are completed.",
      "mode": "subagent",
      "model": "$WEAK_MODEL",
      "prompt": "{file:.opencode/agents/TASK_TRACKER.md}",
      "hidden": true
    },
    "designer": {
      "description": "Handles UI design tasks and creates design specification files.",
      "mode": "subagent",
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/DESIGNER.md}",
      "hidden": true
    },
    "ad-hoc": {
      "description": "Handles quick changes, bugfixes, and ad-hoc queries that don't fit other agent roles.",
      "mode": "subagent",
      "model": "$MID_MODEL",
      "prompt": "{file:.opencode/agents/AD-HOC.md}",
      "hidden": true
    }
  }
}
```

---

## Notes

- `$POWERFUL_MODEL`, `$MID_MODEL`, and `$WEAK_MODEL` are filled in by the Researcher based on the discovered models and user discussion
- If the user only has one model, all three placeholders resolve to the same value
- If only two models are available, the powerful and mid roles share one model
- The Researcher must handle the case where `opencode.json` already exists — merge the `agent` section rather than overwriting
- Step 6 (generate opencode.json) is the absolute last step of initialization — after this the user restarts OpenCode
