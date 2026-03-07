# Steam Game Roulette | Steam Oyun Ruleti

Steam’deki **genel oyunlar** arasından rastgele bir oyun seçmeye yarayan web uygulaması.  
A web app that picks a random game from the **general Steam catalog**.

- Demo / Canlı demo: https://steamgameroulette.vercel.app/

---

## Özellikler (TR)
- Genel Steam oyunları arasından rastgele oyun seçimi (roulette)
- Basit ve hızlı arayüz
- Mobil uyumlu tasarım

## Features (EN)
- Random game selection from the general Steam catalog (roulette)
- Clean and fast UI
- Mobile-friendly (responsive)

---

## Nasıl çalışır? (TR)
Uygulama, Steam oyun verisini bir kaynaktan alır (örn. Steam Store endpoint’leri / üçüncü parti Steam katalog servisi / lokal dataset) ve rastgele seçim yapar.

> Not: Oyun verisinin kaynağı ve güncelliği, projede kullanılan veri kaynağına bağlıdır.

## How it works (EN)
The app fetches Steam game data from a source (e.g., Steam Store endpoints / a third-party catalog service / a local dataset) and then performs a random selection.

> Note: Data coverage and freshness depend on the data source used in the project.

---

## Teknolojiler / Tech
Repo dil dağılımı / Language breakdown:
- TypeScript (%96.1)
- CSS (%3.6)
- JavaScript (%0.3)

Framework/araçlar / Framework & tools (repo içeriğine göre netleştirilecek / to be confirmed from the repo):
- (e.g., Next.js / React)
- Deploy: Vercel

---

## Kurulum (Local) / Getting Started (Local)

### Gereksinimler / Requirements
- Node.js (LTS önerilir / LTS recommended)
- npm / pnpm / yarn

### Kurulum / Install
```bash
git clone https://github.com/ali-novruz/steam-game-tool.git
cd steam-game-tool
npm install
```

### Çalıştırma / Run
```bash
npm run dev
```

Then open / Sonra aç:
- http://localhost:3000

---

## Ortam değişkenleri / Environment variables
Eğer proje bir API key / endpoint kullanıyorsa `.env.local` gerekebilir.  
If the project uses an API key / endpoint, you may need a `.env.local`.

Örnek / Example (isimleri repoya göre düzelt / adjust names based on the repo):
```bash
# .env.local
# STEAM_API_KEY=
# STEAM_API_BASE_URL=
```

---

## Roadmap (Opsiyonel / Optional)
- Filtreler / Filters: tür/etiket (genre/tags), fiyat aralığı (price range), Free-to-Play, inceleme skoru (review score), çıkış tarihi (release date)
- Favorilere ekleme / geçmiş / Favorites & history
- Paylaşılabilir sonuç linki / Shareable result link
- TR/EN dil desteği / TR+EN language support

---

## Katkı / Contributing
- Issue açabilirsin / Feel free to open an issue
- Fork → branch (`feature/...`) → PR

---

## Lisans / License
(Lisans eklemediysen: MIT önerilir.)  
(If you haven’t added a license yet: MIT is recommended).