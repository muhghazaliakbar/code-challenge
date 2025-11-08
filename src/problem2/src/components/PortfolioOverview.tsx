import { useMemo } from 'react'
import { amountFormatter, fiatFormatter } from '@/lib/format'
import type { Token } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type PortfolioOverviewProps = {
  tokens: Token[]
  balances: Record<string, number>
}

export function PortfolioOverview({
  tokens,
  balances,
}: PortfolioOverviewProps) {
  const portfolio = useMemo(() => {
    const rows = tokens
      .map((token) => {
        const balance = balances[token.symbol] ?? 0
        const usdValue = balance * token.price
        return {
          token,
          balance,
          usdValue,
        }
      })
      .filter((row) => row.usdValue > 0)
      .sort((a, b) => b.usdValue - a.usdValue)

    const total = rows.reduce((acc, row) => acc + row.usdValue, 0)

    return {
      total,
      topRows: rows.slice(0, 5),
    }
  }, [tokens, balances])

  return (
    <Card className="bg-slate-950/60 rounded-4xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100">
          Portfolio Snapshot
        </CardTitle>
        <CardDescription>
          Track your holdings in each asset, priced using the market feed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 shadow-inner shadow-black/40">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Total balance
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-100">
            {fiatFormatter.format(portfolio.total || 0)}
          </div>
        </div>
        <div className="space-y-2">
          {portfolio.topRows.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-6 text-sm text-slate-500">
              Balances will appear once prices are loaded.
            </div>
          ) : (
            portfolio.topRows.map(({ token, balance, usdValue }) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={token.iconUrl} alt={token.symbol} />
                    <AvatarFallback>{token.symbol.slice(0, 3)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-xs text-slate-500">
                      {fiatFormatter.format(usdValue)}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div className="font-mono text-sm text-slate-100">
                    {amountFormatter.format(balance)}
                  </div>
                  <div className="uppercase tracking-wide">Units</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

