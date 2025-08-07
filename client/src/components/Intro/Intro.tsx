import { FC } from 'react'

import styles from './Intro.module.scss'

import Logo from 'components/icons/Logo/Logo'

type IntroProps = {}

const Intro: FC<IntroProps> = () => {
	return (
		<div className={styles['intro']}>
			<div className={styles['logo__wrapper']}>
				<div className={styles['logo']}>
					<Logo />
				</div>
				<p className={styles['logo__text']}>0.14.0</p>
			</div>
		</div>
	)
}

export default Intro
