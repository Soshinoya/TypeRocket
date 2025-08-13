import { FC, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

import styles from './Text.module.scss'

import store, { useAppDispatch, useAppSelector } from 'store/index'

import { T_Char } from './types'
import { selectCurrentCharIndex, selectCurrentLineIndex, selectMistakes, selectMode, selectText } from './selectors'

import { resetTestStateAction, setIsTestFinishedAction, setIsTestStartedAction } from 'features/TypingZone/reducer'
import { selectIsTestFinished, selectIsTestStarted } from 'features/TypingZone/selectors'

import { setCorrectWordsAction, setKeystrokesAction, setTypedWordsAction } from 'features/Statistics/reducer'
import { selectKeystrokes } from 'features/Statistics/selectors'

import useClickOutside from 'hooks/useClickOutside'

import {
	compareChars,
	prepareText,
	updateActiveLine,
	changeIndex,
	backspaceHandler,
	getTypedAndCorrectWords,
	updateText,
} from './utils'
import { setCurrentCharIndexAction, setCurrentLineIndexAction, setMistakesAction, setTextAction } from './reducer'

type TextProps = {}

const Text: FC<TextProps> = ({}) => {
	const wordsRef = useRef<HTMLDivElement>(null)
	const hiddenInputRef = useRef<HTMLInputElement>(null)
	const activeLineRef = useRef<HTMLDivElement>(null)

	const dispatch = useAppDispatch()

	const text = useAppSelector(selectText)

	const isTestStarted = useAppSelector(selectIsTestStarted)
	const isTestFinished = useAppSelector(selectIsTestFinished)

	const currentCharIndex = useAppSelector(selectCurrentCharIndex)
	const currentLineIndex = useAppSelector(selectCurrentLineIndex)
	const mistakes = useAppSelector(selectMistakes)
	const mode = useAppSelector(selectMode)

	const keystrokes = useAppSelector(selectKeystrokes)

	const [preparedText, setPreparedText] = useState<T_Char[][]>(prepareText(text, mode))

	const [isTestOnFocus, setIsTestOnFocus] = useState(false)

	const [wordsElWidth, setWordsElWidth] = useState(0)

	useClickOutside(wordsRef, isClickOutside => setIsTestOnFocus(isClickOutside))

	const handleInput = (e: FormEvent<HTMLInputElement>) => {
		if (!e) return

		// @ts-ignore
		const currentValue = e.nativeEvent?.data

		if (!currentValue) return

		dispatch(setIsTestStartedAction(true))

		dispatch(setKeystrokesAction(keystrokes + 1))

		const { newPreparedText, newMistakes } = compareChars(
			preparedText,
			currentCharIndex,
			currentLineIndex,
			currentValue,
			mistakes
		)

		const { newCurrentCharIndex, newCurrentLineIndex } = changeIndex(
			preparedText,
			currentCharIndex,
			currentLineIndex,
			'increment'
		)

		if (
			currentLineIndex === preparedText.length - 1 &&
			currentCharIndex === preparedText[preparedText.length - 1].length - 1
		) {
			dispatch(setIsTestStartedAction(false))
			dispatch(setIsTestFinishedAction(true))
		}

		setPreparedText(newPreparedText)
		dispatch(setCurrentCharIndexAction(newCurrentCharIndex))
		dispatch(setCurrentLineIndexAction(newCurrentLineIndex))
		dispatch(setMistakesAction(newMistakes))
	}

	const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
		const currentKey = e.key

		if (currentKey === 'Backspace') {
			const currentChar = preparedText[currentLineIndex][currentCharIndex - 1]

			currentChar.state = backspaceHandler(currentChar).state

			const { newCurrentCharIndex, newCurrentLineIndex } = changeIndex(
				preparedText,
				currentCharIndex,
				currentLineIndex,
				'decrement'
			)

			dispatch(setCurrentCharIndexAction(newCurrentCharIndex))
			dispatch(setCurrentLineIndexAction(newCurrentLineIndex))
		}
	}

	useEffect(() => {
		const [typedWords, correctWords] = getTypedAndCorrectWords(preparedText, currentLineIndex, currentCharIndex)

		dispatch(setTypedWordsAction(typedWords))
		dispatch(setCorrectWordsAction(correctWords))
	}, [currentCharIndex, currentLineIndex])

	useEffect(() => {
		if (!wordsRef.current) return
		setWordsElWidth(wordsRef.current.offsetWidth)
	}, [wordsRef])

	// Test reset
	useEffect(() => {
		if (isTestStarted || isTestFinished) return
		dispatch(setCurrentCharIndexAction(0))
		dispatch(setCurrentLineIndexAction(0))
		dispatch(setMistakesAction(0))
		setIsTestOnFocus(false)

		dispatch(setTextAction(updateText({ ...store.getState().Text }, wordsElWidth)))

		if (wordsRef.current) {
			wordsRef.current.style.transform = 'none'
		}
	}, [isTestStarted, isTestFinished])

	useEffect(() => {
		updateActiveLine(
			activeLineRef,
			wordsRef,
			currentLineIndex,
			window.matchMedia('(max-width: 600px)').matches ? 31 : 43
		)
	}, [currentLineIndex])

	useEffect(() => {
		setPreparedText(prepareText(text, mode))
		dispatch(resetTestStateAction())
	}, [text])

	return (
		<>
			<div className={styles['words__wrapper']}>
				<div
					ref={wordsRef}
					onClick={() => {
						setIsTestOnFocus(true)
						if (!hiddenInputRef.current) return
						hiddenInputRef.current.focus()
					}}
					className={`words ${styles['words']} ${isTestOnFocus ? '' : styles['words--blur']}`}
				>
					{preparedText.slice(currentLineIndex, currentLineIndex + 4).map((line, i) => (
						<div ref={currentLineIndex === i ? activeLineRef : null} className={styles['line']} key={i}>
							{line.map(({ char, state }, i) => (
								<div
									className={`${styles['char']} ${
										state !== 'default' ? styles[`char--${state}`] : ''
									} ${char === ' ' ? styles['char-space'] : ''}`}
									key={i}
								>
									{char}
								</div>
							))}
						</div>
					))}
				</div>
				<div
					className={`${styles['words-blur-hint']} ${isTestOnFocus ? '' : styles['words-blur-hint--active']}`}
				>
					Click here to focus
				</div>
			</div>
			<input
				ref={hiddenInputRef}
				onInput={handleInput}
				onPaste={e => e.preventDefault()}
				onKeyDown={handleKeydown}
				type='text'
				autoCapitalize='off'
				autoComplete='off'
				autoCorrect='off'
				spellCheck='false'
				// aria-hidden='true'
				tabIndex={-1}
				style={{
					opacity: 0,
					position: 'absolute',
					top: '-1000px',
					left: '-1000px',
					pointerEvents: 'none',
					width: 0,
					height: 0,
				}}
			/>
		</>
	)
}

export default Text
