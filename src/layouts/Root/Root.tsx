import { FC, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { useAppSelector } from 'store/index'

import { selectNotifications } from 'features/Notification/selectors'

import { Paths } from 'utils/paths'

import Notification from 'features/Notification/Notification'
import Header from 'features/Header/Header'
import ConfigBar from 'features/ConfigBar/ConfigBar'
import Footer from 'components/Footer/Footer'
import Intro from 'components/Intro/Intro'

import styles from './Root.module.scss'

type RootProps = {
	isPlayIntro: boolean
	setIsPlayIntro: React.Dispatch<React.SetStateAction<boolean>>
}

const Root: FC<RootProps> = ({ isPlayIntro, setIsPlayIntro }) => {
	const location = useLocation()

	const introRef = useRef<HTMLDivElement>(null)
	const outletRef = useRef<HTMLDivElement>(null)

	const notifications = useAppSelector(selectNotifications)

	useEffect(() => {
		if (!isPlayIntro) return
		setTimeout(() => {
			if (introRef.current && outletRef.current) {
				introRef.current.style.display = 'none'
				outletRef.current.style.opacity = '1'
				setIsPlayIntro(false)
			}
		}, 1500)
	}, [])

	return (
		<div className={styles['root-layout']}>
			<Header />
			<main className={styles['main']}>
				{isPlayIntro ? (
					<div ref={introRef} className={styles['intro']}>
						<Intro />
					</div>
				) : null}
				<div ref={outletRef} className={`${styles['outlet']} ${isPlayIntro ? styles['outlet--hidden'] : ''}`}>
					<Outlet />
				</div>
			</main>
			<Footer centerElement={location.pathname === Paths['root'] ? <ConfigBar /> : null} />
			<ul className={styles['root-notifications']}>
				{notifications.map(notification => (
					<Notification key={notification.id} {...notification} />
				))}
			</ul>
		</div>
	)
}

export default Root
