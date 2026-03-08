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

// Steam Tags/Genres - Expanded list from SteamDB
export const STEAM_TAGS = [
  // Core Genres
  { id: "19", name: "Action", nameTr: "Aksiyon" },
  { id: "21", name: "Adventure", nameTr: "Macera" },
  { id: "9", name: "Strategy", nameTr: "Strateji" },
  { id: "122", name: "RPG", nameTr: "RPG" },
  { id: "597", name: "Casual", nameTr: "Gündelik" },
  { id: "492", name: "Indie", nameTr: "Bağımsız" },
  { id: "599", name: "Simulation", nameTr: "Simülasyon" },
  { id: "699", name: "Racing", nameTr: "Yarış" },
  { id: "701", name: "Sports", nameTr: "Spor" },
  { id: "113", name: "Free to Play", nameTr: "Ücretsiz" },
  { id: "493", name: "Early Access", nameTr: "Erken Erişim" },
  { id: "1664", name: "Puzzle", nameTr: "Bulmaca" },
  { id: "1774", name: "Shooter", nameTr: "Nişancı" },
  { id: "1742", name: "Platformer", nameTr: "Platform" },
  
  // Themes & Settings
  { id: "4166", name: "Atmospheric", nameTr: "Atmosferik" },
  { id: "1684", name: "Fantasy", nameTr: "Fantastik" },
  { id: "1654", name: "Relaxing", nameTr: "Rahatlatıcı" },
  { id: "4136", name: "Funny", nameTr: "Komik" },
  { id: "1667", name: "Horror", nameTr: "Korku" },
  { id: "3942", name: "Sci-fi", nameTr: "Bilim Kurgu" },
  { id: "5350", name: "Family Friendly", nameTr: "Aile Dostu" },
  { id: "4004", name: "Retro", nameTr: "Retro" },
  { id: "4342", name: "Dark", nameTr: "Karanlık" },
  { id: "5716", name: "Mystery", nameTr: "Gizem" },
  { id: "1662", name: "Survival", nameTr: "Hayatta Kalma" },
  { id: "1719", name: "Comedy", nameTr: "Komedi" },
  { id: "1721", name: "Psychological Horror", nameTr: "Psikolojik Korku" },
  { id: "12472", name: "Management", nameTr: "Yönetim" },
  { id: "4172", name: "Medieval", nameTr: "Ortaçağ" },
  { id: "4057", name: "Magic", nameTr: "Büyü" },
  { id: "3916", name: "Old School", nameTr: "Eski Usul" },
  { id: "1643", name: "Building", nameTr: "İnşa" },
  { id: "1708", name: "Tactical", nameTr: "Taktiksel" },
  { id: "5984", name: "Drama", nameTr: "Drama" },
  { id: "1755", name: "Space", nameTr: "Uzay" },
  { id: "4295", name: "Futuristic", nameTr: "Fütüristik" },
  { id: "4947", name: "Romance", nameTr: "Romantik" },
  { id: "1702", name: "Crafting", nameTr: "El Yapımı" },
  { id: "4604", name: "Dark Fantasy", nameTr: "Karanlık Fantastik" },
  { id: "5608", name: "Emotional", nameTr: "Duygusal" },
  { id: "6129", name: "Logic", nameTr: "Mantık" },
  { id: "3978", name: "Survival Horror", nameTr: "Hayatta Kalma Korku" },
  { id: "30358", name: "Nature", nameTr: "Doğa" },
  { id: "1710", name: "Surreal", nameTr: "Sürreal" },
  { id: "3835", name: "Post-apocalyptic", nameTr: "Kıyamet Sonrası" },
  { id: "1678", name: "War", nameTr: "Savaş" },
  { id: "3987", name: "Historical", nameTr: "Tarihsel" },
  { id: "1659", name: "Zombies", nameTr: "Zombiler" },
  { id: "3854", name: "Lore-Rich", nameTr: "Zengin Hikaye" },
  { id: "1687", name: "Stealth", nameTr: "Gizlilik" },
  { id: "4695", name: "Economy", nameTr: "Ekonomi" },
  { id: "8369", name: "Investigation", nameTr: "Soruşturma" },
  { id: "5186", name: "Psychological", nameTr: "Psikolojik" },
  { id: "4064", name: "Thriller", nameTr: "Gerilim" },
  { id: "4168", name: "Military", nameTr: "Askeri" },
  { id: "5613", name: "Detective", nameTr: "Dedektif" },
  { id: "5923", name: "Dark Humor", nameTr: "Kara Mizah" },
  { id: "10808", name: "Supernatural", nameTr: "Doğaüstü" },
  { id: "9541", name: "Demons", nameTr: "Şeytanlar" },
  { id: "4115", name: "Cyberpunk", nameTr: "Siberpunk" },
  { id: "1673", name: "Aliens", nameTr: "Uzaylılar" },
  { id: "1644", name: "Driving", nameTr: "Sürüş" },
  { id: "5752", name: "Robots", nameTr: "Robotlar" },
  { id: "5673", name: "Modern", nameTr: "Modern" },
  { id: "1751", name: "Comic Book", nameTr: "Çizgi Roman" },
  { id: "4236", name: "Loot", nameTr: "Ganimet" },
  { id: "5030", name: "Dystopian", nameTr: "Distopik" },
  { id: "1714", name: "Psychedelic", nameTr: "Psikedelik" },
  { id: "7926", name: "Artificial Intelligence", nameTr: "Yapay Zeka" },
  { id: "17894", name: "Cats", nameTr: "Kediler" },
  { id: "15045", name: "Flight", nameTr: "Uçuş" },
  { id: "4598", name: "Alternate History", nameTr: "Alternatif Tarih" },
  { id: "4036", name: "Parkour", nameTr: "Parkur" },
  { id: "97376", name: "Cozy", nameTr: "Rahat" },
  { id: "10397", name: "Memes", nameTr: "Memler" },
  { id: "16094", name: "Mythology", nameTr: "Mitoloji" },
  { id: "255534", name: "Automation", nameTr: "Otomasyon" },
  { id: "6378", name: "Crime", nameTr: "Suç" },
  { id: "4845", name: "Capitalism", nameTr: "Kapitalizm" },
  { id: "13906", name: "Game Development", nameTr: "Oyun Geliştirme" },
  { id: "5363", name: "Destruction", nameTr: "Yıkım" },
  { id: "15277", name: "Philosophical", nameTr: "Felsefi" },
  { id: "3920", name: "Cooking", nameTr: "Yemek Yapma" },
  { id: "19995", name: "Dark Comedy", nameTr: "Kara Komedi" },
  { id: "6052", name: "Noir", nameTr: "Kara Film" },
  { id: "7432", name: "Lovecraftian", nameTr: "Lovecraft" },
  { id: "4608", name: "Swordplay", nameTr: "Kılıç Dövüşü" },
  { id: "5794", name: "Science", nameTr: "Bilim" },
  { id: "4878", name: "Parody", nameTr: "Parodi" },
  { id: "4046", name: "Dragons", nameTr: "Ejderhalar" },
  { id: "5372", name: "Conspiracy", nameTr: "Komplo" },
  { id: "552282", name: "Wholesome", nameTr: "İçten" },
  { id: "22602", name: "Agriculture", nameTr: "Tarım" },
  { id: "3952", name: "Gothic", nameTr: "Gotik" },
  { id: "4150", name: "World War II", nameTr: "2. Dünya Savaşı" },
  { id: "6915", name: "Martial Arts", nameTr: "Dövüş Sanatları" },
  { id: "1651", name: "Satire", nameTr: "Hiciv" },
  { id: "21006", name: "Underground", nameTr: "Yeraltı" },
  { id: "4821", name: "Mechs", nameTr: "Mekanikler" },
  { id: "5981", name: "Mining", nameTr: "Madencilik" },
  { id: "15564", name: "Fishing", nameTr: "Balıkçılık" },
  { id: "10383", name: "Transportation", nameTr: "Ulaşım" },
  { id: "1638", name: "Dog", nameTr: "Köpek" },
  { id: "1681", name: "Pirates", nameTr: "Korsanlar" },
  { id: "1777", name: "Steampunk", nameTr: "Steampunk" },
  { id: "10679", name: "Time Travel", nameTr: "Zaman Yolculuğu" },
  { id: "16250", name: "Gambling", nameTr: "Kumar" },
  { id: "9157", name: "Underwater", nameTr: "Su Altı" },
  { id: "1616", name: "Trains", nameTr: "Trenler" },
  { id: "4018", name: "Vampire", nameTr: "Vampir" },
  { id: "4853", name: "Political", nameTr: "Politik" },
  { id: "13276", name: "Tanks", nameTr: "Tanklar" },
  { id: "3934", name: "Immersive", nameTr: "Sürükleyici" },
  { id: "1688", name: "Ninja", nameTr: "Ninja" },
  { id: "9564", name: "Hunting", nameTr: "Avcılık" },
  { id: "5502", name: "Hacking", nameTr: "Hackleme" },
  { id: "1647", name: "Western", nameTr: "Vahşi Batı" },
  { id: "5160", name: "Dinosaurs", nameTr: "Dinozorlar" },
  { id: "5432", name: "Programming", nameTr: "Programlama" },
  { id: "1671", name: "Superhero", nameTr: "Süper Kahraman" },
  { id: "7108", name: "Party", nameTr: "Parti" },
  { id: "6310", name: "Diplomacy", nameTr: "Diplomasi" },
  { id: "4376", name: "Assassin", nameTr: "Suikastçi" },
  { id: "6910", name: "Naval", nameTr: "Denizcilik" },
  { id: "9803", name: "Snow", nameTr: "Kar" },
  { id: "1680", name: "Heist", nameTr: "Soygun" },
  { id: "13577", name: "Sailing", nameTr: "Yelkencilik" },
  { id: "5179", name: "Cold War", nameTr: "Soğuk Savaş" },
  { id: "13382", name: "Archery", nameTr: "Okçuluk" },
  { id: "4137", name: "Transhumanism", nameTr: "Transhümanizm" },
  { id: "4520", name: "Farming", nameTr: "Çiftçilik" },
  { id: "7423", name: "Sniper", nameTr: "Keskin Nişancı" },
  { id: "17015", name: "Werewolves", nameTr: "Kurt Adamlar" },
  { id: "6702", name: "Mars", nameTr: "Mars" },
  { id: "4291", name: "Spaceships", nameTr: "Uzay Gemileri" },
  
  // Game Styles
  { id: "1697", name: "Turn-Based", nameTr: "Sıra Tabanlı" },
  { id: "1698", name: "Point & Click", nameTr: "Tıkla & Oyna" },
  { id: "1716", name: "Roguelike", nameTr: "Roguelike" },
  { id: "1756", name: "Roguelite", nameTr: "Roguelite" },
  { id: "1663", name: "FPS", nameTr: "FPS" },
  { id: "1693", name: "Third Person", nameTr: "Üçüncü Şahıs" },
  { id: "3839", name: "First Person", nameTr: "Birinci Şahıs" },
  { id: "1677", name: "Turn-Based Strategy", nameTr: "Sıra Tabanlı Strateji" },
  { id: "1676", name: "RTS", nameTr: "Gerçek Zamanlı Strateji" },
  { id: "5395", name: "Open World", nameTr: "Açık Dünya" },
  { id: "3810", name: "Sandbox", nameTr: "Sandbox" },
  { id: "1666", name: "Card Game", nameTr: "Kart Oyunu" },
  { id: "1730", name: "Board Game", nameTr: "Masa Oyunu" },
  { id: "1685", name: "Tower Defense", nameTr: "Kule Savunma" },
  { id: "1695", name: "Metroidvania", nameTr: "Metroidvania" },
  { id: "4758", name: "2D", nameTr: "2D" },
  { id: "4191", name: "3D", nameTr: "3D" },
  { id: "3964", name: "Isometric", nameTr: "İzometrik" },
  { id: "1738", name: "Hidden Object", nameTr: "Gizli Nesne" },
  { id: "1779", name: "Visual Novel", nameTr: "Görsel Roman" },
  { id: "4106", name: "Action RPG", nameTr: "Aksiyon RPG" },
  { id: "17389", name: "Dungeon Crawler", nameTr: "Zindan Gezgini" },
  { id: "3959", name: "Hack and Slash", nameTr: "Kes ve Biç" },
  { id: "1625", name: "Bullet Hell", nameTr: "Mermi Cehennemi" },
  { id: "3814", name: "City Builder", nameTr: "Şehir Kurma" },
  { id: "4667", name: "Souls-like", nameTr: "Souls Benzeri" },
  { id: "87918", name: "Farming Sim", nameTr: "Çiftçilik Sim" },
  { id: "1770", name: "Beat 'em up", nameTr: "Dövüş" },
  { id: "1628", name: "Metroidvania", nameTr: "Metroidvania" },
  
  // Multiplayer Types  
  { id: "3859", name: "Multiplayer", nameTr: "Çok Oyunculu" },
  { id: "4508", name: "Co-op", nameTr: "İşbirliği" },
  { id: "3843", name: "Online Co-Op", nameTr: "Çevrimiçi İşbirliği" },
  { id: "1775", name: "PvP", nameTr: "PvP" },
  { id: "1738", name: "Local Multiplayer", nameTr: "Yerel Çok Oyunculu" },
  { id: "7368", name: "Local Co-Op", nameTr: "Yerel İşbirliği" },
  { id: "3841", name: "MMO", nameTr: "MMO" },
  { id: "128", name: "Massively Multiplayer", nameTr: "Devasa Çok Oyunculu" },
  
  // Art & Audio
  { id: "4726", name: "Cute", nameTr: "Sevimli" },
  { id: "4305", name: "Colorful", nameTr: "Renkli" },
  { id: "4195", name: "Minimalist", nameTr: "Minimalist" },
  { id: "4252", name: "Stylized", nameTr: "Stilize" },
  { id: "4400", name: "Abstract", nameTr: "Soyut" },
  { id: "3834", name: "Pixel Graphics", nameTr: "Piksel Grafik" },
  { id: "4085", name: "Anime", nameTr: "Anime" },
  { id: "4094", name: "Realistic", nameTr: "Gerçekçi" },
  { id: "5411", name: "Beautiful", nameTr: "Güzel" },
  { id: "1756", name: "Great Soundtrack", nameTr: "Harika Müzik" },
  
  // Time Periods
  { id: "6691", name: "1990's", nameTr: "1990'lar" },
  { id: "7743", name: "1980s", nameTr: "1980'ler" },
  { id: "5382", name: "World War I", nameTr: "1. Dünya Savaşı" },
]

// Age Rating Filter Options
export const AGE_RATINGS = [
  { value: "any", labelTr: "Hepsi", labelEn: "Any" },
  { value: "everyone", labelTr: "Herkes İçin", labelEn: "Everyone" },
  { value: "teen", labelTr: "13+", labelEn: "Teen (13+)" },
  { value: "mature", labelTr: "17+", labelEn: "Mature (17+)" },
  { value: "adult", labelTr: "18+", labelEn: "Adult Only (18+)" },
]

// Backwards compatibility - map old STEAM_GENRES to STEAM_TAGS
export const STEAM_GENRES = STEAM_TAGS.slice(0, 14)

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
