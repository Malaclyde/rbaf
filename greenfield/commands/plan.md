---
name: plan
description: Create or update a development plan with sprint phases and task breakdown
agent: planner
---

# Plan

{{$ARGUMENTS}}

Read project state, create plan. Discuss with user before committing.

## Steps

1. If context provided with command (text above): use as starting point. May suggest direction like "next sprint" or constraint like "prioritize security." Validate against what you find — context may be incomplete or outdated.

2. Read planning files and docs — understand logical units, status, architecture, goals. Discover what project calls work units rather than assuming term.

3. Read project conventions — structure of planning files, naming, task organization.

4. Determine what needs planned next based on context and files. Examples:
   - Initial plan if no units exist
   - Next unit after current finishes
   - Bugfix requirement for current unit
   - Discussion requirement when design decisions need amendment

5. Present findings and proposed plan for discussion. Include:
   - Current project state (done, pending)
   - Proposed structure using project's own terminology
   - Task breakdown with complexity tiers (which tasks suit weaker model, which need stronger)
   - Dependencies and parallelization opportunities

6. Incorporate feedback, finalize plan.
