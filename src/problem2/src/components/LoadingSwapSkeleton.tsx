import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSwapSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded-full bg-slate-800/60" />
        <div className="h-3 w-56 animate-pulse rounded-full bg-slate-800/40" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <div className="flex justify-center">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded-full bg-slate-800/40" />
        <div className="h-10 w-full animate-pulse rounded-full bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-indigo-500/40" />
      </div>
    </div>
  )
}

