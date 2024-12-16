import { FC } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Paths } from 'utils/paths'

import Header from 'features/Header/Header'
import ConfigBar from 'features/ConfigBar/ConfigBar'
import Footer from 'components/Footer/Footer'

import styles from './Root.module.scss'

type RootProps = {}

const Root: FC<RootProps> = () => {
	const location = useLocation()

	return (
		<div className={styles['root-layout']}>
			<Header />
			<main className={styles['main']}>
				<Outlet />
			</main>
			<Footer centerElement={location.pathname === Paths['root'] ? <ConfigBar /> : null} />
		</div>
	)
}

export default Root
