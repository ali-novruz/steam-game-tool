"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Monitor,
  Apple,
  ChevronDown,
  ChevronUp,
  Calendar,
  Code2,
  Building2,
  Tag,
} from "lucide-react"
import { ScoreBadge, ReviewBar } from "@/components/score-badge"
import { MediaGallery } from "@/components/media-gallery"
import type { GameData, Language } from "@/lib/types"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// Linux icon as inline SVG since lucide doesn't have one
function LinuxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.345 1.884 1.345.358 0 .699-.116.978-.34.7-.56.91-1.601.54-2.79-.185-.592-.466-1.217-.865-1.602h.002c-.028-.024-.058-.05-.086-.074-.16-.148-.23-.163-.114-.237.118-.079.356-.058.629-.085.218-.024.43-.066.573-.226.145-.16.17-.395.168-.539-.024-.398-.153-.648-.323-.862-.203-.246-.454-.427-.656-.63-.234-.23-.395-.455-.524-.748a3.101 3.101 0 01-.146-.91c0-.247.024-.457.068-.645a.948.948 0 00.024-.153 37.335 37.335 0 00-.093-4.095c-.066-.397-.165-.63-.277-.86a2.022 2.022 0 01-.173-.469c-.063-.28-.08-.598.017-.947.128-.455.036-.93-.196-1.378-.256-.491-.65-.97-1.007-1.316-.403-.39-.92-.832-1.108-1.337-.186-.501-.237-1.058-.11-1.783.088-.5.166-1.006-.031-1.512C14.389.555 13.546 0 12.504 0" />
    </svg>
  )
}

interface GameCardProps {
  data: GameData
  lang: Language
}

export function GameCard({ data, lang }: GameCardProps) {
  const { game, reviews } = data
  const [showFullDesc, setShowFullDesc] = useState(false)

  const priceDisplay = () => {
    if (game.is_free) return t(lang, "free")
    if (!game.price_overview) return t(lang, "noPrice")
    if (game.price_overview.discount_percent > 0) {
      return (
        <span className="flex items-center gap-2">
          <Badge className="bg-steam-positive text-foreground font-mono text-xs">
            -{game.price_overview.discount_percent}%
          </Badge>
          <span className="text-muted-foreground line-through text-sm">
            {game.price_overview.initial_formatted}
          </span>
          <span className="font-bold text-primary">
            {game.price_overview.final_formatted}
          </span>
        </span>
      )
    }
    return (
      <span className="font-bold">{game.price_overview.final_formatted}</span>
    )
  }

  // Strip HTML tags for plain text desc
  const plainDescription = game.short_description.replace(/<[^>]*>/g, "")
  const detailedPlain = game.detailed_description.replace(/<[^>]*>/g, "")

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm">
      {/* Hero Section */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.header_image}
          alt={game.name}
          className="w-full aspect-[460/215] object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h2 className="text-xl md:text-3xl font-bold text-foreground drop-shadow-lg text-balance leading-tight">
            {game.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {game.genres?.slice(0, 5).map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="bg-secondary/80 backdrop-blur-sm text-secondary-foreground text-[11px]"
              >
                {genre.description}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <CardContent className="flex flex-col gap-6 pt-4">
        {/* Price + Steam Link Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-lg">
            <Tag className="size-4 text-muted-foreground" />
            {priceDisplay()}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://store.steampowered.com/app/${game.steam_appid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1.5"
            >
              {t(lang, "viewOnSteam")}
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>

        {/* Short description */}
        {plainDescription && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plainDescription}
          </p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left Column: Details */}
          <div className="flex flex-col gap-3">
            {game.developers?.length > 0 && (
              <InfoRow
                icon={<Code2 className="size-3.5" />}
                label={t(lang, "developer")}
                value={game.developers.join(", ")}
              />
            )}
            {game.publishers?.length > 0 && (
              <InfoRow
                icon={<Building2 className="size-3.5" />}
                label={t(lang, "publisher")}
                value={game.publishers.join(", ")}
              />
            )}
            <InfoRow
              icon={<Calendar className="size-3.5" />}
              label={t(lang, "releaseDate")}
              value={
                game.release_date.coming_soon
                  ? t(lang, "comingSoon")
                  : game.release_date.date
              }
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {t(lang, "platforms")}:
              </span>
              <div className="flex gap-1.5">
                {game.platforms?.windows && (
                  <Monitor className="size-4 text-muted-foreground" title="Windows" />
                )}
                {game.platforms?.mac && (
                  <Apple className="size-4 text-muted-foreground" title="macOS" />
                )}
                {game.platforms?.linux && (
                  <LinuxIcon className="size-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Scores */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-6 justify-center md:justify-start">
              {game.metacritic && (
                <ScoreBadge
                  score={game.metacritic.score}
                  type="metacritic"
                  label={t(lang, "metacritic")}
                />
              )}
              {reviews.review_score > 0 && (
                <ScoreBadge
                  score={reviews.review_score}
                  type="steam"
                  label={t(lang, "userReviews")}
                />
              )}
            </div>
            <ReviewBar
              positive={reviews.total_positive}
              negative={reviews.total_negative}
              description={reviews.review_score_desc}
              positiveLabel={t(lang, "positive")}
              negativeLabel={t(lang, "negative")}
            />
          </div>
        </div>

        {/* Categories */}
        {game.categories?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              {t(lang, "categories")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {game.categories.slice(0, 12).map((cat) => (
                <Badge key={cat.id} variant="outline" className="text-[11px]">
                  {cat.description}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Media Gallery */}
        <MediaGallery
          game={game}
          screenshotsLabel={t(lang, "screenshots")}
          trailerLabel={t(lang, "trailer")}
          lang={lang}
        />

        {/* Detailed description */}
        {detailedPlain && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-fit"
            >
              {t(lang, "description")}
              {showFullDesc ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
            {showFullDesc && (
              <div
                className={cn(
                  "text-sm text-muted-foreground leading-relaxed max-h-64 overflow-y-auto pr-2",
                  "prose prose-sm dark:prose-invert max-w-none"
                )}
              >
                {detailedPlain}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
    </div>
  )
}
