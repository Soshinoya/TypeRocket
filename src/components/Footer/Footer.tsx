import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Paths } from 'utils/paths.ts'

import styles from './Footer.module.scss'

type FooterProps = {}

const Footer: FC<FooterProps> = () => {
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
			<div className={styles['footer__links']}>
				<Link to={`${Paths.settings}#themes`} className={styles['footer__link']}>
					Themes
				</Link>
				<Link to={`${Paths.settings}#version`} className={styles['footer__link']}>
					Version
				</Link>
			</div>
		</footer>
	)
}

export default Footer