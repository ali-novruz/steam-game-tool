"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GameSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm">
      {/* Hero */}
      <Skeleton className="aspect-[460/215] w-full rounded-none" />

      <CardContent className="flex flex-col gap-6 pt-6">
        {/* Price row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4">
              <Skeleton className="size-14 rounded-lg" />
              <Skeleton className="h-10 w-20" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        </div>

        {/* Screenshots */}
        <div className="flex gap-3 overflow-hidden">
          <Skeleton className="aspect-video w-full shrink-0 md:w-1/2" />
          <Skeleton className="hidden aspect-video w-1/2 shrink-0 md:block" />
        </div>
      </CardContent>
    </Card>
  )
}
