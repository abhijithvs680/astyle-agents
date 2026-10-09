/**
 * Keeps the two copies of each prompt template in step.
 *
 * `<name>.plain.json` is the source: real JSON, so it can be validated and
 * diffed. `<name>.json` is the copy pasted into the platform, where braces
 * collide with the prompt engine's own placeholders and are written as
 * ESCUP / ESCDOWN instead. CRLF, because that is what the platform expects.
 *
 *   node scripts/sync-report-template.mjs          # write the escaped twins
 *   node scripts/sync-report-template.mjs --check  # fail if they are stale
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const docs = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");

/** Each entry is [source of truth, generated twin]. */
const PAIRS = [["report-template.plain.json", "report-template.json"]];

const check = process.argv.includes("--check");
let failed = false;

for (const [sourceName, targetName] of PAIRS) {
  const sourcePath = join(docs, sourceName);
  const targetPath = join(docs, targetName);
  const source = readFileSync(sourcePath, "utf8");

  // Parse before writing: an escaped copy of broken JSON is worse than no copy,
  // because nothing downstream can parse it to find out.
  try {
    JSON.parse(source);
  } catch (error) {
    console.error(`${sourceName} is not valid JSON: ${error.message}`);
    process.exitCode = 1;
    continue;
  }

  const escaped =
    source
      .replace(/\r\n/g, "\n")
      .replace(/\{/g, "ESCUP")
      .replace(/\}/g, "ESCDOWN")
      .replace(/\n/g, "\r\n");

  if (check) {
    const current = readFileSync(targetPath, "utf8");
    if (current !== escaped) {
      console.error(`${targetName} is out of date — run: npm run template:sync`);
      failed = true;
    }
    continue;
  }

  writeFileSync(targetPath, escaped, "utf8");
  console.log(`wrote ${targetName} from ${sourceName}`);
}

if (failed) process.exitCode = 1;
