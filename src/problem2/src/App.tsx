import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { STATIC_PRICE_FEED } from './data/token-prices'
import {
  amountFormatter,
  fiatFormatter,
  rateFormatter,
} from '@/lib/format'
import { TokenAmountField } from '@/components/TokenAmountField'
import { InfoRow } from '@/components/InfoRow'
import { PortfolioOverview } from '@/components/PortfolioOverview'
import { SwapHistoryPanel } from '@/components/SwapHistoryPanel'
import { BackgroundArt } from '@/components/BackgroundArt'
import { LoadingSwapSkeleton } from '@/components/LoadingSwapSkeleton'
import type { RawPrice, SwapEvent, Token } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ArrowLeftRightIcon, Loader2 } from 'lucide-react'

const ICON_BASE_URL =
  'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens'
const SLIPPAGE_OPTIONS = [0.1, 0.5, 1, 3] as const
const DEFAULT_BALANCE_USD = 2500

function buildTokensFromRaw(raw: RawPrice[]) {
  const priceMap = new Map<string, Token>()

  raw.forEach((item) => {
    if (!item.price || Number.isNaN(item.price)) return

    const existing = priceMap.get(item.currency)
    if (!existing || new Date(item.date) > new Date(existing.date)) {
      priceMap.set(item.currency, {
        symbol: item.currency,
        price: item.price,
        date: item.date,
        iconUrl: `${ICON_BASE_URL}/${item.currency}.svg`,
      })
    }
  })

  return Array.from(priceMap.values()).sort((a, b) =>
    a.symbol.localeCompare(b.symbol),
  )
}

function formatForInput(value: number) {
  if (!Number.isFinite(value)) return ''
  return value.toFixed(6).replace(/\.?0+$/, '')
}

function createSwapId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <BackgroundArt />
 
      <main className="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <SwapCard />
        </div>
      </main>
      <Toaster />
    </div>
  )
}

