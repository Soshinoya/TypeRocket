import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Paths } from 'utils/paths'

import Logo from 'components/icons/Logo/Logo'
import UserIcon from 'components/icons/UserIcon/UserIcon'
import Button from 'components/Button/Button'

import styles from './Header.module.scss'

type HeaderProps = {}

const Header: FC<HeaderProps> = () => {
	const isUserAuthenticated = false

	return (
		<header className={styles['header']}>
			<Link to={Paths.root} viewTransition>
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
							<Link to={Paths.register} viewTransition>
								<Button text='Register' action={() => {}} />
							</Link>
							<Link to={Paths.login} viewTransition>
								<Button text='Login' action={() => {}} variant='outline' />
							</Link>
						</>
					)}
				</ul>
			</nav>
		</header>
	)
}

export default Header
