import { cpSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
const from = join(root, "dist/cdn");
const to = join(from, `v${version}`);
mkdirSync(to, { recursive: true });
for (const name of readdirSync(from)) {
  if (name === `v${version}`) continue;
  cpSync(join(from, name), join(to, name), { recursive: true });
}
