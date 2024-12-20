import { FC, useEffect, useState } from 'react'

import store, { useAppDispatch, useAppSelector } from 'store/index'

import { I_ModeOption, Mode } from './types'
import { setTextAction, updateText } from './reducer'
import { selectMode, selectText, selectTimeOptions } from './selectors'

import { calculateWPM } from 'utils/calculateWPM'

import TypingResult from 'components/TypingResult/TypingResult'
import RestartIcon from 'components/icons/RestartIcon/RestartIcon'

import styles from './TypingZone.module.scss'

// Тип буквы с состоянием
type T_Letter = {
	key: string
	state: string
}

type TypingZoneProps = {}

const TypingZone: FC<TypingZoneProps> = () => {
	const dispatch = useAppDispatch()
	// Получаем данные из Redux
	const currentMode = useAppSelector(selectMode)
	const timeOptions = useAppSelector(selectTimeOptions)
	const text = useAppSelector(selectText)

	// Генерация начального массива текста
	const generateInitialTextArr = (text: string[]): T_Letter[][] =>
		text.map((word, wordIndex, words) =>
			[...word]
				.map(letter => ({ key: letter, state: 'default' }))
				.concat(wordIndex < words.length - 1 ? [{ key: ' ', state: 'default' }] : [])
		)

	// Локальные состояния
	const [isResultOpen, setIsResultOpen] = useState(false)
	const [wpm, setWpm] = useState(0)

	const [initialCountdown, setInitialCountdown] = useState<I_ModeOption['count']>(
		timeOptions.find(option => option.enabled)?.count || timeOptions[0].count
	)
	const [countdown, setCountdown] = useState<number>(initialCountdown)
	const [isCountdownActive, setIsCountdownActive] = useState(false)
	const [errorCount, setErrorCount] = useState(0)
	const [globalIndex, setGlobalIndex] = useState({ wordIndex: 0, letterIndex: 0 })
	const [textArr, setTextArr] = useState<T_Letter[][]>(generateInitialTextArr(text))

	// Изменение состояния текущей буквы
	const updateLetterState = (state: 'correct' | 'incorrect', increment = true) => {
		setTextArr(prev => {
			const updated = [...prev]
			const { wordIndex, letterIndex } = globalIndex
			updated[wordIndex][letterIndex].state = state
			return updated
		})
		if (increment) changeGlobalIndex('increment')
	}

	// Изменение текущего индекса
	const changeGlobalIndex = (action: 'increment' | 'decrement') => {
		setGlobalIndex(({ wordIndex, letterIndex }) => {
			if (action === 'increment') {
				if (letterIndex < textArr[wordIndex].length - 1) {
					return { wordIndex, letterIndex: letterIndex + 1 }
				}
				return wordIndex < textArr.length - 1
					? { wordIndex: wordIndex + 1, letterIndex: 0 }
					: { wordIndex, letterIndex }
			} else {
				if (letterIndex > 0) {
					return { wordIndex, letterIndex: letterIndex - 1 }
				}
				return wordIndex > 0
					? { wordIndex: wordIndex - 1, letterIndex: textArr[wordIndex - 1].length - 1 }
					: { wordIndex, letterIndex }
			}
		})
	}

	// Обработчик нажатий клавиш
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Backspace') {
			changeGlobalIndex('decrement')
			setTextArr(prev => {
				const updated = [...prev]
				const { wordIndex, letterIndex } = globalIndex
				if (letterIndex > 0 || (wordIndex > 0 && letterIndex === 0)) {
					updated[wordIndex][letterIndex - 1]?.state &&
						(updated[wordIndex][letterIndex - 1].state = 'default')
				}
				return updated
			})
			return
		}

		if (event.key.length === 1) {
			// Начало набора текста
			if (!isCountdownActive && currentMode === Mode['time']) startTyping()

			const currentLetter = textArr[globalIndex.wordIndex][globalIndex.letterIndex]
			if (currentLetter?.key === event.key) {
				updateLetterState('correct')
			} else {
				setErrorCount(prev => prev + 1)
				updateLetterState('incorrect')
			}

			if (
				globalIndex.wordIndex >= textArr.length - 1 &&
				globalIndex.letterIndex >= textArr[globalIndex.wordIndex].length - 1
			) {
				endTyping()
			}
		}
	}

	// Запуск таймера обратного отсчета
	useEffect(() => {
		let intervalId: NodeJS.Timeout
		if (isCountdownActive && countdown > 0) {
			intervalId = setInterval(() => setCountdown(prev => prev - 1), 1000)
		} else if (countdown <= 0) {
			endTyping()
		}
		return () => clearInterval(intervalId)
	}, [isCountdownActive, countdown])

	// Обновление тайпинга при изменении опций времени
	useEffect(() => {
		setInitialCountdown(timeOptions.find(option => option.enabled)?.count || timeOptions[0].count)
	}, [timeOptions])

	useEffect(() => {
		resetTyping()
	}, [text])

	// Слушатель событий клавиш
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [globalIndex, currentMode])

	// Начало теста
	const startTyping = () => {
		if (isResultOpen) return
		if (currentMode === Mode['time']) setIsCountdownActive(true)
	}

	// Завершение теста
	const endTyping = () => {
		console.log('Количество ошибок: ', errorCount)
		const wordsTyped = text.slice(0, globalIndex.wordIndex)
		setWpm(calculateWPM(wordsTyped, initialCountdown))
		setIsResultOpen(true)
		dispatch(setTextAction(updateText({ ...store.getState().TypingZone })))
		resetTyping()
	}

	// Сброс теста
	const resetTyping = () => {
		setErrorCount(0)
		setGlobalIndex({ wordIndex: 0, letterIndex: 0 })
		setTextArr(generateInitialTextArr(text))
		setCountdown(initialCountdown)
		setIsCountdownActive(false)
	}

	return (
		<>
			<div className={styles['typing-zone']}>
				<div className={styles['words']}>
					{textArr.map((word, wordIdx) => (
						<div className={styles['word']} key={wordIdx}>
							{word.map((letter, letterIdx) => (
								<div className={`${styles['letter']} ${styles[letter.state]}`} key={letterIdx}>
									{letter.key}
								</div>
							))}
						</div>
					))}
				</div>
				<div
					className={styles['restart']}
					onClick={() => dispatch(setTextAction(updateText({ ...store.getState().TypingZone })))}
				>
					<RestartIcon style={{ width: '24px', height: '24px' }} />
				</div>
				<p className={`${styles['countdown']} ${isCountdownActive ? '' : styles['countdown--hide']}`}>
					{countdown}
				</p>
			</div>
			<TypingResult wpm={wpm} isOpen={isResultOpen} setIsOpen={setIsResultOpen} />
		</>
	)
}

export default TypingZone
