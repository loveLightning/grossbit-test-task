import { useEffect, useState } from 'react'
import axios from 'axios'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Input } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import s from './coin-converter.module.scss'
import {
  CoinConverterDataTypes,
  CurrencyTypes,
  UnionCurrency,
  UnionOrderType,
} from '../../types'

export const CoinConverter = () => {
  const [currency, setCurrency] = useState<CurrencyTypes>({
    firstCurrency: {
      coinConverterSelect: [],
      currency: 'BTC',
      inputValue: '',
      isLoading: false,
    },
    secondCurrency: {
      coinConverterSelect: [],
      currency: 'ETH',
      inputValue: '',
      isLoading: false,
    },
  })

  const clearInputs = () => {
    setCurrency((prev) => {
      return {
        firstCurrency: {
          ...prev.firstCurrency,
          inputValue: '',
          isLoading: false,
        },
        secondCurrency: {
          ...prev.secondCurrency,
          inputValue: '',
          isLoading: false,
        },
      }
    })
  }

  const changeValueFromCurrency = async (
    value: string,
    orderCoin: UnionOrderType,
    currencyTarget?: UnionCurrency
  ) => {
    const currencyDefineTarget = currencyTarget || currency[orderCoin].currency

    const swapCurrentOrderCoin: UnionOrderType =
      orderCoin === 'firstCurrency' ? 'secondCurrency' : 'firstCurrency'

    setCurrency((prev) => ({
      ...prev,
      [orderCoin]: {
        ...prev[orderCoin],
        inputValue: value,
        isLoading: true,
      },
    }))

    if (value.length >= 1) {
      try {
        const {
          data,
        }: {
          data: {
            [K in UnionCurrency]: number
          }
        } = await axios.get(
          `https://min-api.cryptocompare.com/data/price?fsym=${currencyDefineTarget}&tsyms=${currency[swapCurrentOrderCoin].currency}`
        )

        if (data) {
          const number = +data[currency[swapCurrentOrderCoin].currency] * +value

          if (orderCoin === 'firstCurrency') {
            setCurrency((prev) => {
              return {
                ...prev,
                secondCurrency: {
                  ...prev.secondCurrency,
                  inputValue: String(number),
                },
              }
            })
          } else {
            setCurrency((prev) => {
              return {
                ...prev,
                firstCurrency: {
                  ...prev.firstCurrency,
                  inputValue: String(number),
                },
              }
            })
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        setCurrency((prev) => ({
          ...prev,
          [orderCoin]: {
            ...prev[orderCoin],
            isLoading: false,
          },
        }))
      }
    } else {
      clearInputs()
    }
  }

  const changeSelect = async (
    event: SelectChangeEvent,
    orderCoin: UnionOrderType
  ) => {
    setCurrency((prev) => {
      return {
        ...prev,
        [orderCoin]: {
          ...prev[orderCoin],
          currency: event.target.value,
        },
      }
    })

    changeValueFromCurrency(
      currency[orderCoin].inputValue,
      orderCoin,
      event.target.value as UnionCurrency
    )
  }

  const getAllCurrencies = async () => {
    try {
      const { data } = await axios.get(
        'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD'
      )

      const coins: CoinConverterDataTypes[] = data?.Data?.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (coin: any) => {
          const name = coin.CoinInfo.Name
          if (name === 'USDT' || name === 'BTC' || name === 'ETH') {
            return true
          }
          return false
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ).map((coin: any) => {
        const obj: CoinConverterDataTypes = {
          name: coin.CoinInfo.FullName,
          imageUrl: `https://www.cryptocompare.com/${coin.CoinInfo.ImageUrl}`,
          symbol: coin.CoinInfo.Name,
        }
        return obj
      })
      setCurrency((prev) => {
        return {
          secondCurrency: {
            ...prev.secondCurrency,
            coinConverterSelect: coins,
          },
          firstCurrency: {
            ...prev.firstCurrency,
            coinConverterSelect: coins,
          },
        }
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }

  useEffect(() => {
    getAllCurrencies()
  }, [])

  return (
    <div className={s.wrap}>
      <div className="container">
        <div className={s['title-wrap']}>
          <h1 className={s.title}>Crypto Currency Converter</h1>

          <div className={s.main}>
            <div className={s.content}>
              <div className={s['wrap-field']}>
                {currency.firstCurrency.coinConverterSelect.length &&
                currency.firstCurrency.currency ? (
                  <>
                    {currency.secondCurrency.isLoading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          zIndex: 100,
                          left: '-60px',
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                    <Input
                      fullWidth
                      onChange={(e) =>
                        changeValueFromCurrency(e.target.value, 'firstCurrency')
                      }
                      value={currency.firstCurrency.inputValue}
                      placeholder="Enter the value"
                      type="number"
                      className={s.input}
                    />
                    <FormControl fullWidth>
                      <Select
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                          },
                        }}
                        className={s.select}
                        labelId="first-currency"
                        value={currency.firstCurrency.currency}
                        onChange={(e) => changeSelect(e, 'firstCurrency')}
                      >
                        currency
                        {currency.firstCurrency.coinConverterSelect.map(
                          (el) => (
                            <MenuItem key={el.symbol} value={el.symbol}>
                              <div className={s.div}>
                                {el.name}
                                <img
                                  className={s.img}
                                  src={el.imageUrl}
                                  alt="Coin icon"
                                />
                              </div>
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </>
                ) : null}
              </div>

              <div className={s['wrap-field']}>
                {currency.secondCurrency.coinConverterSelect.length &&
                currency.secondCurrency.currency ? (
                  <>
                    {currency.firstCurrency.isLoading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          zIndex: 100,
                          left: '-60px',
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                    <Input
                      fullWidth
                      onChange={(e) =>
                        changeValueFromCurrency(
                          e.target.value,
                          'secondCurrency'
                        )
                      }
                      value={currency.secondCurrency.inputValue}
                      placeholder="Enter the value"
                      type="number"
                      className={s.input}
                    />
                    <FormControl fullWidth>
                      <Select
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                          },
                        }}
                        className={s.select}
                        labelId="second-currency"
                        value={currency.secondCurrency.currency}
                        onChange={(e) => changeSelect(e, 'secondCurrency')}
                      >
                        {currency.secondCurrency.coinConverterSelect.map(
                          (el) => (
                            <MenuItem key={el.symbol} value={el.symbol}>
                              <div className={s.div}>
                                {el.name}
                                <img
                                  className={s.img}
                                  src={el.imageUrl}
                                  alt="Coin icon"
                                />
                              </div>
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </>
                ) : null}
              </div>
              {currency.firstCurrency.inputValue &&
                currency.secondCurrency.inputValue && (
                  <div>
                    <p>{`${currency.firstCurrency.inputValue}  ${currency.firstCurrency.currency} = ${currency.secondCurrency.inputValue} ${currency.secondCurrency.currency}`}</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
