import { readFileSync, writeFileSync } from "fs";

const raw = readFileSync("user_read_only_context/text_attachments/games_appid-1oSsl.json", "utf-8");
const games = JSON.parse(raw);
const ids = games.map((g) => g.appid).sort((a, b) => a - b);

const lines = [
  `// ${ids.length} Steam Game IDs`,
  `export const STEAM_GAME_IDS: number[] = [${ids.join(",")}]`,
  "",
  "export function getRandomGameId(): number {",
  "  const index = Math.floor(Math.random() * STEAM_GAME_IDS.length)",
  "  return STEAM_GAME_IDS[index]",
  "}",
  "",
];

writeFileSync("lib/steam-games.ts", lines.join("\n"));
console.log(`Wrote ${ids.length} game IDs to lib/steam-games.ts`);
