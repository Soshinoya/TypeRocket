import { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Paths } from 'utils/paths'

import Logo from 'components/icons/Logo/Logo'
import UserIcon from 'components/icons/UserIcon/UserIcon'
import Button from 'components/Button/Button'

import styles from './Header.module.scss'

type HeaderProps = {}

const Header: FC<HeaderProps> = () => {
	const isUserAuthenticated = false

	const navigate = useNavigate()

	return (
		<header className={styles['header']}>
			<Link to={Paths.root}>
				<Logo />
			</Link>
			<nav className={styles['header-nav']}>
				<ul className={styles['header-nav__links']}>
					{isUserAuthenticated ? (
						<>
							<Link to={Paths.root} className={styles['header-nav__link']}>
								Mode
							</Link>
							<Link to={Paths.root} className={styles['header-nav__link']}>
								<UserIcon />
							</Link>
						</>
					) : (
						<>
							<Button text='Register' action={() => navigate('/register')} />
							<Button text='Login' action={() => navigate('/login')} variant='outline' />
						</>
					)}
				</ul>
			</nav>
		</header>
	)
}

export default Header
