import { FC, useEffect, useState } from 'react'

import store, { useAppDispatch, useAppSelector } from 'store/index'

import { Mode, T_Letter, T_CurrentLetterRect } from './types'
import { setTextAction, updateText } from './reducer'
import { selectMode, selectText, selectTimeOptions } from './selectors'

import { calculateWPM } from 'utils/calculateStats'
import { generateInitialTextArr, closure, adjustWordPositions } from './utils'

import TypingResult from 'components/TypingResult/TypingResult'
import BlinkingCursor from 'components/BlinkingCursor/BlinkingCursor'
import RestartIcon from 'components/icons/RestartIcon/RestartIcon'

import styles from './TypingZone.module.scss'

import hitAudio from 'assets/audio/typewriter-key-hit.mp3'

const incorrectLetterAudio = new Audio(hitAudio)

type TypingZoneProps = {}

const TypingZone: FC<TypingZoneProps> = () => {
	const dispatch = useAppDispatch()

	// Получаем данные из Redux
	const currentMode = useAppSelector(selectMode)
	const timeOptions = useAppSelector(selectTimeOptions)
	const text = useAppSelector(selectText)

	// Локальные состояния
	const [currentLetterRect, setCurrentLetterRect] = useState<T_CurrentLetterRect>({ top: '0px', left: '0px' })
	const [isResultOpen, setIsResultOpen] = useState(false)
	const [wpm, setWpm] = useState(0)

	const [currentEvent, setCurrentEvent] = useState<KeyboardEvent['key']>()
	const [countdown, setCountdown] = useState<number>(
		timeOptions.find(option => option.enabled)?.count || timeOptions[0].count
	)
	const [isCountdownActive, setIsCountdownActive] = useState(false)
	const [errorCount, setErrorCount] = useState(0)
	const [globalIndex, setGlobalIndex] = useState({ wordIndex: 0, letterIndex: 0 })
	const [textArr, setTextArr] = useState<T_Letter[][]>(generateInitialTextArr(text))

	const { changeGlobalIndex, updateLetterState } = closure(textArr, globalIndex, setGlobalIndex, setTextArr)

	// Обработчик нажатий клавиш
	const handleKeyDown = (event: KeyboardEvent) => {
		setCurrentEvent(event.key)
		incorrectLetterAudio.pause()
		incorrectLetterAudio.currentTime = 0

		if (event.key === 'Backspace') {
			changeGlobalIndex('decrement')
			return
		}

		if (event.key.length === 1) {
			// Начало набора текста
			if (!isCountdownActive && currentMode === Mode['time']) {
				startTyping()
			}

			const currentLetter = textArr[globalIndex.wordIndex]?.[globalIndex.letterIndex]
			if (currentLetter?.key === event.key) {
				updateLetterState('correct')
			} else {
				setErrorCount(prev => prev + 1)
				updateLetterState('incorrect')
				incorrectLetterAudio.play()
			}

			// Проверка на окончание набора текста
			if (
				globalIndex.wordIndex >= textArr.length - 1 &&
				globalIndex.letterIndex >= textArr[globalIndex.wordIndex].length - 1
			) {
				endTyping()
			}
		}
	}

	useEffect(() => {
		if (currentEvent === 'Backspace') {
			setTextArr(prev => {
				const updated = [...prev]
				const { wordIndex, letterIndex } = globalIndex

				// Удаление состояния буквы при нажатии Backspace
				if (letterIndex > 0 || (wordIndex > 0 && letterIndex === 0)) {
					const letter = updated[wordIndex]?.[letterIndex]
					if (letter?.state) {
						letter.state = 'default'
					}
				}
				return updated
			})
		}
	}, [currentEvent, globalIndex])

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
		setCountdown(timeOptions.find(option => option.enabled)?.count || timeOptions[0].count)
	}, [timeOptions])

	useEffect(() => {
		resetTyping()
	}, [text])

	// Слушатель событий клавиш
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [globalIndex, currentMode])

	useEffect(() => {
		const wordsElement = document.querySelector('.words') as HTMLElement
		const wordEl = wordsElement?.querySelector(`[word-id="${globalIndex.wordIndex}"]`)
		const letterEl = wordEl?.querySelector(`[letter-id="${globalIndex.letterIndex}"]`)

		if (!wordsElement || !letterEl) return

		const wordsRect = wordsElement.getBoundingClientRect()
		const letterRect = letterEl.getBoundingClientRect()

		let topOffset = letterRect.top - wordsRect.top
		let leftOffset = letterRect.left - wordsRect.left

		if (topOffset >= 28) {
			adjustWordPositions(wordsElement, topOffset)
			topOffset = 0 // Сбросим topOffset, если он больше 28
		}

		setCurrentLetterRect({
			top: `${topOffset}px`,
			left: `${leftOffset}px`,
		})
	}, [globalIndex])

	const restartIconHandler = () => {
		dispatch(setTextAction(updateText({ ...store.getState().TypingZone })))
		resetTyping()
	}

	// Начало теста
	const startTyping = () => {
		if (isResultOpen) return
		if (currentMode === Mode['time']) setIsCountdownActive(true)
	}

	// Завершение теста
	const endTyping = () => {
		console.log('Количество ошибок: ', errorCount)
		const wordsTyped = text.slice(0, globalIndex.wordIndex)
		setWpm(calculateWPM(wordsTyped, timeOptions.find(option => option.enabled)?.count || timeOptions[0].count))
		setIsResultOpen(true)
		dispatch(setTextAction(updateText({ ...store.getState().TypingZone })))
		resetTyping()
	}

	// Сброс теста
	const resetTyping = () => {
		setErrorCount(0)
		setGlobalIndex({ wordIndex: 0, letterIndex: 0 })
		setTextArr(generateInitialTextArr(text))
		setCountdown(timeOptions.find(option => option.enabled)?.count || timeOptions[0].count)
		setIsCountdownActive(false)
		document.querySelectorAll('.words [word-id]').forEach(elem => {
			const el = elem as HTMLElement
			el.style.top = '0px'
		})
	}

	return (
		<>
			<div className={styles['typing-zone']}>
				<div className={`words ${styles['words']}`}>
					{textArr.map((word, wordIdx) => (
						<div className={styles['word']} word-id={wordIdx} key={wordIdx}>
							{word.map((letter, letterIdx) => (
								<div
									className={`${styles['letter']} ${letter.key === ' ' ? styles['space'] : ''} ${
										letter.state !== 'default' && letter.key !== ' '
											? styles[letter.state]
											: styles[`space--${letter.state}`]
									}`}
									letter-id={letterIdx}
									key={letterIdx}
								>
									{letter.key}
								</div>
							))}
						</div>
					))}
					<BlinkingCursor top={currentLetterRect.top} left={currentLetterRect.left} />
				</div>
				<div className={styles['restart']} onClick={restartIconHandler}>
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
