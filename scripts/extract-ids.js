import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Try multiple paths to find the JSON
const possiblePaths = [
  resolve(__dirname, "games_appid.json"),
  resolve(process.cwd(), "scripts/games_appid.json"),
  resolve(process.cwd(), "games_appid.json"),
  "/home/user/games_appid.json",
];

let raw = null;
for (const p of possiblePaths) {
  console.log("Trying:", p, "exists:", existsSync(p));
  if (existsSync(p)) {
    raw = readFileSync(p, "utf-8");
    console.log("Found at:", p);
    break;
  }
}

if (!raw) {
  console.error("Could not find games_appid.json. CWD:", process.cwd(), "__dirname:", __dirname);
  process.exit(1);
}

const games = JSON.parse(raw);
const ids = games.map((g) => g.appid).sort((a, b) => a - b);

const lines = [
  `// ${ids.length} Steam Game IDs - auto-generated`,
  `export const STEAM_GAME_IDS: number[] = [${ids.join(",")}]`,
  "",
  "export function getRandomGameId(): number {",
  "  const index = Math.floor(Math.random() * STEAM_GAME_IDS.length)",
  "  return STEAM_GAME_IDS[index]",
  "}",
  "",
];

// Try multiple output paths
const outPaths = [
  resolve(__dirname, "../lib/steam-games.ts"),
  resolve(process.cwd(), "lib/steam-games.ts"),
];

let written = false;
for (const op of outPaths) {
  try {
    writeFileSync(op, lines.join("\n"));
    console.log(`Wrote ${ids.length} game IDs to ${op}`);
    written = true;
    break;
  } catch (e) {
    console.log("Could not write to:", op, e.message);
  }
}

if (!written) {
  // Output to stdout as fallback
  console.log("OUTPUT_START");
  console.log(lines.join("\n"));
  console.log("OUTPUT_END");
}
