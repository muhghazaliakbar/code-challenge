import { useMemo, useState } from 'react'
import type { Token } from '@/types'
import { fiatFormatter } from '@/lib/format'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type TokenSelectProps = {
  selected: Token | null
  onSelect: (token: Token | null) => void
  tokens: Token[]
  exclude?: string
  disabled?: boolean
}

export function TokenSelect({
  selected,
  onSelect,
  tokens,
  exclude,
  disabled = false,
}: TokenSelectProps) {
  const [open, setOpen] = useState(false)

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => (exclude ? token.symbol !== exclude : true))
  }, [tokens, exclude])

  if (disabled) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="flex w-40 items-center justify-between gap-2 rounded-full border-slate-800/60 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-500 sm:w-52"
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>—</AvatarFallback>
          </Avatar>
          <span>Select token</span>
        </div>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer flex w-40 items-center justify-between gap-2 rounded-full border-slate-700 bg-slate-900/70 pl-1.5 pr-3 py-2 text-sm font-medium text-slate-100 sm:w-52"
        >
          <div className="flex items-center gap-2">
            {selected ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={selected.iconUrl} alt={selected.symbol} />
                <AvatarFallback>{selected.symbol.slice(0, 3)}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarFallback>—</AvatarFallback>
              </Avatar>
            )}
            <span>{selected?.symbol ?? 'Select token'}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-slate-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <Command>
          <CommandInput placeholder="Search token..." className="border-0" />
          <CommandList>
            <CommandEmpty>No tokens found.</CommandEmpty>
            <CommandGroup>
              {filteredTokens.map((token) => (
                <CommandItem
                  key={token.symbol}
                  value={token.symbol}
                  onSelect={() => {
                    onSelect(token)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={token.iconUrl} alt={token.symbol} />
                      <AvatarFallback>{token.symbol.slice(0, 3)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-slate-400">
                        {fiatFormatter.format(token.price)}
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      'h-4 w-4 text-cyan-400',
                      selected?.symbol === token.symbol
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

