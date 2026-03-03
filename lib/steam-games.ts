import { readFile } from "fs/promises"
import { join } from "path"

let cachedIds: number[] | null = null

// Popular game IDs as fallback if file read fails
const FALLBACK_IDS = [
  730, 570, 440, 304930, 1091500, 578080, 1172470, 292030,
  1245620, 271590, 1174180, 252490, 359550, 413150, 620,
  8930, 204300, 227300, 374320, 381210, 550, 105600, 236390,
  49520, 255710, 294100, 322170, 391540, 582010, 614570,
  203160, 242760, 261550, 346110, 435150, 550650, 72850,
]

async function loadGameIds(): Promise<number[]> {
  if (cachedIds) return cachedIds

  try {
    const filePath = join(process.cwd(), "data", "appidler.txt")
    let raw = await readFile(filePath, "utf-8")

    // Strip BOM and non-printable chars
    raw = raw.replace(/^\uFEFF/, "").replace(/[^\x20-\x7E\n\r]/g, "")

    const lines = raw.split(/\r?\n/)
    const ids: number[] = []

    for (const line of lines) {
      const digits = line.replace(/\s+/g, "").trim()
      if (digits.length > 0 && /^\d+$/.test(digits)) {
        const num = parseInt(digits, 10)
        if (num > 0) ids.push(num)
      }
    }

    cachedIds = [...new Set(ids)]
    return cachedIds
  } catch {
    cachedIds = FALLBACK_IDS
    return cachedIds
  }
}

export async function getRandomGameId(): Promise<number> {
  const ids = await loadGameIds()
  if (ids.length === 0) return 730
  return ids[Math.floor(Math.random() * ids.length)]
}

export async function getTotalGameCount(): Promise<number> {
  const ids = await loadGameIds()
  return ids.length
}
