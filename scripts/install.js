#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

function usage() {
  console.log(`Research Project Manager installer

Usage:
  npx -y github:cameleonh/research-project-manager -- [options]

Options:
  --target <path>      Install Markdown project files into this folder. Default: current directory.
  --codex-home <path>  Codex home folder. Default: CODEX_HOME or ~/.codex.
  --skip-files         Do not install Markdown dashboard/template files.
  --skip-skill         Do not install the Codex skill.
  --force              Overwrite existing destination files.
  --help               Show this help.
`);
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    codexHome: process.env.CODEX_HOME || path.join(os.homedir(), ".codex"),
    skipFiles: false,
    skipSkill: false,
    force: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      continue;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--target") {
      options.target = argv[++i];
    } else if (arg === "--codex-home") {
      options.codexHome = argv[++i];
    } else if (arg === "--skip-files") {
      options.skipFiles = true;
    } else if (arg === "--skip-skill") {
      options.skipSkill = true;
    } else if (arg === "--force") {
      options.force = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyPath(source, destination, options) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing source path: ${source}`);
  }

  if (fs.existsSync(destination)) {
    if (!options.force) {
      console.log(`skip: ${destination} already exists`);
      return;
    }
    fs.rmSync(destination, { recursive: true, force: true });
  }

  ensureDir(path.dirname(destination));
  fs.cpSync(source, destination, { recursive: true });
  console.log(`copy: ${destination}`);
}

function installFiles(options) {
  const target = path.resolve(options.target);
  ensureDir(target);

  const items = [
    "PROJECT_DASHBOARD.md",
    "PROJECT_MANAGEMENT_GUIDE.md",
    "research_project_template",
    "docs",
  ];

  for (const item of items) {
    copyPath(path.join(repoRoot, item), path.join(target, item), options);
  }
}

function installSkill(options) {
  const skillSource = path.join(repoRoot, "codex_skill", "research-project-manager");
  const skillDestination = path.join(
    path.resolve(options.codexHome),
    "skills",
    "research-project-manager"
  );

  copyPath(skillSource, skillDestination, options);
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      usage();
      return;
    }

    if (!options.skipFiles) {
      installFiles(options);
    }

    if (!options.skipSkill) {
      installSkill(options);
    }

    console.log("done");
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
