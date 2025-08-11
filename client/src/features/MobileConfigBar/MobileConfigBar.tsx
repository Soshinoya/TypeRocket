import { FC, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from 'store/index'

import { I_ModeOption, languages, Mode } from 'features/Text/types'
import {
	setIsNumbersAction,
	setIsPunctuationAction,
	setLanguageAction,
	setModeAction,
	setTimeOptionsAction,
	setWordOptionsAction,
} from 'features/Text/reducer'
import {
	selectLanguage,
	selectIsNumbers,
	selectIsPunctuation,
	selectMode,
	selectWordOptions,
	selectTimeOptions,
} from 'features/Text/selectors'

import Modal from 'components/Modal/Modal'

import styles from './MobileConfigBar.module.scss'

type MobileConfigBarProps = {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileConfigBar: FC<MobileConfigBarProps> = ({ isOpen, setIsOpen }) => {
	const dispatch = useAppDispatch()

	const currentLanguage = useAppSelector(selectLanguage)
	const isPunctuation = useAppSelector(selectIsPunctuation)
	const isNumbers = useAppSelector(selectIsNumbers)
	const currentMode = useAppSelector(selectMode)
	const wordOptions = useAppSelector(selectWordOptions)
	const timeOptions = useAppSelector(selectTimeOptions)

	const [currentModeOptions, setCurrentModeOptions] = useState<I_ModeOption[]>(wordOptions)

	const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)

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

	useEffect(() => {
		if (currentMode === Mode['words']) {
			setCurrentModeOptions(wordOptions)
		} else {
			setCurrentModeOptions(timeOptions)
		}
	}, [currentMode, wordOptions, timeOptions])

	return (
		<>
			<Modal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				children={
					<div className={styles['mobile-config-bar']}>
						<div className={styles['mobile-config-bar-item']}>
							<h3 className={styles['mobile-config-bar-item__title']}>Languages</h3>
							<p
								className={styles['mobile-config-bar-item__value']}
								onClick={() => {
									setIsOpen(false)
									setIsLanguageModalOpen(true)
								}}
							>
								{currentLanguage.name}
							</p>
						</div>
						<div className={styles['mobile-config-bar-item']}>
							<h3 className={styles['mobile-config-bar-item__title']}>Additions</h3>
							<div className={styles['mobile-config-bar-item__wrapper']}>
								<p
									onClick={() => dispatch(setIsPunctuationAction(!isPunctuation))}
									className={`${styles['mobile-config-bar-item__value']} ${
										isPunctuation ? styles['mobile-config-bar-item__value--enabled'] : ''
									}`}
								>
									Punctuation
								</p>
								<p
									onClick={() => dispatch(setIsNumbersAction(!isNumbers))}
									className={`${styles['mobile-config-bar-item__value']} ${
										isNumbers ? styles['mobile-config-bar-item__value--enabled'] : ''
									}`}
								>
									Numbers
								</p>
							</div>
						</div>
						<div className={styles['mobile-config-bar-item']}>
							<h3 className={styles['mobile-config-bar-item__title']}>Mode</h3>
							<div className={styles['mobile-config-bar-item__wrapper']}>
								<p
									onClick={() => modeClickHandler(Mode['words'])}
									className={`${styles['mobile-config-bar-item__value']} ${
										currentMode === Mode['words']
											? styles['mobile-config-bar-item__value--enabled']
											: ''
									}`}
								>
									{Mode['words']}
								</p>
								<p
									onClick={() => modeClickHandler(Mode['time'])}
									className={`${styles['mobile-config-bar-item__value']} ${
										currentMode === Mode['time']
											? styles['mobile-config-bar-item__value--enabled']
											: ''
									}`}
								>
									{Mode['time']}
								</p>
							</div>
						</div>
						<div className={styles['mobile-config-bar-item']}>
							<h3 className={styles['mobile-config-bar-item__title']}>Mode options</h3>
							<div
								className={`${styles['mobile-config-bar-item__wrapper']} ${styles['mobile-config-bar-item__wrapper--options']}`}
							>
								{currentModeOptions.map(({ count, enabled }) => (
									<p
										key={count}
										onClick={() => optionClickHandler(count, enabled)}
										className={`${styles['mobile-config-bar-item__value']} ${
											enabled ? styles['mobile-config-bar-item__value--enabled'] : ''
										}`}
									>
										{count}
									</p>
								))}
							</div>
						</div>
					</div>
				}
			/>
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
								<li
									className={styles['mobile-config-bar-modal__item']}
									onClick={() => onClick()}
									key={id}
								>
									{title}
								</li>
							))}
					</ul>
				}
			/>
		</>
	)
}

export default MobileConfigBar
