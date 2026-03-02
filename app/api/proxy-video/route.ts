import { type NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const allowed = [
    "video.akamai.steamstatic.com",
    "cdn.akamai.steamstatic.com",
    "steamcdn-a.akamaihd.net",
    "store.steampowered.com",
    "media.st.dl.eccdnx.com",
    "video.fastly.steamstatic.com",
    "video.cloudflare.steamstatic.com",
  ]

  let finalUrl: string
  try {
    const secureUrl = url.replace(/^http:\/\//, "https://")
    const parsed = new URL(secureUrl)
    if (!allowed.some((d) => parsed.hostname.endsWith(d))) {
      return new Response(JSON.stringify({ error: "Domain not allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }
    finalUrl = secureUrl
  } catch {
    return new Response(JSON.stringify({ error: "Invalid url" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const upstream = await fetch(finalUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!upstream.ok || !upstream.body) {
      return new Response(
        JSON.stringify({ error: `Upstream ${upstream.status}` }),
        { status: upstream.status, headers: { "Content-Type": "application/json" } }
      )
    }

    // Stream the response body directly without buffering
    const contentType = upstream.headers.get("content-type") || "video/mp4"
    const contentLength = upstream.headers.get("content-length")

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    }
    if (contentLength) {
      headers["Content-Length"] = contentLength
    }

    return new Response(upstream.body, { status: 200, headers })
  } catch {
    return new Response(JSON.stringify({ error: "Proxy failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
