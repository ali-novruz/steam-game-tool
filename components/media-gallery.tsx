"use client"

import { useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SteamGame } from "@/lib/types"

interface MediaGalleryProps {
  game: SteamGame
  screenshotsLabel: string
  trailerLabel: string
}

export function MediaGallery({
  game,
  screenshotsLabel,
  trailerLabel,
}: MediaGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
  const [activeTrailer, setActiveTrailer] = useState<string | null>(null)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const hasScreenshots = game.screenshots && game.screenshots.length > 0
  const hasMovies = game.movies && game.movies.length > 0

  if (!hasScreenshots && !hasMovies) return null

  return (
    <div className="flex flex-col gap-4">
      {hasMovies && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {trailerLabel}
          </h3>
          {activeTrailer ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
              <video
                src={activeTrailer}
                controls
                autoPlay
                className="size-full object-contain"
              >
                <track kind="captions" />
              </video>
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {game.movies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() =>
                    setActiveTrailer(movie.mp4?.max || movie.mp4?.["480"] || "")
                  }
                  className="group relative aspect-video w-48 shrink-0 overflow-hidden rounded-lg bg-secondary"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={movie.thumbnail}
                    alt={movie.name}
                    className="size-full object-cover transition-transform group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40 transition-colors group-hover:bg-background/20">
                    <Play className="size-8 text-primary-foreground drop-shadow-lg" fill="currentColor" />
                  </div>
                </button>
              ))}
            </div>
          )}
          {activeTrailer && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTrailer(null)}
              className="w-fit"
            >
              Close
            </Button>
          )}
        </div>
      )}

      {hasScreenshots && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {screenshotsLabel}
          </h3>
          <div className="relative">
            <div ref={emblaRef} className="overflow-hidden rounded-lg">
              <div className="flex gap-3">
                {game.screenshots.map((ss) => (
                  <div
                    key={ss.id}
                    className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-secondary md:w-[calc(50%-0.375rem)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ss.path_full}
                      alt={`Screenshot ${ss.id}`}
                      className="size-full object-cover"
                      loading="lazy"
                      crossOrigin="anonymous"
                    />
                  </div>
                ))}
              </div>
            </div>
            {game.screenshots.length > 2 && (
              <>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className={cn(
                    "absolute top-1/2 left-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 shadow-lg"
                  )}
                  onClick={scrollPrev}
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className={cn(
                    "absolute top-1/2 right-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 shadow-lg"
                  )}
                  onClick={scrollNext}
                  aria-label="Next screenshot"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
