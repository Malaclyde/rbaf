---
name: discuss
agent: researcher
---

# Discuss

{{$ARGUMENTS}}

Research a design decision and discuss it with the user. Document the conclusion.

## Steps

1. If context was provided with the command (text above), use it as the starting point for what needs to be decided. It may contain a specific question ("should we use X or Y?"), a design tradeoff to explore, or a reference to a discussion requirement in the planning files.

2. Read the relevant planning files, design docs, and codebase to understand the context around the decision.

3. Research available options — look up documentation, best practices, and community patterns for each approach.

4. Present your findings to the user with a clear comparison of options, tradeoffs, and your recommendation.

5. Discuss and refine based on user feedback.

6. Document the decision in the appropriate files (update design docs, add a decision record, or update the discussion requirement status).
