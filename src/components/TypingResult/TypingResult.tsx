import React, { FC } from 'react'

import styles from './TypingResult.module.scss'

type TypingResultProps = {
	wpm: number
	rawWpm: number
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TypingResult: FC<TypingResultProps> = ({ wpm, rawWpm, isOpen, setIsOpen }) => {
	return (
		<div className={`${styles['result__wrapper']} ${isOpen ? styles['result__wrapper--active'] : ''}`}>
			<div className={styles['result']}>
				<div className={styles['result-header']}>
					<p className={styles['result-header__title']}>Results</p>
					<p className={styles['result-header__cross']} onClick={() => setIsOpen(false)}>
						X
					</p>
				</div>
				<div className={styles['result-body']}>
					<div className={styles['result-item']}>
						<h2 className={styles['result-item__title']}>{wpm}</h2>
						<p className={styles['result-item__subtitle']}>WPM</p>
					</div>
				</div>
			</div>
			<div
				className={`${styles['blur']} ${isOpen ? styles['blur--active'] : ''}`}
				onClick={() => setIsOpen(false)}
			></div>
		</div>
	)
}

export default TypingResult
