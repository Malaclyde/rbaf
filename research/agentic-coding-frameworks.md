# Agentic Coding Frameworks Research

Date: 2026-05-15
Context: Research conducted to understand the landscape of agentic coding tools before designing agent system prompts and project structure conventions.

---

## Scope Clarification

This research covers two distinct categories:

1. **Behavioral Frameworks** (directly relevant) — Define agent personality, workflow, project structure, memory patterns via system prompts and conventions. Examples: GSD, Caveman.
2. **Harnesses/Runtimes** (tangentially relevant) — The tools/IDEs that execute agents. Examples: Aider, Cline, Cursor, Claude Code.

This project is building a **behavioral framework** — the `.md` files define how agents think, plan, research, and cooperate. The harness (OpenCode) is separate and provides tools dynamically.

---

## Reference Frameworks (in `temp/`)

### Caveman
- **Approach**: Token-minimizing. Compresses AI communication — drops articles, filler, pleasantries, hedging.
- **Mechanism**: MCP proxy server (`caveman-shrink`) that intercepts tool descriptions and compresses prose fields. Also defines response style rules (caveman mode).
- **Intensity levels**: lite / full / ultra / wenyan (Classical Chinese).
- **Key insight**: Rules-based response compression works. Same accuracy, fewer context tokens.
- **Relevance**: Demonstrates that response style can be enforced purely via rules in system prompts + middleware.

### Get-Shit-Done (GSD)
- **Approach**: Heavy formal process. 30+ workflow files, 40+ template files.
- **Structure**: `.planning/` directory with PROJECT.md, ROADMAP.md, STATE.md, REQUIREMENTS.md, MILESTONES.md, BACKLOG.md, LEARNINGS.md, THREADS.md, config.json, CLAUDE.md.
- **Workflows**: new-project, spec-phase, plan-phase, execute-phase, verify-phase, verify-work, quick, fast, code-review, review, discovery-phase, ultraplan-phase, insert-phase, transition, update, cleanup, health, import, ingest-docs, add-tests, etc.
- **Phase structure**: Each phase has dedicated files (NN-NAME-PLAN.md, NN-NAME-SUMMARY.md, NN-CONTEXT.md, etc.).
- **Sub-agents**: gsd-executor, gsd-verifier, gsd-planner, gsd-phase-researcher, gsd-plan-checker, gsd-debugger, gsd-codebase-mapper, gsd-code-reviewer, gsd-integration-checker, gsd-nyquist-auditor, gsd-ui-researcher, gsd-ui-checker, gsd-ui-auditor.
- **Multi-runtime**: Supports Claude Code, OpenCode, Gemini CLI, Codex CLI, Cursor, Kilo, Ollama, LM Studio, llama.cpp.
- **Key insight**: Formal phase planning + separate files per logical unit means agents only load relevant context. Heavy ceremony but high traceability.
- **Relevance**: The closest existing analog to this project. Shows what full ceremony looks like — useful as upper bound reference.

---

## Behavioral Frameworks (Not Harnesses)

No other pure behavioral frameworks at GSD's level of completeness were found. The closest patterns exist within harnesses that have strong user-prompt conventions.

---

## Harnesses (Tangentially Relevant)

### Aider (Paul Gauthier) — 45K stars
- **Architecture**: CLI-based, single-threaded, user-in-the-loop. Intentionally non-autonomous.
- **Repo map**: Tree-sitter AST + PageRank algorithm → compresses 100K-line repos into ~1K tokens. Graph ranks identifiers by centrality (how often referenced).
- **Git-as-safety**: Every AI edit = separate auto-commit. `git revert` for undo. Zero undo cost.
- **Architect/Editor split**: Two-model pipeline. Powerful model plans, cheap model executes edits. Separates reasoning from implementation.
- **Token usage**: ~4.2x fewer tokens than Claude Code for equivalent tasks (repo map compression).
- **Model-agnostic**: 50+ providers supported.
- **Key success factors**: Repo map (first to solve context window for large codebases), git safety net, open source, benchmark leader despite single maintainer.

### Claude Code (Anthropic) — 124K stars
- **Architecture**: Terminal-first, full tool set (15+ tools). ReAct-style loop.
- **Sub-agents**: Can delegate subtasks to separate agent sessions.
- **Context management**: Uses prompt caching extensively. Auto-compacts when approaching limits.
- **Key differentiator**: Anthropic's own model, deep MCP integration, most popular CLI coding agent.

### Cline (Cline Inc.) — 62K stars
- **Architecture**: VS Code extension with TypeScript agent loop. Model-agnostic.
- **Tools**: bash, editor, read_files, apply_patch, search, fetch_web, ask_question. MCP integration.
- **Context management**: Auto-compact (summarization at window limit), `/smol` manual compact, `/newtask` fresh context with distilled handoff, `.clineignore`.
- **Sub-agents**: Experimental parallel research agents. Coordinator agent delegates to specialists.
- **Modes**: Plan mode (only `plan_mode_respond` tool) vs Act mode (all tools).
- **Key differentiator**: Most complete open-source VS Code agent, richest tool ecosystem, MCP marketplace.

