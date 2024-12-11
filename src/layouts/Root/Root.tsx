import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import Header from 'features/Header/Header'
import Footer from 'components/Footer/Footer'

import styles from './Root.module.scss'

type RootProps = {}

const Root: FC<RootProps> = () => {
	return (
		<div className={styles['root-layout']}>
			<Header />
			<main className={styles['main']}>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}

export default Root
