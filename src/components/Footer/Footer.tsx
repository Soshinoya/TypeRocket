import { FC, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'

import { Paths } from 'utils/paths.ts'

import styles from './Footer.module.scss'

import Themes from 'features/Themes/Themes'

type FooterProps = {
	centerElement?: ReactNode
}

const Footer: FC<FooterProps> = ({ centerElement }) => {
	const [isThemesModalOpen, setIsThemesModalOpen] = useState(false)

	return (
		<footer className={styles['footer']}>
			<div className={styles['footer__links']}>
				<a href='t.me/evvxrtex' className={styles['footer__link']}>
					Telegram
				</a>
				<a href='github.com' className={styles['footer__link']}>
					Github
				</a>
			</div>
			{centerElement}
			<div className={styles['footer__links']}>
				<p className={styles['footer__link']} onClick={() => setIsThemesModalOpen(true)}>
					Themes
				</p>
				<Link to={`${Paths.settings}#version`} className={styles['footer__link']}>
					Version
				</Link>
			</div>
			<Themes isOpen={isThemesModalOpen} setIsOpen={setIsThemesModalOpen} />
		</footer>
	)
}

export default Footer
