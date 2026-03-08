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

// Steam Tags - Complete list from SteamDB (450+ tags)
export const STEAM_TAGS = [
  // === TOP-LEVEL GENRES ===
  { id: "492", name: "Indie", nameTr: "Bağımsız", category: "genre" },
  { id: "19", name: "Action", nameTr: "Aksiyon", category: "genre" },
  { id: "597", name: "Casual", nameTr: "Gündelik", category: "genre" },
  { id: "21", name: "Adventure", nameTr: "Macera", category: "genre" },
  { id: "599", name: "Simulation", nameTr: "Simülasyon", category: "genre" },
  { id: "122", name: "RPG", nameTr: "RPG", category: "genre" },
  { id: "9", name: "Strategy", nameTr: "Strateji", category: "genre" },
  { id: "1743", name: "Action-Adventure", nameTr: "Aksiyon-Macera", category: "genre" },
  { id: "701", name: "Sports", nameTr: "Spor", category: "genre" },
  { id: "699", name: "Racing", nameTr: "Yarış", category: "genre" },
  { id: "809", name: "Software", nameTr: "Yazılım", category: "genre" },
  { id: "1743", name: "Fighting", nameTr: "Dövüş", category: "genre" },

  // === THEMES & MOODS ===
  { id: "4166", name: "Atmospheric", nameTr: "Atmosferik", category: "theme" },
  { id: "1684", name: "Fantasy", nameTr: "Fantastik", category: "theme" },
  { id: "1654", name: "Relaxing", nameTr: "Rahatlatıcı", category: "theme" },
  { id: "4136", name: "Funny", nameTr: "Komik", category: "theme" },
  { id: "1667", name: "Horror", nameTr: "Korku", category: "theme" },
  { id: "3942", name: "Sci-fi", nameTr: "Bilim Kurgu", category: "theme" },
  { id: "5350", name: "Family Friendly", nameTr: "Aile Dostu", category: "theme" },
  { id: "4004", name: "Retro", nameTr: "Retro", category: "theme" },
  { id: "4342", name: "Dark", nameTr: "Karanlık", category: "theme" },
  { id: "5716", name: "Mystery", nameTr: "Gizem", category: "theme" },
  { id: "1662", name: "Survival", nameTr: "Hayatta Kalma", category: "theme" },
  { id: "1719", name: "Comedy", nameTr: "Komedi", category: "theme" },
  { id: "1721", name: "Psychological Horror", nameTr: "Psikolojik Korku", category: "theme" },
  { id: "12472", name: "Management", nameTr: "Yönetim", category: "theme" },
  { id: "4172", name: "Medieval", nameTr: "Ortaçağ", category: "theme" },
  { id: "4057", name: "Magic", nameTr: "Büyü", category: "theme" },
  { id: "3916", name: "Old School", nameTr: "Eski Usul", category: "theme" },
  { id: "1643", name: "Building", nameTr: "İnşa", category: "theme" },
  { id: "1708", name: "Tactical", nameTr: "Taktiksel", category: "theme" },
  { id: "5984", name: "Drama", nameTr: "Drama", category: "theme" },
  { id: "1755", name: "Space", nameTr: "Uzay", category: "theme" },
  { id: "4295", name: "Futuristic", nameTr: "Fütüristik", category: "theme" },
  { id: "4947", name: "Romance", nameTr: "Romantik", category: "theme" },
  { id: "1702", name: "Crafting", nameTr: "El İşi", category: "theme" },
  { id: "4604", name: "Dark Fantasy", nameTr: "Karanlık Fantastik", category: "theme" },
  { id: "5608", name: "Emotional", nameTr: "Duygusal", category: "theme" },
  { id: "6129", name: "Logic", nameTr: "Mantık", category: "theme" },
  { id: "3978", name: "Survival Horror", nameTr: "Hayatta Kalma Korku", category: "theme" },
  { id: "30358", name: "Nature", nameTr: "Doğa", category: "theme" },
  { id: "6691", name: "1990's", nameTr: "1990'lar", category: "theme" },
  { id: "1710", name: "Surreal", nameTr: "Sürreal", category: "theme" },
  { id: "7261", name: "Education", nameTr: "Eğitim", category: "theme" },
  { id: "3835", name: "Post-apocalyptic", nameTr: "Kıyamet Sonrası", category: "theme" },
  { id: "7743", name: "1980s", nameTr: "1980'ler", category: "theme" },
  { id: "1678", name: "War", nameTr: "Savaş", category: "theme" },
  { id: "3987", name: "Historical", nameTr: "Tarihsel", category: "theme" },
  { id: "1659", name: "Zombies", nameTr: "Zombiler", category: "theme" },
  { id: "3854", name: "Lore-Rich", nameTr: "Zengin Hikaye", category: "theme" },
  { id: "1687", name: "Stealth", nameTr: "Gizlilik", category: "theme" },
  { id: "4695", name: "Economy", nameTr: "Ekonomi", category: "theme" },
  { id: "8369", name: "Investigation", nameTr: "Soruşturma", category: "theme" },
  { id: "5186", name: "Psychological", nameTr: "Psikolojik", category: "theme" },
  { id: "44868", name: "LGBTQ+", nameTr: "LGBTQ+", category: "theme" },
  { id: "4064", name: "Thriller", nameTr: "Gerilim", category: "theme" },
  { id: "4168", name: "Military", nameTr: "Askeri", category: "theme" },
  { id: "5613", name: "Detective", nameTr: "Dedektif", category: "theme" },
  { id: "5923", name: "Dark Humor", nameTr: "Kara Mizah", category: "theme" },
  { id: "10808", name: "Supernatural", nameTr: "Doğaüstü", category: "theme" },
  { id: "9541", name: "Demons", nameTr: "Şeytanlar", category: "theme" },
  { id: "4115", name: "Cyberpunk", nameTr: "Siberpunk", category: "theme" },
  { id: "1673", name: "Aliens", nameTr: "Uzaylılar", category: "theme" },
  { id: "1644", name: "Driving", nameTr: "Sürüş", category: "theme" },
  { id: "5752", name: "Robots", nameTr: "Robotlar", category: "theme" },
  { id: "5673", name: "Modern", nameTr: "Modern", category: "theme" },
  { id: "1751", name: "Comic Book", nameTr: "Çizgi Roman", category: "theme" },
  { id: "4236", name: "Loot", nameTr: "Ganimet", category: "theme" },
  { id: "5030", name: "Dystopian", nameTr: "Distopik", category: "theme" },
  { id: "1714", name: "Psychedelic", nameTr: "Psikedelik", category: "theme" },
  { id: "7926", name: "Artificial Intelligence", nameTr: "Yapay Zeka", category: "theme" },
  { id: "17894", name: "Cats", nameTr: "Kediler", category: "theme" },
  { id: "15045", name: "Flight", nameTr: "Uçuş", category: "theme" },
  { id: "4598", name: "Alternate History", nameTr: "Alternatif Tarih", category: "theme" },
  { id: "4036", name: "Parkour", nameTr: "Parkur", category: "theme" },
  { id: "97376", name: "Cozy", nameTr: "Rahat", category: "theme" },
  { id: "10397", name: "Memes", nameTr: "Memler", category: "theme" },
  { id: "16094", name: "Mythology", nameTr: "Mitoloji", category: "theme" },
  { id: "255534", name: "Automation", nameTr: "Otomasyon", category: "theme" },
  { id: "6378", name: "Crime", nameTr: "Suç", category: "theme" },
  { id: "4845", name: "Capitalism", nameTr: "Kapitalizm", category: "theme" },
  { id: "13906", name: "Game Development", nameTr: "Oyun Geliştirme", category: "theme" },
  { id: "5363", name: "Destruction", nameTr: "Yıkım", category: "theme" },
  { id: "15277", name: "Philosophical", nameTr: "Felsefi", category: "theme" },
  { id: "3920", name: "Cooking", nameTr: "Yemek Yapma", category: "theme" },
  { id: "19995", name: "Dark Comedy", nameTr: "Kara Komedi", category: "theme" },
  { id: "6052", name: "Noir", nameTr: "Kara Film", category: "theme" },
  { id: "7432", name: "Lovecraftian", nameTr: "Lovecraft", category: "theme" },
  { id: "4608", name: "Swordplay", nameTr: "Kılıç Dövüşü", category: "theme" },
  { id: "5794", name: "Science", nameTr: "Bilim", category: "theme" },
  { id: "1931", name: "America", nameTr: "Amerika", category: "theme" },
  { id: "4878", name: "Parody", nameTr: "Parodi", category: "theme" },
  { id: "4046", name: "Dragons", nameTr: "Ejderhalar", category: "theme" },
  { id: "5372", name: "Conspiracy", nameTr: "Komplo", category: "theme" },
  { id: "552282", name: "Wholesome", nameTr: "İçten", category: "theme" },
  { id: "22602", name: "Agriculture", nameTr: "Tarım", category: "theme" },
  { id: "3952", name: "Gothic", nameTr: "Gotik", category: "theme" },
  { id: "4150", name: "World War II", nameTr: "2. Dünya Savaşı", category: "theme" },
  { id: "6915", name: "Martial Arts", nameTr: "Dövüş Sanatları", category: "theme" },
  { id: "1651", name: "Satire", nameTr: "Hiciv", category: "theme" },
  { id: "21006", name: "Underground", nameTr: "Yeraltı", category: "theme" },
  { id: "4821", name: "Mechs", nameTr: "Mekanikler", category: "theme" },
  { id: "5981", name: "Mining", nameTr: "Madencilik", category: "theme" },
  { id: "15564", name: "Fishing", nameTr: "Balıkçılık", category: "theme" },
  { id: "10383", name: "Transportation", nameTr: "Ulaşım", category: "theme" },
  { id: "1638", name: "Dog", nameTr: "Köpek", category: "theme" },
  { id: "1681", name: "Pirates", nameTr: "Korsanlar", category: "theme" },
  { id: "1777", name: "Steampunk", nameTr: "Steampunk", category: "theme" },
  { id: "10679", name: "Time Travel", nameTr: "Zaman Yolculuğu", category: "theme" },
  { id: "16250", name: "Gambling", nameTr: "Kumar", category: "theme" },
  { id: "9157", name: "Underwater", nameTr: "Su Altı", category: "theme" },
  { id: "1616", name: "Trains", nameTr: "Trenler", category: "theme" },
  { id: "4018", name: "Vampire", nameTr: "Vampir", category: "theme" },
  { id: "4853", name: "Political", nameTr: "Politik", category: "theme" },
  { id: "13276", name: "Tanks", nameTr: "Tanklar", category: "theme" },
  { id: "3934", name: "Immersive", nameTr: "Sürükleyici", category: "theme" },
  { id: "1688", name: "Ninja", nameTr: "Ninja", category: "theme" },
  { id: "9564", name: "Hunting", nameTr: "Avcılık", category: "theme" },
  { id: "9935", name: "Otome", nameTr: "Otome", category: "theme" },
  { id: "5502", name: "Hacking", nameTr: "Hackleme", category: "theme" },
  { id: "1647", name: "Western", nameTr: "Vahşi Batı", category: "theme" },
  { id: "961", name: "Politics", nameTr: "Politika", category: "theme" },
  { id: "5160", name: "Dinosaurs", nameTr: "Dinozorlar", category: "theme" },
  { id: "953", name: "Faith", nameTr: "İnanç", category: "theme" },
  { id: "5432", name: "Programming", nameTr: "Programlama", category: "theme" },
  { id: "1671", name: "Superhero", nameTr: "Süper Kahraman", category: "theme" },
  { id: "7108", name: "Party", nameTr: "Parti", category: "theme" },
  { id: "6310", name: "Diplomacy", nameTr: "Diplomasi", category: "theme" },
  { id: "4376", name: "Assassin", nameTr: "Suikastçi", category: "theme" },
  { id: "6910", name: "Naval", nameTr: "Denizcilik", category: "theme" },
  { id: "9803", name: "Snow", nameTr: "Kar", category: "theme" },
  { id: "1680", name: "Heist", nameTr: "Soygun", category: "theme" },
  { id: "13577", name: "Sailing", nameTr: "Yelkencilik", category: "theme" },
  { id: "5179", name: "Cold War", nameTr: "Soğuk Savaş", category: "theme" },
  { id: "13382", name: "Archery", nameTr: "Okçuluk", category: "theme" },
  { id: "637", name: "Foreign", nameTr: "Yabancı", category: "theme" },
  { id: "616", name: "Horses", nameTr: "Atlar", category: "theme" },
  { id: "4137", name: "Transhumanism", nameTr: "Transhümanizm", category: "theme" },
  { id: "550", name: "Offroad", nameTr: "Arazi", category: "theme" },
  { id: "514", name: "Nostalgia", nameTr: "Nostalji", category: "theme" },
  { id: "4520", name: "Farming", nameTr: "Çiftçilik", category: "theme" },
  { id: "7423", name: "Sniper", nameTr: "Keskin Nişancı", category: "theme" },
  { id: "462", name: "Jet", nameTr: "Jet", category: "theme" },
  { id: "458", name: "Illuminati", nameTr: "Illuminati", category: "theme" },
  { id: "17015", name: "Werewolves", nameTr: "Kurt Adamlar", category: "theme" },
  { id: "6702", name: "Mars", nameTr: "Mars", category: "theme" },
  { id: "4291", name: "Spaceships", nameTr: "Uzay Gemileri", category: "theme" },
  { id: "5382", name: "World War I", nameTr: "1. Dünya Savaşı", category: "theme" },
  { id: "349", name: "Rome", nameTr: "Roma", category: "theme" },
  { id: "321", name: "Dwarf", nameTr: "Cüce", category: "theme" },
  { id: "206", name: "Warhammer 40K", nameTr: "Warhammer 40K", category: "theme" },
  { id: "173", name: "Vikings", nameTr: "Vikingler", category: "theme" },
  { id: "138", name: "Elf", nameTr: "Elf", category: "theme" },
  { id: "133", name: "Birds", nameTr: "Kuşlar", category: "theme" },
  { id: "121", name: "Lemmings", nameTr: "Lemmings", category: "theme" },
  { id: "74", name: "Fox", nameTr: "Tilki", category: "theme" },

  // === VISUALS & VIEWPOINT ===
  { id: "3871", name: "2D", nameTr: "2D", category: "visual" },
  { id: "4191", name: "3D", nameTr: "3D", category: "visual" },
  { id: "4305", name: "Colorful", nameTr: "Renkli", category: "visual" },
  { id: "3834", name: "Pixel Graphics", nameTr: "Piksel Grafik", category: "visual" },
  { id: "4726", name: "Cute", nameTr: "Sevimli", category: "visual" },
  { id: "3839", name: "First-Person", nameTr: "Birinci Şahıs", category: "visual" },
  { id: "4085", name: "Anime", nameTr: "Anime", category: "visual" },
  { id: "4252", name: "Stylized", nameTr: "Stilize", category: "visual" },
  { id: "1693", name: "Third Person", nameTr: "Üçüncü Şahıs", category: "visual" },
  { id: "7241", name: "Top-Down", nameTr: "Yukarıdan Bakış", category: "visual" },
  { id: "4094", name: "Realistic", nameTr: "Gerçekçi", category: "visual" },
  { id: "15822", name: "Cartoony", nameTr: "Karikatür", category: "visual" },
  { id: "6815", name: "Hand-drawn", nameTr: "El Çizimi", category: "visual" },
  { id: "4195", name: "Minimalist", nameTr: "Minimalist", category: "visual" },
  { id: "1035", name: "VR", nameTr: "VR", category: "visual" },
  { id: "9378", name: "Cartoon", nameTr: "Çizgi Film", category: "visual" },
  { id: "6560", name: "Text-Based", nameTr: "Metin Tabanlı", category: "visual" },
  { id: "6476", name: "Cinematic", nameTr: "Sinematik", category: "visual" },
  { id: "5961", name: "2.5D", nameTr: "2.5D", category: "visual" },
  { id: "3964", name: "Isometric", nameTr: "İzometrik", category: "visual" },
  { id: "4400", name: "Abstract", nameTr: "Soyut", category: "visual" },
  { id: "1731", name: "3D Vision", nameTr: "3D Görüş", category: "visual" },
  { id: "1701", name: "Split Screen", nameTr: "Bölünmüş Ekran", category: "visual" },
  { id: "1400", name: "Voxel", nameTr: "Voxel", category: "visual" },
  { id: "1305", name: "FMV", nameTr: "FMV", category: "visual" },
  { id: "1085", name: "Beautiful", nameTr: "Güzel", category: "visual" },
  { id: "381", name: "360 Video", nameTr: "360 Video", category: "visual" },

  // === SUB-GENRES ===
  { id: "1664", name: "Puzzle", nameTr: "Bulmaca", category: "subgenre" },
  { id: "4106", name: "Action RPG", nameTr: "Aksiyon RPG", category: "subgenre" },
  { id: "1773", name: "Arcade", nameTr: "Arcade", category: "subgenre" },
  { id: "1774", name: "Shooter", nameTr: "Nişancı", category: "subgenre" },
  { id: "1625", name: "Platformer", nameTr: "Platform", category: "subgenre" },
  { id: "1779", name: "Visual Novel", nameTr: "Görsel Roman", category: "subgenre" },
  { id: "1716", name: "Roguelike", nameTr: "Roguelike", category: "subgenre" },
  { id: "3810", name: "Sandbox", nameTr: "Sandbox", category: "subgenre" },
  { id: "1698", name: "Point & Click", nameTr: "Tıkla & Oyna", category: "subgenre" },
  { id: "7703", name: "Walking Simulator", nameTr: "Yürüyüş Simülasyonu", category: "subgenre" },
  { id: "7662", name: "Dating Sim", nameTr: "Flört Simülasyonu", category: "subgenre" },
  { id: "7325", name: "JRPG", nameTr: "JRPG", category: "subgenre" },
  { id: "1666", name: "Card Game", nameTr: "Kart Oyunu", category: "subgenre" },
  { id: "6967", name: "Life Sim", nameTr: "Yaşam Sim", category: "subgenre" },
  { id: "6767", name: "Party-Based RPG", nameTr: "Parti Tabanlı RPG", category: "subgenre" },
  { id: "5617", name: "Design & Illustration", nameTr: "Tasarım", category: "subgenre" },
  { id: "5051", name: "Strategy RPG", nameTr: "Strateji RPG", category: "subgenre" },
  { id: "4749", name: "Board Game", nameTr: "Masa Oyunu", category: "subgenre" },
  { id: "1685", name: "Tower Defense", nameTr: "Kule Savunma", category: "subgenre" },
  { id: "1676", name: "RTS", nameTr: "Gerçek Zamanlı Strateji", category: "subgenre" },
  { id: "3814", name: "City Builder", nameTr: "Şehir Kurma", category: "subgenre" },
  { id: "1770", name: "Beat 'em up", nameTr: "Dövüş", category: "subgenre" },
  { id: "2688", name: "Rhythm", nameTr: "Ritim", category: "subgenre" },
  { id: "87918", name: "Farming Sim", nameTr: "Çiftçilik Sim", category: "subgenre" },
  { id: "2367", name: "Auto Battler", nameTr: "Otomatik Savaş", category: "subgenre" },
  { id: "2288", name: "Word Game", nameTr: "Kelime Oyunu", category: "subgenre" },
  { id: "2089", name: "Colony Sim", nameTr: "Koloni Sim", category: "subgenre" },
  { id: "2046", name: "eSports", nameTr: "e-Spor", category: "subgenre" },
  { id: "2039", name: "Space Sim", nameTr: "Uzay Sim", category: "subgenre" },
  { id: "2036", name: "Grand Strategy", nameTr: "Büyük Strateji", category: "subgenre" },
  { id: "1801", name: "MMORPG", nameTr: "MMORPG", category: "subgenre" },
  { id: "1741", name: "Battle Royale", nameTr: "Battle Royale", category: "subgenre" },
  { id: "1731", name: "Party Game", nameTr: "Parti Oyunu", category: "subgenre" },
  { id: "1312", name: "God Game", nameTr: "Tanrı Oyunu", category: "subgenre" },
  { id: "1268", name: "Open World Survival Craft", nameTr: "Açık Dünya Hayatta Kalma", category: "subgenre" },
  { id: "1117", name: "4X", nameTr: "4X", category: "subgenre" },
  { id: "972", name: "MOBA", nameTr: "MOBA", category: "subgenre" },
  { id: "700", name: "Trivia", nameTr: "Bilgi Yarışması", category: "subgenre" },
  { id: "653", name: "Job Simulator", nameTr: "İş Simülasyonu", category: "subgenre" },
  { id: "378", name: "Pinball", nameTr: "Pinball", category: "subgenre" },
  { id: "364", name: "Social Deduction", nameTr: "Sosyal Çıkarım", category: "subgenre" },
  { id: "36695", name: "Exploration", nameTr: "Keşif", category: "subgenre" },
  { id: "15786", name: "2D Platformer", nameTr: "2D Platform", category: "subgenre" },
  { id: "1756", name: "Roguelite", nameTr: "Roguelite", category: "subgenre" },
  { id: "1663", name: "FPS", nameTr: "FPS", category: "subgenre" },
  { id: "11493", name: "Immersive Sim", nameTr: "Sürükleyici Sim", category: "subgenre" },
  { id: "10359", name: "3D Platformer", nameTr: "3D Platform", category: "subgenre" },
  { id: "10314", name: "Action Roguelike", nameTr: "Aksiyon Roguelike", category: "subgenre" },
  { id: "9645", name: "Choose Your Own Adventure", nameTr: "Kendi Maceranı Seç", category: "subgenre" },
  { id: "9047", name: "Turn-Based Tactics", nameTr: "Sıra Tabanlı Taktik", category: "subgenre" },
  { id: "9037", name: "Hidden Object", nameTr: "Gizli Nesne", category: "subgenre" },
  { id: "8811", name: "Side Scroller", nameTr: "Yan Kaydırmalı", category: "subgenre" },
  { id: "8527", name: "Puzzle Platformer", nameTr: "Bulmaca Platform", category: "subgenre" },
  { id: "8502", name: "Shoot 'Em Up", nameTr: "Nişancı", category: "subgenre" },
  { id: "8230", name: "Bullet Hell", nameTr: "Mermi Cehennemi", category: "subgenre" },
  { id: "3959", name: "Hack and Slash", nameTr: "Kes ve Biç", category: "subgenre" },
  { id: "17389", name: "Dungeon Crawler", nameTr: "Zindan Gezgini", category: "subgenre" },
  { id: "7317", name: "Clicker", nameTr: "Tıklayıcı", category: "subgenre" },
  { id: "5890", name: "Top-Down Shooter", nameTr: "Yukarıdan Nişancı", category: "subgenre" },
  { id: "5609", name: "Idler", nameTr: "Boşta Kalma", category: "subgenre" },
  { id: "5453", name: "Third-Person Shooter", nameTr: "Üçüncü Şahıs Nişancı", category: "subgenre" },
  { id: "5412", name: "Time Management", nameTr: "Zaman Yönetimi", category: "subgenre" },
  { id: "5028", name: "Collectathon", nameTr: "Toplama Oyunu", category: "subgenre" },
  { id: "4928", name: "Precision Platformer", nameTr: "Hassas Platform", category: "subgenre" },
  { id: "4560", name: "Real Time Tactics", nameTr: "Gerçek Zamanlı Taktik", category: "subgenre" },
  { id: "4243", name: "Arena Shooter", nameTr: "Arena Nişancı", category: "subgenre" },
  { id: "4017", name: "Card Battler", nameTr: "Kart Savaşı", category: "subgenre" },
  { id: "3942", name: "Tactical RPG", nameTr: "Taktiksel RPG", category: "subgenre" },
  { id: "3641", name: "Wargame", nameTr: "Savaş Oyunu", category: "subgenre" },
  { id: "3452", name: "Creature Collector", nameTr: "Yaratık Toplayıcı", category: "subgenre" },
  { id: "1695", name: "Metroidvania", nameTr: "Metroidvania", category: "subgenre" },
  { id: "4667", name: "Souls-like", nameTr: "Souls Benzeri", category: "subgenre" },
  { id: "3310", name: "Runner", nameTr: "Koşucu", category: "subgenre" },
  { id: "2868", name: "CRPG", nameTr: "CRPG", category: "subgenre" },
  { id: "2381", name: "Twin Stick Shooter", nameTr: "İkili Çubuk Nişancı", category: "subgenre" },
  { id: "1854", name: "Match 3", nameTr: "3'lü Eşleştirme", category: "subgenre" },
  { id: "1849", name: "Mystery Dungeon", nameTr: "Gizemli Zindan", category: "subgenre" },
  { id: "1711", name: "Looter Shooter", nameTr: "Yağmacı Nişancı", category: "subgenre" },
  { id: "1607", name: "Spectacle fighter", nameTr: "Gösteri Dövüşü", category: "subgenre" },
  { id: "1587", name: "Hero Shooter", nameTr: "Kahraman Nişancı", category: "subgenre" },
  { id: "1568", name: "Solitaire", nameTr: "Solitaire", category: "subgenre" },
  { id: "1562", name: "Roguelike Deckbuilder", nameTr: "Roguelike Deste", category: "subgenre" },
  { id: "1539", name: "Combat Racing", nameTr: "Savaş Yarışı", category: "subgenre" },
  { id: "1442", name: "Action RTS", nameTr: "Aksiyon RTS", category: "subgenre" },
  { id: "1298", name: "Trading Card Game", nameTr: "Kart Değişim", category: "subgenre" },
  { id: "1266", name: "Sokoban", nameTr: "Sokoban", category: "subgenre" },
  { id: "1201", name: "Boomer Shooter", nameTr: "Boomer Nişancı", category: "subgenre" },
  { id: "1156", name: "Typing", nameTr: "Yazma", category: "subgenre" },
  { id: "1034", name: "Political Sim", nameTr: "Politik Sim", category: "subgenre" },
  { id: "859", name: "Shop Keeper", nameTr: "Dükkan Sahibi", category: "subgenre" },
  { id: "818", name: "Escape Room", nameTr: "Kaçış Odası", category: "subgenre" },
  { id: "712", name: "Traditional Roguelike", nameTr: "Klasik Roguelike", category: "subgenre" },
  { id: "622", name: "On-Rails Shooter", nameTr: "Ray Nişancı", category: "subgenre" },
  { id: "555", name: "Spelling", nameTr: "Heceleme", category: "subgenre" },
  { id: "451", name: "Outbreak Sim", nameTr: "Salgın Sim", category: "subgenre" },
  { id: "427", name: "Roguevania", nameTr: "Roguevania", category: "subgenre" },
  { id: "395", name: "Medical Sim", nameTr: "Tıp Sim", category: "subgenre" },
  { id: "273", name: "Extraction Shooter", nameTr: "Çıkarma Nişancı", category: "subgenre" },
  { id: "261", name: "Boss Rush", nameTr: "Boss Koşusu", category: "subgenre" },
  { id: "149", name: "Mahjong", nameTr: "Mahjong", category: "subgenre" },
  { id: "98", name: "Musou", nameTr: "Musou", category: "subgenre" },
  { id: "68", name: "Hobby Sim", nameTr: "Hobi Sim", category: "subgenre" },

  // === FEATURES ===
  { id: "35809", name: "Story Rich", nameTr: "Zengin Hikaye", category: "feature" },
  { id: "23451", name: "Combat", nameTr: "Savaş", category: "feature" },
  { id: "19553", name: "Controller", nameTr: "Oyun Kolu", category: "feature" },
  { id: "18645", name: "Female Protagonist", nameTr: "Kadın Karakter", category: "feature" },
  { id: "17812", name: "Choices Matter", nameTr: "Seçimler Önemli", category: "feature" },
  { id: "17061", name: "PvE", nameTr: "PvE", category: "feature" },
  { id: "16104", name: "Linear", nameTr: "Doğrusal", category: "feature" },
  { id: "15860", name: "PvP", nameTr: "PvP", category: "feature" },
  { id: "15665", name: "Multiple Endings", nameTr: "Çoklu Son", category: "feature" },
  { id: "5395", name: "Open World", nameTr: "Açık Dünya", category: "feature" },
  { id: "14355", name: "Physics", nameTr: "Fizik", category: "feature" },
  { id: "13900", name: "Character Customization", nameTr: "Karakter Özelleştirme", category: "feature" },
  { id: "9583", name: "Resource Management", nameTr: "Kaynak Yönetimi", category: "feature" },
  { id: "8946", name: "Procedural Generation", nameTr: "Prosedürel Oluşturma", category: "feature" },
  { id: "8907", name: "Turn-Based Combat", nameTr: "Sıra Tabanlı Savaş", category: "feature" },
  { id: "7877", name: "Tabletop", nameTr: "Masa Üstü", category: "feature" },
  { id: "7163", name: "Base Building", nameTr: "Üs İnşası", category: "feature" },
  { id: "6523", name: "Score Attack", nameTr: "Skor Saldırısı", category: "feature" },
  { id: "5646", name: "Narration", nameTr: "Anlatı", category: "feature" },
  { id: "5530", name: "Conversation", nameTr: "Konuşma", category: "feature" },
  { id: "5174", name: "Deckbuilding", nameTr: "Deste Oluşturma", category: "feature" },
  { id: "4625", name: "Tutorial", nameTr: "Öğretici", category: "feature" },
  { id: "4556", name: "Nonlinear", nameTr: "Doğrusal Olmayan", category: "feature" },
  { id: "4200", name: "Inventory Management", nameTr: "Envanter Yönetimi", category: "feature" },
  { id: "4124", name: "Team-Based", nameTr: "Takım Tabanlı", category: "feature" },
  { id: "4098", name: "Perma Death", nameTr: "Kalıcı Ölüm", category: "feature" },
  { id: "2956", name: "Grid-Based Movement", nameTr: "Izgara Hareketi", category: "feature" },
  { id: "2880", name: "Level Editor", nameTr: "Seviye Editörü", category: "feature" },
  { id: "2421", name: "Moddable", nameTr: "Modlanabilir", category: "feature" },
  { id: "2128", name: "Class-Based", nameTr: "Sınıf Tabanlı", category: "feature" },
  { id: "2008", name: "Vehicular Combat", nameTr: "Araç Savaşı", category: "feature" },
  { id: "1963", name: "Gun Customization", nameTr: "Silah Özelleştirme", category: "feature" },
  { id: "1945", name: "Trading", nameTr: "Ticaret", category: "feature" },
  { id: "1632", name: "6DOF", nameTr: "6DOF", category: "feature" },
  { id: "1531", name: "Quick-Time Events", nameTr: "Hızlı Zaman Olayları", category: "feature" },
  { id: "1529", name: "Bullet Time", nameTr: "Mermi Zamanı", category: "feature" },
  { id: "1426", name: "Time Manipulation", nameTr: "Zaman Manipülasyonu", category: "feature" },
  { id: "1293", name: "Dynamic Narration", nameTr: "Dinamik Anlatı", category: "feature" },
  { id: "1201", name: "Hex Grid", nameTr: "Altıgen Izgara", category: "feature" },
  { id: "675", name: "Naval Combat", nameTr: "Deniz Savaşı", category: "feature" },
  { id: "593", name: "Music-Based Procedural", nameTr: "Müzik Tabanlı Oluşturma", category: "feature" },
  { id: "255", name: "Asymmetric VR", nameTr: "Asimetrik VR", category: "feature" },

  // === PLAYERS ===
  { id: "4182", name: "Singleplayer", nameTr: "Tek Oyunculu", category: "players" },
  { id: "3859", name: "Multiplayer", nameTr: "Çok Oyunculu", category: "players" },
  { id: "4508", name: "Co-op", nameTr: "İşbirliği", category: "players" },
  { id: "3843", name: "Online Co-Op", nameTr: "Çevrimiçi İşbirliği", category: "players" },
  { id: "7838", name: "Massively Multiplayer", nameTr: "Devasa Çok Oyunculu", category: "players" },
  { id: "6989", name: "Local Multiplayer", nameTr: "Yerel Çok Oyunculu", category: "players" },
  { id: "7368", name: "Local Co-Op", nameTr: "Yerel İşbirliği", category: "players" },
  { id: "3072", name: "4 Player Local", nameTr: "4 Oyunculu Yerel", category: "players" },
  { id: "1316", name: "Co-op Campaign", nameTr: "İşbirliği Kampanya", category: "players" },
  { id: "1001", name: "Asynchronous Multiplayer", nameTr: "Asenkron Çok Oyunculu", category: "players" },

  // === SPORTS ===
  { id: "620", name: "Football (Soccer)", nameTr: "Futbol", category: "sports" },
  { id: "461", name: "Boxing", nameTr: "Boks", category: "sports" },
  { id: "413", name: "Golf", nameTr: "Golf", category: "sports" },
  { id: "402", name: "Motorbike", nameTr: "Motorsiklet", category: "sports" },
  { id: "385", name: "Basketball", nameTr: "Basketbol", category: "sports" },
  { id: "352", name: "Submarine", nameTr: "Denizaltı", category: "sports" },
  { id: "345", name: "Bikes", nameTr: "Bisikletler", category: "sports" },
  { id: "324", name: "Baseball", nameTr: "Beyzbol", category: "sports" },
  { id: "323", name: "LEGO", nameTr: "LEGO", category: "sports" },
  { id: "266", name: "Mini Golf", nameTr: "Mini Golf", category: "sports" },
  { id: "262", name: "Skateboarding", nameTr: "Kaykay", category: "sports" },
  { id: "252", name: "Wrestling", nameTr: "Güreş", category: "sports" },
  { id: "229", name: "Pool", nameTr: "Bilardo", category: "sports" },
  { id: "220", name: "Football (American)", nameTr: "Amerikan Futbolu", category: "sports" },
  { id: "204", name: "Skating", nameTr: "Paten", category: "sports" },
  { id: "195", name: "Tennis", nameTr: "Tenis", category: "sports" },
  { id: "192", name: "Cycling", nameTr: "Bisiklet", category: "sports" },
  { id: "160", name: "Motocross", nameTr: "Motokros", category: "sports" },
  { id: "142", name: "Hockey", nameTr: "Hokey", category: "sports" },
  { id: "129", name: "Bowling", nameTr: "Bowling", category: "sports" },
  { id: "111b", name: "Skiing", nameTr: "Kayak", category: "sports" },
  { id: "111c", name: "Snowboarding", nameTr: "Snowboard", category: "sports" },
  { id: "90", name: "BMX", nameTr: "BMX", category: "sports" },
  { id: "86", name: "ATV", nameTr: "ATV", category: "sports" },
  { id: "48", name: "Cricket", nameTr: "Kriket", category: "sports" },
  { id: "38", name: "Volleyball", nameTr: "Voleybol", category: "sports" },
  { id: "34", name: "Rugby", nameTr: "Ragbi", category: "sports" },
  { id: "23", name: "Snooker", nameTr: "Bilardo", category: "sports" },

  // === CHALLENGE ===
  { id: "10403", name: "Difficult", nameTr: "Zor", category: "challenge" },
  { id: "2239", name: "Competitive", nameTr: "Rekabetçi", category: "challenge" },
  { id: "336", name: "Unforgiving", nameTr: "Affetmez", category: "challenge" },
  { id: "5300", name: "Replay Value", nameTr: "Tekrar Oynanabilirlik", category: "challenge" },
  { id: "3215", name: "Fast-Paced", nameTr: "Hızlı Tempolu", category: "challenge" },
  { id: "671", name: "Real-Time", nameTr: "Gerçek Zamanlı", category: "challenge" },
  { id: "611", name: "Time Attack", nameTr: "Zaman Saldırısı", category: "challenge" },
  { id: "553", name: "Real-Time with Pause", nameTr: "Duraklat ile Gerçek Zamanlı", category: "challenge" },
  { id: "1697", name: "Turn-Based", nameTr: "Sıra Tabanlı", category: "challenge" },

  // === ADULT CONTENT / AGE RATING ===
  { id: "9130", name: "Sexual Content", nameTr: "Cinsel İçerik", category: "adult" },
  { id: "6650", name: "Nudity", nameTr: "Çıplaklık", category: "adult" },
  { id: "12432", name: "Adult Content", nameTr: "Yetişkin İçerik", category: "adult" },
  { id: "7769", name: "Mature", nameTr: "Olgun", category: "adult" },
  { id: "6778", name: "Hentai", nameTr: "Hentai", category: "adult" },
  { id: "6751", name: "NSFW", nameTr: "NSFW", category: "adult" },
  { id: "14430", name: "Violent", nameTr: "Şiddetli", category: "adult" },
  { id: "11611", name: "Gore", nameTr: "Kanlı", category: "adult" },
  { id: "1021", name: "Blood", nameTr: "Kan", category: "adult" },
  { id: "255b", name: "Jump Scare", nameTr: "Ani Korku", category: "adult" },

  // === AUDIO ===
  { id: "13521", name: "Soundtrack", nameTr: "Müzik", category: "audio" },
  { id: "5564", name: "Great Soundtrack", nameTr: "Harika Müzik", category: "audio" },
  { id: "3053", name: "Music", nameTr: "Müzik", category: "audio" },
  { id: "326", name: "Electronic Music", nameTr: "Elektronik Müzik", category: "audio" },
  { id: "312", name: "Ambient", nameTr: "Ortam Müziği", category: "audio" },
  { id: "207", name: "Instrumental Music", nameTr: "Enstrümantal Müzik", category: "audio" },
  { id: "172", name: "Rock Music", nameTr: "Rock Müzik", category: "audio" },
  { id: "117", name: "8-bit Music", nameTr: "8-bit Müzik", category: "audio" },
  { id: "81", name: "Electronic", nameTr: "Elektronik", category: "audio" },

  // === MISC ===
  { id: "141482", name: "Profile Features Limited", nameTr: "Profil Özellikleri Sınırlı", category: "misc" },
  { id: "27498", name: "Demo Available", nameTr: "Demo Mevcut", category: "misc" },
  { id: "113", name: "Free to Play", nameTr: "Ücretsiz", category: "misc" },
  { id: "493", name: "Early Access", nameTr: "Erken Erişim", category: "misc" },
  { id: "17660", name: "AI Content Disclosed", nameTr: "AI İçerik Açıklandı", category: "misc" },
  { id: "1971", name: "Experimental", nameTr: "Deneysel", category: "misc" },
  { id: "1646", name: "Movie", nameTr: "Film", category: "misc" },
  { id: "909", name: "Software Training", nameTr: "Yazılım Eğitimi", category: "misc" },
  { id: "875", name: "Minigames", nameTr: "Mini Oyunlar", category: "misc" },
  { id: "607", name: "Remake", nameTr: "Yeniden Yapım", category: "misc" },
  { id: "457", name: "Sequel", nameTr: "Devam", category: "misc" },
  { id: "323b", name: "Experience", nameTr: "Deneyim", category: "misc" },
  { id: "286", name: "Kickstarter", nameTr: "Kickstarter", category: "misc" },
  { id: "156", name: "Crowdfunded", nameTr: "Kitle Fonlu", category: "misc" },
  { id: "62", name: "Benchmark", nameTr: "Benchmark", category: "misc" },
  { id: "41", name: "Feature Film", nameTr: "Uzun Metraj", category: "misc" },
  { id: "18", name: "Reboot", nameTr: "Yeniden Başlatma", category: "misc" },
  { id: "1557", name: "Classic", nameTr: "Klasik", category: "misc" },
  { id: "466", name: "Addictive", nameTr: "Bağımlılık Yapıcı", category: "misc" },
  { id: "332", name: "Cult Classic", nameTr: "Kült Klasik", category: "misc" },
  { id: "189", name: "Epic", nameTr: "Epik", category: "misc" },
  { id: "672", name: "Dungeons & Dragons", nameTr: "Dungeons & Dragons", category: "misc" },
  { id: "170", name: "Games Workshop", nameTr: "Games Workshop", category: "misc" },
  { id: "2373", name: "RPGMaker", nameTr: "RPGMaker", category: "misc" },
  { id: "322", name: "GameMaker", nameTr: "GameMaker", category: "misc" },
  { id: "206b", name: "TrackIR", nameTr: "TrackIR", category: "misc" },
  { id: "71", name: "Hardware", nameTr: "Donanım", category: "misc" },
  { id: "268", name: "Mod", nameTr: "Mod", category: "misc" },
  { id: "465", name: "Chess", nameTr: "Satranç", category: "misc" },
  { id: "285", name: "Dice", nameTr: "Zar", category: "misc" },
]

