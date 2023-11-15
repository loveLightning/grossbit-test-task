export type UnionCurrency = 'USDT' | 'BTC' | 'ETH'

export interface CoinConverterDataTypes {
  name: string
  symbol: UnionCurrency
  imageUrl: string
}
