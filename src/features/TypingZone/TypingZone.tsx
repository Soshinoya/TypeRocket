import { FC, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from 'store/index'

import { I_ModeOption, Mode } from './types'
import { setWordOptionsAction } from './reducer'
import { selectMode, selectTimeOptions, selectWordOptions } from './selectors'

import { getRandomWords } from 'utils/getRandomWords'
import { calculateWPM } from 'utils/calculateWPM'

import TypingResult from 'components/TypingResult/TypingResult'
import RestartIcon from 'components/icons/RestartIcon/RestartIcon'

import styles from './TypingZone.module.scss'

const testText =
	'old how hand house tell of much will problem program this nation system up hand than show hold which both end through long present order know where nation without what get state present for small those early then or under'

// const text = 'old how hand house tell of much will problem program'

type T_Letter = {
	key: string
	state: string
}

type TypingZoneProps = {}

const generateInitialTextArr = (text: string): T_Letter[][] =>
	text
		.split(' ')
		.map((word, wordIndex, words) =>
			[...word]
				.map(letter => ({ key: letter, state: 'default' }))
				.concat(wordIndex < words.length - 1 ? [{ key: ' ', state: 'default' }] : [])
		)

const TypingZone: FC<TypingZoneProps> = () => {
	const dispatch = useAppDispatch()

	const currentMode = useAppSelector(selectMode)
	const wordOptions = useAppSelector(selectWordOptions)
	const timeOptions = useAppSelector(selectTimeOptions)

	const [isResultOpen, setIsResultOpen] = useState(false)
	const [wpm, setWpm] = useState(0)

	const [initialCountdown, setInitialCountdown] = useState<I_ModeOption['count']>(
		timeOptions.find(option => option.enabled)?.count || timeOptions[0].count
	)
	const [countdown, setCountdown] = useState<I_ModeOption['count']>(
		timeOptions.find(option => option.enabled)?.count || timeOptions[0].count
	)
	const [isCountdownActive, setIsCountdownActive] = useState(false)
	const [errorCount, setErrorCount] = useState(0)
	const [globalIndex, setGlobalIndex] = useState({ wordIndex: 0, letterIndex: 0 })
	const [text, setText] = useState('')
	const [textArr, setTextArr] = useState<T_Letter[][]>(generateInitialTextArr(text))

	const updateText = () => {
		let updatedText: string = ''
		try {
			const wordCount = wordOptions.find(option => option.enabled)?.count || wordOptions[0].count
			updatedText = getRandomWords(testText, wordCount)
		} catch (error) {
			console.log(error)
			dispatch(setWordOptionsAction(wordOptions[0]))
			updatedText = getRandomWords(text, wordOptions[0].count)
		} finally {
			setText(updatedText)
		}
	}

	const updateLetterState = (state: 'correct' | 'incorrect', increment = true) => {
		setTextArr(prev => {
			const updated = [...prev]
			const { wordIndex, letterIndex } = globalIndex
			updated[wordIndex][letterIndex].state = state
			return updated
		})
		if (increment) changeGlobalIndex('increment')
	}

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
			if (globalIndex.wordIndex === 0 && globalIndex.letterIndex === 0) {
				if (currentMode === Mode['words']) {
					//
				} else if (currentMode === Mode['time'] && !isCountdownActive) {
					startTyping()
				}
			}
			if (
				globalIndex.wordIndex >= textArr.length - 1 &&
				globalIndex.letterIndex >= textArr[globalIndex.wordIndex].length - 1
			) {
				console.log('last word')
				endTyping()
			}
			const currentLetter = textArr[globalIndex.wordIndex][globalIndex.letterIndex]
			if (currentLetter?.key === event.key) {
				updateLetterState('correct')
			} else {
				setErrorCount(prev => prev + 1)
				updateLetterState('incorrect')
			}
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [globalIndex, currentMode])

	useEffect(() => {
		let intervalId: NodeJS.Timeout

		if (isCountdownActive && countdown > 0) {
			intervalId = setInterval(() => {
				setCountdown(prev => prev - 1)
			}, 1000)
		} else if (countdown <= 0) {
			endTyping()
		}

		return () => clearInterval(intervalId)
	}, [isCountdownActive, countdown])

	useEffect(() => {
		const newCountdown = timeOptions.find(option => option.enabled)?.count || timeOptions[0].count
		setInitialCountdown(newCountdown)
		setCountdown(newCountdown)
	}, [timeOptions])

	useEffect(() => updateText(), [wordOptions])

	useEffect(() => resetTyping(), [text, currentMode, initialCountdown, wordOptions])

	const startTyping = () => {
		if (isResultOpen) return
		if (currentMode === Mode['words']) {
			// ...
		} else if (currentMode === Mode['time']) {
			setIsCountdownActive(true)
		}
	}

	const endTyping = () => {
		console.log('-- End Typing ---')

		const updatedWpm = calculateWPM(text.split(' ').slice(0, globalIndex.wordIndex), initialCountdown)
		setWpm(updatedWpm)
		console.log(updatedWpm)

		setGlobalIndex({ wordIndex: 0, letterIndex: 0 })
		setTextArr(generateInitialTextArr(text))

		if (currentMode === Mode['time']) {
			setIsCountdownActive(false)
			setCountdown(initialCountdown)
		}

		setIsResultOpen(true)
	}

	const resetTyping = () => {
		setErrorCount(0)
		setGlobalIndex({ wordIndex: 0, letterIndex: 0 })
		setTextArr(generateInitialTextArr(text))
		setIsCountdownActive(false)
		setCountdown(initialCountdown)
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
				<div className={styles['restart']} onClick={resetTyping}>
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
