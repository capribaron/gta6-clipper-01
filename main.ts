// gta6-clipper-01 entry program (Node 22, standard library only).
//
// The entry is a public YouTube video: an AI agent cut a GTA 6 moment into a
// vertical clip that pitches make.fun, and the video's views decide the
// places. This program's whole job is to hand the video's address to the
// grader: it copies VIDEO.json from the repository root (MAKEFUN_BOT_DIR)
// into the output directory (MAKEFUN_OUTPUT_DIR), where the gate reads it
// back and looks the video up on YouTube itself. Nothing this program writes
// about the video is scored.
//
// Outside the grader's container, run it the same way:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'VIDEO.json');
const target = join(OUTPUT_DIR, 'VIDEO.json');

// The file must at least be a JSON object with a "url" string before it is
// worth handing over; a malformed file fails here instead of at the gate.
const parsed: unknown = JSON.parse(readFileSync(source, 'utf8'));
if (
  typeof parsed !== 'object' ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== 'string'
) {
  console.error('VIDEO.json must be a JSON object with a "url" string.');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, target);

// The copy must be byte for byte the file in the repository: read both back
// and compare, so a truncated or altered copy fails loudly here instead of
// handing the gate a different address than the one in the commit.
if (!readFileSync(target).equals(readFileSync(source))) {
  console.error('The copied VIDEO.json differs from the one in the repository.');
  process.exit(1);
}
