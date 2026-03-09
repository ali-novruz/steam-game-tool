import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { getRandomGameId } from "@/lib/steam-games"
import type { GameFilters } from "@/lib/types"

const MAX_RETRIES = 10 // Number of rounds
const PARALLEL_CHECKS = 8 // Check 8 games per round = 80 total games checked

// Parse filters from URL search params
function parseFilters(searchParams: URLSearchParams): Partial<GameFilters> {
  const filters: Partial<GameFilters> = {}
  
  if (searchParams.get("startingLetter")) filters.startingLetter = searchParams.get("startingLetter")!
  if (searchParams.get("freeOnly") === "true") filters.freeOnly = true
  if (searchParams.get("onSale") === "true") filters.onSale = true
  if (searchParams.get("priceMin")) filters.priceMin = Number(searchParams.get("priceMin"))
  if (searchParams.get("priceMax")) filters.priceMax = Number(searchParams.get("priceMax"))
  if (searchParams.get("genres")) filters.genres = searchParams.get("genres")!.split(",")
  if (searchParams.get("categories")) filters.categories = searchParams.get("categories")!.split(",")
  if (searchParams.get("reviewScore")) filters.reviewScore = searchParams.get("reviewScore")!
  if (searchParams.get("metacriticMin")) filters.metacriticMin = Number(searchParams.get("metacriticMin"))
  if (searchParams.get("metacriticMax")) filters.metacriticMax = Number(searchParams.get("metacriticMax"))
  if (searchParams.get("releaseYear")) filters.releaseYear = Number(searchParams.get("releaseYear"))
  if (searchParams.get("multiplayer") === "true") filters.multiplayer = true
  if (searchParams.get("multiplayer") === "false") filters.multiplayer = false
  if (searchParams.get("earlyAccess") === "true") filters.earlyAccess = true
  if (searchParams.get("turkishSupport") === "true") filters.turkishSupport = true
  if (searchParams.get("hasAchievements") === "true") filters.hasAchievements = true
  if (searchParams.get("hasTradingCards") === "true") filters.hasTradingCards = true
  if (searchParams.get("controllerSupport") === "true") filters.controllerSupport = true
  if (searchParams.get("vrSupport") === "true") filters.vrSupport = true
  
  if (searchParams.get("windows") === "true" || searchParams.get("mac") === "true" || searchParams.get("linux") === "true") {
    filters.platforms = {
      windows: searchParams.get("windows") === "true",
      mac: searchParams.get("mac") === "true",
      linux: searchParams.get("linux") === "true",
    }
  }
  
  return filters
}

