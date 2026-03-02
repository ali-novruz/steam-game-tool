import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 })
  }

  // Only allow Steam CDN domains
  const allowed = [
    "store.steampowered.com",
    "cdn.akamai.steamstatic.com",
    "shared.akamai.steamstatic.com",
    "steamcdn-a.akamaihd.net",
  ]

  try {
    const parsed = new URL(url)
    if (!allowed.some((d) => parsed.hostname.endsWith(d))) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 })
    }

    const res = await fetch(url)
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 })
    }

    const blob = await res.blob()
    return new NextResponse(blob, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
        "Content-Disposition": `attachment; filename="steam-screenshot.jpg"`,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to proxy" }, { status: 500 })
  }
}
