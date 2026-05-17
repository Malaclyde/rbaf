#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, copyFileSync } = fs;

const AGENTS = [
  {
    file: 'TEAM_LEAD.md',
    mode: 'primary',
    description: 'Orchestrates development \u2014 spawns subagents, manages workflow, and drives project sessions',
  },
  {
    file: 'PLANNER.md',
    mode: 'subagent',
    description: 'Creates plans, defines requirements, organizes work into sprints, and produces task breakdowns',
  },
  {
    file: 'RESEARCHER.md',
    mode: 'subagent',
    description: 'Deep research, debugging, project initialization, and technical discussions',
  },
  {
    file: 'IMPLEMENTATION_SPEC.md',
    mode: 'subagent',
    description: 'Writes detailed implementation specifications from sprint plans',
  },
  {
    file: 'MID-CODER.md',
    mode: 'subagent',
    description: 'Implements complex tasks from specifications with tests and verification',
  },
  {
    file: 'WEAK-CODER.md',
    mode: 'subagent',
    description: 'Implements simple, well-defined tasks from specifications',
  },
  {
    file: 'VERIFIER.md',
    mode: 'subagent',
    description: 'Independent verification and code review against specifications',
  },
  {
    file: 'DESIGNER.md',
    mode: 'subagent',
    description: 'Creates UI design specifications following Google\'s DESIGN.md format',
  },
  {
    file: 'AD-HOC.md',
    mode: 'subagent',
    description: 'Generalist problem solver for quick changes, bugfixes, and unforeseen tasks',
  },
  {
    file: 'UTILITY.md',
    mode: 'subagent',
    description: 'Project maintenance \u2014 updates planning files, documentation, and changelogs',
  },
];

const COMMANDS = [
  'plan.md', 'init.md', 'git-commit.md', 'git-pr.md',
  'docs-update.md', 'status-update.md', 'worktree-create.md', 'worktree-finish.md',
];

const REPO_ROOT = path.resolve(__dirname, '..');
const SOURCE_AGENTS_DIR = path.join(REPO_ROOT, 'agents');
const SOURCE_COMMANDS_DIR = path.join(REPO_ROOT, 'commands');

function getGlobalDir() {
  const xdg = process.env.XDG_CONFIG_HOME;
  const base = xdg ? path.resolve(xdg) : path.join(os.homedir(), '.config');
  return path.join(base, 'opencode');
}

function getTargetDir(isGlobal) {
  return isGlobal ? getGlobalDir() : path.resolve(process.cwd(), '.opencode');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = { global: false, dryRun: false, force: false, help: false };

  for (const arg of args) {
    switch (arg) {
      case '--global':
      case '-g':
        flags.global = true;
        break;
      case '--dry-run':
      case '-n':
        flags.dryRun = true;
        break;
      case '--force':
      case '-f':
        flags.force = true;
        break;
      case '--help':
      case '-h':
        flags.help = true;
        break;
    }
  }

  return flags;
}

function printHelp() {
  console.log(`
  opencode-agent-framework installer

  Installs agents and commands from this framework into an OpenCode configuration
  directory.

  Usage:
    node bin/install.js              local install (./.opencode/)
    node bin/install.js --global     global install (~/.config/opencode/)
    node bin/install.js --dry-run    preview without writing
    node bin/install.js --force      overwrite existing files
    node bin/install.js --help       show this message

  Flags:
    -g, --global    Install to global config (~/.config/opencode/)
    -n, --dry-run   Preview changes without writing
    -f, --force     Overwrite existing files
    -h, --help      Show this help
`);
}

function validateSources() {
  const errors = [];

  if (!existsSync(SOURCE_AGENTS_DIR)) {
    errors.push(`agents directory not found: ${SOURCE_AGENTS_DIR}`);
  }
  if (!existsSync(SOURCE_COMMANDS_DIR)) {
    errors.push(`commands directory not found: ${SOURCE_COMMANDS_DIR}`);
  }

  for (const agent of AGENTS) {
    const p = path.join(SOURCE_AGENTS_DIR, agent.file);
    if (!existsSync(p)) {
      errors.push(`agent file not found: ${agent.file}`);
    }
  }

  for (const cmd of COMMANDS) {
    const p = path.join(SOURCE_COMMANDS_DIR, cmd);
    if (!existsSync(p)) {
      errors.push(`command file not found: ${cmd}`);
    }
  }

  return errors;
}

