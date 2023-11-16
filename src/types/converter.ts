export interface CurrencyTypes {
  firstCurrency: {
    isLoading: boolean
    coinConverterSelect: CoinConverterDataTypes[]
    currency: UnionCurrency
    inputValue: string
  }
  secondCurrency: {
    isLoading: boolean
    coinConverterSelect: CoinConverterDataTypes[]
    currency: UnionCurrency
    inputValue: string
  }
}

export type UnionCurrency = 'USDT' | 'BTC' | 'ETH'

export interface CoinConverterDataTypes {
  name: string
  symbol: UnionCurrency
  imageUrl: string
}

export type UnionOrderType = 'firstCurrency' | 'secondCurrency'
