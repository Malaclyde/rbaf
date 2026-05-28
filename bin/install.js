#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, copyFileSync, statSync } = fs;

const AGENTS = [
  'TEAM_LEAD.md', 'PLANNER.md', 'RESEARCHER.md', 'IMPLEMENTATION_SPEC.md',
  'CODER.md', 'VERIFIER.md', 'DESIGNER.md',
  'GIT.md', 'AD-HOC.md', 'UTILITY.md',
];

const COMMANDS = [
  'plan.md', 'init.md', 'research.md', 'discuss.md', 'design.md',
];

const REPO_ROOT = path.resolve(__dirname, '..');

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

function promptProjectType() {
  return new Promise((resolve) => {
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('');
    console.log('Project type:');
    console.log('  1) Brownfield  — existing project, unknown structure (agents discover conventions)');
    console.log('  2) Greenfield  — new project, standard structure (agents know layout)');
    console.log('');
    rl.question('  Which type? [1/2]: ', (answer) => {
      rl.close();
      resolve(answer.trim() === '2' ? 'greenfield' : 'brownfield');
    });
  });
}

function validateSources(sourceAgentsDir, sourceCommandsDir) {
  const errors = [];

  if (!existsSync(sourceAgentsDir)) {
    errors.push(`agents directory not found: ${sourceAgentsDir}`);
  }
  if (!existsSync(sourceCommandsDir)) {
    errors.push(`commands directory not found: ${sourceCommandsDir}`);
  }

  for (const agentFile of AGENTS) {
    const p = path.join(sourceAgentsDir, agentFile);
    if (!existsSync(p)) {
      errors.push(`agent file not found: ${agentFile}`);
    }
  }

  for (const cmd of COMMANDS) {
    const p = path.join(sourceCommandsDir, cmd);
    if (!existsSync(p)) {
      errors.push(`command file not found: ${cmd}`);
    }
  }

  return errors;
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

async function main() {
  const flags = parseArgs();

  if (flags.help) {
    printHelp();
    process.exit(0);
  }

  const mode = flags.global ? 'global' : 'local';
  const targetDir = getTargetDir(flags.global);
  const projectType = await promptProjectType();

  const sourceAgentsDir = path.join(REPO_ROOT, projectType, 'agents');
  const sourceCommandsDir = path.join(REPO_ROOT, projectType, 'commands');

  console.log(`\n  Agentic coding framework installer\n`);
  console.log(`  source: ${REPO_ROOT}`);
  console.log(`  mode: ${mode}`);
  console.log(`  type: ${projectType}`);

  const errors = validateSources(sourceAgentsDir, sourceCommandsDir);
  if (errors.length > 0) {
    console.error(`\n  error: source validation failed:`);
    for (const err of errors) {
      console.error(`    ${err}`);
    }
    process.exit(1);
  }

  const ops = [];
  const commandsDest = path.join(targetDir, 'commands');
  const agentsDest = path.join(targetDir, 'agents');

  for (const cmd of COMMANDS) {
    const src = path.join(sourceCommandsDir, cmd);
    const dest = path.join(commandsDest, cmd);
    copyCommand(src, dest, flags.dryRun, flags.force, ops);
  }

  for (const agentFile of AGENTS) {
    const src = path.join(sourceAgentsDir, agentFile);
    const dest = path.join(agentsDest, agentFile);
    copyCommand(src, dest, flags.dryRun, flags.force, ops);
  }

  if (projectType === 'greenfield') {
    console.log('\n  Creating project skeleton...');

    // Create empty directories
    const emptyDirs = [
      '.planning/sprints',
      '.planning/milestones',
      '.planning/requirements',
      '.docs/components',
      '.docs/research',
    ];
    for (const dir of emptyDirs) {
      const fullPath = path.join(process.cwd(), dir);
      if (!existsSync(fullPath)) {
        if (!flags.dryRun) {
          mkdirSync(fullPath, { recursive: true });
        }
        ops.push({ type: 'create', file: dir + '/' });
      }
    }

    // Copy template files to project root
    const templatesDir = path.join(REPO_ROOT, 'greenfield', 'templates');
    if (existsSync(templatesDir)) {
      const templateFiles = readdirSync(templatesDir, { recursive: true });
      for (const relativePath of templateFiles) {
        const srcPath = path.join(templatesDir, relativePath);
        if (!existsSync(srcPath)) continue;
        if (!statSync(srcPath).isFile()) continue;

        const destPath = path.join(process.cwd(), relativePath);
        const destDir = path.dirname(destPath);

        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }

        copyCommand(srcPath, destPath, flags.dryRun, flags.force, ops);
      }
    } else {
      ops.push({ type: 'error', reason: 'templates directory not found', file: templatesDir });
    }
  }

  printSummary(ops, targetDir);
}

main();
