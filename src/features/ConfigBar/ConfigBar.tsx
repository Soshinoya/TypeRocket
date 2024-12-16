import { FC, useEffect, useState } from 'react'

import { useAppSelector, useAppDispatch } from 'store/index'

import { I_ModeOption, Mode } from 'features/TypingZone/types'

import {
	setIsPunctuationAction,
	setIsNumbersAction,
	setModeAction,
	setWordOptionsAction,
	setTimeOptionsAction,
} from 'features/TypingZone/reducer'

import {
	selectLanguage,
	selectIsNumbers,
	selectIsPunctuation,
	selectMode,
	selectWordOptions,
	selectTimeOptions,
} from 'features/TypingZone/selectors'

import styles from './ConfigBar.module.scss'

type ConfigBarProps = {}

const ConfigBar: FC<ConfigBarProps> = () => {
	const dispatch = useAppDispatch()

	const currentLanguage = useAppSelector(selectLanguage)
	const isPunctuation = useAppSelector(selectIsPunctuation)
	const isNumbers = useAppSelector(selectIsNumbers)
	const currentMode = useAppSelector(selectMode)
	const wordOptions = useAppSelector(selectWordOptions)
	const timeOptions = useAppSelector(selectTimeOptions)

	const [currentModeOptions, setCurrentModeOptions] = useState<I_ModeOption[]>(wordOptions)

	useEffect(() => {
		if (currentMode === Mode['words']) {
			setCurrentModeOptions(wordOptions)
		} else {
			setCurrentModeOptions(timeOptions)
		}
	}, [currentMode, wordOptions, timeOptions])

	const modeClickHandler = (mode: Mode) => {
		if (mode === currentMode) return

		dispatch(setModeAction(mode))
	}

	const optionClickHandler = (count: I_ModeOption['count'], enabled: I_ModeOption['enabled']) => {
		if (enabled) return

		const updatedOption: I_ModeOption =
			currentModeOptions.find(option => option.count === count) ||
			currentModeOptions[currentModeOptions.length - 1]

		switch (currentMode) {
			case Mode['words']:
				dispatch(setWordOptionsAction(updatedOption))
				break
			case Mode['time']:
				dispatch(setTimeOptionsAction(updatedOption))
				break
		}
	}

	return (
		<div className={styles['config-bar']}>
			<p className={styles['config-bar-item']}>{currentLanguage}</p>
			<div className={styles['separator']}></div>
			<div className={styles['config-bar-item__wrapper']}>
				<p
					onClick={() => dispatch(setIsPunctuationAction(!isPunctuation))}
					className={`${styles['config-bar-item']} ${
						isPunctuation ? styles['config-bar-item--enabled'] : ''
					}`}
				>
					Punctuation
				</p>
				<p
					onClick={() => dispatch(setIsNumbersAction(!isNumbers))}
					className={`${styles['config-bar-item']} ${isNumbers ? styles['config-bar-item--enabled'] : ''}`}
				>
					Numbers
				</p>
			</div>
			<div className={styles['separator']}></div>
			<div className={styles['config-bar-item__wrapper']}>
				<p
					onClick={() => modeClickHandler(Mode['words'])}
					className={`${styles['config-bar-item']} ${
						currentMode === Mode['words'] ? styles['config-bar-item--enabled'] : ''
					}`}
				>
					{Mode['words']}
				</p>
				<p
					onClick={() => modeClickHandler(Mode['time'])}
					className={`${styles['config-bar-item']} ${
						currentMode === Mode['time'] ? styles['config-bar-item--enabled'] : ''
					}`}
				>
					{Mode['time']}
				</p>
			</div>
			<div className={styles['separator']}></div>
			<div className={`${styles['config-bar-item__wrapper']} ${styles['config-bar-item__wrapper--options']}`}>
				{currentModeOptions.map(({ count, enabled }) => (
					<p
						key={count}
						onClick={() => optionClickHandler(count, enabled)}
						className={`${styles['config-bar-item']} ${enabled ? styles['config-bar-item--enabled'] : ''}`}
					>
						{count}
					</p>
				))}
			</div>
		</div>
	)
}

export default ConfigBar