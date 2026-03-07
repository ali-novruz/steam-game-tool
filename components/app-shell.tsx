"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, AlertCircle, Search, RotateCw, Gamepad2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GameCard } from "@/components/game-card"
import { GameSkeleton } from "@/components/game-skeleton"
import { SocialShare } from "@/components/social-share"
import type { GameData, Language } from "@/lib/types"
import { t } from "@/lib/i18n"

/* ------------------------------------------------------------------ */
/*  Spinning Wheel with Steam Logo                                     */
/* ------------------------------------------------------------------ */
function SpinnerLogo({ className, size = "md", spinning = false }: { className?: string; size?: "sm" | "md" | "lg"; spinning?: boolean }) {
  const sizes = {
    sm: "size-8",
    md: "size-12",
    lg: "size-32 md:size-40",
  }

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <svg 
        viewBox="0 0 100 100" 
        className={`size-full transition-transform ${spinning ? "animate-spin-wheel" : ""}`}
        style={{ animationDuration: spinning ? "2.5s" : "0s" }}
        aria-hidden="true"
      >
        {/* Gradients and defs */}
        <defs>
          <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        
        {/* Spinner dots at 12 positions */}
        <circle cx="50" cy="8" r="2.5" fill="#0ea5e9" opacity="1" />
        <circle cx="75.9" cy="12.5" r="2.5" fill="#0ea5e9" opacity="0.9" />
        <circle cx="91.4" cy="25.9" r="2.5" fill="#0ea5e9" opacity="0.8" />
        <circle cx="97.5" cy="45" r="2.5" fill="#0ea5e9" opacity="0.7" />
        <circle cx="91.4" cy="64.1" r="2.5" fill="#0ea5e9" opacity="0.6" />
        <circle cx="75.9" cy="77.5" r="2.5" fill="#0ea5e9" opacity="0.5" />
        <circle cx="50" cy="91.5" r="2.5" fill="#0ea5e9" opacity="0.5" />
        <circle cx="24.1" cy="87.5" r="2.5" fill="#0ea5e9" opacity="0.6" />
        <circle cx="8.6" cy="74.1" r="2.5" fill="#0ea5e9" opacity="0.7" />
        <circle cx="2.5" cy="55" r="2.5" fill="#0ea5e9" opacity="0.8" />
        <circle cx="8.6" cy="35.9" r="2.5" fill="#0ea5e9" opacity="0.9" />
        <circle cx="24.1" cy="22.5" r="2.5" fill="#0ea5e9" opacity="1" />
        
        {/* Outer ring */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
        
        {/* Steam logo center - simplified circle + pipes */}
        <g>
          {/* Center circle */}
          <circle cx="50" cy="50" r="14" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          {/* Steam dot */}
          <circle cx="50" cy="42" r="2.5" fill="#0ea5e9" />
          {/* Pipe 1 */}
          <path d="M48 56 Q45 62 42 65" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
          {/* Pipe 2 */}
          <path d="M52 56 Q55 62 58 65" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
        </g>
        
        {/* Inner glow */}
        <circle cx="50" cy="50" r="18" fill="none" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.2" />
      </svg>
      
      {/* Pointer at top */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10">
        <svg viewBox="0 0 20 24" className="size-4 md:size-6 text-sky-500 drop-shadow-lg">
          <polygon points="10,24 0,8 10,0 20,8" fill="currentColor" />
        </svg>
      </div>
    </div>
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
/*  Spin Button with wheel animation                                   */
/* ------------------------------------------------------------------ */
function SpinButton({ 
  onClick, 
  loading, 
  hasGame, 
  lang 
}: { 
  onClick: () => void
  loading: boolean
  hasGame: boolean
  lang: Language 
}) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      disabled={loading}
      className="gap-2 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
    >
      <RotateCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
      {loading 
        ? t(lang, "discovering") 
        : hasGame 
          ? t(lang, "newGame") 
          : t(lang, "spinWheel")
      }
    </Button>
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
  const [spinning, setSpinning] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  /* Random game with spin animation */
  const fetchRandomGame = useCallback(async () => {
    setSpinning(true)
    setLoading(true)
    setError(false)
    setSearchError(false)
    
    // Start fetch but wait for spin animation
    const fetchPromise = fetch("/api/steam/random")
    
    // Wait at least 2.5 seconds for spin animation
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    try {
      const res = await fetchPromise
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setGameData(data)
    } catch {
      setError(true)
    } finally {
      setSpinning(false)
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
            <SpinnerLogo size="sm" />
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
            {/* Spinning Wheel */}
            <div className="relative animate-fade-in-up">
              <div className="absolute -inset-12 rounded-full bg-primary/20 blur-3xl animate-pulse-ring" />
              <div className="relative drop-shadow-[0_0_32px_rgba(0,0,0,0.3)]">
                <SpinnerLogo size="lg" spinning={spinning} />
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
              <SpinButton
                onClick={fetchRandomGame}
                loading={loading}
                hasGame={false}
                lang={lang}
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
              <FeatureCard icon={<RotateCw className="size-5" />} title={t(lang, "spinWheel")} desc={lang === "tr" ? "Tek tıkla rastgele oyun" : "One click, random game"} />
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

        {/* ---- Loading with spinning wheel ---- */}
        {loading && (
          <section className="flex flex-col items-center gap-8 py-12">
            <div className="relative">
              <div className="absolute -inset-12 rounded-full bg-primary/20 blur-3xl animate-pulse-ring" />
              <SpinnerLogo size="lg" spinning={spinning} />
            </div>
            <p className="text-lg font-medium text-muted-foreground animate-pulse">
              {t(lang, "discovering")}
            </p>
          </section>
        )}

        {/* ---- Game loaded ---- */}
        {gameData && !loading && !error && (
          <section className="flex flex-col gap-6">
            {/* Controls row */}
            <div className="flex flex-col items-center gap-3">
              <SpinButton onClick={fetchRandomGame} loading={loading} hasGame={true} lang={lang} />
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