// Age Rating Filter Options  
export const AGE_RATINGS = [
  { value: "any", labelTr: "Hepsi", labelEn: "Any" },
  { value: "everyone", labelTr: "Herkes İçin", labelEn: "Everyone" },
  { value: "teen", labelTr: "13+", labelEn: "Teen (13+)" },
  { value: "mature", labelTr: "17+ (Olgun)", labelEn: "Mature (17+)" },
  { value: "adult", labelTr: "18+ (Yetişkin)", labelEn: "Adult Only (18+)" },
]

// Tag Categories for filtering UI
export const TAG_CATEGORIES = [
  { id: "genre", name: "Genres", nameTr: "Ana Türler" },
  { id: "theme", name: "Themes & Moods", nameTr: "Temalar" },
  { id: "visual", name: "Visuals", nameTr: "Görsel" },
  { id: "subgenre", name: "Sub-Genres", nameTr: "Alt Türler" },
  { id: "feature", name: "Features", nameTr: "Özellikler" },
  { id: "players", name: "Players", nameTr: "Oyuncular" },
  { id: "sports", name: "Sports", nameTr: "Sporlar" },
  { id: "challenge", name: "Challenge", nameTr: "Zorluk" },
  { id: "audio", name: "Audio", nameTr: "Ses" },
  { id: "adult", name: "Age Rating", nameTr: "Yaş Sınırı" },
  { id: "misc", name: "Misc", nameTr: "Diğer" },
]

// Backwards compat
export const STEAM_GENRES = STEAM_TAGS.filter(t => t.category === "genre")

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
