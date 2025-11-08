import { amountFormatter, historyTimestampFormatter, rateFormatter } from '@/lib/format'
import type { SwapEvent } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type SwapHistoryPanelProps = {
  history: SwapEvent[]
}

export function SwapHistoryPanel({ history }: SwapHistoryPanelProps) {
  return (
    <Card className="bg-slate-950/60 rounded-4xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100">Recent Activity</CardTitle>
        <CardDescription>
          A running log of the latest swaps executed from this device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-6 text-sm text-slate-500">
            Submit a swap to populate your history.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-100">
                  {amountFormatter.format(item.fromAmount)} {item.fromSymbol} →{' '}
                  {amountFormatter.format(item.toAmount)} {item.toSymbol}
                </div>
                <div className="text-xs text-slate-500">
                  {historyTimestampFormatter.format(new Date(item.timestamp))}
                </div>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                <span>
                  Rate:&nbsp;
                  <span className="text-slate-300">
                    {rateFormatter.format(item.rate)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Success
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

