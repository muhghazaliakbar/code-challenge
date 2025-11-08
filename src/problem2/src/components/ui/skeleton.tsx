import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl border border-white/10 bg-slate-900/60',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }

