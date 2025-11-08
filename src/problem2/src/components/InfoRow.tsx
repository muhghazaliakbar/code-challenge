import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type InfoRowProps = {
  label: string
  value: string
  helper?: string
  className?: string
}

export function InfoRow({ label, value, helper, className }: InfoRowProps) {
  return (
    <Card className={cn('rounded-2xl border border-white/10 bg-slate-950/70 p-4', className)}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-slate-100">{value}</div>
      {helper ? (
        <div className="mt-1 text-xs text-slate-500">{helper}</div>
      ) : null}
    </Card>
  )
}