### Roo Code (RooVetGit → defunct as of May 2026) — 24K stars
- **Fork of Cline** with more features, less stability.
- **Unique features**:
  - **Modes system**: Code, Architect, Ask, Debug, Orchestrator (Boomerang Mode). Each mode has its own tool groups, role definition, and prompt.
  - **Boomerang Tasks**: Orchestrator breaks complex tasks into subtasks, each in its own context window with specialized mode.
  - **Tool groups**: Read, Search, Edit, Command, MCP, Workflow, Image — organized into named groups modes can enable/disable.
  - **Custom modes**: YAML-defined with roleDefinition, customInstructions, groups, file regex restrictions.
  - **Per-mode temperature, sticky models, API profiles**.
- **Key differentiator**: Most sophisticated mode/orchestration system. Shows how role-based tool access + mode switching enables multi-agent-like behavior in a single-agent runtime.

### Cursor (Anysphere) — Proprietary AI-first IDE
- **Architecture**: VS Code fork with deep AI integration. Client-side encryption → cloud inference.
- **Context**: Full codebase vector indexing (Turbopuffer), Merkle tree sync for incremental re-indexing. Open tabs as high-weight context. @-mention system.
- **Agent features**: Agent Mode (20 tool calls/prompt), Background Agents (isolated AWS VMs), Plan Mode, Apply Model (cheap model rewrites file from diff).
- **Token philosophy**: Heavy — full embeddings, background agents, cloud processing.
- **Key differentiator**: Fastest completions (~200ms, 72% acceptance), deepest editor integration, $1B ARR.

### Windsurf / Cascade (Codeium → Cognition) — Proprietary AI-first IDE
- **Architecture**: VS Code fork + JetBrains plugin. Originally Codeium, rebranded to Windsurf, acquired by Cognition (~$250M).
- **Context**: Fast Context (auto-indexes entire project), M-Query RAG, Codemaps (architectural awareness), real-time flow-state tracking.
- **Agent**: Cascade — plans multi-step edits, reads files, runs terminals, auto-continues. Adaptive model router (cheapest sufficient model per task).
- **Arena Mode**: Multiple models side-by-side on same prompt.
- **Token philosophy**: Adaptive — simpler tasks cost less via model routing.
- **Key differentiator**: Best autonomous agent (least steering needed), strongest compliance (FedRAMP), adaptive routing saves tokens.

### GitHub Copilot (Microsoft) — 4.7M paid subscribers
- **Architecture**: Extension in all major IDEs (VS Code, JetBrains, Neovim, Xcode, Visual Studio). Azure-hosted models.
- **Agent features**: Ask/Plan/Agent personas, Copilot Edits (multi-file working set), Cloud Agents (on GitHub Actions — assigned issue, writes code, creates PR, self-reviews), third-party agent SDK.
- **Context**: Open files + limited codebase indexing. Weaker than Cursor/Windsurf for multi-file.
- **Token philosophy**: Cheapest entry ($10/mo). Context-limited; 67% of devs hit limits regularly.
- **Key differentiator**: Widest IDE support, strongest enterprise/GitHub integration, lowest price.

### Continue (Continue Dev) — 33K stars
- **Architecture**: Open-source VS Code/JetBrains extension, pivoted to CI/CD PR checks platform.
- **Legacy**: Highly flexible context providers (@File, @Codebase via RAG, @Docs, etc.), any model (local or cloud), MCP support.
- **New**: PR checks as code (`.continue/checks/`), run as autonomous agents against PR diffs, reported as GitHub status checks.
- **Key differentiator**: Only fully open-source option, any model, unique PR checks niche.

### OpenHands (All-Hands-AI) — 74K stars
- **Architecture**: Event-sourced, Pydantic-typed events with append-only EventLog. Stateless Agent, mutable ConversationState.
- **Sandboxing**: Optional (LocalWorkspace default, DockerWorkspace opt-in).
- **Planning**: Light — "code is the universal action." No multi-agent. System prompt + microagents + event history.
- **Context**: Condenser system — automatic summarization at window limits. Microagents that auto-load based on repo context (AGENTS.md files, `.openhands/` directory).
- **MCP**: Full native support.
- **Key differentiator**: Event-sourced architecture, microagent knowledge injection, SOTA SWE-bench (~77% with critic model).

### SWE-agent (Princeton NLP) — 19K stars (maintenance-only)
- **Architecture**: Shell-based agent loop. Docker container via SWE-ReX. ACI (Agent-Computer Interface) design.
- **ACI**: 4 tool bundles designed specifically for LM agents (not humans). Windowed file viewer (100-line chunks), line-targeted file editor with linter, search commands (no context-display), submit.
- **Key insight**: Good ACI design matters more than model capability. Constrained, precise tool interfaces prevent agents from getting confused.
- **mini-SWE-agent**: ~100 lines of Python, same performance, >74% SWE-bench Verified. Minimal possible harness.
- **Key differentiator**: Research-first (NeurIPS 2024). Proved ACI matters. Shows minimal viable agent loop.

