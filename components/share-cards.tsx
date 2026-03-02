"use client"

import { useRef, useCallback, useState } from "react"
import { toPng } from "html-to-image"
import { Download, Twitter, Instagram, Image as ImageIcon, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GameData, Language } from "@/lib/types"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface ShareCardsProps {
  data: GameData
  lang: Language
}

export function ShareCards({ data, lang }: ShareCardsProps) {
  const twitterRef = useRef<HTMLDivElement>(null)
  const instaRef = useRef<HTMLDivElement>(null)
  const generalRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { game, reviews } = data

  const handleDownload = useCallback(
    async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
      if (!ref.current) return
      setDownloading(filename)
      try {
        const dataUrl = await toPng(ref.current, {
          cacheBust: true,
          pixelRatio: 2,
          fetchRequestInit: { mode: "cors" },
        })
        const link = document.createElement("a")
        link.download = `${filename}.png`
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error("Failed to generate image:", err)
      } finally {
        setDownloading(null)
      }
    },
    []
  )

  const plainDesc =
    game.short_description.replace(/<[^>]*>/g, "").slice(0, 120) +
    (game.short_description.length > 120 ? "..." : "")

  const positivePercent =
    reviews.total_positive + reviews.total_negative > 0
      ? Math.round(
          (reviews.total_positive /
            (reviews.total_positive + reviews.total_negative)) *
            100
        )
      : 0

  const priceText = game.is_free
    ? t(lang, "free")
    : game.price_overview?.final_formatted ?? t(lang, "noPrice")

  const discountBadge =
    !game.is_free && game.price_overview && game.price_overview.discount_percent > 0
      ? `-${game.price_overview.discount_percent}%`
      : null

  const storeLink = `https://store.steampowered.com/app/${game.steam_appid}`
  const genresStr = game.genres?.slice(0, 3).map((g) => g.description).join(" / ") || ""

  const socialText = [
    game.name,
    "",
    plainDesc || "",
    "",
    genresStr ? `Genres: ${genresStr}` : "",
    reviews.review_score_desc ? `Reviews: ${reviews.review_score_desc} (${positivePercent}% positive)` : "",
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
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied
            ? lang === "tr"
              ? "Kopyalandi!"
              : "Copied!"
            : lang === "tr"
              ? "Metni Kopyala"
              : "Copy Text"}
        </Button>
      </div>

      <Tabs defaultValue="twitter" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="twitter" className="gap-1.5 text-xs">
            <Twitter className="size-3.5" />
            <span className="hidden sm:inline">{t(lang, "shareTwitter")}</span>
            <span className="sm:hidden">X</span>
          </TabsTrigger>
          <TabsTrigger value="instagram" className="gap-1.5 text-xs">
            <Instagram className="size-3.5" />
            <span className="hidden sm:inline">{t(lang, "shareInstagram")}</span>
            <span className="sm:hidden">IG</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-1.5 text-xs">
            <ImageIcon className="size-3.5" />
            <span className="hidden sm:inline">{t(lang, "shareGeneral")}</span>
            <span className="sm:hidden">{t(lang, "share")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Twitter/X Card - 1200x675 aspect ratio */}
        <TabsContent value="twitter" className="flex flex-col gap-3 mt-4">
          <div className="overflow-x-auto pb-2">
            <div
              ref={twitterRef}
              className="relative w-[600px] shrink-0"
              style={{ aspectRatio: "1200/675" }}
            >
              <div className="absolute inset-0 bg-[#0e1621] rounded-xl overflow-hidden">
                <img
                  src={game.header_image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0e1621] via-[#0e1621]/80 to-transparent" />

                <div className="relative flex h-full p-6 gap-5">
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <SteamLogo className="size-5 text-[#66c0f4]" />
                        <span className="text-[#66c0f4] text-xs font-medium">
                          Steam Game Roulette
                        </span>
                      </div>
                      <h3 className="text-white text-xl font-bold leading-tight line-clamp-2">
                        {game.name}
                      </h3>
                      <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
                        {plainDesc}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-1">
                        {game.genres?.slice(0, 3).map((g) => (
                          <span
                            key={g.id}
                            className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70"
                          >
                            {g.description}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        {game.metacritic && (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "flex size-7 items-center justify-center rounded text-xs font-bold text-white",
                                game.metacritic.score >= 75
                                  ? "bg-[#66cc33]"
                                  : game.metacritic.score >= 50
                                    ? "bg-[#ffcc33]"
                                    : "bg-[#ff0000]"
                              )}
                            >
                              {game.metacritic.score}
                            </span>
                            <span className="text-[10px] text-white/50">
                              Metacritic
                            </span>
                          </div>
                        )}
                        {reviews.total_reviews > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[#66c0f4]">
                              {positivePercent}%
                            </span>
                            <span className="text-[10px] text-white/50">
                              {t(lang, "positive")}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          {discountBadge && (
                            <span className="rounded bg-[#66cc33] px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {discountBadge}
                            </span>
                          )}
                          <span className="text-sm font-bold text-white">
                            {priceText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex w-[200px] shrink-0 items-center">
                    <img
                      src={
                        game.screenshots?.[0]?.path_thumbnail ??
                        game.header_image
                      }
                      alt=""
                      className="w-full rounded-lg object-cover shadow-xl"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-fit gap-1.5"
            disabled={downloading === "twitter"}
            onClick={() => handleDownload(twitterRef, `${game.name}-twitter`)}
          >
            <Download className="size-3.5" />
            {downloading === "twitter" ? "..." : t(lang, "download")}
          </Button>
        </TabsContent>

        {/* Instagram Story - 1080x1920 aspect ratio */}
        <TabsContent value="instagram" className="flex flex-col gap-3 mt-4">
          <div className="overflow-x-auto pb-2 flex justify-center">
            <div
              ref={instaRef}
              className="relative shrink-0"
              style={{ width: "320px", aspectRatio: "1080/1920" }}
            >
              <div className="absolute inset-0 bg-[#0e1621] rounded-2xl overflow-hidden">
                <img
                  src={
                    game.screenshots?.[0]?.path_full ?? game.header_image
                  }
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0e1621]/90 via-transparent to-[#0e1621]/95" />

                <div className="relative flex flex-col h-full p-5 justify-between">
                  <div className="flex items-center gap-2">
                    <SteamLogo className="size-5 text-[#66c0f4]" />
                    <span className="text-[#66c0f4] text-xs font-medium">
                      Steam Game Roulette
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-4 text-center">
                    <img
                      src={game.header_image}
                      alt=""
                      className="w-full rounded-lg shadow-2xl"
                      crossOrigin="anonymous"
                    />
                    <h3 className="text-white text-lg font-bold leading-tight">
                      {game.name}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-1">
                      {game.genres?.slice(0, 4).map((g) => (
                        <span
                          key={g.id}
                          className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-white/70"
                        >
                          {g.description}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed line-clamp-3 px-2">
                      {plainDesc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <StatBlock
                        value={
                          game.metacritic?.score?.toString() ?? "--"
                        }
                        label="Metacritic"
                      />
                      <StatBlock
                        value={
                          reviews.total_reviews > 0
                            ? `${positivePercent}%`
                            : "--"
                        }
                        label={t(lang, "positive")}
                      />
                      <StatBlock value={priceText} label={t(lang, "price")} />
                    </div>
                    {discountBadge && (
                      <div className="flex justify-center">
                        <span className="rounded-full bg-[#66cc33] px-3 py-1 text-xs font-bold text-white">
                          {discountBadge} {t(lang, "discount")}
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <span className="text-[10px] text-white/30">
                        {"store.steampowered.com/app/"}{game.steam_appid}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-1.5"
              disabled={downloading === "instagram"}
              onClick={() =>
                handleDownload(instaRef, `${game.name}-instagram`)
              }
            >
              <Download className="size-3.5" />
              {downloading === "instagram" ? "..." : t(lang, "download")}
            </Button>
          </div>
        </TabsContent>

        {/* General Card - 1200x900 */}
        <TabsContent value="general" className="flex flex-col gap-3 mt-4">
          <div className="overflow-x-auto pb-2">
            <div
              ref={generalRef}
              className="relative w-[600px] shrink-0"
              style={{ aspectRatio: "1200/900" }}
            >
              <div className="absolute inset-0 bg-[#0e1621] rounded-xl overflow-hidden">
                <img
                  src={game.header_image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0e1621]/60 to-[#0e1621]" />

                <div className="relative flex flex-col h-full p-6 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SteamLogo className="size-5 text-[#66c0f4]" />
                      <span className="text-[#66c0f4] text-xs font-medium">
                        Steam Game Roulette
                      </span>
                    </div>
                    {discountBadge && (
                      <span className="rounded bg-[#66cc33] px-2 py-0.5 text-xs font-bold text-white">
                        {discountBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-5 flex-1 min-h-0">
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                      <h3 className="text-white text-2xl font-bold leading-tight line-clamp-2">
                        {game.name}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {game.genres?.slice(0, 4).map((g) => (
                          <span
                            key={g.id}
                            className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70"
                          >
                            {g.description}
                          </span>
                        ))}
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-4 flex-1">
                        {plainDesc}
                      </p>

                      <div className="flex flex-col gap-1.5 text-xs">
                        {game.developers?.length > 0 && (
                          <div className="flex gap-2">
                            <span className="text-white/40 min-w-[70px]">
                              {t(lang, "developer")}
                            </span>
                            <span className="text-white/70">
                              {game.developers.join(", ")}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <span className="text-white/40 min-w-[70px]">
                            {t(lang, "releaseDate")}
                          </span>
                          <span className="text-white/70">
                            {game.release_date.coming_soon
                              ? t(lang, "comingSoon")
                              : game.release_date.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-[220px] shrink-0 flex flex-col gap-3">
                      <img
                        src={game.header_image}
                        alt=""
                        className="w-full rounded-lg shadow-xl"
                        crossOrigin="anonymous"
                      />
                      {game.screenshots?.[0] && (
                        <img
                          src={game.screenshots[0].path_thumbnail}
                          alt=""
                          className="w-full rounded-lg shadow-xl"
                          crossOrigin="anonymous"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                    {game.metacritic && (
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded text-sm font-bold text-white",
                            game.metacritic.score >= 75
                              ? "bg-[#66cc33]"
                              : game.metacritic.score >= 50
                                ? "bg-[#ffcc33]"
                                : "bg-[#ff0000]"
                          )}
                        >
                          {game.metacritic.score}
                        </span>
                        <span className="text-[10px] text-white/50">
                          Metacritic
                        </span>
                      </div>
                    )}
                    {reviews.total_reviews > 0 && (
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-[#66c0f4]">
                          {positivePercent}% {t(lang, "positive")}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {reviews.total_reviews.toLocaleString()} reviews
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-white">
                        {priceText}
                      </span>
                      <span className="text-[10px] text-white/40">
                        store.steampowered.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-fit gap-1.5"
            disabled={downloading === "general"}
            onClick={() =>
              handleDownload(generalRef, `${game.name}-share`)
            }
          >
            <Download className="size-3.5" />
            {downloading === "general" ? "..." : t(lang, "download")}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SteamLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12.004-5.373 12.004-12S18.606 0 11.979 0" />
    </svg>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-white/5 px-2 py-2">
      <span className="text-sm font-bold text-white">{value}</span>
      <span className="text-[10px] text-white/40">{label}</span>
    </div>
  )
}
