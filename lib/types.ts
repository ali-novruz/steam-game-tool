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
  metacritic?: { score: number; url: string; source?: string }
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
  pc_requirements?: { minimum?: string; recommended?: string } | null
  mac_requirements?: { minimum?: string; recommended?: string } | null
  linux_requirements?: { minimum?: string; recommended?: string } | null
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

/* ------------------------------------------------------------------ */
/*  Filter Types                                                       */
/* ------------------------------------------------------------------ */
export interface GameFilters {
  startingLetter: string // A-Z or "" for any
  priceMin: number // 0 for no minimum
  priceMax: number // 0 for no maximum
  freeOnly: boolean
  onSale: boolean
  genres: string[] // multi-select genre IDs
  categories: string[] // multi-select category IDs
  platforms: {
    windows: boolean
    mac: boolean
    linux: boolean
  }
  metacriticMin: number // 0-100, 0 for no minimum
  metacriticMax: number // 0-100, 0 for no maximum
  reviewScore: string // "any" | "positive" | "very_positive" | "overwhelmingly_positive" | "mixed" | "negative"
  releaseYear: number // 0 for any year
  multiplayer: boolean | null // null = any, true = multiplayer, false = singleplayer only
  earlyAccess: boolean | null // null = any, true = only early access, false = exclude early access
  turkishSupport: boolean // only games with Turkish language support
  hasAchievements: boolean
  hasTradingCards: boolean
  controllerSupport: boolean
  vrSupport: boolean
}

export const DEFAULT_FILTERS: GameFilters = {
  startingLetter: "",
  priceMin: 0,
  priceMax: 0,
  freeOnly: false,
  onSale: false,
  genres: [],
  categories: [],
  platforms: {
    windows: false,
    mac: false,
    linux: false,
  },
  metacriticMin: 0,
  metacriticMax: 0,
  reviewScore: "any",
  releaseYear: 0,
  multiplayer: null,
  earlyAccess: null,
  turkishSupport: false,
  hasAchievements: false,
  hasTradingCards: false,
  controllerSupport: false,
  vrSupport: false,
}

// Common Steam genres
export const STEAM_GENRES = [
  { id: "1", name: "Action" },
  { id: "25", name: "Adventure" },
  { id: "2", name: "Strategy" },
  { id: "3", name: "RPG" },
  { id: "4", name: "Casual" },
  { id: "23", name: "Indie" },
  { id: "28", name: "Simulation" },
  { id: "9", name: "Racing" },
  { id: "18", name: "Sports" },
  { id: "37", name: "Free to Play" },
  { id: "70", name: "Early Access" },
  { id: "51", name: "Animation & Modeling" },
  { id: "58", name: "Video Production" },
  { id: "56", name: "Software Training" },
]

// Common Steam categories
export const STEAM_CATEGORIES = [
  { id: "2", name: "Single-player" },
  { id: "1", name: "Multi-player" },
  { id: "49", name: "PvP" },
  { id: "36", name: "Online PvP" },
  { id: "9", name: "Co-op" },
  { id: "38", name: "Online Co-op" },
  { id: "22", name: "Steam Achievements" },
  { id: "29", name: "Steam Trading Cards" },
  { id: "28", name: "Full controller support" },
  { id: "18", name: "Partial Controller Support" },
  { id: "13", name: "Captions available" },
  { id: "31", name: "VR Support" },
  { id: "23", name: "Steam Cloud" },
  { id: "8", name: "Valve Anti-Cheat enabled" },
  { id: "30", name: "Steam Workshop" },
  { id: "35", name: "In-App Purchases" },
]

// Review score options
export const REVIEW_SCORES = [
  { value: "any", labelTr: "Hepsi", labelEn: "Any" },
  { value: "overwhelmingly_positive", labelTr: "Ezici Olumlu", labelEn: "Overwhelmingly Positive" },
  { value: "very_positive", labelTr: "Çok Olumlu", labelEn: "Very Positive" },
  { value: "positive", labelTr: "Olumlu", labelEn: "Positive" },
  { value: "mostly_positive", labelTr: "Çoğunlukla Olumlu", labelEn: "Mostly Positive" },
  { value: "mixed", labelTr: "Karışık", labelEn: "Mixed" },
  { value: "mostly_negative", labelTr: "Çoğunlukla Olumsuz", labelEn: "Mostly Negative" },
  { value: "negative", labelTr: "Olumsuz", labelEn: "Negative" },
  { value: "very_negative", labelTr: "Çok Olumsuz", labelEn: "Very Negative" },
]
