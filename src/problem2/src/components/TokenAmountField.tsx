import { amountFormatter } from '@/lib/format'
import type { Token } from '@/types'
import { TokenSelect } from '@/components/TokenSelect'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type TokenAmountFieldProps = {
  label: string
  amount: string
  onAmountChange?: (value: string) => void
  readOnly?: boolean
  token?: Token
  onTokenChange: (symbol: string | null) => void
  tokens: Token[]
  exclude?: string
  fiatValue: string | null
  balance?: number
  onMax?: () => void
}

export function TokenAmountField({
  label,
  amount,
  onAmountChange,
  readOnly,
  token,
  onTokenChange,
  tokens,
  exclude,
  fiatValue,
  balance,
  onMax,
}: TokenAmountFieldProps) {
  return (
    <div className="rounded-4xl border border-white/5 bg-slate-900/60 p-5 shadow-inner shadow-black/40 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <Label>{label}</Label>
        {fiatValue ? (
          <span className="text-xs font-medium text-slate-500">≈ {fiatValue}</span>
        ) : null}
      </div>
      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          Balance:{' '}
          {token && balance !== undefined
            ? `${amountFormatter.format(balance)} ${token.symbol}`
            : '—'}
        </span>
        {!readOnly && onMax && token ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMax}
            className="rounded-full border-white/20 px-3 py-0 text-xs"
          >
            Max
          </Button>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => onAmountChange?.(event.target.value)}
          readOnly={readOnly}
          className="h-auto flex-1 border-none bg-transparent px-0 text-3xl font-semibold text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="0.0"
        />
        <TokenSelect
          selected={token ?? null}
          onSelect={(selected) => onTokenChange(selected?.symbol ?? null)}
          tokens={tokens}
          exclude={exclude}
          disabled={tokens.length === 0}
        />
      </div>
    </div>
  )
}

