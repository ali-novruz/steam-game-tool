"use client"

import { Button } from "@/components/ui/button"
import type { Language } from "@/lib/types"

interface LanguageSwitcherProps {
  lang: Language
  onToggle: () => void
}

export function LanguageSwitcher({ lang, onToggle }: LanguageSwitcherProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="gap-1.5 font-mono text-xs"
      aria-label={lang === "tr" ? "Switch to English" : "Türkçe'ye geçiş"}
    >
      <span className={lang === "tr" ? "font-bold text-primary" : "text-muted-foreground"}>
        TR
      </span>
      <span className="text-muted-foreground">/</span>
      <span className={lang === "en" ? "font-bold text-primary" : "text-muted-foreground"}>
        EN
      </span>
    </Button>
  )
}