// Check if game matches filters
function matchesFilters(gameData: Record<string, unknown>, reviewData: Record<string, unknown>, filters: Partial<GameFilters>): boolean {
  const name = (gameData.name as string) || ""
  
  // Starting letter
  if (filters.startingLetter && !name.toUpperCase().startsWith(filters.startingLetter)) {
    return false
  }
  
  // Free only
  if (filters.freeOnly && !gameData.is_free) {
    return false
  }
  
  // On sale
  if (filters.onSale) {
    const priceOverview = gameData.price_overview as { discount_percent?: number } | undefined
    if (!priceOverview || !priceOverview.discount_percent || priceOverview.discount_percent <= 0) {
      return false
    }
  }
  
  // Price range (in cents)
  if (!gameData.is_free && (filters.priceMin || filters.priceMax)) {
    const priceOverview = gameData.price_overview as { final?: number } | undefined
    const priceCents = priceOverview?.final || 0
    const priceDollars = priceCents / 100
    if (filters.priceMin && priceDollars < filters.priceMin) return false
    if (filters.priceMax && priceDollars > filters.priceMax) return false
  }
  
  // Genres - Check Steam's official genre IDs
  // Steam API only returns limited genre info, so we only filter on main genres
  // Main genre IDs: 1=Action, 2=Strategy, 3=RPG, 4=Casual, 9=Racing, 18=Sports, 
  // 23=Indie, 25=Adventure, 28=Simulation, 29=MMO, 37=Free to Play, 70=Early Access
  const mainGenreIds = new Set(["1", "2", "3", "4", "9", "18", "23", "25", "28", "29", "37", "70"])
  
  if (filters.genres && filters.genres.length > 0) {
    const gameGenres = (gameData.genres as { id: string; description: string }[]) || []
    const gameGenreIds = gameGenres.map(g => g.id)
    const genreDescriptions = gameGenres.map(g => g.description.toLowerCase())
    
    // Only filter on main genres that Steam API actually returns
    const mainGenreFilters = filters.genres.filter(id => mainGenreIds.has(id))
    
    if (mainGenreFilters.length > 0) {
      // Check for direct ID match
      const hasDirectMatch = mainGenreFilters.some(tagId => gameGenreIds.includes(tagId))
      
      if (!hasDirectMatch) {
        // Fallback: Text-based matching
        const genreTextMappings: Record<string, string[]> = {
          "1": ["action"],
          "25": ["adventure"],
          "3": ["rpg", "role-playing"],
          "2": ["strategy"],
          "28": ["simulation"],
          "4": ["casual"],
          "23": ["indie"],
          "18": ["sports"],
          "9": ["racing"],
          "37": ["free to play", "free"],
          "70": ["early access"],
          "29": ["massively multiplayer", "mmo"],
        }
        
        const hasTextMatch = mainGenreFilters.some(tagId => {
          const mappedTerms = genreTextMappings[tagId]
          if (mappedTerms) {
            return mappedTerms.some(term => 
              genreDescriptions.some(desc => desc.includes(term))
            )
          }
          return false
        })
        
        if (!hasTextMatch) {
          return false
        }
      }
    }
    // For non-main genre filters (themes, subgenres, etc.), try text-based matching
    // in the game's description since Steam API doesn't provide tag data
    const nonMainGenreFilters = filters.genres.filter(id => !mainGenreIds.has(id))
    
    if (nonMainGenreFilters.length > 0) {
      // Get game description text for matching
      const descriptionText = [
        gameData.short_description || "",
        gameData.detailed_description || "",
        ...(gameGenres.map(g => g.description) || [])
      ].join(" ").toLowerCase()
      
      // Import tag names for matching - we'll match against English names
      const tagNameMap: Record<string, string[]> = {
        // Themes
        "4166": ["atmospheric", "atmosphere"],
        "1667": ["horror", "scary", "terrifying"],
        "4136": ["comedy", "funny", "humor"],
        "1684": ["fantasy", "magic", "magical"],
        "3942": ["sci-fi", "science fiction", "futuristic"],
        "1662": ["survival"],
        "21978": ["dark", "darkness"],
        "4604": ["dark fantasy"],
        "16689": ["lovecraftian", "lovecraft", "cosmic horror"],
        "5611": ["psychological", "psychological horror"],
        "1721": ["zombies", "zombie"],
        "1645": ["mystery", "mysterious"],
        "5984": ["demons", "demonic"],
        "7208": ["female protagonist"],
        "4295": ["robots", "robot"],
        "1738": ["ninja"],
        "4085": ["anime"],
        "1654": ["relaxing", "relax"],
        "5154": ["steampunk"],
        "4057": ["cyberpunk", "cyber"],
        "1659": ["post-apocalyptic", "apocalypse"],
        "4018": ["economy", "economic"],
        "4115": ["assassin"],
        "3987": ["historical", "history"],
        "5608": ["emotional"],
        "7432": ["lovecraftian"],
        "4106": ["romance", "romantic"],
        "15045": ["choices matter", "choices"],
        "1742": ["turn-based", "turn based"],
        "1774": ["shooting", "shooter"],
        "4252": ["comic book"],
        "6815": ["hand-drawn", "hand drawn"],
        "4726": ["cute"],
        "7481": ["controller support", "controller"],
        
        // Subgenres
        "1697": ["roguelike", "rogue-like"],
        "3959": ["roguelite", "rogue-lite"],
        "1702": ["crafting", "craft"],
        "1628": ["metroidvania"],
        "3834": ["souls-like", "soulslike", "souls like"],
        "21725": ["deckbuilding", "deck building", "deck-building"],
        "1695": ["open world"],
        "1664": ["puzzle"],
        "1625": ["platformer", "platform"],
        "1698": ["building", "build"],
        "1752": ["tower defense"],
        "1677": ["turn-based strategy"],
        "1708": ["tactical"],
        "4325": ["city builder"],
        "1676": ["rts", "real-time strategy"],
        "1770": ["board game"],
        "4434": ["moba"],
        "3993": ["visual novel"],
        "4486": ["exploration", "explore"],
        "7250": ["sandbox"],
        "17894": ["battle royale"],
        "3978": ["card game"],
        
        // Visual/Art styles
        "4305": ["2d"],
        "4791": ["3d"],
        "7332": ["pixel graphics", "pixel art", "pixelated"],
        "4400": ["first-person", "first person"],
        "1697": ["third-person", "third person"],
        "4004": ["retro"],
        "8093": ["minimalist", "minimal"],
        "5716": ["stylized"],
        "5411": ["beautiful", "gorgeous"],
        "7948": ["colorful"],
        
        // Players
        "1775": ["pvp", "versus"],
        "1738": ["pve"],
        "3841": ["local multiplayer", "local co-op"],
        "3843": ["online co-op", "online multiplayer"],
        "4182": ["singleplayer", "single player", "single-player"],
        "128": ["multiplayer", "multi-player"],
        "1685": ["co-op", "coop", "cooperative"],
        
        // Features
        "5752": ["great soundtrack", "soundtrack"],
        "1756": ["procedural", "randomly generated"],
        "7113": ["replay value", "replayability"],
        "8122": ["story rich", "narrative"],
        "4758": ["perma death", "permadeath"],
      }
      
      // Check if any non-main tag matches game description
      const hasTagMatch = nonMainGenreFilters.some(tagId => {
        const keywords = tagNameMap[tagId]
        if (keywords) {
          return keywords.some(keyword => descriptionText.includes(keyword))
        }
        return true // If we don't have a mapping, don't reject
      })
      
      if (!hasTagMatch) {
        return false
      }
    }
  }
  
  // Platforms
  if (filters.platforms) {
    const platforms = gameData.platforms as { windows?: boolean; mac?: boolean; linux?: boolean } | undefined
    if (filters.platforms.windows && !platforms?.windows) return false
    if (filters.platforms.mac && !platforms?.mac) return false
    if (filters.platforms.linux && !platforms?.linux) return false
  }
  
  // Review score
  if (filters.reviewScore && filters.reviewScore !== "any") {
    const reviewScoreDesc = ((reviewData as { review_score_desc?: string })?.review_score_desc || "").toLowerCase().replace(/\s+/g, "_")
    if (!reviewScoreDesc.includes(filters.reviewScore.replace("_", " ").toLowerCase()) && 
        reviewScoreDesc !== filters.reviewScore.toLowerCase()) {
      return false
    }
  }
  
  // Metacritic - only filter if game HAS a metacritic score
  if (filters.metacriticMin || filters.metacriticMax) {
    const metacritic = gameData.metacritic as { score?: number } | undefined
    // If game has no metacritic score, skip this game when metacritic filter is set
    if (!metacritic || metacritic.score === undefined) {
      return false
    }
    const score = metacritic.score
    if (filters.metacriticMin && score < filters.metacriticMin) return false
    if (filters.metacriticMax && score > filters.metacriticMax) return false
  }
  
  // Release year
  if (filters.releaseYear) {
    const releaseDate = gameData.release_date as { date?: string } | undefined
    const dateStr = releaseDate?.date || ""
    const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/)
    if (yearMatch) {
      const year = parseInt(yearMatch[0], 10)
      if (year !== filters.releaseYear) return false
    }
  }
  
  // Multiplayer/Singleplayer
  if (filters.multiplayer !== undefined && filters.multiplayer !== null) {
    const categories = (gameData.categories as { id: number }[]) || []
    const catIds = categories.map(c => c.id)
    const hasMultiplayer = catIds.includes(1) || catIds.includes(49) || catIds.includes(36) || catIds.includes(9) || catIds.includes(38)
    const hasSingleplayer = catIds.includes(2)
    if (filters.multiplayer === true && !hasMultiplayer) return false
    if (filters.multiplayer === false && !hasSingleplayer) return false
  }
  
  // Category checks (achievements, trading cards, controller, VR)
  const categories = (gameData.categories as { id: number }[]) || []
  const catIds = categories.map(c => c.id)
  
  if (filters.hasAchievements && !catIds.includes(22)) return false
  if (filters.hasTradingCards && !catIds.includes(29)) return false
  if (filters.controllerSupport && !catIds.includes(28) && !catIds.includes(18)) return false
  if (filters.vrSupport && !catIds.includes(31)) return false
  
  // Early Access
  if (filters.earlyAccess === true) {
    const genres = (gameData.genres as { id: string }[]) || []
    const genreIds = genres.map(g => g.id)
    if (!genreIds.includes("70")) return false
  }
  
  return true
}

