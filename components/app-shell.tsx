"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, AlertCircle, Search, Dices, Gamepad2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenerateButton } from "@/components/generate-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GameCard } from "@/components/game-card"
import { GameSkeleton } from "@/components/game-skeleton"
import { SocialShare } from "@/components/social-share"
import { FilterPanel } from "@/components/filter-panel"
import type { GameData, Language, GameFilters } from "@/lib/types"
import { DEFAULT_FILTERS } from "@/lib/types"
import { t } from "@/lib/i18n"

/* ------------------------------------------------------------------ */
/*  Steam Icon                                                         */
/* ------------------------------------------------------------------ */
function SteamLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12.004-5.373 12.004-12S18.606 0 11.979 0" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Feature Card                                                       */
/* ------------------------------------------------------------------ */
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border bg-card/60 backdrop-blur-sm p-5 text-center transition-colors hover:bg-card">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Shell                                                         */
/* ------------------------------------------------------------------ */
export function AppShell() {
  const [lang, setLang] = useState<Language>("tr")
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchId, setSearchId] = useState("")
  const [searchError, setSearchError] = useState(false)
  const [filters, setFilters] = useState<GameFilters>(DEFAULT_FILTERS)
  const [noMatch, setNoMatch] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  
  // Track current request to ignore stale responses
  const requestIdRef = useRef(0)

  useEffect(() => { setMounted(true) }, [])

  /* Build filter query string */
  const buildFilterQuery = useCallback((f: GameFilters): string => {
    const params = new URLSearchParams()
    if (f.startingLetter) params.set("startingLetter", f.startingLetter)
    if (f.freeOnly) params.set("freeOnly", "true")
    if (f.onSale) params.set("onSale", "true")
    if (f.priceMin > 0) params.set("priceMin", String(f.priceMin))
    if (f.priceMax > 0) params.set("priceMax", String(f.priceMax))
    if (f.genres.length > 0) params.set("genres", f.genres.join(","))
    if (f.categories.length > 0) params.set("categories", f.categories.join(","))
    if (f.reviewScore !== "any") params.set("reviewScore", f.reviewScore)
    if (f.metacriticMin > 0) params.set("metacriticMin", String(f.metacriticMin))
    if (f.metacriticMax > 0) params.set("metacriticMax", String(f.metacriticMax))
    if (f.releaseYear > 0) params.set("releaseYear", String(f.releaseYear))
    if (f.multiplayer === true) params.set("multiplayer", "true")
    if (f.multiplayer === false) params.set("multiplayer", "false")
    if (f.earlyAccess === true) params.set("earlyAccess", "true")
    if (f.turkishSupport) params.set("turkishSupport", "true")
    if (f.hasAchievements) params.set("hasAchievements", "true")
    if (f.hasTradingCards) params.set("hasTradingCards", "true")
    if (f.controllerSupport) params.set("controllerSupport", "true")
    if (f.vrSupport) params.set("vrSupport", "true")
    if (f.platforms.windows) params.set("windows", "true")
    if (f.platforms.mac) params.set("mac", "true")
    if (f.platforms.linux) params.set("linux", "true")
    const query = params.toString()
    return query ? `?${query}` : ""
  }, [])

  /* Random game with filters */
  const fetchRandomGame = useCallback(async () => {
    // Increment request ID to track this specific request
    const currentRequestId = ++requestIdRef.current
    
    // Reset all states before fetching
    setLoading(true)
    setError(false)
    setSearchError(false)
    setNoMatch(false)
    setGameData(null) // Clear previous game data immediately
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout
    
    try {
      const query = buildFilterQuery(filters)
      const res = await fetch(`/api/steam/random${query}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      // Ignore if this is a stale request
      if (currentRequestId !== requestIdRef.current) {
        return
      }
      
      if (!res.ok) {
        throw new Error("Failed with status " + res.status)
      }
      
      const data = await res.json()
      
      // Ignore if this is a stale request
      if (currentRequestId !== requestIdRef.current) {
        return
      }
      
      // Check for "no matching game" special error
      if (data.error === "NO_MATCHING_GAME") {
        setNoMatch(true)
        setLoading(false)
        return
      }
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Success - set game data
      setGameData(data)
      setLoading(false)
    } catch (err) {
      clearTimeout(timeoutId)
      
      // Ignore if this is a stale request
      if (currentRequestId !== requestIdRef.current) {
        return
      }
      
      // Check if it was a timeout/abort
      if (err instanceof Error && err.name === 'AbortError') {
        setNoMatch(true) // Treat timeout as "no match found"
      } else {
        setError(true)
      }
      setLoading(false)
    }
  }, [filters, buildFilterQuery])

  /* Search by ID */
  const fetchGameById = useCallback(async (id: string) => {
    const trimmed = id.trim()
    if (!trimmed || !/^\d+$/.test(trimmed)) { setSearchError(true); return }
    setLoading(true)
    setError(false)
    setSearchError(false)
    try {
      const res = await fetch(`/api/steam/lookup?id=${trimmed}`)
      if (!res.ok) { setSearchError(true); setLoading(false); return }
      const data = await res.json()
      if (data.error) { setSearchError(true); setLoading(false); return }
      setGameData(data)
    } catch {
      setSearchError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleLang = useCallback(() => setLang((p) => (p === "tr" ? "en" : "tr")), [])
  const toggleTheme = useCallback(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"), [resolvedTheme, setTheme])

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Header ---- */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <SteamLogo className="size-6 text-primary" />
            <h1 className="text-sm font-bold md:text-base text-foreground">{t(lang, "title")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} onToggle={toggleLang} />
            {mounted ? (
              <Button variant="outline" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme">
                {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            ) : (
              <div className="size-8" />
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        {/* ---- Hero (no game loaded, not loading, no error, no noMatch) ---- */}
        {!gameData && !loading && !error && !noMatch && (
          <section className="flex flex-col items-center gap-10 py-12 md:py-20">
            {/* Logo + Glow */}
            <div className="relative animate-fade-in-up">
              <div className="absolute -inset-8 rounded-full bg-primary/20 blur-2xl animate-pulse-ring" />
              <div className="relative animate-float flex items-center gap-3">
                <SteamLogo className="size-16 text-primary md:size-20 drop-shadow-[0_0_24px_oklch(0.72_0.12_220/0.5)]" />
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold text-foreground md:text-3xl">Steam Game</span>
                  <span className="text-xl font-bold text-primary md:text-2xl">Roulette</span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-3 text-center animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <h2 className="text-xl font-semibold text-muted-foreground md:text-2xl text-balance leading-tight">
                {t(lang, "heroTagline")}
              </h2>
              <p className="text-base text-muted-foreground md:text-lg max-w-md text-pretty">
                {t(lang, "heroDesc")}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <GenerateButton
                onClick={fetchRandomGame}
                loading={loading}
                hasGame={false}
                discoverLabel={t(lang, "rollDice")}
                loadingLabel={t(lang, "discovering")}
                newGameLabel={t(lang, "newGame")}
              />

              {/* Filter Panel */}
              <div className="w-full max-w-md">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                  lang={lang}
                />
              </div>

              <span className="text-xs text-muted-foreground">{t(lang, "orText")}</span>

              {/* ID search */}
              <div className="flex w-full max-w-xs gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={t(lang, "searchPlaceholder")}
                  value={searchId}
                  onChange={(e) => { setSearchId(e.target.value); setSearchError(false) }}
                  onKeyDown={(e) => { if (e.key === "Enter") fetchGameById(searchId) }}
                  className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Button onClick={() => fetchGameById(searchId)} disabled={loading || !searchId.trim()} className="gap-1.5">
                  <Search className="size-4" />
                  {t(lang, "searchButton")}
                </Button>
              </div>
              {searchError && <p className="text-xs text-destructive">{t(lang, "searchError")}</p>}
            </div>

            {/* Feature cards */}
            <div className="grid w-full max-w-lg grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
              <FeatureCard icon={<Dices className="size-5" />} title={t(lang, "rollDice")} desc={lang === "tr" ? "Tek tıkla rastgele oyun" : "One click, random game"} />
              <FeatureCard icon={<Gamepad2 className="size-5" />} title={lang === "tr" ? "Detaylı Bilgi" : "Full Details"} desc={lang === "tr" ? "Fiyat, puan, fragman" : "Price, scores, trailers"} />
              <FeatureCard icon={<Share2 className="size-5" />} title={t(lang, "share")} desc={lang === "tr" ? "Sosyal medya kartları" : "Social media cards"} />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 text-center animate-fade-in-up" style={{ animationDelay: "450ms" }}>
              {[
                { val: "157,000+", label: t(lang, "statGames") },
                { val: "50+", label: t(lang, "statGenres") },
                { val: "5,000+", label: t(lang, "statFree") },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-primary">{s.val}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---- No Match Found (different from error) ---- */}
        {noMatch && !loading && !error && (
          <section className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-warning/10">
              <Search className="size-8 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{t(lang, "noMatchTitle")}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{t(lang, "noMatchDesc")}</p>
            
            {/* Filter Panel to change filters */}
            <div className="w-full max-w-md mt-2">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
                lang={lang}
              />
            </div>
            
            <div className="flex gap-2 mt-2">
              <Button onClick={() => { setFilters(DEFAULT_FILTERS); setNoMatch(false) }} variant="outline">
                {t(lang, "resetFilters")}
              </Button>
              <Button onClick={() => { setNoMatch(false); setTimeout(fetchRandomGame, 0) }}>
                {t(lang, "tryAgain")}
              </Button>
            </div>
          </section>
        )}

        {/* ---- Error ---- */}
        {error && !loading && (
          <section className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{t(lang, "errorTitle")}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{t(lang, "errorDesc")}</p>
            <Button onClick={() => { setError(false); setTimeout(fetchRandomGame, 0) }} variant="outline">{t(lang, "tryAgain")}</Button>
          </section>
        )}

        {/* ---- Loading ---- */}
        {loading && (
          <section className="flex flex-col gap-6">
            <div className="flex justify-center">
              <GenerateButton onClick={fetchRandomGame} loading={loading} hasGame={true} discoverLabel={t(lang, "rollDice")} loadingLabel={t(lang, "discovering")} newGameLabel={t(lang, "newGame")} />
            </div>
            <GameSkeleton />
          </section>
        )}

        {/* ---- Game loaded ---- */}
        {gameData && !loading && !error && (
          <section className="flex flex-col gap-6">
            {/* Controls row */}
            <div className="flex flex-col items-center gap-3">
              <GenerateButton onClick={fetchRandomGame} loading={loading} hasGame={true} discoverLabel={t(lang, "rollDice")} loadingLabel={t(lang, "discovering")} newGameLabel={t(lang, "newGame")} />
              
              {/* Filter Panel */}
              <div className="w-full max-w-md">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                  lang={lang}
                />
              </div>
              
              <div className="flex w-full max-w-sm items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={t(lang, "searchPlaceholder")}
                  value={searchId}
                  onChange={(e) => { setSearchId(e.target.value); setSearchError(false) }}
                  onKeyDown={(e) => { if (e.key === "Enter") fetchGameById(searchId) }}
                  className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Button size="sm" onClick={() => fetchGameById(searchId)} disabled={loading || !searchId.trim()} className="gap-1.5">
                  <Search className="size-3.5" />
                  {t(lang, "searchButton")}
                </Button>
              </div>
              {searchError && <p className="text-xs text-destructive">{t(lang, "searchError")}</p>}
            </div>

            <GameCard data={gameData} lang={lang} />
            <SocialShare data={gameData} lang={lang} />
          </section>
        )}
      </main>

      {/* ---- Footer ---- */}
      <footer className="border-t py-6 text-center">
        <p className="text-xs text-muted-foreground">
          {lang === "tr"
            ? "Steam Game Roulette - Valve Corporation ile bağlantısı yoktur."
            : "Steam Game Roulette - Not affiliated with Valve Corporation."}
        </p>
      </footer>
    </div>
  )
}
