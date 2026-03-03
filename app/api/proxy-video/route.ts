import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Allow streaming large responses (no body size limit)
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  // Only allow Steam CDN domains
  const allowed = [
    "cdn.akamai.steamstatic.com",
    "video.akamai.steamstatic.com",
    "steamcdn-a.akamaihd.net",
    "store.steampowered.com",
    "media.st.dl.eccdnx.com",
    "video.fastly.steamstatic.com",
    "video.cloudflare.steamstatic.com",
  ]

  let finalUrl: string
  try {
    const parsed = new URL(url)
    if (!allowed.some((d) => parsed.hostname.endsWith(d))) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 })
    }
    // KEEP the original HTTP URL - Steam CDN works over HTTP,
    // converting to HTTPS breaks it because the CDN doesn't support it
    finalUrl = url
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  try {
    // Forward Range header for video seeking support
    const range = req.headers.get("range")
    const fetchHeaders: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }
    if (range) {
      fetchHeaders["Range"] = range
    }

    const upstream = await fetch(finalUrl, { headers: fetchHeaders })

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: upstream.status }
      )
    }

    if (!upstream.body) {
      return NextResponse.json({ error: "No response body" }, { status: 502 })
    }

    const isWebm = finalUrl.includes(".webm")
    const contentType = isWebm ? "video/webm" : "video/mp4"
    const contentLength = upstream.headers.get("content-length")
    const contentRange = upstream.headers.get("content-range")
    const acceptRanges = upstream.headers.get("accept-ranges")

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    }
    if (contentLength) responseHeaders["Content-Length"] = contentLength
    if (contentRange) responseHeaders["Content-Range"] = contentRange
    if (acceptRanges) responseHeaders["Accept-Ranges"] = acceptRanges
    else responseHeaders["Accept-Ranges"] = "bytes"

    return new Response(upstream.body as ReadableStream, {
      status: upstream.status,
      headers: responseHeaders,
    })
  } catch {
    return NextResponse.json({ error: "Proxy failed" }, { status: 502 })
  }
}