// Helper to check a single game
async function checkGame(appId: number, filters: ReturnType<typeof parseFilters>, hasFilters: boolean) {
  try {
    const [detailsRes, reviewsRes] = await Promise.all([
      fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`,
        { next: { revalidate: 0 } }
      ),
      fetch(
        `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&purchase_type=all&num_per_page=0`,
        { next: { revalidate: 0 } }
      ),
    ])

    if (!detailsRes.ok) return null

    const detailsJson = await detailsRes.json()
    const appData = detailsJson[String(appId)]

    if (!appData?.success) return null

    const gameData = appData.data

    // Only return actual games (not DLC, software, video, etc.)
    if (gameData.type !== "game") return null
    
    // Parse reviews
    let reviews = {
      num_reviews: 0,
      review_score: 0,
      review_score_desc: "No user reviews",
      total_positive: 0,
      total_negative: 0,
      total_reviews: 0,
    }

    try {
      const reviewsJson = await reviewsRes.json()
      if (reviewsJson?.query_summary) {
        reviews = reviewsJson.query_summary
      }
    } catch {
      // Reviews fetch failed, use defaults
    }
    
    // Apply filters
    if (hasFilters && !matchesFilters(gameData, reviews, filters)) {
      return null
    }

    return { gameData, reviews }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filters = parseFilters(searchParams)
  const hasFilters = Object.keys(filters).length > 0
  
  // Track which IDs we've tried to avoid duplicates
  const triedIds = new Set<number>()

  for (let round = 0; round < MAX_RETRIES; round++) {
    // Get unique random IDs for this round
    const appIds: number[] = []
    while (appIds.length < PARALLEL_CHECKS) {
      const id = getRandomGameId()
      if (!triedIds.has(id)) {
        triedIds.add(id)
        appIds.push(id)
      }
      // Safety check to avoid infinite loop
      if (triedIds.size > 1000) break
    }
    
    // Check all games in parallel
    const results = await Promise.all(
      appIds.map(id => checkGame(id, filters, hasFilters))
    )
    
    // Find first valid result
    const validResult = results.find(r => r !== null)
    
    if (validResult) {
      const { gameData, reviews } = validResult

      const metacritic = gameData.metacritic || null
      
      // Try to fetch OpenCritic score if Metacritic is not available
      let opencritic = null
      if (!metacritic) {
        try {
          // Search for game on OpenCritic
          const searchRes = await fetch(
            `https://api.opencritic.com/api/game/search?criteria=${encodeURIComponent(gameData.name)}`,
            { 
              headers: { 'User-Agent': 'Mozilla/5.0' },
              next: { revalidate: 3600 } // Cache for 1 hour
            }
          )
          if (searchRes.ok) {
            const searchData = await searchRes.json()
            if (searchData && searchData.length > 0) {
              const gameMatch = searchData[0]
              if (gameMatch.topCriticScore && gameMatch.topCriticScore > 0) {
                opencritic = {
                  score: Math.round(gameMatch.topCriticScore),
                  url: `https://opencritic.com/game/${gameMatch.id}/${gameMatch.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                  tier: gameMatch.tier || null
                }
              }
            }
          }
        } catch {
          // OpenCritic fetch failed, continue without it
        }
      }

      return NextResponse.json({
        game: {
          steam_appid: gameData.steam_appid,
          name: gameData.name,
          type: gameData.type,
          short_description: gameData.short_description || "",
          detailed_description: gameData.detailed_description || "",
          header_image: gameData.header_image || "",
          website: gameData.website || null,
          developers: gameData.developers || [],
          publishers: gameData.publishers || [],
          genres: gameData.genres || [],
          categories: gameData.categories || [],
          screenshots: (gameData.screenshots || []).slice(0, 10),
          movies: (gameData.movies || []).slice(0, 3),
          release_date: gameData.release_date || {
            coming_soon: false,
            date: "Unknown",
          },
          metacritic,
          opencritic,
          recommendations: gameData.recommendations || null,
          price_overview: gameData.price_overview || null,
          is_free: gameData.is_free || false,
          platforms: gameData.platforms || {
            windows: false,
            mac: false,
            linux: false,
          },
          background: gameData.background || "",
          background_raw: gameData.background_raw || "",
          capsule_image: gameData.capsule_image || "",
          capsule_imagev5: gameData.capsule_imagev5 || "",
          pc_requirements: gameData.pc_requirements || null,
          mac_requirements: gameData.mac_requirements || null,
          linux_requirements: gameData.linux_requirements || null,
        },
        reviews,
      })
    }
    // No valid game found in this round, continue to next round
  }

  // Return special error type for "no matching game found" - this is NOT a server error
  return NextResponse.json(
    { error: "NO_MATCHING_GAME", message: "No game found matching your filters after multiple attempts." },
    { status: 200 }
  )
}
