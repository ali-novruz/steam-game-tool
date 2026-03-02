import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const appId = searchParams.get("id")

  if (!appId || !/^\d+$/.test(appId)) {
    return NextResponse.json(
      { error: "Invalid or missing Steam App ID." },
      { status: 400 }
    )
  }

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

    if (!detailsRes.ok) {
      return NextResponse.json(
        { error: "Steam API request failed." },
        { status: 502 }
      )
    }

    const detailsJson = await detailsRes.json()
    const appData = detailsJson[String(appId)]

    if (!appData?.success) {
      return NextResponse.json(
        { error: "Game not found. Please check the App ID." },
        { status: 404 }
      )
    }

    const gameData = appData.data

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
      },
      reviews,
    })
  } catch {
    return NextResponse.json(
      { error: "Network error. Please try again." },
      { status: 500 }
    )
  }
}
