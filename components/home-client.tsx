"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import {
  Sun,
  Moon,
  Copy,
  Check,
  Download,
  Twitter,
  Instagram,
  Image as ImageIcon,
  Dices,
  Gamepad2,
  Share2,
  Sparkles,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GameCard } from "@/components/game-card"
import { GameSkeleton } from "@/components/game-skeleton"
import { GenerateButton } from "@/components/generate-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { GameData, Language } from "@/lib/types"
import { t } from "@/lib/i18n"
import { toPng } from "html-to-image"

/* ------------------------------------------------------------------ */
/*  Inline Social Share Cards                                          */
/* ------------------------------------------------------------------ */
function SocialShareSection({
  data,
  lang,
}: {
  data: GameData
  lang: Language
}) {
  const { game, reviews } = data
  const twitterRef = useRef<HTMLDivElement>(null)
  const instaRef = useRef<HTMLDivElement>(null)
  const generalRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const plainDesc =
    game.short_description?.replace(/<[^>]*>/g, "").slice(0, 120) || ""
  const genresStr =
    game.genres
      ?.slice(0, 3)
      .map((g) => g.description)
      .join(" / ") || ""
  const priceText = game.is_free
    ? lang === "tr"
      ? "Ucretsiz"
      : "Free"
    : game.price_overview?.final_formatted ||
      (lang === "tr" ? "Fiyat bilgisi yok" : "N/A")
  const positivePercent =
    reviews.total_positive + reviews.total_negative > 0
      ? Math.round(
          (reviews.total_positive /
            (reviews.total_positive + reviews.total_negative)) *
            100
        )
      : 0

  const storeLink = `https://store.steampowered.com/app/${game.steam_appid}`

  const socialText = [
    game.name,
    "",
    plainDesc,
    "",
    genresStr ? `Genres: ${genresStr}` : "",
    reviews.review_score_desc
      ? `Reviews: ${reviews.review_score_desc} (${positivePercent}% positive)`
      : "",
    game.metacritic ? `Metacritic: ${game.metacritic.score}/100` : "",
    `Price: ${priceText}`,
    "",
    storeLink,
    "",
    "#Steam #Gaming #SteamGameRoulette",
  ]
    .filter(Boolean)
    .join("\n")

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(socialText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async (
    ref: React.RefObject<HTMLDivElement | null>,
    name: string
  ) => {
    if (!ref.current) return
    setDownloading(name)
    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
      })
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `${game.name.replace(/[^a-zA-Z0-9]/g, "_")}_${name}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch {
      // silent
    } finally {
      setDownloading(null)
    }
  }

  const cardBaseStyle: React.CSSProperties = {
    background: "linear-gradient(145deg, #1b2838 0%, #0e1621 100%)",
    color: "#c7d5e0",
    fontFamily: "system-ui, -apple-system, sans-serif",
    overflow: "hidden",
  }

  /* Score box helper */
  const ScoreBox = ({
    value,
    label,
    size = "sm",
  }: {
    value: number | string
    label: string
    size?: "sm" | "lg"
  }) => {
    const num = typeof value === "number" ? value : parseInt(value)
    const bg =
      num >= 70 ? "#66c0f4" : num >= 40 ? "#b9a44c" : "#c35b2d"
    const dims =
      size === "lg"
        ? {
            fontSize: "clamp(20px, 5vw, 36px)",
            wh: "clamp(48px, 10vw, 72px)",
            labelSize: "clamp(8px, 2vw, 12px)",
            radius: 10,
          }
        : {
            fontSize: "clamp(14px, 2vw, 22px)",
            wh: "clamp(32px, 4vw, 48px)",
            labelSize: "clamp(7px, 0.9vw, 10px)",
            radius: 6,
          }
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            background: bg,
            color: "#fff",
            fontWeight: 700,
            fontSize: dims.fontSize,
            borderRadius: dims.radius,
            width: dims.wh,
            height: dims.wh,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {typeof value === "number" ? value : `${value}%`}
        </div>
        <div style={{ fontSize: dims.labelSize, color: "#8f98a0", marginTop: 4 }}>
          {label}
        </div>
      </div>
    )
  }

  /* Genre pills helper */
  const GenrePills = ({ max = 3, size = "sm" }: { max?: number; size?: "sm" | "lg" }) => (
    <div style={{ display: "flex", gap: size === "lg" ? 8 : 6, flexWrap: "wrap" }}>
      {game.genres?.slice(0, max).map((g) => (
        <span
          key={g.id}
          style={{
            background: "rgba(102,192,244,0.15)",
            color: "#66c0f4",
            fontSize: size === "lg" ? "clamp(9px, 2vw, 14px)" : "clamp(7px, 0.9vw, 11px)",
            padding: size === "lg" ? "4px 12px" : "2px 8px",
            borderRadius: size === "lg" ? 6 : 4,
          }}
        >
          {g.description}
        </span>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground">
        {t(lang, "socialShare")}
      </h3>

      {/* Copyable Social Text */}
      <div className="flex flex-col gap-2">
        <pre className="max-h-36 overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-secondary p-3 text-xs text-secondary-foreground font-mono leading-relaxed">
          {socialText}
        </pre>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyText}
          className="w-fit gap-1.5"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied
            ? lang === "tr" ? "Kopyalandi!" : "Copied!"
            : lang === "tr" ? "Metni Kopyala" : "Copy Text"}
        </Button>
      </div>

      <Tabs defaultValue="twitter" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="twitter" className="gap-1.5 flex-1">
            <Twitter className="size-3.5" />
            {t(lang, "shareTwitter")}
          </TabsTrigger>
          <TabsTrigger value="instagram" className="gap-1.5 flex-1">
            <Instagram className="size-3.5" />
            {t(lang, "shareInstagram")}
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-1.5 flex-1">
            <ImageIcon className="size-3.5" />
            {t(lang, "shareGeneral")}
          </TabsTrigger>
        </TabsList>

        {/* ---- Twitter Card 16:9 ---- */}
        <TabsContent value="twitter" className="flex flex-col gap-3 mt-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <div
              ref={twitterRef}
              style={{ ...cardBaseStyle, width: "100%", aspectRatio: "1200/675", position: "relative" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={game.header_image} alt="" crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25, filter: "blur(8px)" }} />
              <div style={{ position: "relative", display: "flex", height: "100%", padding: "5%" }}>
                <div style={{ width: "45%", height: "100%", borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={game.header_image} alt={game.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "5%", gap: "4%" }}>
                  <div style={{ fontSize: "clamp(14px, 2vw, 24px)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{game.name}</div>
                  <div style={{ fontSize: "clamp(9px, 1.2vw, 13px)", color: "#8f98a0", lineHeight: 1.4 }}>{plainDesc}</div>
                  <div style={{ display: "flex", gap: "6%", flexWrap: "wrap" }}>
                    {game.metacritic && <ScoreBox value={game.metacritic.score} label="Metacritic" />}
                    {positivePercent > 0 && <ScoreBox value={`${positivePercent}`} label="Steam" />}
                  </div>
                  <GenrePills />
                  <div style={{ fontSize: "clamp(12px, 1.6vw, 20px)", fontWeight: 700, color: "#66c0f4" }}>{priceText}</div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "3%", right: "4%", fontSize: "clamp(7px, 0.8vw, 10px)", color: "#4a5568" }}>steamgameroulette.app</div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleDownload(twitterRef, "twitter")} disabled={downloading === "twitter"} className="w-fit gap-1.5">
            <Download className="size-3.5" />
            {downloading === "twitter" ? "..." : `${t(lang, "download")} Twitter/X`}
          </Button>
        </TabsContent>

        {/* ---- Instagram Story 9:16 ---- */}
        <TabsContent value="instagram" className="flex flex-col gap-3 mt-3">
          <div className="overflow-hidden rounded-lg border border-border" style={{ maxHeight: 500, overflowY: "auto" }}>
            <div
              ref={instaRef}
              style={{ ...cardBaseStyle, width: "100%", aspectRatio: "1080/1920", position: "relative" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={game.header_image} alt="" crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2, filter: "blur(12px)" }} />
              <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", padding: "8% 6%" }}>
                <div style={{ width: "100%", aspectRatio: "460/215", borderRadius: 16, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={game.header_image} alt={game.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ marginTop: "6%", display: "flex", flexDirection: "column", gap: "3%" }}>
                  <div style={{ fontSize: "clamp(16px, 4vw, 32px)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{game.name}</div>
                  <div style={{ fontSize: "clamp(10px, 2.5vw, 16px)", color: "#8f98a0", lineHeight: 1.5 }}>{plainDesc}</div>
                  <GenrePills max={4} size="lg" />
                  <div style={{ display: "flex", gap: "8%", marginTop: "4%", justifyContent: "center" }}>
                    {game.metacritic && <ScoreBox value={game.metacritic.score} label="Metacritic" size="lg" />}
                    {positivePercent > 0 && <ScoreBox value={`${positivePercent}`} label="Steam" size="lg" />}
                  </div>
                  <div style={{ fontSize: "clamp(18px, 5vw, 36px)", fontWeight: 700, color: "#66c0f4", textAlign: "center", marginTop: "4%" }}>{priceText}</div>
                </div>
                <div style={{ marginTop: "auto", textAlign: "center", fontSize: "clamp(8px, 2vw, 12px)", color: "#4a5568" }}>steamgameroulette.app</div>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleDownload(instaRef, "instagram")} disabled={downloading === "instagram"} className="w-fit gap-1.5">
            <Download className="size-3.5" />
            {downloading === "instagram" ? "..." : `${t(lang, "download")} Instagram`}
          </Button>
        </TabsContent>

        {/* ---- General Card 4:3 ---- */}
        <TabsContent value="general" className="flex flex-col gap-3 mt-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <div
              ref={generalRef}
              style={{ ...cardBaseStyle, width: "100%", aspectRatio: "1200/900", position: "relative" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={game.header_image} alt="" crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2, filter: "blur(10px)" }} />
              <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", padding: "5%" }}>
                <div style={{ display: "flex", gap: "4%", flex: 1 }}>
                  <div style={{ width: "50%", borderRadius: 12, overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={game.header_image} alt={game.name} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "4%" }}>
                    <div style={{ fontSize: "clamp(14px, 2.5vw, 28px)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{game.name}</div>
                    <div style={{ fontSize: "clamp(9px, 1.3vw, 14px)", color: "#8f98a0", lineHeight: 1.5 }}>{plainDesc}</div>
                    <div style={{ display: "flex", gap: "6%", marginTop: "2%" }}>
                      {game.metacritic && <ScoreBox value={game.metacritic.score} label="Metacritic" />}
                      {positivePercent > 0 && <ScoreBox value={`${positivePercent}`} label="Steam" />}
                    </div>
                    <GenrePills max={4} />
                    <div style={{ fontSize: "clamp(14px, 2vw, 24px)", fontWeight: 700, color: "#66c0f4" }}>{priceText}</div>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: "3%", right: "4%", fontSize: "clamp(7px, 0.8vw, 10px)", color: "#4a5568" }}>steamgameroulette.app</div>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleDownload(generalRef, "general")} disabled={downloading === "general"} className="w-fit gap-1.5">
            <Download className="size-3.5" />
            {downloading === "general" ? "..." : `${t(lang, "download")} ${t(lang, "shareGeneral")}`}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Feature Card                                                       */
/* ------------------------------------------------------------------ */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  delay: number
}) {
  return (
    <div
      className="animate-fade-in-up flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-6 text-primary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Client Component                                              */
/* ------------------------------------------------------------------ */
export function HomeClient() {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [lang, setLang] = useState<Language>("tr")
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchId, setSearchId] = useState("")
  const [searchError, setSearchError] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchGame = useCallback(async () => {
    setLoading(true)
    setError(false)
    setSearchError(false)
    try {
      const res = await fetch("/api/steam/random")
      if (!res.ok) throw new Error("API error")
      const data = await res.json()
      setGameData(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchGameById = useCallback(async (id: string) => {
    if (!id.trim() || !/^\d+$/.test(id.trim())) {
      setSearchError(true)
      return
    }
    setLoading(true)
    setError(false)
    setSearchError(false)
    try {
      const res = await fetch(`/api/steam/lookup?id=${id.trim()}`)
      if (!res.ok) {
        setSearchError(true)
        setLoading(false)
        return
      }
      const data = await res.json()
      if (data.error) {
        setSearchError(true)
        setLoading(false)
        return
      }
      setGameData(data)
    } catch {
      setSearchError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-base font-bold text-foreground">
              {t(lang, "title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t(lang, "subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher
              lang={lang}
              onToggle={() => setLang((l) => (l === "tr" ? "en" : "tr"))}
            />
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

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        {!gameData && !loading && !error && (
          <div className="flex flex-col items-center gap-12 py-12 md:py-20">
            <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2">
              <div className="animate-pulse-glow size-64 rounded-full bg-primary/20 blur-[100px] md:size-96" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className="animate-fade-in-up flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
                <Sparkles className="size-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {lang === "tr" ? "100.000+ Steam oyunu" : "100,000+ Steam games"}
                </span>
              </div>

              <h2
                className="animate-fade-in-up text-4xl font-bold text-foreground md:text-5xl lg:text-6xl text-balance"
                style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
              >
                {t(lang, "title")}
              </h2>

              <p
                className="animate-fade-in-up max-w-lg text-base text-muted-foreground md:text-lg leading-relaxed text-pretty"
                style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
              >
                {t(lang, "heroDesc")}
              </p>

              <div
                className="animate-fade-in-up pt-4"
                style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
              >
                <GenerateButton
                  onClick={fetchGame}
                  loading={loading}
                  hasGame={false}
                  discoverLabel={t(lang, "rollDice")}
                  loadingLabel={t(lang, "discovering")}
                  newGameLabel={t(lang, "newGame")}
                />
              </div>

              {/* Search by ID */}
              <div
                className="animate-fade-in-up flex w-full max-w-sm flex-col items-center gap-2"
                style={{ animationDelay: "350ms", animationFillMode: "backwards" }}
              >
                <span className="text-xs text-muted-foreground">{t(lang, "orText")}</span>
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={t(lang, "searchPlaceholder")}
                    value={searchId}
                    onChange={(e) => {
                      setSearchId(e.target.value)
                      setSearchError(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") fetchGameById(searchId)
                    }}
                    className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    onClick={() => fetchGameById(searchId)}
                    disabled={loading || !searchId.trim()}
                    className="gap-1.5"
                  >
                    <Search className="size-4" />
                    {t(lang, "searchButton")}
                  </Button>
                </div>
                {searchError && (
                  <p className="text-xs text-destructive">{t(lang, "searchError")}</p>
                )}
              </div>
            </div>

            <div className="relative z-10 grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
              <FeatureCard icon={Dices} title={t(lang, "feature1Title")} desc={t(lang, "feature1Desc")} delay={400} />
              <FeatureCard icon={Gamepad2} title={t(lang, "feature2Title")} desc={t(lang, "feature2Desc")} delay={500} />
              <FeatureCard icon={Share2} title={t(lang, "feature3Title")} desc={t(lang, "feature3Desc")} delay={600} />
            </div>

            <div
              className="animate-fade-in-up relative z-10 flex items-center gap-8 text-center md:gap-12"
              style={{ animationDelay: "700ms", animationFillMode: "backwards" }}
            >
              <div>
                <div className="text-2xl font-bold text-foreground md:text-3xl">100K+</div>
                <div className="text-xs text-muted-foreground">{lang === "tr" ? "Oyun" : "Games"}</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground md:text-3xl">{lang === "tr" ? "Anlik" : "Instant"}</div>
                <div className="text-xs text-muted-foreground">{lang === "tr" ? "Kesfet" : "Discovery"}</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground md:text-3xl">3+</div>
                <div className="text-xs text-muted-foreground">{lang === "tr" ? "Paylasim Formati" : "Share Formats"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && <GameSkeleton />}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <h3 className="text-lg font-semibold text-foreground">{t(lang, "errorTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t(lang, "errorDesc")}</p>
            <Button onClick={fetchGame}>{t(lang, "tryAgain")}</Button>
          </div>
        )}

        {/* Game Card + Social Share */}
        {gameData && !loading && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <GenerateButton
                onClick={fetchGame}
                loading={loading}
                hasGame={true}
                discoverLabel={t(lang, "rollDice")}
                loadingLabel={t(lang, "discovering")}
                newGameLabel={t(lang, "newGame")}
              />
              <div className="flex w-full max-w-sm items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={t(lang, "searchPlaceholder")}
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value)
                    setSearchError(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchGameById(searchId)
                  }}
                  className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Button
                  size="sm"
                  onClick={() => fetchGameById(searchId)}
                  disabled={loading || !searchId.trim()}
                  className="gap-1.5"
                >
                  <Search className="size-3.5" />
                  {t(lang, "searchButton")}
                </Button>
              </div>
              {searchError && (
                <p className="text-xs text-destructive">{t(lang, "searchError")}</p>
              )}
            </div>
            <GameCard data={gameData} lang={lang} />
            <SocialShareSection data={gameData} lang={lang} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        Steam Game Roulette &middot; Powered by Steam Store API
      </footer>
    </div>
  )
}
