---
name: plan
agent: planner
---

# Plan

{{$ARGUMENTS}}

Read the project state and create a plan. Discuss the plan with the user before committing to it.

## Steps

1. If context was provided with the command (text above), use it as a starting point for what to plan. It may suggest a direction like "the next sprint" or a constraint like "prioritize security." Validate this context against what you find — it may be incomplete or outdated.

2. Read the planning files and documentation — understand what logical units exist, their status, and the project's architecture and goals. Discover what the project calls its work units rather than assuming a term.

3. Read the project conventions — understand the structure of planning files, naming conventions, and how tasks are organized.

4. Determine what needs to be planned next based on both the provided context and what the files show. Examples of what you may need to create:
   - Initial plan if no units exist yet
   - The next unit after the current one finishes
   - A bugfix requirement to be added to the current unit
   - A discussion requirement when design decisions need amendment

5. Present your findings and proposed plan for discussion. Include:
   - The current project state (what is done, what is pending)
   - The proposed structure using the project's own terminology
   - Task breakdown with complexity tiers (which tasks suit a weaker model, which need a stronger one)
   - Dependencies and parallelization opportunities

6. Incorporate feedback and finalize the plan.
