import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  console.log("[v0] video-embed url param:", url, "full search:", req.nextUrl.search)
  if (!url) return new NextResponse("Missing url", { status: 400 })

  const httpsUrl = url.replace(/^http:\/\//, "https://")
  const isWebm = httpsUrl.includes(".webm")
  const mime = isWebm ? "video/webm" : "video/mp4"

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;background:#000;overflow:hidden}
video{width:100%;height:100%;object-fit:contain}</style></head>
<body><video controls autoplay playsinline><source src="${httpsUrl}" type="${mime}"></video></body></html>`

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
