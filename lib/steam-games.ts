import { readFileSync } from "fs"
import { join } from "path"

interface GameEntry {
  appid: number
  name: string
}

let cachedIds: number[] | null = null

function loadGameIds(): number[] {
  if (cachedIds) return cachedIds

  try {
    // Load the full JSON from public/ at runtime (server-side only)
    const filePath = join(process.cwd(), "public", "games_appid.json")
    const raw = readFileSync(filePath, "utf-8")
    const games: GameEntry[] = JSON.parse(raw)
    cachedIds = games.map((g) => g.appid)
    return cachedIds
  } catch {
    // Fallback: return empty array (should not happen in production)
    console.error("Could not load games_appid.json, using empty list")
    return []
  }
}

export function getRandomGameId(): number {
  const ids = loadGameIds()
  if (ids.length === 0) return 730 // CS2 fallback
  const index = Math.floor(Math.random() * ids.length)
  return ids[index]
}

export function getTotalGameCount(): number {
  return loadGameIds().length
}
