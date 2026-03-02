import { NextResponse, type NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  // Only allow steam CDN domains
  const allowed = [
    "video.akamai.steamstatic.com",
    "cdn.akamai.steamstatic.com",
    "steamcdn-a.akamaihd.net",
    "store.steampowered.com",
    "media.st.dl.eccdnx.com",
  ]

  let parsedUrl: URL
  try {
    // Force https
    const secureUrl = url.replace(/^http:\/\//, "https://")
    parsedUrl = new URL(secureUrl)
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  if (!allowed.some((d) => parsedUrl.hostname.endsWith(d))) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 })
  }

  try {
    const res = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}` },
        { status: res.status }
      )
    }

    const contentType =
      res.headers.get("content-type") || "video/mp4"
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch {
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 })
  }
}
