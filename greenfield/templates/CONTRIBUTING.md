# Contributing

## Code of Conduct

This project follows a Code of Conduct. By participating, you are expected to uphold it.

## Branch Naming

Branches follow the requirement type they address:

```
<type>/<sprint-codename>/<short-description>
```

Types: `feat`, `fix`, `research`, `discuss`, `chore`.

- `feat` — new feature (maps to feature requirement)
- `fix` — bugfix (maps to bugfix requirement)
- `research` — investigative work (maps to research requirement)
- `discuss` — design decision work (maps to discussion requirement)
- `chore` — maintenance, dependencies, CI (no requirement required)

Branch types reflect the planning purpose. A single branch may contain multiple commits of different conventional types.

## Pull Request Process

1. Keep PRs focused on a single concern.
2. Run the full test suite and linter before submitting.
3. Update documentation if your change affects public APIs or behavior.
4. Include a summary of what changed and why.
5. Mark the PR as **Ready for Review** once CI passes.

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```

<type>(<scope>): <description>

feat: add user authentication
fix: resolve login redirect loop
docs: update API reference
refactor: extract validation logic
test: add unit tests
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`.
Scope optional — use to indicate component or module affected.

Commit types describe what the commit does, not which requirement it belongs to. A `feat/` branch may contain `feat:`, `refactor:`, `test:`, and `docs:` commits. The branch type signals the planning frame; the commit type describes the change.
