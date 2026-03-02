"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dices, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GenerateButtonProps {
  onClick: () => void
  loading: boolean
  hasGame: boolean
  discoverLabel: string
  loadingLabel: string
  newGameLabel: string
}

export function GenerateButton({
  onClick,
  loading,
  hasGame,
  discoverLabel,
  loadingLabel,
  newGameLabel,
}: GenerateButtonProps) {
  const [rolling, setRolling] = useState(false)

  const handleClick = () => {
    if (loading) return
    setRolling(true)
    setTimeout(() => setRolling(false), 600)
    onClick()
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      size="lg"
      className={cn(
        "relative gap-2.5 px-8 py-6 text-base font-semibold transition-all",
        !hasGame && "px-10 py-7 text-lg",
        loading && "cursor-wait"
      )}
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <Dices className={cn("size-5", rolling && "animate-dice-roll")} />
      )}
      {loading ? loadingLabel : hasGame ? newGameLabel : discoverLabel}
    </Button>
  )
}