function generateAgentFrontmatter(description, mode) {
  return `---
description: ${description}
mode: ${mode}
---
`;
}

function readFileSafe(filePath) {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function writeFileSafe(filePath, content) {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, content, 'utf-8');
}

function copyCommand(src, dest, dryRun, force, ops) {
  if (existsSync(dest) && !force) {
    ops.push({ type: 'skip', reason: 'exists', file: path.relative(process.cwd(), dest) });
    return;
  }

  const content = readFileSafe(src);
  if (!content) {
    ops.push({ type: 'error', reason: 'unreadable', file: path.relative(process.cwd(), src) });
    return;
  }

  if (!dryRun) {
    writeFileSafe(dest, content);
  }
  ops.push({ type: 'copy', file: path.relative(process.cwd(), dest) });
}

function installAgent(agent, targetDir, dryRun, force, ops) {
  const src = path.join(SOURCE_AGENTS_DIR, agent.file);
  const dest = path.join(targetDir, 'agents', agent.file);

  if (existsSync(dest) && !force) {
    ops.push({ type: 'skip', reason: 'exists', file: path.relative(process.cwd(), dest) });
    return;
  }

  const content = readFileSafe(src);
  if (!content) {
    ops.push({ type: 'error', reason: 'unreadable', file: path.relative(process.cwd(), src) });
    return;
  }

  const frontmatter = generateAgentFrontmatter(agent.description, agent.mode);
  const result = frontmatter + content;

  if (!dryRun) {
    writeFileSafe(dest, result);
  }
  ops.push({ type: 'copy', file: path.relative(process.cwd(), dest) });
}

function printSummary(ops, targetDir) {
  const copies = ops.filter(o => o.type === 'copy');
  const skips = ops.filter(o => o.type === 'skip');
  const errors = ops.filter(o => o.type === 'error');

  console.log(`\n  target: ${targetDir}`);
  console.log(`  agents: ${copies.filter(o => o.file.includes('/agents/')).length} installed`);
  console.log(`  commands: ${copies.filter(o => o.file.includes('/commands/')).length} installed`);

  if (skips.length > 0) {
    console.log(`\n  skipped (use --force to overwrite):`);
    for (const s of skips) {
      console.log(`    ${s.file}`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n  errors:`);
    for (const e of errors) {
      console.log(`    ${e.file}: ${e.reason}`);
    }
  }

  if (copies.length > 0) {
    console.log(`\n  done. ${copies.length} file(s) installed.`);
  } else if (errors.length === 0) {
    console.log(`\n  nothing to install — all files already exist.`);
  }
}

function main() {
  const flags = parseArgs();

  if (flags.help) {
    printHelp();
    process.exit(0);
  }

  const mode = flags.global ? 'global' : 'local';
  const targetDir = getTargetDir(flags.global);

  console.log(`opencode-agent-framework installer\n`);
  console.log(`  source: ${REPO_ROOT}`);
  console.log(`  mode: ${mode}`);

  const sourceErrors = validateSources();
  if (sourceErrors.length > 0) {
    console.error(`\n  error: source validation failed:`);
    for (const err of sourceErrors) {
      console.error(`    ${err}`);
    }
    process.exit(1);
  }

  const ops = [];

  const commandsDest = path.join(targetDir, 'commands');
  const agentsDest = path.join(targetDir, 'agents');

  for (const cmd of COMMANDS) {
    const src = path.join(SOURCE_COMMANDS_DIR, cmd);
    const dest = path.join(commandsDest, cmd);
    copyCommand(src, dest, flags.dryRun, flags.force, ops);
  }

  for (const agent of AGENTS) {
    installAgent(agent, targetDir, flags.dryRun, flags.force, ops);
  }

  printSummary(ops, targetDir);
}

main();
