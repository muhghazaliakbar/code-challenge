export type RawPrice = {
  currency: string
  date: string
  price: number
}

export type Token = {
  symbol: string
  price: number
  date: string
  iconUrl: string
}

export type SwapEvent = {
  id: string
  timestamp: string
  fromSymbol: string
  toSymbol: string
  fromAmount: number
  toAmount: number
  rate: number
}

