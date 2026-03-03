import { readFileSync } from "fs"
import { join } from "path"

let cachedIds: number[] | null = null

function loadGameIds(): number[] {
  if (cachedIds) return cachedIds

  try {
    const filePath = join(process.cwd(), "data", "appidler.txt")
    const raw = readFileSync(filePath, "utf-8")
    const lines = raw.split("\n")
    const ids: number[] = []

    for (const line of lines) {
      // Each line has space-separated digits like " 1 0 0 9 0" = 10090
      const stripped = line.replace(/\s+/g, "").trim()
      if (stripped.length > 0) {
        const num = parseInt(stripped, 10)
        if (!isNaN(num) && num > 0) {
          ids.push(num)
        }
      }
    }

    cachedIds = ids
    console.log(`Loaded ${ids.length} game IDs from appidler.txt`)
    return ids
  } catch (err) {
    console.error("Failed to load appidler.txt, using empty list:", err)
    cachedIds = []
    return cachedIds
  }
}

export function getGameIds(): number[] {
  return loadGameIds()
}

export function getRandomGameId(): number {
  const ids = loadGameIds()
  if (ids.length === 0) return 730 // fallback to CS2
  const index = Math.floor(Math.random() * ids.length)
  return ids[index]
}

export function getTotalGameCount(): number {
  return loadGameIds().length
}
