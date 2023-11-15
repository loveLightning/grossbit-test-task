import { useState } from 'react'
import axios from 'axios'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Input } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import {
  CoinConverterDataTypes,
  UnionCurrency,
  coinConverterData,
} from './coin-converter.data'
import s from './coin-converter.module.scss'

export const CoinConverter = () => {
  const [firstCoinConverterSelect] =
    useState<CoinConverterDataTypes[]>(coinConverterData)

  const [secondCoinConverterSelect] =
    useState<CoinConverterDataTypes[]>(coinConverterData)

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
          const number = +data[secondCurrency].toFixed(3) * +e.target.value
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
          const number = +data[firstCurrency].toFixed(3) * +e.target.value
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
                            {el.symbol}
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
                            {el.symbol}
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
