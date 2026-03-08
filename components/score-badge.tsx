"use client"

import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  type: "metacritic" | "opencritic" | "steam"
  label: string
  className?: string
}

function getMetacriticColor(score: number) {
  if (score >= 75) return "bg-steam-positive text-foreground"
  if (score >= 50) return "bg-steam-mixed text-foreground"
  return "bg-steam-negative text-foreground"
}

function getSteamColor(reviewScore: number) {
  if (reviewScore >= 7) return "text-steam-positive"
  if (reviewScore >= 5) return "text-steam-mixed"
  return "text-steam-negative"
}

function getOpenCriticColor(score: number) {
  if (score >= 75) return "bg-emerald-500 text-white"
  if (score >= 50) return "bg-yellow-500 text-foreground"
  return "bg-red-500 text-white"
}

export function ScoreBadge({ score, type, label, className }: ScoreBadgeProps) {
  if (type === "metacritic") {
    return (
      <div className={cn("flex flex-col items-center gap-1.5", className)}>
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-lg font-mono text-xl font-bold",
            getMetacriticColor(score)
          )}
        >
          {score}
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    )
  }
  
  if (type === "opencritic") {
    return (
      <div className={cn("flex flex-col items-center gap-1.5", className)}>
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-lg font-mono text-xl font-bold",
            getOpenCriticColor(score)
          )}
        >
          {score}
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div
        className={cn(
          "text-2xl font-bold font-mono",
          getSteamColor(score)
        )}
      >
        {score}/10
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

interface ReviewBarProps {
  positive: number
  negative: number
  description: string
  positiveLabel: string
  negativeLabel: string
}

export function ReviewBar({
  positive,
  negative,
  description,
  positiveLabel,
  negativeLabel,
}: ReviewBarProps) {
  const total = positive + negative
  const positivePercent = total > 0 ? (positive / total) * 100 : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{description}</span>
        <span className="text-muted-foreground">
          {total.toLocaleString()} reviews
        </span>
      </div>
      {total > 0 && (
        <>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="rounded-full bg-steam-positive transition-all duration-500"
              style={{ width: `${positivePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {positiveLabel}: {positive.toLocaleString()} (
              {positivePercent.toFixed(0)}%)
            </span>
            <span>
              {negativeLabel}: {negative.toLocaleString()} (
              {(100 - positivePercent).toFixed(0)}%)
            </span>
          </div>
        </>
      )}
    </div>
  )
}
