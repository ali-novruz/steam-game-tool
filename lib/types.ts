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
  opencritic?: { score: number; url: string; tier?: string }
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
  startingLetter: string
  priceMin: number
  priceMax: number
  freeOnly: boolean
  onSale: boolean
  genres: string[] // Steam official genre IDs
  tags: string[] // SteamDB tag IDs
  categories: string[]
  platforms: {
    windows: boolean
    mac: boolean
    linux: boolean
  }
  metacriticMin: number
  metacriticMax: number
  reviewScore: string
  releaseYear: number
  multiplayer: boolean | null
  earlyAccess: boolean | null
  turkishSupport: boolean
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
  tags: [],
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

/* ------------------------------------------------------------------ */
/*  Steam Official Genres (from appdetails API)                        */
/* ------------------------------------------------------------------ */
// These are the ONLY genres that Steam's API returns - used for filtering
export const STEAM_GENRES = [
  { id: "1", name: "Action", nameTr: "Aksiyon" },
  { id: "25", name: "Adventure", nameTr: "Macera" },
  { id: "3", name: "RPG", nameTr: "RPG" },
  { id: "2", name: "Strategy", nameTr: "Strateji" },
  { id: "28", name: "Simulation", nameTr: "Simülasyon" },
  { id: "4", name: "Casual", nameTr: "Gündelik" },
  { id: "23", name: "Indie", nameTr: "Bağımsız" },
  { id: "18", name: "Sports", nameTr: "Spor" },
  { id: "9", name: "Racing", nameTr: "Yarış" },
  { id: "37", name: "Free to Play", nameTr: "Ücretsiz" },
  { id: "70", name: "Early Access", nameTr: "Erken Erişim" },
  { id: "29", name: "Massively Multiplayer", nameTr: "Kitlesel Çok Oyunculu" },
  { id: "58", name: "Video Production", nameTr: "Video Üretimi" },
  { id: "51", name: "Animation & Modeling", nameTr: "Animasyon" },
]

// Backwards compat
export const STEAM_TAGS = STEAM_GENRES.map(g => ({ ...g, category: "genre" }))

