import { Link } from 'react-router-dom'
import s from './header.module.scss'

export const Header = () => {
  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <Link to="/">
          <p className={s['text-logo']}>Cryptocurrency conversion</p>
        </Link>
      </div>
    </div>
  )
}
