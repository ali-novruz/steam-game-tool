import { readFileSync } from "fs"
import { join } from "path"

let cachedIds: number[] | null = null

// Popular game IDs as fallback - these are known working Steam app IDs
const FALLBACK_IDS = [
  730,      // CS2
  570,      // Dota 2
  440,      // TF2
  304930,   // Unturned
  1091500,  // Cyberpunk 2077
  578080,   // PUBG
  1172470,  // Apex Legends
  292030,   // The Witcher 3
  1245620,  // Elden Ring
  271590,   // GTA V
  1174180,  // Red Dead 2
  252490,   // Rust
  359550,   // Tom Clancy
  413150,   // Stardew Valley
  550,      // Left 4 Dead 2
  620,      // Portal 2
  4000,     // Garry's Mod
  105600,   // Terraria
  218620,   // PAYDAY 2
  230410,   // Warframe
  238960,   // Path of Exile
  275850,   // No Man's Sky
  289070,   // Civ 6
  322330,   // Don't Starve
  374320,   // Dark Souls III
  381210,   // Dead by Daylight
  394360,   // Hearts of Iron IV
  435150,   // Divinity 2
  489830,   // Skyrim SE
  550650,   // Sea of Thieves
  594650,   // Hunt: Showdown
  703080,   // Planet Coaster
  892970,   // Valheim
  945360,   // Among Us
  1086940,  // Baldur's Gate 3
  1203220,  // Naraka
  1593500,  // God of War
  1817190,  // MW2
  1938090,  // Call of Duty
  2050650,  // Resident Evil 4
  2358720,  // Palworld
]

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
    const uniqueIds = [...new Set(ids)]
    
    // If we got very few IDs, something went wrong - use fallback
    if (uniqueIds.length < 100) {
      console.log(`[v0] Only found ${uniqueIds.length} IDs, using fallback list`)
      cachedIds = FALLBACK_IDS
    } else {
      cachedIds = uniqueIds
      console.log(`[v0] Loaded ${cachedIds.length} unique game IDs from appidler.txt`)
    }
    
    return cachedIds
  } catch (err) {
    console.error("[v0] Failed to load appidler.txt:", err)
    cachedIds = FALLBACK_IDS
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