### CrewAI — 52K stars
- **Architecture**: Role-based agent teams with defined goals, backstories, tools. Sequential and hierarchical processes.
- **Flows**: Event-driven orchestration layer with `@start`, `@listen`, `@router` decorators defining DAG-like execution.
- **Memory**: Short-term (per-task), long-term (RAG-based vector DB), entity memory.
- **Key differentiator**: "Assemble the team" mental model. Role-playing with backstory creates reliable constrained behavior.
- **Relevance**: Not a coding agent — a multi-agent orchestrator. Shows role-based agent design patterns.

### LangGraph (LangChain) — 32K stars
- **Architecture**: Directed graph of nodes and edges with typed state. Inspired by Pregel/Apache Beam. Conditional edges, sub-graphs, parallel branches, supervisor patterns.
- **State**: Explicit typed state + checkpointing → durable execution (pause/resume across failures).
- **Key differentiator**: "Design the state machine." Full control over execution topology. Deep observability (LangSmith).
- **Relevance**: Not a coding agent — an orchestration framework. Shows state-machine approach to agent workflows.

### AutoGPT — 184K stars (most-starred AI agent project)
- **Architecture**: Think → Act → Observe → Repeat. Classic: JSON output with thoughts/plan/command. 21 built-in commands. Short-term FIFO + long-term vector memory (FAISS/Pinecone).
- **Token philosophy**: Notably expensive — every iteration = full LLM call + embedding call. No built-in optimization.
- **Key differentiator**: Sparked the modern AI agent movement (March 2023). Proved LLM + loop + tools = autonomous behavior. Proved the concept but reliability/cost issues.
- **Relevance**: The prototype that modern coding agents evolved from. Historical reference.

### Semantic Kernel / Microsoft Agent Framework — 28K stars
- **Architecture**: Three-layer SDK (Kernel → Agents → AgentGroupChat). Model-agnostic, primary language C#.
- **Enterprise**: .NET/Azure integration, DI container pattern, plugin-based memory stores.
- **Key differentiator**: Enterprise-first, polyglot SDK. Brings agent patterns to .NET/C# world.
- **Relevance**: Shows enterprise .NET approach to agent systems.

---

## Cross-Cutting Patterns

### Context Window Management Strategies
| Strategy | Used By | Effectiveness |
|---|---|---|
| Structural compression (repo map) | Aider | Very high — 100K lines → 1K tokens |
| Auto-summarization at limit | Claude Code, Cline, OpenHands | High — preserves key decisions |
| Vector embeddings + indexing | Cursor, Windsurf | High — but expensive |
| Separate file per logical unit | GSD | High — agents only load relevant context |
| Rules-based terse responses | Caveman | Medium — saves output tokens, not input |

### Agentic Patterns
| Pattern | Used By | Description |
|---|---|---|
| Architect/Editor split | Aider | Powerful model plans, cheap model edits |
| Role-based Modes | Roo Code, Cline | Different tool access per mode |
| Team Lead + Sub-agents | GSD, Cline | Hierarchical delegation |
| State Machine Graph | LangGraph | Explicit typed state + conditional edges |
| Autonomous Think-Act Loop | AutoGPT, Claude Code | Single agent loops with tools |
| Event-sourced Agent | OpenHands | Append-only event log, stateless agent |

### Safety Patterns
| Pattern | Used By |
|---|---|
| Git auto-commit per edit | Aider |
| Checkpoints per tool use | Cline |
| Review-on-submit | SWE-agent |
| User approval per tool | Cline (configurable) |

### Project Structure Patterns
| Pattern | Used By |
|---|---|
| `.planning/` directory | GSD |
| `AGENTS.md` per repo | OpenHands |
| `.clinerules` / `.cursor/rules` | Cline, Cursor |
| `.github/copilot-instructions.md` | Copilot |
| `.windsurfrules` | Windsurf |

---

## Key Takeaways for This Project

1. **No other project does exactly what this one does** — a behavioral framework that is tool-agnostic, project-structure-agnostic, and sits between Caveman (minimal) and GSD (heavy).

2. **Aider's repo map** is the most significant context-saving innovation — worth considering whether a similar structural compression approach could be integrated.

3. **GSD's file-per-unit pattern** is the most relevant reference — demonstrates that separate files for phases/tasks means agents only load what they need.

4. **Roo Code's modes system** shows how role-specific prompts + tool access groups can emulate multi-agent behavior in a single runtime.

5. **Git safety is universally expected** — any agentic workflow needs an undo mechanism.

6. **MCP is becoming standard** — the project should remain tool-agnostic but MCP-aware.

7. **The microagent/skill pattern** (OpenHands AGENTS.md, Cline skills, GSD subagent prompts) is a lightweight way to inject domain knowledge without modifying core prompts.
