import { readFileSync } from "fs"
import { join } from "path"

let cachedIds: number[] | null = null

function loadGameIds(): number[] {
  if (cachedIds) return cachedIds

  try {
    const filePath = join(process.cwd(), "data", "appidler.txt")
    let raw = readFileSync(filePath, "utf-8")

    // Strip BOM and any non-ASCII characters
    raw = raw.replace(/^\uFEFF/, "").replace(/[^\x20-\x7E\n\r]/g, "")

    const lines = raw.split(/\r?\n/)
    const ids: number[] = []

    for (const line of lines) {
      // Each line has space-separated digits like " 3 5 0 0" = 3500
      const digits = line.replace(/\s+/g, "").trim()
      if (digits.length > 0 && /^\d+$/.test(digits)) {
        const num = parseInt(digits, 10)
        if (num > 0) {
          ids.push(num)
        }
      }
    }

    // Deduplicate
    cachedIds = [...new Set(ids)]
    console.log(`[v0] Loaded ${cachedIds.length} unique game IDs from appidler.txt (${lines.length} lines)`)
    return cachedIds
  } catch (err) {
    console.error("[v0] Failed to load appidler.txt:", err)
    // Fallback: a small set of known popular game IDs
    cachedIds = [730,570,440,304930,1091500,578080,1172470,292030,1245620,271590,1174180,252490,359550,413150]
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
