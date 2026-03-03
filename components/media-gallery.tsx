"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
/*  Video Player - uses all HTTPS URL variants with fallback           */
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  // Build HTTPS URLs for all CDN variants
  function httpsVariants(httpUrl: string): string[] {
    if (!httpUrl) return []
    const base = httpUrl.replace(/^http:\/\//, "https://")
    const variants = [base]
    // Also try alternate CDN domains
    if (base.includes("cdn.akamai.steamstatic.com")) {
      variants.push(base.replace("cdn.akamai.steamstatic.com", "steamcdn-a.akamaihd.net"))
      variants.push(base.replace("cdn.akamai.steamstatic.com", "cdn.cloudflare.steamstatic.com"))
    }
    if (base.includes("video.akamai.steamstatic.com")) {
      variants.push(base.replace("video.akamai.steamstatic.com", "steamcdn-a.akamaihd.net"))
    }
    return variants
  }

  // Collect all possible source URLs
  const allUrls: { url: string; type: string }[] = []
  const rawMp4 = movie.mp4?.max || movie.mp4?.["480"] || ""
  const rawWebm = movie.webm?.max || movie.webm?.["480"] || ""

  if (rawMp4) {
    for (const u of httpsVariants(rawMp4)) {
      allUrls.push({ url: u, type: "video/mp4" })
    }
  }
  if (rawWebm) {
    for (const u of httpsVariants(rawWebm)) {
      allUrls.push({ url: u, type: "video/webm" })
    }
  }

  console.log("[v0] VideoPlayer allUrls:", JSON.stringify(allUrls.map(u => u.url)))
  console.log("[v0] VideoPlayer raw mp4:", rawMp4, "raw webm:", rawWebm)

  const hasVideo = allUrls.length > 0

  // Try loading video sources one by one via JS
  useEffect(() => {
    if (!hasVideo || !videoRef.current) return
    const video = videoRef.current
    let idx = 0

    function tryNext() {
      if (idx >= allUrls.length) {
        console.log("[v0] VideoPlayer all sources failed")
        setFailed(true)
        setLoading(false)
        return
      }
      const src = allUrls[idx]
      console.log("[v0] VideoPlayer trying:", src.url)
      video.src = src.url
      video.load()
    }

    function onCanPlay() {
      console.log("[v0] VideoPlayer canplay:", video.src)
      setLoading(false)
      setFailed(false)
      video.play().catch(() => {})
    }

    function onError() {
      console.log("[v0] VideoPlayer error on:", allUrls[idx]?.url)
      idx++
      tryNext()
    }

    video.addEventListener("canplay", onCanPlay)
    video.addEventListener("error", onError)
    tryNext()

    return () => {
      video.removeEventListener("canplay", onCanPlay)
      video.removeEventListener("error", onError)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo])

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
          {hasVideo && !failed ? (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                </div>
              )}
              <video
                ref={videoRef}
                controls
                playsInline
                className="size-full object-contain"
              >
                <track kind="captions" />
              </video>
            </>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 text-white">
              <Play className="size-10 text-white/40" />
              <p className="text-sm text-white/50">
                {lang === "tr" ? "Video yuklenemedi" : "Video unavailable"}
              </p>
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
