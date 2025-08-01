import { FC, useEffect, useRef, useState } from 'react'

import store, { useAppDispatch, useAppSelector } from 'store/index'

import { Mode, T_Word, T_CurrentLetterRect, I_ModeOption } from './types'
import { setTextAction, updateText } from './reducer'
import { selectMode, selectText, selectTimeOptions } from './selectors'

import { calculateWPM, calculateRawWPM, calculateAcc, calculateConsistency } from 'utils/calculateStats'
import { generateInitialTextArr, updateWords, closure } from './utils'

import TypingResult from 'components/TypingResult/TypingResult'
import BlinkingCursor from 'components/BlinkingCursor/BlinkingCursor'

import RestartIcon from 'components/icons/RestartIcon/RestartIcon'

import styles from './TypingZone.module.scss'

import hitAudio from 'assets/audio/error1_1.wav'
import clickAudio from 'assets/audio/click4_11.wav'

const incorrectLetterAudio = new Audio(hitAudio)
const correctLetterAudio = new Audio(clickAudio)

type TypingZoneProps = {}

const TypingZone: FC<TypingZoneProps> = () => {
	const dispatch = useAppDispatch()

	// Get data from Redux
	const currentMode = useAppSelector(selectMode)
	const timeOptions: I_ModeOption[] = useAppSelector(selectTimeOptions)
	const text = useAppSelector(selectText)

	// Local states
	const wordsElRef = useRef<HTMLDivElement | null>(null)
	const restartIconElRef = useRef<HTMLDivElement | null>(null)

	const [wordsElWidth, setWordsElWidth] = useState(0)
	// const [currentLetterRect, setCurrentLetterRect] = useState<T_CurrentLetterRect>({ top: '0px', left: '0px' })
	const [currentLetterRect, setCurrentLetterRect] = useState<T_CurrentLetterRect>({ left: '0px' })
	const [isResultOpen, setIsResultOpen] = useState(false)
	const [wpm, setWpm] = useState(0)
	const [rawWpm, setRawWpm] = useState(0)
	const [acc, setAcc] = useState(0)
	const [consistency, setConsistency] = useState(0)
	const [errorCount, setErrorCount] = useState(0)
	const [wpmPerTimeArr, setWpmPerTimeArr] = useState<{ time: number; wpm: number; rawWpm: number }[]>([])

	const [t1, setT1] = useState(0)
	const [timeBetweenKeyStrokes, setTimeBetweenKeyStrokes] = useState<number[]>([])

	const [keystrokes, setKeystrokes] = useState(0)
	const [currentEvent, setCurrentEvent] = useState<KeyboardEvent['key']>()
	const [correctWords, setCorrectWords] = useState<{ index: number; word: string }[]>([])
	const [typedWords, setTypedWords] = useState<{ index: number; word: string }[]>([])

	// timer - measures the time it takes to complete the test in seconds
	const [timer, setTimer] = useState(0)
	const [isTimerActive, setIsTimerActive] = useState(false)
	const [globalIndex, setGlobalIndex] = useState({ lineIndex: 0, wordIndex: 0, letterIndex: 0 })
	const [textArr, setTextArr] = useState<T_Word[][]>(generateInitialTextArr(text))

	const { changeGlobalIndex, updateLetterState } = closure(textArr, globalIndex, setGlobalIndex, setTextArr)

	// Keydown handler
	const handleKeyDown = (event: KeyboardEvent) => {
		setCurrentEvent(event.key)

		setKeystrokes(keystrokes + 1)

		incorrectLetterAudio.pause()
		incorrectLetterAudio.currentTime = 0
		correctLetterAudio.pause()
		correctLetterAudio.currentTime = 0

		if (event.key === 'Backspace') {
			changeGlobalIndex('decrement')
			return
		}

		if (event.key.length === 1) {
			startTyping()

			// Recording the time between keystrokes
			let t2 = performance.now() // Getting the current time in ms
			let deltaT = Math.round(t2 - t1) // Calculating the time difference between the current and previous clicks
			setTimeBetweenKeyStrokes(prev => [...prev, deltaT])
			setT1(t2)

			const { lineIndex, wordIndex, letterIndex } = globalIndex

			const currentLetter = textArr[lineIndex]?.[wordIndex]?.letters?.[letterIndex]

			if (currentLetter?.key === event.key) {
				updateLetterState('correct')
				correctLetterAudio.play()

				if (textArr[lineIndex][wordIndex].state !== 'incorrect') {
					textArr[lineIndex][wordIndex].state = 'correct'
				}
			} else {
				setErrorCount(prev => prev + 1)
				updateLetterState('incorrect')
				textArr[lineIndex][wordIndex].state = 'incorrect'
				incorrectLetterAudio.play()
			}

			// Проверка на окончание набора текста
			if (
				textArr[lineIndex][wordIndex].index >= textArr.flat().length - 1 &&
				letterIndex >= textArr[lineIndex][wordIndex].letters.length - 1
			) {
				endTyping()
			}
		}
	}

	useEffect(() => {
		setTextArr(generateInitialTextArr(text))
	}, [text])

	useEffect(() => {
		if (textArr.length > 0) {
			setCorrectWords(prevCorrectWords =>
				updateWords(
					prevCorrectWords,
					textArr,
					word => word.state === 'correct' && word.letters.every(({ state }) => state === 'correct'),
					({ index, letters }) => ({
						index,
						word: letters.map(({ key }) => key).join(''),
					})
				)
			)

			setTypedWords(prevTypedWords =>
				updateWords(
					prevTypedWords,
					textArr,
					word => word.letters.every(({ state }) => state !== 'default'),
					({ index, letters }) => ({
						index,
						word: letters.map(({ key }) => key).join(''),
					})
				)
			)
		}
	}, [globalIndex])

	// Deleting a letter's state when pressing Backspace
	useEffect(() => {
		if (currentEvent === 'Backspace') {
			setTextArr(prev => {
				const updated = [...prev]
				const { lineIndex, wordIndex, letterIndex } = globalIndex

				if (letterIndex > 0 || (wordIndex > 0 && letterIndex === 0)) {
					const letter = updated[lineIndex][wordIndex]?.letters?.[letterIndex]
					if (letter?.state) {
						letter.state = 'default'
					}
				}
				return updated
			})
		}
	}, [currentEvent, globalIndex])

	// Key event listener
	useEffect(() => {
		if (isResultOpen) return
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [globalIndex, currentMode, isResultOpen, textArr])

	// Starting the timer
	useEffect(() => {
		let intervalId: NodeJS.Timeout | undefined

		if (!isTimerActive) return

		intervalId = setInterval(() => {
			const newTimer = timer + 1
			setTimer(newTimer)
			setWpmPerTimeArr(prev => [
				...prev,
				{
					time: newTimer,
					wpm: calculateWPM(
						correctWords.map(({ word }) => word),
						newTimer
					),
					rawWpm: calculateRawWPM(
						typedWords.map(({ word }) => word),
						newTimer
					),
				},
			])
		}, 1000)

		const targetTime = timeOptions.find(option => option.enabled)?.count || timeOptions[0].count

		if (timer >= targetTime && currentMode === Mode.time) {
			endTyping()
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId)
			}
		}
	}, [isTimerActive, timer])

	useEffect(() => {
		if (wordsElRef.current) {
			setWordsElWidth(wordsElRef.current.offsetWidth)
		}
	}, [wordsElRef])

	useEffect(() => {
		resetTyping()
	}, [text])

	useEffect(() => {
		const wordsContainerElement = document.querySelector('.words') as HTMLElement
		const wordEl = wordsContainerElement?.querySelector(`[word-id="${globalIndex.wordIndex}"]`)
		const letterEl = wordEl?.querySelector(`[letter-id="${globalIndex.letterIndex}"]`)

		if (!wordsContainerElement || !letterEl) return

		const wordsContainerRect = wordsContainerElement.getBoundingClientRect()
		const letterRect = letterEl.getBoundingClientRect()

		let leftOffset = letterRect.left - wordsContainerRect.left

		setCurrentLetterRect({
			left: `${leftOffset}px`,
		})
	}, [globalIndex])

	useEffect(() => {
		if (!isResultOpen) {
			dispatch(setTextAction(updateText({ ...store.getState().TypingZone }, wordsElWidth)))
			resetTyping()
		}
	}, [isResultOpen])

	// Focus on restart icon when pressing tab
	useEffect(() => {
		const tabPressHandler = (e: KeyboardEvent) => {
			if (restartIconElRef.current && e.key === 'Tab') {
				e.preventDefault()
				restartIconElRef.current.focus()
			}
		}

		document.addEventListener('keydown', tabPressHandler)

		return () => document.removeEventListener('keydown', tabPressHandler)
	}, [restartIconElRef])

	const restartIconHandler = () => {
		dispatch(setTextAction(updateText({ ...store.getState().TypingZone }, wordsElWidth)))
		resetTyping()
	}

	// The beginning of the test
	const startTyping = () => {
		if (isResultOpen) return
		setIsTimerActive(true)
	}

	// The end of the test
	const endTyping = () => {
		setIsTimerActive(false)

		setWpm(
			calculateWPM(
				correctWords.map(({ word }) => word),
				timer
			)
		)
		setRawWpm(
			calculateRawWPM(
				typedWords.map(({ word }) => word),
				timer
			)
		)
		setAcc(
			calculateAcc(
				typedWords.map(({ word }) => word),
				errorCount
			)
		)
		setConsistency(calculateConsistency(timeBetweenKeyStrokes))

		setIsResultOpen(true)
	}

	// Test Reset
	const resetTyping = () => {
		setErrorCount(0)
		setGlobalIndex({ lineIndex: 0, wordIndex: 0, letterIndex: 0 })
		setIsTimerActive(false)
		setTimer(0)
		setTimeBetweenKeyStrokes([])
		setT1(0)
		setWpmPerTimeArr([])
		setKeystrokes(0)
		setCorrectWords([])
		setTypedWords([])
		document.querySelectorAll('.words [word-id]').forEach(elem => {
			const el = elem as HTMLElement
			el.style.top = '0px'
		})
	}

	return (
		<>
			<div className={styles['typing-zone']}>
				<div className={`words ${styles['words']}`} ref={wordsElRef}>
					{textArr.length > 0 ? (
						<>
							{[...textArr]
								.splice(globalIndex.lineIndex, 4)
								.flat()
								.map((word, wordIdx) => (
									<div className={styles['word']} word-id={wordIdx} key={wordIdx}>
										{word.letters.map((letter, letterIdx) => (
											<div
												className={`${styles['letter']} ${
													letter.key === ' ' ? styles['space'] : ''
												} ${
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
							<BlinkingCursor left={currentLetterRect.left} />
						</>
					) : null}
				</div>
				<div
					ref={restartIconElRef}
					tabIndex={0}
					className={styles['restart']}
					onClick={restartIconHandler}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							restartIconHandler()
							restartIconElRef.current?.blur()
						}
					}}
				>
					<RestartIcon style={{ width: '24px', height: '24px' }} />
				</div>
				{currentMode === Mode.time && (
					<p className={`${styles['countdown']} ${isTimerActive ? '' : styles['countdown--hide']}`}>
						{(timeOptions.find(option => option.enabled)?.count || timeOptions[0].count) - timer}
					</p>
				)}
			</div>
			<TypingResult
				wpm={wpm}
				rawWpm={rawWpm}
				accuracy={acc}
				consistency={consistency}
				errorCount={errorCount}
				time={timer}
				wpmPerTimeArr={wpmPerTimeArr}
				keystrokes={keystrokes}
				isOpen={isResultOpen}
				setIsOpen={setIsResultOpen}
			/>
		</>
	)
}

export default TypingZone
