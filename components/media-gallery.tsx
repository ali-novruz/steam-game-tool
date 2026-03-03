"use client"

import { useState, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  Download,
  Maximize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SteamGame } from "@/lib/types"

interface MediaGalleryProps {
  game: SteamGame
  screenshotsLabel: string
  trailerLabel: string
  lang: "tr" | "en"
}

function toHttps(url: string) {
  return url ? url.replace(/^http:\/\//, "https://") : ""
}



/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */
function Lightbox({
  src,
  alt,
  onClose,
  downloadLabel,
}: {
  src: string
  alt: string
  onClose: () => void
  downloadLabel: string
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const handleDownload = async () => {
    try {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`
      const res = await fetch(proxyUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `screenshot-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(src, "_blank")
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <div className="relative max-h-[90vh] max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[85vh] max-w-full rounded-lg object-contain" />
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={handleDownload}
            aria-label={downloadLabel}
            className="rounded-full bg-black/60 text-white hover:bg-black/80 border-0"
          >
            <Download className="size-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full bg-black/60 text-white hover:bg-black/80 border-0"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Convert Steam CDN URL to working HTTPS video URL                   */
/* ------------------------------------------------------------------ */
function toSteamVideoHttps(url: string): string {
  if (!url) return ""
  // Replace HTTP with HTTPS and swap to Cloudflare CDN which supports HTTPS
  return url
    .replace(/^http:\/\//, "https://")
    .replace("cdn.akamai.steamstatic.com", "cdn.cloudflare.steamstatic.com")
    .replace("video.akamai.steamstatic.com", "cdn.cloudflare.steamstatic.com")
}

/* ------------------------------------------------------------------ */
/*  Video Player - direct HTTPS CDN playback                           */
/* ------------------------------------------------------------------ */
function VideoPlayer({
  movie,
  onClose,
  lang,
}: {
  movie: SteamGame["movies"][0]
  onClose: () => void
  lang: "tr" | "en"
}) {
  const [srcIndex, setSrcIndex] = useState(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  // Build a list of all possible video sources to try in order
  const sources: { url: string; type: string }[] = []
  if (movie.mp4?.max) sources.push({ url: movie.mp4.max, type: "video/mp4" })
  if (movie.mp4?.["480"]) sources.push({ url: movie.mp4["480"], type: "video/mp4" })
  if (movie.webm?.max) sources.push({ url: movie.webm.max, type: "video/webm" })
  if (movie.webm?.["480"]) sources.push({ url: movie.webm["480"], type: "video/webm" })

  const current = sources[srcIndex]
  const hasVideo = sources.length > 0
  const allFailed = srcIndex >= sources.length

  const handleError = () => {
    // Try next source
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1)
    } else {
      setSrcIndex(sources.length) // mark all failed
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={movie.name}
    >
      <div className="relative w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          {hasVideo && !allFailed ? (
            <video
              key={srcIndex}
              controls
              autoPlay
              playsInline
              className="size-full object-contain"
              onError={handleError}
            >
              <source src={toSteamVideoHttps(current.url)} type={current.type} />
              <track kind="captions" />
            </video>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 text-white">
              <Play className="size-10 text-white/40" />
              <p className="text-sm text-white/50">
                {lang === "tr" ? "Video yuklenemedi" : "Video unavailable"}
              </p>
              {hasVideo && (
                <a
                  href={`https://store.steampowered.com/app/${movie.id || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline"
                >
                  {lang === "tr" ? "Steam'de izle" : "Watch on Steam"}
                </a>
              )}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium text-white truncate pr-4">{movie.name}</p>
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full bg-white/10 text-white hover:bg-white/20 border-0 shrink-0"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main MediaGallery component                                       */
/* ------------------------------------------------------------------ */
export function MediaGallery({
  game,
  screenshotsLabel,
  trailerLabel,
  lang,
}: MediaGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [activeMovie, setActiveMovie] = useState<SteamGame["movies"][0] | null>(null)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const hasScreenshots = game.screenshots && game.screenshots.length > 0
  const hasMovies = game.movies && game.movies.length > 0

  if (!hasScreenshots && !hasMovies) return null

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Trailers */}
        {hasMovies && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">{trailerLabel}</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {game.movies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveMovie(movie)
                  }}
                  type="button"
                  className="group relative aspect-video w-48 shrink-0 overflow-hidden rounded-lg bg-secondary cursor-pointer"
                  aria-label={`${lang === "tr" ? "Oynat" : "Play"}: ${movie.name}`}
                >
                  <img
                    src={movie.thumbnail}
                    alt={movie.name}
                    className="size-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/20">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform group-hover:scale-110">
                      <Play className="size-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <p className="absolute bottom-1.5 left-2 right-2 truncate text-[11px] font-medium text-white drop-shadow">{movie.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screenshots */}
        {hasScreenshots && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">{screenshotsLabel}</h3>
            <div className="relative">
              <div ref={emblaRef} className="overflow-hidden rounded-lg">
                <div className="flex gap-3">
                  {game.screenshots.map((ss) => (
                    <button
                      key={ss.id}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setLightboxSrc(ss.path_full)
                      }}
                      type="button"
                      className="group relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-secondary cursor-pointer md:w-[calc(50%-0.375rem)]"
                      aria-label={`${lang === "tr" ? "Buyut" : "Enlarge"}: Screenshot ${ss.id}`}
                    >
                      <img
                        src={ss.path_full}
                        alt={`Screenshot ${ss.id}`}
                        className="size-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                      <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex size-8 items-center justify-center rounded-full bg-black/60 text-white">
                          <Maximize2 className="size-3.5" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {game.screenshots.length > 2 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    className={cn("absolute top-1/2 left-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 shadow-lg")}
                    onClick={scrollPrev}
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    className={cn("absolute top-1/2 right-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 shadow-lg")}
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

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <Lightbox
          src={lightboxSrc}
          alt={`${game.name} screenshot`}
          onClose={() => setLightboxSrc(null)}
          downloadLabel={lang === "tr" ? "Indir" : "Download"}
        />
      )}

      {/* Video Player Modal */}
      {activeMovie && (
        <VideoPlayer
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
          lang={lang}
        />
      )}
    </>
  )
}
