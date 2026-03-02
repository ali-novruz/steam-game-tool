import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) {
    return new Response("Missing url", { status: 400 })
  }

  // Convert http to https
  const httpsUrl = url.replace(/^http:\/\//, "https://")

  // Serve a minimal HTML page with a video player
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:100%;height:100%;background:#000;overflow:hidden}
    video{width:100%;height:100%;object-fit:contain}
  </style>
</head>
<body>
  <video controls autoplay playsinline>
    <source src="${httpsUrl}" type="${httpsUrl.includes('.webm') ? 'video/webm' : 'video/mp4'}">
  </video>
</body>
</html>`

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
