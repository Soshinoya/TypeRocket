import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Paths } from 'utils/paths'

import Logo from 'components/icons/Logo/Logo'
import UserIcon from 'components/icons/UserIcon/UserIcon'

import styles from './Header.module.scss'

type HeaderProps = {}

const Header: FC<HeaderProps> = () => {
	return (
		<header className={styles['header']}>
			<Link to={Paths.root}>
				<Logo />
			</Link>
			<nav className={styles['header-nav']}>
				<ul className={styles['header-nav__links']}>
					<Link to={Paths.root} className={styles['header-nav__link']}>
						Mode
					</Link>
					<Link to={Paths.root} className={styles['header-nav__link']}>
						<UserIcon />
					</Link>
				</ul>
			</nav>
		</header>
	)
}

export default Header