function SwapCard() {
  const isMountedRef = useRef(false)
  const fromSymbolRef = useRef<string | null>(null)
  const toSymbolRef = useRef<string | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [history, setHistory] = useState<SwapEvent[]>([])
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [priceError, setPriceError] = useState<string | null>(null)

  const [fromSymbol, setFromSymbol] = useState<string | null>(null)
  const [toSymbol, setToSymbol] = useState<string | null>(null)
  const [fromAmount, setFromAmount] = useState('100')
  const [slippage, setSlippage] = useState<(typeof SLIPPAGE_OPTIONS)[number]>(0.5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])

  const applyTokenSnapshot = useCallback(
    (nextTokens: Token[]) => {
      if (!isMountedRef.current) return

      setTokens(nextTokens)

      const [first, second] = nextTokens

      setBalances((prev) => {
        const nextBalances: Record<string, number> = { ...prev }

        nextTokens.forEach((token) => {
          if (!token.price || Number.isNaN(token.price)) return
          const rawAmount = DEFAULT_BALANCE_USD / token.price
          const amount = Number.isFinite(rawAmount)
            ? Number(rawAmount.toFixed(4))
            : 0
          if (prev[token.symbol] === undefined) {
            nextBalances[token.symbol] = amount > 0 ? amount : 0
          } else {
            nextBalances[token.symbol] = prev[token.symbol]
          }
        })

        return nextBalances
      })

      const currentFrom = fromSymbolRef.current
      const currentTo = toSymbolRef.current

      const nextFrom =
        currentFrom && nextTokens.some((token) => token.symbol === currentFrom)
          ? currentFrom
          : first?.symbol ?? null

      let nextTo: string | null
      if (currentTo && nextTokens.some((token) => token.symbol === currentTo)) {
        nextTo = currentTo
      } else {
        nextTo = second?.symbol ?? null
      }

      if (nextTo === nextFrom) {
        nextTo =
          nextTokens.find((token) => token.symbol !== nextFrom)?.symbol ?? null
      }

      setFromSymbol(nextFrom)
      setToSymbol(nextTo)
    },
    [],
  )

  const loadPrices = useCallback(async () => {
    setIsLoadingPrices(true)
    setPriceError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 250))
      const nextTokens = buildTokensFromRaw(STATIC_PRICE_FEED)
      if (!nextTokens.length) {
        throw new Error('Static price feed returned no tokens.')
      }
      applyTokenSnapshot(nextTokens)
    } catch (error) {
      console.error(error)
      if (isMountedRef.current) {
        setPriceError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading prices.',
        )
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingPrices(false)
      }
    }
  }, [applyTokenSnapshot])

  useEffect(() => {
    isMountedRef.current = true
    loadPrices()
    return () => {
      isMountedRef.current = false
    }
  }, [loadPrices])

  useEffect(() => {
    fromSymbolRef.current = fromSymbol
  }, [fromSymbol])

  useEffect(() => {
    toSymbolRef.current = toSymbol
  }, [toSymbol])

  const fromToken = useMemo(
    () => tokens.find((token) => token.symbol === fromSymbol),
    [tokens, fromSymbol],
  )

  const toToken = useMemo(
    () => tokens.find((token) => token.symbol === toSymbol),
    [tokens, toSymbol],
  )

  const parsedFromAmount = useMemo(() => {
    const next = Number(fromAmount)
    return Number.isFinite(next) ? next : 0
  }, [fromAmount])

  const exchangeRate = useMemo(() => {
    if (!fromToken || !toToken) return null
    return fromToken.price / toToken.price
  }, [fromToken, toToken])

  const toAmount = useMemo(() => {
    if (!exchangeRate) return 0
    return parsedFromAmount * exchangeRate
  }, [parsedFromAmount, exchangeRate])

  const minReceived = useMemo(() => {
    if (!toAmount) return 0
    return toAmount * (1 - slippage / 100)
  }, [toAmount, slippage])

  const fromFiatValue = useMemo(() => {
    if (!fromToken) return 0
    return parsedFromAmount * fromToken.price
  }, [parsedFromAmount, fromToken])

  const toFiatValue = useMemo(() => {
    if (!toToken) return 0
    return toAmount * toToken.price
  }, [toAmount, toToken])

  const fromBalance = useMemo(() => {
    if (!fromToken) return 0
    return balances[fromToken.symbol] ?? 0
  }, [balances, fromToken])

  const toBalance = useMemo(() => {
    if (!toToken) return 0
    return balances[toToken.symbol] ?? 0
  }, [balances, toToken])

  const selectionError = useMemo(() => {
    if (!fromToken || !toToken) return null
    if (fromToken.symbol === toToken.symbol) {
      return 'Select two different tokens to swap.'
    }
    return null
  }, [fromToken, toToken])

  const balanceError = useMemo(() => {
    if (!fromToken) return null
    if (parsedFromAmount > fromBalance) {
      return 'Insufficient balance for this swap.'
    }
    return null
  }, [fromToken, parsedFromAmount, fromBalance])

  const combinedErrors = useMemo(() => {
    const errors = [...formErrors]
    if (selectionError && !errors.includes(selectionError)) {
      errors.push(selectionError)
    }
    if (balanceError && !errors.includes(balanceError)) {
      errors.push(balanceError)
    }
    return errors
  }, [formErrors, selectionError, balanceError])

  const isSwapDisabled =
    !fromToken ||
    !toToken ||
    parsedFromAmount <= 0 ||
    parsedFromAmount > fromBalance ||
    !!combinedErrors.length

  const lastUpdated = useMemo(() => {
    if (!fromToken || !toToken) return null
    const latest = [fromToken.date, toToken.date].sort().at(-1)
    return latest ? new Date(latest) : null
  }, [fromToken, toToken])

  function handleReverse() {
    setFromSymbol(toSymbol)
    setToSymbol(fromSymbol)
  }

  function handleAmountChange(value: string) {
    if (value === '') {
      setFromAmount('')
      setFormErrors([])
      return
    }

    const trimmed = value.replace(/[^\d.]/g, '')
    const dotCount = (trimmed.match(/\./g) ?? []).length
    if (dotCount > 1) return

    setFromAmount(trimmed)

    const numeric = Number(trimmed)
    const nextErrors: string[] = []

    if (!Number.isFinite(numeric)) {
      nextErrors.push('Please enter a valid amount.')
    } else if (numeric <= 0) {
      nextErrors.push('Amount must be greater than zero.')
    } else if (numeric > 1_000_000_000) {
      nextErrors.push('Amount is too large.')
    }

    setFormErrors(nextErrors)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!fromToken || !toToken) {
      setFormErrors(['Select both the source and destination tokens.'])
      return
    }

    if (fromToken.symbol === toToken.symbol) {
      setFormErrors(['Select two different tokens to swap.'])
      return
    }

    if (parsedFromAmount <= 0) {
      setFormErrors(['Amount must be greater than zero.'])
      return
    }

    if (parsedFromAmount > fromBalance) {
      setFormErrors(['Insufficient balance for this swap.'])
      return
    }

    setFormErrors([])
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1300))

    const updatedFromBalance = Math.max(fromBalance - parsedFromAmount, 0)
    const updatedToBalance = toBalance + toAmount

    const swapRecord: SwapEvent = {
      id: createSwapId(),
      timestamp: new Date().toISOString(),
      fromSymbol: fromToken.symbol,
      toSymbol: toToken.symbol,
      fromAmount: parsedFromAmount,
      toAmount,
      rate: exchangeRate ?? 0,
    }

    setBalances((prev) => {
      const next = { ...prev }
      next[fromToken.symbol] = updatedFromBalance
      next[toToken.symbol] = updatedToBalance
      return next
    })

    setHistory((prev) => [swapRecord, ...prev].slice(0, 8))

    setIsSubmitting(false)
    setFromAmount('')
    toast.success('Swap submitted', {
      description: `${amountFormatter.format(parsedFromAmount)} ${fromToken.symbol} → ${amountFormatter.format(toAmount)} ${toToken.symbol}. New ${fromToken.symbol} balance: ${amountFormatter.format(updatedFromBalance)}.`,
    })
  }

  if (isLoadingPrices) {
    return (
      <Card className="bg-slate-950/70 p-6">
        <LoadingSwapSkeleton />
      </Card>
    )
  }

  if (priceError) {
    return (
      <Card className="bg-slate-950/70 p-8 text-center">
        <div className="space-y-4">
          <span className="inline-flex items-center justify-center rounded-full bg-red-500/15 px-4 py-1 text-sm font-medium text-red-200">
            Price Feed Unavailable
          </span>
          <p className="text-lg text-slate-300">{priceError}</p>
          <Button variant="secondary" onClick={loadPrices} className="rounded-full px-6">
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-slate-950/70 rounded-4xl">
        <CardHeader className="pb-0">
          <CardTitle className="text-3xl text-slate-100 text-center">
            Swap with Confidence
          </CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Trade seamlessly across supported assets using curated market rates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <TokenAmountField
              label="From"
              amount={fromAmount}
              onAmountChange={handleAmountChange}
              token={fromToken}
              onTokenChange={(symbol) => setFromSymbol(symbol)}
              tokens={tokens}
              exclude={toSymbol ?? undefined}
              fiatValue={fromToken ? fiatFormatter.format(fromFiatValue) : null}
              balance={fromToken ? fromBalance : undefined}
              onMax={() => {
                if (!fromToken) return
                setFromAmount(formatForInput(fromBalance))
              }}
            />

            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleReverse}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 transition hover:border-slate-700 hover:bg-slate-800"
                aria-label="Reverse tokens"
              >
                <span className="absolute inset-0 rounded-full border border-white/10 blur" />
                <ArrowLeftRightIcon className="h-4 w-4 text-slate-200 transition duration-300 group-hover:rotate-180" />
              </Button>
            </div>

            <TokenAmountField
              label="To"
              amount={amountFormatter.format(toAmount || 0)}
              readOnly
              token={toToken}
              onTokenChange={(symbol) => setToSymbol(symbol)}
              tokens={tokens}
              exclude={fromSymbol ?? undefined}
              fiatValue={toToken ? fiatFormatter.format(toFiatValue) : null}
              balance={toToken ? toBalance : undefined}
            />
          </div>

          <div className="rounded-4xl border border-white/5 bg-slate-900/60 p-4 shadow-inner shadow-black/50 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                label="Rate"
                value={
                  exchangeRate && fromToken && toToken
                    ? `1 ${fromToken.symbol} ≈ ${rateFormatter.format(exchangeRate)} ${toToken.symbol}`
                    : '—'
                }
              />
              <InfoRow
                label="You Receive (est.)"
                value={
                  toToken
                    ? `${amountFormatter.format(toAmount || 0)} ${toToken.symbol}`
                    : '—'
                }
              />
              <InfoRow
                label="Minimum Received"
                helper={`After ${slippage}% slippage tolerance`}
                value={
                  toToken
                    ? `${amountFormatter.format(minReceived || 0)} ${toToken.symbol}`
                    : '—'
                }
              />
              <InfoRow
                label="USD Value"
                value={
                  toToken
                    ? fiatFormatter.format(toFiatValue || 0)
                    : '—'
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Slippage tolerance
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {SLIPPAGE_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={slippage === option ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'rounded-full px-4',
                      slippage === option &&
                        'shadow-lg shadow-cyan-500/40 text-white',
                    )}
                    onClick={() => setSlippage(option)}
                  >
                    {option}%
                  </Button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="relative w-full overflow-hidden rounded-full text-white text-lg"
              disabled={isSwapDisabled || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Swapping...
                </span>
              ) : (
                'Swap Now'
              )}
            </Button>

            {combinedErrors.length > 0 && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                <ul className="space-y-1">
                  {combinedErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 text-sm text-slate-400">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Zero gas fees on testnet • Optimized routing for the best rates
              </span>
              {lastUpdated && (
                <span className="text-xs text-slate-500">
                  Updated{' '}
                  {Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  }).format(lastUpdated)}
                </span>
              )}
            </div>
          </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PortfolioOverview tokens={tokens} balances={balances} />
        <SwapHistoryPanel history={history} />
      </div>
    </>
  )
}

export default App
