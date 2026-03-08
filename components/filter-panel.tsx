"use client"

import { useState, useMemo } from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  X, 
  Monitor, 
  Apple, 
  Gamepad2,
  Users,
  User,
  Percent,
  Clock,
  Star,
  Globe,
  Trophy,
  CreditCard,
  Sparkles,
  Glasses,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameFilters, Language } from "@/lib/types"
import { DEFAULT_FILTERS, STEAM_GENRES, REVIEW_SCORES, TAG_CATEGORIES, STEAMDB_TAGS } from "@/lib/types"
import { t } from "@/lib/i18n"

// Turkish alphabet collation helper
const turkishCollator = new Intl.Collator("tr", { sensitivity: "base" })
const englishCollator = new Intl.Collator("en", { sensitivity: "base" })

interface FilterPanelProps {
  filters: GameFilters
  onChange: (filters: GameFilters) => void
  onReset: () => void
  lang: Language
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

export function FilterPanel({ filters, onChange, onReset, lang }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [tagSearch, setTagSearch] = useState("")

  // Filter and sort Steam official genres (used for filtering)
  const sortedGenres = useMemo(() => {
    const collator = lang === "tr" ? turkishCollator : englishCollator
    const searchLower = tagSearch.toLowerCase().trim()
    
    let filtered = [...STEAM_GENRES]
    
    // Filter by search term
    if (searchLower) {
      filtered = filtered.filter(tag => {
        const name = lang === "tr" ? tag.nameTr : tag.name
        return name.toLowerCase().includes(searchLower)
      })
    }
    
    // Sort alphabetically
    filtered.sort((a, b) => {
      const nameA = lang === "tr" ? a.nameTr : a.name
      const nameB = lang === "tr" ? b.nameTr : b.name
      return collator.compare(nameA, nameB)
    })
    
    return filtered
  }, [lang, tagSearch])
  
  // Group SteamDB tags by category for informational display
  const groupedTags = useMemo(() => {
    const collator = lang === "tr" ? turkishCollator : englishCollator
    const searchLower = tagSearch.toLowerCase().trim()
    
    const groups: Record<string, typeof STEAMDB_TAGS> = {}
    
    for (const tag of STEAMDB_TAGS) {
      // Filter by search
      if (searchLower) {
        const name = lang === "tr" ? tag.nameTr : tag.name
        if (!name.toLowerCase().includes(searchLower)) continue
      }
      
      if (!groups[tag.category]) groups[tag.category] = []
      groups[tag.category].push(tag)
    }
    
    // Sort each group
    for (const cat of Object.keys(groups)) {
      groups[cat].sort((a, b) => {
        const nameA = lang === "tr" ? a.nameTr : a.name
        const nameB = lang === "tr" ? b.nameTr : b.name
        return collator.compare(nameA, nameB)
      })
    }
    
    return groups
  }, [lang, tagSearch])
  


  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const updateFilter = <K extends keyof GameFilters>(key: K, value: GameFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  const toggleGenre = (genreId: string) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter(g => g !== genreId)
      : [...filters.genres, genreId]
    updateFilter("genres", newGenres)
  }

  const activeFilterCount = countActiveFilters(filters)

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <Filter className="size-4" />
          <span>{t(lang, "filters")}</span>
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-3 rounded-xl border bg-card p-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Header with reset */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">{t(lang, "filterOptions")}</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onReset} className="text-xs gap-1 h-7">
                <X className="size-3" />
                {t(lang, "resetFilters")}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* Starting Letter */}
            <FilterSection 
              title={t(lang, "startingLetter")} 
              icon={<span className="text-sm font-bold">A</span>}
              isOpen={activeSection === "letter"}
              onToggle={() => toggleSection("letter")}
            >
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => updateFilter("startingLetter", "")}
                  className={`px-2 py-1 text-xs rounded ${filters.startingLetter === "" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
                >
                  {t(lang, "all")}
                </button>
                {ALPHABET.map(letter => (
                  <button
                    key={letter}
                    onClick={() => updateFilter("startingLetter", letter)}
                    className={`size-7 text-xs rounded ${filters.startingLetter === letter ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Price */}
            <FilterSection 
              title={t(lang, "priceRange")} 
              icon={<CreditCard className="size-4" />}
              isOpen={activeSection === "price"}
              onToggle={() => toggleSection("price")}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.freeOnly}
                      onChange={(e) => updateFilter("freeOnly", e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{t(lang, "freeOnly")}</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => updateFilter("onSale", e.target.checked)}
                      className="rounded border-border"
                    />
                    <Percent className="size-3" />
                    <span className="text-sm">{t(lang, "onSale")}</span>
                  </label>
                </div>
                {!filters.freeOnly && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={filters.priceMin || ""}
                      onChange={(e) => updateFilter("priceMin", Number(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-sm rounded border bg-secondary"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      placeholder="Max $"
                      value={filters.priceMax || ""}
                      onChange={(e) => updateFilter("priceMax", Number(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-sm rounded border bg-secondary"
                    />
                  </div>
                )}
              </div>
            </FilterSection>

            {/* Platforms */}
            <FilterSection 
              title={t(lang, "platforms")} 
              icon={<Monitor className="size-4" />}
              isOpen={activeSection === "platforms"}
              onToggle={() => toggleSection("platforms")}
            >
              <div className="flex flex-wrap gap-2">
                <ToggleChip
                  active={filters.platforms.windows}
                  onClick={() => updateFilter("platforms", { ...filters.platforms, windows: !filters.platforms.windows })}
                  icon={<Monitor className="size-3" />}
                  label="Windows"
                />
                <ToggleChip
                  active={filters.platforms.mac}
                  onClick={() => updateFilter("platforms", { ...filters.platforms, mac: !filters.platforms.mac })}
                  icon={<Apple className="size-3" />}
                  label="macOS"
                />
                <ToggleChip
                  active={filters.platforms.linux}
                  onClick={() => updateFilter("platforms", { ...filters.platforms, linux: !filters.platforms.linux })}
                  icon={<span className="text-[10px] font-bold">Lx</span>}
                  label="Linux"
                />
              </div>
            </FilterSection>

            {/* Game Mode */}
            <FilterSection 
              title={t(lang, "gameMode")} 
              icon={<Users className="size-4" />}
              isOpen={activeSection === "gamemode"}
              onToggle={() => toggleSection("gamemode")}
            >
              <div className="flex flex-wrap gap-2">
                <ToggleChip
                  active={filters.multiplayer === null}
                  onClick={() => updateFilter("multiplayer", null)}
                  label={t(lang, "all")}
                />
                <ToggleChip
                  active={filters.multiplayer === false}
                  onClick={() => updateFilter("multiplayer", false)}
                  icon={<User className="size-3" />}
                  label={t(lang, "singleplayer")}
                />
                <ToggleChip
                  active={filters.multiplayer === true}
                  onClick={() => updateFilter("multiplayer", true)}
                  icon={<Users className="size-3" />}
                  label={t(lang, "multiplayer")}
                />
              </div>
            </FilterSection>

            {/* Genres/Tags */}
            <FilterSection 
              title={t(lang, "genres")} 
              icon={<Gamepad2 className="size-4" />}
              isOpen={activeSection === "genres"}
              onToggle={() => toggleSection("genres")}
            >
              <div className="flex flex-col gap-2">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t(lang, "searchTags")}
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-xs rounded border bg-secondary placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                  {tagSearch && (
                    <button
                      onClick={() => setTagSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
                
                {/* Selected tags count */}
                {filters.genres.length > 0 && (
                  <p className="text-[10px] text-muted-foreground">
                    {filters.genres.length} {lang === "tr" ? "seçili" : "selected"}
                  </p>
                )}
                
                {/* Steam official genres - these are filterable */}
                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                  {/* Main Genres Section */}
                  <div>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1.5 block">
                      {lang === "tr" ? "Ana Türler (Filtrelenebilir)" : "Main Genres (Filterable)"}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sortedGenres.map(tag => (
                        <ToggleChip
                          key={tag.id}
                          active={filters.genres.includes(tag.id)}
                          onClick={() => toggleGenre(tag.id)}
                          label={lang === "tr" ? tag.nameTr : tag.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* SteamDB Tags by Category - informational only */}
                  {TAG_CATEGORIES.filter(c => c.id !== "genre").map(category => {
                    const tags = groupedTags[category.id]
                    if (!tags || tags.length === 0) return null
                    
                    return (
                      <div key={category.id}>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          {lang === "tr" ? category.nameTr : category.name}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tags.map(tag => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 text-[11px] rounded bg-secondary/50 text-muted-foreground cursor-default"
                              title={lang === "tr" ? "Bu etiket Steam API tarafından filtrelenemiyor" : "This tag cannot be filtered via Steam API"}
                            >
                              {lang === "tr" ? tag.nameTr : tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  
                  {sortedGenres.length === 0 && Object.keys(groupedTags).length === 0 && (
                    <p className="text-xs text-muted-foreground py-2">
                      {lang === "tr" ? "Sonuç bulunamadı" : "No results found"}
                    </p>
                  )}
                </div>
              </div>
            </FilterSection>

            {/* Review Score */}
            <FilterSection 
              title={t(lang, "reviewScore")} 
              icon={<Star className="size-4" />}
              isOpen={activeSection === "review"}
              onToggle={() => toggleSection("review")}
            >
              <div className="flex flex-wrap gap-1.5">
                {REVIEW_SCORES.map(score => (
                  <ToggleChip
                    key={score.value}
                    active={filters.reviewScore === score.value}
                    onClick={() => updateFilter("reviewScore", score.value)}
                    label={lang === "tr" ? score.labelTr : score.labelEn}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Metacritic */}
            <FilterSection 
              title="Metacritic" 
              icon={<span className="text-[10px] font-bold text-green-500">MC</span>}
              isOpen={activeSection === "metacritic"}
              onToggle={() => toggleSection("metacritic")}
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min={0}
                  max={100}
                  value={filters.metacriticMin || ""}
                  onChange={(e) => updateFilter("metacriticMin", Number(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm rounded border bg-secondary"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  min={0}
                  max={100}
                  value={filters.metacriticMax || ""}
                  onChange={(e) => updateFilter("metacriticMax", Number(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm rounded border bg-secondary"
                />
                <span className="text-xs text-muted-foreground">(0-100)</span>
              </div>
            </FilterSection>

            {/* Release Year */}
            <FilterSection 
              title={t(lang, "releaseYear")} 
              icon={<Clock className="size-4" />}
              isOpen={activeSection === "year"}
              onToggle={() => toggleSection("year")}
            >
              <select
                value={filters.releaseYear}
                onChange={(e) => updateFilter("releaseYear", Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm rounded border bg-secondary"
              >
                <option value={0}>{t(lang, "anyYear")}</option>
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </FilterSection>

            {/* Extra Features */}
            <FilterSection 
              title={t(lang, "extraFeatures")} 
              icon={<Sparkles className="size-4" />}
              isOpen={activeSection === "extra"}
              onToggle={() => toggleSection("extra")}
            >
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.earlyAccess === true}
                    onChange={(e) => updateFilter("earlyAccess", e.target.checked ? true : null)}
                    className="rounded border-border"
                  />
                  <Clock className="size-3" />
                  <span className="text-sm">Early Access</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.turkishSupport}
                    onChange={(e) => updateFilter("turkishSupport", e.target.checked)}
                    className="rounded border-border"
                  />
                  <Globe className="size-3" />
                  <span className="text-sm">{t(lang, "turkishSupport")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasAchievements}
                    onChange={(e) => updateFilter("hasAchievements", e.target.checked)}
                    className="rounded border-border"
                  />
                  <Trophy className="size-3" />
                  <span className="text-sm">{t(lang, "hasAchievements")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasTradingCards}
                    onChange={(e) => updateFilter("hasTradingCards", e.target.checked)}
                    className="rounded border-border"
                  />
                  <CreditCard className="size-3" />
                  <span className="text-sm">{t(lang, "hasTradingCards")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.controllerSupport}
                    onChange={(e) => updateFilter("controllerSupport", e.target.checked)}
                    className="rounded border-border"
                  />
                  <Gamepad2 className="size-3" />
                  <span className="text-sm">{t(lang, "controllerSupport")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.vrSupport}
                    onChange={(e) => updateFilter("vrSupport", e.target.checked)}
                    className="rounded border-border"
                  />
                  <Glasses className="size-3" />
                  <span className="text-sm">{t(lang, "vrSupport")}</span>
                </label>
              </div>
            </FilterSection>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Helper Components                                                  */
/* ------------------------------------------------------------------ */

function FilterSection({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      {isOpen && (
        <div className="mt-2 animate-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  )
}

function ToggleChip({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
  label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full border transition-colors ${
        active 
          ? "bg-primary text-primary-foreground border-primary" 
          : "bg-secondary text-foreground border-border hover:border-primary/50"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function countActiveFilters(filters: GameFilters): number {
  let count = 0
  if (filters.startingLetter) count++
  if (filters.priceMin > 0 || filters.priceMax > 0) count++
  if (filters.freeOnly) count++
  if (filters.onSale) count++
  if (filters.genres.length > 0) count++
  if (filters.categories.length > 0) count++
  if (filters.platforms.windows || filters.platforms.mac || filters.platforms.linux) count++
  if (filters.metacriticMin > 0 || filters.metacriticMax > 0) count++
  if (filters.reviewScore !== "any") count++
  if (filters.releaseYear > 0) count++
  if (filters.multiplayer !== null) count++
  if (filters.earlyAccess !== null) count++
  if (filters.turkishSupport) count++
  if (filters.hasAchievements) count++
  if (filters.hasTradingCards) count++
  if (filters.controllerSupport) count++
  if (filters.vrSupport) count++
  return count
}
