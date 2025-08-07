import { FC, useEffect, useState } from 'react'

import store, { useAppSelector, useAppDispatch } from 'store/index'

import { languages, I_ModeOption, Mode } from 'features/TypingZone/types'

import {
	setIsPunctuationAction,
	setIsNumbersAction,
	setModeAction,
	setWordOptionsAction,
	setTimeOptionsAction,
	setTextAction,
	updateText,
	setLanguageAction,
} from 'features/TypingZone/reducer'

import {
	selectLanguage,
	selectIsNumbers,
	selectIsPunctuation,
	selectMode,
	selectWordOptions,
	selectTimeOptions,
} from 'features/TypingZone/selectors'

import Modal from 'components/Modal/Modal'

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

	const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)

	useEffect(() => {
		const wordsEl = document.querySelector('.words') as HTMLElement
		dispatch(setTextAction(updateText({ ...store.getState().TypingZone }, wordsEl.offsetWidth)))
	}, [currentLanguage, isPunctuation, isNumbers, currentMode, wordOptions, timeOptions])

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

	return window.matchMedia('(min-width: 1025px)').matches ? (
		<>
			<div className={styles['config-bar']}>
				<p className={styles['config-bar-item']} onClick={() => setIsLanguageModalOpen(true)}>
					{currentLanguage.name}
				</p>
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
						className={`${styles['config-bar-item']} ${
							isNumbers ? styles['config-bar-item--enabled'] : ''
						}`}
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
							className={`${styles['config-bar-item']} ${
								enabled ? styles['config-bar-item--enabled'] : ''
							}`}
						>
							{count}
						</p>
					))}
				</div>
			</div>
			<Modal
				isOpen={isLanguageModalOpen}
				setIsOpen={setIsLanguageModalOpen}
				style={{ padding: 0 }}
				children={
					<ul>
						{Object.values(languages)
							.map(language => {
								return {
									id: language.id,
									title: language.name,
									onClick: () => {
										setIsLanguageModalOpen(false)
										dispatch(setLanguageAction(language))
									},
								}
							})
							.map(({ id, title, onClick }) => (
								<li className={styles['config-bar-modal__item']} onClick={() => onClick()} key={id}>
									{title}
								</li>
							))}
					</ul>
				}
			/>
		</>
	) : (
		<></>
	)
}

export default ConfigBar
