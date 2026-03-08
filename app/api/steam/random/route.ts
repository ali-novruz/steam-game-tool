import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { getRandomGameId } from "@/lib/steam-games"
import type { GameFilters } from "@/lib/types"

const MAX_RETRIES = 15

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
  
  // Genres
  if (filters.genres && filters.genres.length > 0) {
    const gameGenres = (gameData.genres as { id: string }[]) || []
    const gameGenreIds = gameGenres.map(g => g.id)
    if (!filters.genres.some(g => gameGenreIds.includes(g))) {
      return false
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
  
  // Metacritic
  if (filters.metacriticMin || filters.metacriticMax) {
    const metacritic = gameData.metacritic as { score?: number } | undefined
    const score = metacritic?.score || 0
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filters = parseFilters(searchParams)
  const hasFilters = Object.keys(filters).length > 0
  
  let attempts = 0

  while (attempts < MAX_RETRIES) {
    attempts++
    const appId = getRandomGameId()

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

      if (!detailsRes.ok) continue

      const detailsJson = await detailsRes.json()
      const appData = detailsJson[String(appId)]

      if (!appData?.success) continue

      const gameData = appData.data

      // Only return actual games (not DLC, software, video, etc.)
      if (gameData.type !== "game") continue
      
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
        continue
      }

      const metacritic = gameData.metacritic || null

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
    } catch {
      // Network error, try again
      continue
    }
  }

  return NextResponse.json(
    { error: "Could not find a valid game after multiple attempts." },
    { status: 500 }
  )
}