/* ------------------------------------------------------------------ */
/*  SteamDB Tags - Complete list with real tag IDs                     */
/* ------------------------------------------------------------------ */
// These are community-assigned tags from SteamDB - NOT directly filterable
// via Steam API, but shown for informational purposes
export const STEAMDB_TAGS = [
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
  { id: "701", name: "Sports", nameTr: "Spor", category: "theme" },
  { id: "1643", name: "Building", nameTr: "İnşa", category: "theme" },
  { id: "1708", name: "Tactical", nameTr: "Taktiksel", category: "theme" },
  { id: "5984", name: "Drama", nameTr: "Drama", category: "theme" },
  { id: "1755", name: "Space", nameTr: "Uzay", category: "theme" },
  { id: "4295", name: "Futuristic", nameTr: "Fütüristik", category: "theme" },
  { id: "4947", name: "Romance", nameTr: "Romantik", category: "theme" },
  { id: "1702", name: "Crafting", nameTr: "Üretim", category: "theme" },
  { id: "4604", name: "Dark Fantasy", nameTr: "Karanlık Fantezi", category: "theme" },
  { id: "699", name: "Racing", nameTr: "Yarış", category: "theme" },
  { id: "5608", name: "Emotional", nameTr: "Duygusal", category: "theme" },
  { id: "6129", name: "Logic", nameTr: "Mantık", category: "theme" },
  { id: "3978", name: "Survival Horror", nameTr: "Hayatta Kalma Korku", category: "theme" },
  { id: "30358", name: "Nature", nameTr: "Doğa", category: "theme" },
  { id: "6691", name: "1990's", nameTr: "1990'lar", category: "theme" },
  { id: "1710", name: "Surreal", nameTr: "Gerçeküstü", category: "theme" },
  { id: "1036", name: "Education", nameTr: "Eğitim", category: "theme" },
  { id: "3835", name: "Post-apocalyptic", nameTr: "Kıyamet Sonrası", category: "theme" },
  { id: "7743", name: "1980s", nameTr: "1980'ler", category: "theme" },
  { id: "1678", name: "War", nameTr: "Savaş", category: "theme" },
  { id: "3987", name: "Historical", nameTr: "Tarihi", category: "theme" },
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
  { id: "10397", name: "Memes", nameTr: "Memeler", category: "theme" },
  { id: "16094", name: "Mythology", nameTr: "Mitoloji", category: "theme" },
  { id: "255534", name: "Automation", nameTr: "Otomasyon", category: "theme" },
  { id: "6378", name: "Crime", nameTr: "Suç", category: "theme" },
  { id: "4845", name: "Capitalism", nameTr: "Kapitalizm", category: "theme" },
  { id: "13906", name: "Game Development", nameTr: "Oyun Geliştirme", category: "theme" },
  { id: "5363", name: "Destruction", nameTr: "Yıkım", category: "theme" },
  { id: "15277", name: "Philosophical", nameTr: "Felsefi", category: "theme" },
  { id: "3920", name: "Cooking", nameTr: "Yemek Yapma", category: "theme" },
  { id: "19995", name: "Dark Comedy", nameTr: "Kara Komedi", category: "theme" },
  { id: "6052", name: "Noir", nameTr: "Noir", category: "theme" },
  { id: "7432", name: "Lovecraftian", nameTr: "Lovecraft", category: "theme" },
  { id: "4608", name: "Swordplay", nameTr: "Kılıç Dövüşü", category: "theme" },
  { id: "5794", name: "Science", nameTr: "Bilim", category: "theme" },
  { id: "13190", name: "America", nameTr: "Amerika", category: "theme" },
  { id: "4878", name: "Parody", nameTr: "Parodi", category: "theme" },
  { id: "4046", name: "Dragons", nameTr: "Ejderhalar", category: "theme" },
  { id: "5372", name: "Conspiracy", nameTr: "Komplo", category: "theme" },
  { id: "552282", name: "Wholesome", nameTr: "Samimi", category: "theme" },
  { id: "22602", name: "Agriculture", nameTr: "Tarım", category: "theme" },
  { id: "3952", name: "Gothic", nameTr: "Gotik", category: "theme" },
  { id: "4150", name: "World War II", nameTr: "İkinci Dünya Savaşı", category: "theme" },
  { id: "6915", name: "Martial Arts", nameTr: "Dövüş Sanatları", category: "theme" },
  { id: "1651", name: "Satire", nameTr: "Hiciv", category: "theme" },
  { id: "21006", name: "Underground", nameTr: "Yeraltı", category: "theme" },
  { id: "4821", name: "Mechs", nameTr: "Robotlar", category: "theme" },
  { id: "5981", name: "Mining", nameTr: "Madencilik", category: "theme" },
  { id: "15564", name: "Fishing", nameTr: "Balıkçılık", category: "theme" },
  { id: "10383", name: "Transportation", nameTr: "Taşımacılık", category: "theme" },
  { id: "1638", name: "Dog", nameTr: "Köpek", category: "theme" },
  { id: "1681", name: "Pirates", nameTr: "Korsanlar", category: "theme" },
  { id: "1777", name: "Steampunk", nameTr: "Steampunk", category: "theme" },
  { id: "10679", name: "Time Travel", nameTr: "Zaman Yolculuğu", category: "theme" },
  { id: "16250", name: "Gambling", nameTr: "Kumar", category: "theme" },
  { id: "9157", name: "Underwater", nameTr: "Su Altı", category: "theme" },
  { id: "1616", name: "Trains", nameTr: "Trenler", category: "theme" },
  { id: "4018", name: "Vampire", nameTr: "Vampir", category: "theme" },
  { id: "4853", name: "Political", nameTr: "Politik", category: "theme" },
  { id: "4202", name: "Tanks", nameTr: "Tanklar", category: "theme" },
  { id: "3877", name: "Ninja", nameTr: "Ninja", category: "theme" },
  { id: "1100687", name: "Hunting", nameTr: "Avcılık", category: "theme" },
  { id: "9551", name: "Hacking", nameTr: "Hackleme", category: "theme" },
  { id: "1774", name: "Western", nameTr: "Batı", category: "theme" },
  { id: "4474", name: "Dinosaurs", nameTr: "Dinozorlar", category: "theme" },
  { id: "14139", name: "Superhero", nameTr: "Süper Kahraman", category: "theme" },
  { id: "7332", name: "Assassin", nameTr: "Suikastçı", category: "theme" },
  { id: "4994", name: "Naval", nameTr: "Deniz", category: "theme" },
  { id: "4195", name: "Sailing", nameTr: "Yelken", category: "theme" },
  { id: "6310", name: "Cold War", nameTr: "Soğuk Savaş", category: "theme" },
  { id: "1100688", name: "Archery", nameTr: "Okçuluk", category: "theme" },
  { id: "10235", name: "Horses", nameTr: "Atlar", category: "theme" },
  { id: "9204", name: "Transhumanism", nameTr: "Transhümanizm", category: "theme" },
  { id: "1100689", name: "Sniper", nameTr: "Keskin Nişancı", category: "theme" },
  { id: "7368", name: "Jet", nameTr: "Jet", category: "theme" },
  { id: "9564", name: "Mars", nameTr: "Mars", category: "theme" },
  { id: "1649", name: "Golf", nameTr: "Golf", category: "theme" },
  { id: "4562", name: "World War I", nameTr: "Birinci Dünya Savaşı", category: "theme" },
  { id: "7622", name: "Submarine", nameTr: "Denizaltı", category: "theme" },
  { id: "6426", name: "Rome", nameTr: "Roma", category: "theme" },
  { id: "1100690", name: "Bikes", nameTr: "Bisikletler", category: "theme" },
  { id: "7478", name: "Spaceships", nameTr: "Uzay Gemileri", category: "theme" },
  { id: "11123", name: "LEGO", nameTr: "LEGO", category: "theme" },
  { id: "1647", name: "Dwarf", nameTr: "Cüce", category: "theme" },
  { id: "7481", name: "Vikings", nameTr: "Vikingler", category: "theme" },
  { id: "620519", name: "Elf", nameTr: "Elf", category: "theme" },
  { id: "7569", name: "Birds", nameTr: "Kuşlar", category: "theme" },
  
  // === SUB-GENRES ===
  { id: "1664", name: "Puzzle", nameTr: "Bulmaca", category: "subgenre" },
  { id: "4106", name: "Action-Adventure", nameTr: "Aksiyon-Macera", category: "subgenre" },
  { id: "1773", name: "Arcade", nameTr: "Arcade", category: "subgenre" },
  { id: "1774", name: "Shooter", nameTr: "Nişancı", category: "subgenre" },
  { id: "1625", name: "Platformer", nameTr: "Platform", category: "subgenre" },
  { id: "3799", name: "Visual Novel", nameTr: "Görsel Roman", category: "subgenre" },
  { id: "1716", name: "Roguelike", nameTr: "Roguelike", category: "subgenre" },
  { id: "3810", name: "Sandbox", nameTr: "Sandbox", category: "subgenre" },
  { id: "1698", name: "Point & Click", nameTr: "Tıkla ve Oyna", category: "subgenre" },
  { id: "21978", name: "Action RPG", nameTr: "Aksiyon RPG", category: "subgenre" },
  { id: "5379", name: "Exploration", nameTr: "Keşif", category: "subgenre" },
  { id: "3959", name: "Roguelite", nameTr: "Roguelite", category: "subgenre" },
  { id: "1663", name: "FPS", nameTr: "FPS", category: "subgenre" },
  { id: "3834", name: "Immersive Sim", nameTr: "Sürükleyici Sim", category: "subgenre" },
  { id: "1697", name: "3D Platformer", nameTr: "3D Platform", category: "subgenre" },
  { id: "1751", name: "2D Platformer", nameTr: "2D Platform", category: "subgenre" },
  { id: "3839", name: "Action Roguelike", nameTr: "Aksiyon Roguelike", category: "subgenre" },
  { id: "1741", name: "Turn-Based Strategy", nameTr: "Sıra Tabanlı Strateji", category: "subgenre" },
  { id: "1646", name: "Walking Simulator", nameTr: "Yürüyüş Simülatörü", category: "subgenre" },
  { id: "9130", name: "Dating Sim", nameTr: "Flört Sim", category: "subgenre" },
  { id: "4434", name: "JRPG", nameTr: "JRPG", category: "subgenre" },
  { id: "1666", name: "Card Game", nameTr: "Kart Oyunu", category: "subgenre" },
  { id: "24904", name: "Party-Based RPG", nameTr: "Parti Tabanlı RPG", category: "subgenre" },
  { id: "17305", name: "Strategy RPG", nameTr: "Strateji RPG", category: "subgenre" },
  { id: "1770", name: "Board Game", nameTr: "Masa Oyunu", category: "subgenre" },
  { id: "1685", name: "Tower Defense", nameTr: "Kule Savunma", category: "subgenre" },
  { id: "1676", name: "RTS", nameTr: "RTS", category: "subgenre" },
  { id: "3814", name: "City Builder", nameTr: "Şehir Kurma", category: "subgenre" },
  { id: "3993", name: "Beat 'em up", nameTr: "Dövüş", category: "subgenre" },
  { id: "11104", name: "Automobile Sim", nameTr: "Araç Simülasyonu", category: "subgenre" },
  { id: "4182", name: "2D Fighter", nameTr: "2D Dövüş", category: "subgenre" },
  { id: "1752", name: "Rhythm", nameTr: "Ritim", category: "subgenre" },
  { id: "87918", name: "Farming Sim", nameTr: "Çiftçilik Sim", category: "subgenre" },
  { id: "4184", name: "3D Fighter", nameTr: "3D Dövüş", category: "subgenre" },
  { id: "1100686", name: "Auto Battler", nameTr: "Otomatik Dövüş", category: "subgenre" },
  { id: "1766", name: "Word Game", nameTr: "Kelime Oyunu", category: "subgenre" },
  { id: "220585", name: "Colony Sim", nameTr: "Koloni Sim", category: "subgenre" },
  { id: "16598", name: "Space Sim", nameTr: "Uzay Simülasyonu", category: "subgenre" },
  { id: "4364", name: "Grand Strategy", nameTr: "Büyük Strateji", category: "subgenre" },
  { id: "21725", name: "Battle Royale", nameTr: "Battle Royale", category: "subgenre" },
  { id: "7108", name: "Party Game", nameTr: "Parti Oyunu", category: "subgenre" },
  { id: "4701", name: "God Game", nameTr: "Tanrı Oyunu", category: "subgenre" },
  { id: "1100691", name: "Open World Survival Craft", nameTr: "Açık Dünya Hayatta Kalma", category: "subgenre" },
  { id: "1743", name: "4X", nameTr: "4X", category: "subgenre" },
  { id: "1718", name: "MOBA", nameTr: "MOBA", category: "subgenre" },
  { id: "7782", name: "Trivia", nameTr: "Trivia", category: "subgenre" },
  { id: "10816", name: "Job Simulator", nameTr: "İş Simülasyonu", category: "subgenre" },
  { id: "1337", name: "Pinball", nameTr: "Langırt", category: "subgenre" },
  { id: "17927", name: "Social Deduction", nameTr: "Sosyal Dedüksiyon", category: "subgenre" },
  { id: "6948", name: "Musou", nameTr: "Musou", category: "subgenre" },
  
  // === VISUALS & VIEWPOINT ===
  { id: "3871", name: "2D", nameTr: "2D", category: "visual" },
  { id: "4191", name: "3D", nameTr: "3D", category: "visual" },
  { id: "3854", name: "Colorful", nameTr: "Renkli", category: "visual" },
  { id: "3964", name: "Pixel Graphics", nameTr: "Piksel Grafik", category: "visual" },
  { id: "4726", name: "Cute", nameTr: "Sevimli", category: "visual" },
  { id: "3839", name: "First-Person", nameTr: "Birinci Şahıs", category: "visual" },
  { id: "4085", name: "Anime", nameTr: "Anime", category: "visual" },
  { id: "5432", name: "Stylized", nameTr: "Stilize", category: "visual" },
  { id: "1697", name: "Third Person", nameTr: "Üçüncü Şahıs", category: "visual" },
  { id: "7208", name: "Top-Down", nameTr: "Kuşbakışı", category: "visual" },
  { id: "4175", name: "Realistic", nameTr: "Gerçekçi", category: "visual" },
  { id: "4195", name: "Cartoony", nameTr: "Karikatür", category: "visual" },
  { id: "6815", name: "Hand-drawn", nameTr: "El Çizimi", category: "visual" },
  { id: "4094", name: "Minimalist", nameTr: "Minimalist", category: "visual" },
  { id: "21978", name: "VR", nameTr: "VR", category: "visual" },
  { id: "1732", name: "Text-Based", nameTr: "Metin Tabanlı", category: "visual" },
  { id: "7926", name: "Cinematic", nameTr: "Sinematik", category: "visual" },
  { id: "5395", name: "Isometric", nameTr: "İzometrik", category: "visual" },
  { id: "4400", name: "Abstract", nameTr: "Soyut", category: "visual" },
  { id: "4252", name: "Voxel", nameTr: "Voksel", category: "visual" },
  { id: "10816", name: "Beautiful", nameTr: "Güzel", category: "visual" },
  
  // === FEATURES ===
  { id: "1742", name: "Story Rich", nameTr: "Zengin Hikaye", category: "feature" },
  { id: "3993", name: "Combat", nameTr: "Savaş", category: "feature" },
  { id: "7481", name: "Controller", nameTr: "Kumanda", category: "feature" },
  { id: "7208", name: "Female Protagonist", nameTr: "Kadın Kahraman", category: "feature" },
  { id: "6426", name: "Choices Matter", nameTr: "Seçimler Önemli", category: "feature" },
  { id: "3878", name: "PvE", nameTr: "PvE", category: "feature" },
  { id: "4434", name: "Linear", nameTr: "Doğrusal", category: "feature" },
  { id: "1775", name: "PvP", nameTr: "PvP", category: "feature" },
  { id: "6971", name: "Multiple Endings", nameTr: "Çoklu Sonlar", category: "feature" },
  { id: "1695", name: "Open World", nameTr: "Açık Dünya", category: "feature" },
  { id: "4168", name: "Physics", nameTr: "Fizik", category: "feature" },
  { id: "4305", name: "Character Customization", nameTr: "Karakter Özelleştirme", category: "feature" },
  { id: "17389", name: "Resource Management", nameTr: "Kaynak Yönetimi", category: "feature" },
  { id: "4325", name: "Turn-Based Tactics", nameTr: "Sıra Tabanlı Taktik", category: "feature" },
  { id: "1730", name: "Procedural Generation", nameTr: "Prosedürel Oluşturma", category: "feature" },
  { id: "4736", name: "Turn-Based Combat", nameTr: "Sıra Tabanlı Savaş", category: "feature" },
  { id: "1754", name: "Hack and Slash", nameTr: "Kesip Biç", category: "feature" },
  { id: "17770", name: "Deckbuilding", nameTr: "Deste Kurma", category: "feature" },
  { id: "5390", name: "Narration", nameTr: "Anlatım", category: "feature" },
  { id: "1759", name: "Perma Death", nameTr: "Kalıcı Ölüm", category: "feature" },
  { id: "5711", name: "Level Editor", nameTr: "Seviye Editörü", category: "feature" },
  { id: "5094", name: "Moddable", nameTr: "Modlanabilir", category: "feature" },
  { id: "4252", name: "Quick-Time Events", nameTr: "Hızlı Olay", category: "feature" },
  { id: "9204", name: "Bullet Time", nameTr: "Mermi Zamanı", category: "feature" },
  { id: "11123", name: "Time Manipulation", nameTr: "Zaman Manipülasyonu", category: "feature" },
  
  // === PLAYERS ===
  { id: "4182", name: "Singleplayer", nameTr: "Tek Oyunculu", category: "players" },
  { id: "3859", name: "Multiplayer", nameTr: "Çok Oyunculu", category: "players" },
  { id: "3841", name: "Co-op", nameTr: "Co-op", category: "players" },
  { id: "4508", name: "Online Co-Op", nameTr: "Online Co-op", category: "players" },
  { id: "128", name: "Massively Multiplayer", nameTr: "Kitlesel Çok Oyunculu", category: "players" },
  { id: "7368", name: "Local Multiplayer", nameTr: "Yerel Çok Oyunculu", category: "players" },
  { id: "3843", name: "Local Co-Op", nameTr: "Yerel Co-op", category: "players" },
  { id: "1685", name: "4 Player Local", nameTr: "4 Oyunculu Yerel", category: "players" },
  { id: "4840", name: "Asynchronous Multiplayer", nameTr: "Asenkron Çok Oyunculu", category: "players" },
  
  // === CHALLENGE ===
  { id: "5547", name: "Difficult", nameTr: "Zor", category: "challenge" },
  { id: "5941", name: "Competitive", nameTr: "Rekabetçi", category: "challenge" },
  { id: "7782", name: "Tutorial", nameTr: "Eğitim", category: "challenge" },
  
  // === MISC ===
  { id: "113", name: "Free to Play", nameTr: "Ücretsiz", category: "misc" },
  { id: "493", name: "Early Access", nameTr: "Erken Erişim", category: "misc" },
  { id: "5153", name: "Remake", nameTr: "Yeniden Yapım", category: "misc" },
  { id: "9803", name: "Sequel", nameTr: "Devam", category: "misc" },
  { id: "1084988", name: "Kickstarter", nameTr: "Kickstarter", category: "misc" },
]

/* ------------------------------------------------------------------ */
/*  Steam Categories                                                   */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Review Score Options                                               */
/* ------------------------------------------------------------------ */
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
  { value: "overwhelmingly_negative", labelTr: "Ezici Olumsuz", labelEn: "Overwhelmingly Negative" },
]

/* ------------------------------------------------------------------ */
/*  Tag Categories for Filter UI                                       */
/* ------------------------------------------------------------------ */
export const TAG_CATEGORIES = [
  { id: "genre", name: "Genres", nameTr: "Türler" },
  { id: "theme", name: "Themes", nameTr: "Temalar" },
  { id: "subgenre", name: "Sub-Genres", nameTr: "Alt Türler" },
  { id: "visual", name: "Visuals", nameTr: "Görseller" },
  { id: "feature", name: "Features", nameTr: "Özellikler" },
  { id: "players", name: "Players", nameTr: "Oyuncular" },
  { id: "challenge", name: "Challenge", nameTr: "Zorluk" },
  { id: "misc", name: "Other", nameTr: "Diğer" },
]
