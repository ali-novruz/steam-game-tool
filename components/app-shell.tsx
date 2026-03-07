"use client"

import { useState, useCallback, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, AlertCircle, Search, Dices, Gamepad2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenerateButton } from "@/components/generate-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GameCard } from "@/components/game-card"
import { GameSkeleton } from "@/components/game-skeleton"
import { SocialShare } from "@/components/social-share"
import type { GameData, Language } from "@/lib/types"
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
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  /* Random game */
  const fetchRandomGame = useCallback(async () => {
    setLoading(true)
    setError(false)
    setSearchError(false)
    try {
      const res = await fetch("/api/steam/random")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setGameData(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

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
        {/* ---- Hero (no game loaded, not loading, no error) ---- */}
        {!gameData && !loading && !error && (
          <section className="flex flex-col items-center gap-10 py-12 md:py-20">
            {/* Glow orb + icon */}
            <div className="relative animate-fade-in-up">
              <div className="absolute -inset-8 rounded-full bg-primary/20 blur-2xl animate-pulse-ring" />
              <div className="relative animate-float">
                <SteamLogo className="size-20 text-primary md:size-24 drop-shadow-[0_0_24px_oklch(0.72_0.12_220/0.5)]" />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-3 text-center animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <h2 className="text-3xl font-extrabold text-foreground md:text-5xl text-balance leading-tight">
                {t(lang, "title")}
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

        {/* ---- Error ---- */}
        {error && !loading && (
          <section className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{t(lang, "errorTitle")}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{t(lang, "errorDesc")}</p>
            <Button onClick={fetchRandomGame} variant="outline">{t(lang, "tryAgain")}</Button>
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
