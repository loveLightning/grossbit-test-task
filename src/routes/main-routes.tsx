import { Route, Routes } from 'react-router-dom'
import { CoinConverterPage } from '../pages'

export const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CoinConverterPage />} />
    </Routes>
  )
}
