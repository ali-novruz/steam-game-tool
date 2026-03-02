export interface SteamGame {
  steam_appid: number
  name: string
  type: string
  short_description: string
  detailed_description: string
  header_image: string
  website: string | null
  developers: string[]
  publishers: string[]
  genres: { id: string; description: string }[]
  categories: { id: number; description: string }[]
  screenshots: { id: number; path_thumbnail: string; path_full: string }[]
  movies: {
    id: number
    name: string
    thumbnail: string
    webm: { "480": string; max: string }
    mp4: { "480": string; max: string }
    highlight: boolean
  }[]
  release_date: { coming_soon: boolean; date: string }
  metacritic?: { score: number; url: string }
  recommendations?: { total: number }
  price_overview?: {
    currency: string
    initial: number
    final: number
    discount_percent: number
    initial_formatted: string
    final_formatted: string
  }
  is_free: boolean
  platforms: { windows: boolean; mac: boolean; linux: boolean }
  background: string
  background_raw: string
  capsule_image: string
  capsule_imagev5: string
}

export interface SteamReviewSummary {
  num_reviews: number
  review_score: number
  review_score_desc: string
  total_positive: number
  total_negative: number
  total_reviews: number
}

export interface GameData {
  game: SteamGame
  reviews: SteamReviewSummary
}

export type Language = "tr" | "en"
