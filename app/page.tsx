"use client"
// v2 - social-share + video proxy
import { useState, useCallback, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenerateButton } from "@/components/generate-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GameCard } from "@/components/game-card"
import { GameSkeleton } from "@/components/game-skeleton"
import { SocialShare } from "@/components/social-share"
import type { GameData, Language } from "@/lib/types"
import { t } from "@/lib/i18n"

export default function Home() {
  const [lang, setLang] = useState<Language>("tr")
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchRandomGame = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch("/api/steam/random")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setGameData(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "tr" ? "en" : "tr"))
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="size-6 text-primary"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12.004-5.373 12.004-12S18.606 0 11.979 0" />
            </svg>
            <h1 className="text-sm font-bold md:text-base text-foreground">
              {t(lang, "title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} onToggle={toggleLang} />
            {mounted ? (
              <Button
                variant="outline"
                size="icon-sm"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
            ) : (
              <div className="size-8" />
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        {/* Hero / Generate Area */}
        {!gameData && !loading && !error && (
          <section className="flex flex-col items-center justify-center gap-6 py-20 md:py-32 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  className="size-16 text-primary md:size-20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12.004-5.373 12.004-12S18.606 0 11.979 0" />
                </svg>
                <div className="absolute -inset-4 animate-shimmer rounded-full" />
              </div>
              <h2 className="text-2xl font-bold text-foreground md:text-4xl text-balance">
                {t(lang, "title")}
              </h2>
              <p className="max-w-md text-muted-foreground text-pretty">
                {t(lang, "subtitle")}
              </p>
            </div>
            <GenerateButton
              onClick={fetchRandomGame}
              loading={loading}
              hasGame={false}
              discoverLabel={t(lang, "rollDice")}
              loadingLabel={t(lang, "discovering")}
              newGameLabel={t(lang, "newGame")}
            />
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {t(lang, "errorTitle")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t(lang, "errorDesc")}
            </p>
            <Button onClick={fetchRandomGame} variant="outline">
              {t(lang, "tryAgain")}
            </Button>
          </section>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <section className="flex flex-col gap-6">
            <div className="flex justify-center">
              <GenerateButton
                onClick={fetchRandomGame}
                loading={loading}
                hasGame={true}
                discoverLabel={t(lang, "rollDice")}
                loadingLabel={t(lang, "discovering")}
                newGameLabel={t(lang, "newGame")}
              />
            </div>
            <GameSkeleton />
          </section>
        )}

        {/* Game Data Display */}
        {gameData && !loading && !error && (
          <section className="flex flex-col gap-6">
            <div className="flex justify-center">
              <GenerateButton
                onClick={fetchRandomGame}
                loading={loading}
                hasGame={true}
                discoverLabel={t(lang, "rollDice")}
                loadingLabel={t(lang, "discovering")}
                newGameLabel={t(lang, "newGame")}
              />
            </div>
            <GameCard data={gameData} lang={lang} />
            <SocialShare data={gameData} lang={lang} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center">
        <p className="text-xs text-muted-foreground">
          {lang === "tr"
            ? "Steam Game Roulette - Valve Corporation ile baglantisi yoktur."
            : "Steam Game Roulette - Not affiliated with Valve Corporation."}
        </p>
      </footer>
    </div>
  )
}
