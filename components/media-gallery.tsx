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
  ExternalLink,
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

/* ------------------------------------------------------------------ */
/*  Scroll lock helper                                                 */
/* ------------------------------------------------------------------ */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const scrollY = window.scrollY
    const body = document.body
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.overflow = "hidden"

    return () => {
      body.style.position = ""
      body.style.top = ""
      body.style.left = ""
      body.style.right = ""
      body.style.overflow = ""
      window.scrollTo(0, scrollY)
    }
  }, [active])
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function toHttps(url: string) {
  if (!url) return ""
  return url.replace(/^http:\/\//, "https://")
}

/* ------------------------------------------------------------------ */
/*  Lightbox overlay                                                   */
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
  useScrollLock(true)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(src)}`)
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
    >
      <div
        className="relative max-h-[90vh] max-w-[95vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />
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
/*  Video Player overlay                                              */
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
  const [videoError, setVideoError] = useState(false)
  const [downloadingVideo, setDownloadingVideo] = useState(false)

  useScrollLock(true)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  // Convert all video URLs to HTTPS - Steam CDN supports HTTPS natively
  const mp4Max = toHttps(movie.mp4?.max || "")
  const mp4_480 = toHttps(movie.mp4?.["480"] || "")
  const webmMax = toHttps(movie.webm?.max || "")
  const webm480 = toHttps(movie.webm?.["480"] || "")
  const bestUrl = mp4Max || mp4_480 || webmMax || webm480

  const handleDownloadVideo = () => {
    const url = mp4Max || mp4_480
    if (url) {
      window.open(url, "_blank")
    }
  }

  // Try loading via direct HTTPS fetch with no-cors as test
  useEffect(() => {
    if (!videoRef.current || !bestUrl) return
    const video = videoRef.current

    // Reset state
    setVideoError(false)

    // Set src directly instead of using <source> elements for better compatibility
    video.src = bestUrl
    video.load()

    const onError = () => {
      // If the direct HTTPS mp4 max failed, try 480p
      if (video.src === mp4Max && mp4_480) {
        video.src = mp4_480
        video.load()
      } else if (video.src === mp4_480 && webmMax) {
        video.src = webmMax
        video.load()
      } else {
        setVideoError(true)
      }
    }

    video.addEventListener("error", onError)
    return () => video.removeEventListener("error", onError)
  }, [bestUrl, mp4Max, mp4_480, webmMax])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={movie.name}
    >
      <div
        className="relative w-full max-w-4xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          {!videoError ? (
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              className="size-full object-contain"
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-4 text-white">
              <Play className="size-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center px-4">
                {lang === "tr"
                  ? "Video burada yuklenemiyor. Asagidaki butonla dogrudan acabilirsiniz:"
                  : "Video cannot load here. Use the button below to open directly:"}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" asChild className="gap-1.5">
                  <a href={bestUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    {lang === "tr" ? "Tarayicida Ac" : "Open in Browser"}
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium text-white truncate pr-4">
            {movie.name}
          </p>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadVideo}
              disabled={downloadingVideo}
              className="gap-1.5 bg-white/10 text-white hover:bg-white/20 border-0"
            >
              <Download className="size-3.5" />
              {lang === "tr" ? "Video Indir" : "Download Video"}
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full bg-white/10 text-white hover:bg-white/20 border-0"
            >
              <X className="size-4" />
            </Button>
          </div>
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
            <h3 className="text-sm font-medium text-muted-foreground">
              {trailerLabel}
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {game.movies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => setActiveMovie(movie)}
                  className="group relative aspect-video w-48 shrink-0 overflow-hidden rounded-lg bg-secondary cursor-pointer"
                  aria-label={`${lang === "tr" ? "Oynat" : "Play"}: ${movie.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={movie.thumbnail}
                    alt={movie.name}
                    className="size-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/20">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform group-hover:scale-110">
                      <Play
                        className="size-5 text-primary-foreground ml-0.5"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                  <p className="absolute bottom-1.5 left-2 right-2 truncate text-[11px] font-medium text-white drop-shadow">
                    {movie.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screenshots */}
        {hasScreenshots && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {screenshotsLabel}
            </h3>
            <div className="relative">
              <div ref={emblaRef} className="overflow-hidden rounded-lg">
                <div className="flex gap-3">
                  {game.screenshots.map((ss) => (
                    <button
                      key={ss.id}
                      onClick={() => setLightboxSrc(ss.path_full)}
                      className="group relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-secondary cursor-pointer md:w-[calc(50%-0.375rem)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    className={cn(
                      "absolute top-1/2 left-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 shadow-lg"
                    )}
                    onClick={scrollPrev}
                    aria-label="Previous"
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
                    aria-label="Next"
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
