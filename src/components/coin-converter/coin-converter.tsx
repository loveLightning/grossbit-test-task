import { useEffect, useState } from 'react'
import axios from 'axios'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Input } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { CoinConverterDataTypes, UnionCurrency } from './coin-converter.data'
import s from './coin-converter.module.scss'

export const CoinConverter = () => {
  const [firstCoinConverterSelect, setFirstCoinConverterSelect] = useState<
    CoinConverterDataTypes[]
  >([])

  const [secondCoinConverterSelect, setSecondCoinConverterSelect] = useState<
    CoinConverterDataTypes[]
  >([])

  const [firstCurrency, setFirstCurrency] = useState<UnionCurrency>('BTC')
  const [secondCurrency, setSecondCurrency] = useState<UnionCurrency>('ETH')

  const [firstInputValue, setFirstInputValue] = useState('')
  const [secondInputValue, setSecondInputValue] = useState('')

  const [isLoadingFirst, setIsLoadingFirst] = useState(false)
  const [isLoadingSecond, setIsLoadingSecond] = useState(false)

  const changeFirstSelect = (event: SelectChangeEvent) => {
    setFirstCurrency(event.target.value as UnionCurrency)
  }

  const changeSecondSelect = (event: SelectChangeEvent) => {
    setSecondCurrency(event.target.value as UnionCurrency)
  }

  const clearInputs = () => {
    setFirstInputValue('')
    setSecondInputValue('')
  }

  const changeValueFromFirstCurrency = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFirstInputValue(e.target.value)

    if (e.target.value.length >= 1) {
      try {
        setIsLoadingFirst(true)
        const {
          data,
        }: {
          data: {
            [K in UnionCurrency]: number
          }
        } = await axios.get(
          `https://min-api.cryptocompare.com/data/price?fsym=${firstCurrency}&tsyms=${secondCurrency}`
        )
        if (data) {
          const number = +data[secondCurrency] * +e.target.value

          setSecondInputValue(String(number))
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        setIsLoadingFirst(false)
      }
    } else {
      clearInputs()
    }
  }

  const changeValueFromFSecondCurrency = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSecondInputValue(e.target.value)

    if (e.target.value.length >= 1) {
      try {
        setIsLoadingSecond(true)
        const {
          data,
        }: {
          data: {
            [K in UnionCurrency]: number
          }
        } = await axios.get(
          `https://min-api.cryptocompare.com/data/price?fsym=${secondCurrency}&tsyms=${firstCurrency}`
        )
        if (data) {
          const number = +data[firstCurrency] * +e.target.value
          setFirstInputValue(String(number))
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        setIsLoadingSecond(false)
      }
    } else {
      clearInputs()
    }
  }

  const getAllCurrencies = async () => {
    const { data } = await axios.get(
      'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD'
    )

    const coins: CoinConverterDataTypes[] = data.Data.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (coin: any, id: number) => {
        if (id === 0 || id === 1 || id === 7) {
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
    setSecondCoinConverterSelect(coins)
    setFirstCoinConverterSelect(coins)
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
                {firstCoinConverterSelect.length && firstCurrency ? (
                  <>
                    {isLoadingSecond && (
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
                      onChange={(e) => changeValueFromFirstCurrency(e)}
                      value={firstInputValue}
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
                        value={firstCurrency}
                        onChange={changeFirstSelect}
                      >
                        {firstCoinConverterSelect.map((el) => (
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
                        ))}
                      </Select>
                    </FormControl>
                  </>
                ) : null}
              </div>

              <div className={s['wrap-field']}>
                {secondCoinConverterSelect.length && secondCurrency ? (
                  <>
                    {isLoadingFirst && (
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
                      onChange={(e) => changeValueFromFSecondCurrency(e)}
                      value={secondInputValue}
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
                        value={secondCurrency}
                        onChange={changeSecondSelect}
                      >
                        {secondCoinConverterSelect.map((el) => (
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
                        ))}
                      </Select>
                    </FormControl>
                  </>
                ) : null}
              </div>
              {firstInputValue && secondInputValue && (
                <div>
                  <p>{`${firstInputValue}  ${firstCurrency} = ${secondInputValue} ${secondCurrency}`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
