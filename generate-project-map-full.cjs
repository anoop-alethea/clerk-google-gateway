const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const OUTPUT_FILE = path.join(ROOT, 'project-map-full.txt');

const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.cache', '.vscode', 'coverage', '.turbo'
]);

const EXCLUDE_FILES = new Set([
  '.DS_Store', 'yarn.lock', 'package-lock.json', 'pnpm-lock.yaml'
]);

const MAX_FILE_SIZE_BYTES = 100 * 1024; // 100 KB

let structureLines = [];
let fileBlocks = [];

// Build structure + collect file paths
function walk(dir, depth = 0, relPath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(relPath, entry.name);

    if (EXCLUDE_DIRS.has(entry.name) || EXCLUDE_FILES.has(entry.name)) return;

    const indent = '  '.repeat(depth);

    if (entry.isDirectory()) {
      structureLines.push(`${indent}${entry.name}/`);
      walk(fullPath, depth + 1, relativePath);
    } else if (entry.isFile()) {
      structureLines.push(`${indent}${entry.name}`);

      try {
        const stats = fs.statSync(fullPath);
        if (stats.size <= MAX_FILE_SIZE_BYTES) {
          const content = fs.readFileSync(fullPath, 'utf8');
          fileBlocks.push(`=== FILE: ${relativePath} ===\n${content}\n`);
        } else {
          fileBlocks.push(`=== FILE: ${relativePath} ===\n[Skipped: too large]\n`);
        }
      } catch (err) {
        fileBlocks.push(`=== FILE: ${relativePath} ===\n[Error reading file: ${err.message}]\n`);
      }
    }
  });
}

// Run it
walk(ROOT);

// Write output
const finalOutput = [
  '=== PROJECT STRUCTURE ===\n',
  structureLines.join('\n'),
  '\n\n=== FILE CONTENTS ===\n',
  fileBlocks.join('\n')
].join('\n');

fs.writeFileSync(OUTPUT_FILE, finalOutput);
console.log(`✅ Full project map written to: ${OUTPUT_FILE}`);
