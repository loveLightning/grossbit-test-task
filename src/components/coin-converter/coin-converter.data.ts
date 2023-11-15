export type UnionCurrency = 'USDT' | 'BTC' | 'ETH'

export interface CoinConverterDataTypes {
  name: string
  symbol: UnionCurrency
}

export const coinConverterData: CoinConverterDataTypes[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
  },
  {
    symbol: 'USDT',
    name: 'Tether',
  },
]
