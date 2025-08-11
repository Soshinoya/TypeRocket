import { RefObject } from 'react'

// @ts-ignore
import MeasureText from 'text-measure'

import { I_Action } from 'store/types'
import { I_ModeOption, I_Text, Mode, T_Char } from './types'

import { languagesData } from 'data/languages/languages'

import { addNumbers, addPunctuation } from 'utils/utils'
import { getRandomWords } from 'utils/getRandomWords'

import hitAudio from 'assets/audio/error1_1.wav'
import clickAudio from 'assets/audio/click4_11.wav'

const incorrectLetterAudio = new Audio(hitAudio)
const correctLetterAudio = new Audio(clickAudio)

const textMeasure = window.matchMedia('(max-width: 600px)').matches
	? new MeasureText('24px JetBrains Mono')
	: new MeasureText('32px JetBrains Mono')

export const updateItems = (items: I_ModeOption[], action: I_Action): I_ModeOption[] => {
	return items.map(item => {
		const updatedItem = { ...item }

		updatedItem.enabled = false

		if (action.payload.count === updatedItem.count) {
			updatedItem.enabled = true
		}

		return updatedItem
	})
}

// Обновление текста
export const updateText = (state: I_Text, containerWidth: number): string[][] => {
	const { language, isPunctuation, isNumbers, mode, wordOptions } = state

	let text: string[][] = []
	let currentLine = 0
	let currentLineWidth = 0

	text[currentLine] = []

	// wordsArr присваиваем исходный набор слов
	let wordsArr: string[] = languagesData[language.key]

	// Изменение количества слов в тексте
	if (mode === Mode['words']) {
		const wordCount = wordOptions.find(option => option.enabled)?.count || wordOptions[0].count
		wordsArr = getRandomWords(wordsArr, wordCount)
	} else if (mode === Mode['time']) {
		wordsArr = getRandomWords(wordsArr)
	}

	if (isPunctuation) {
		wordsArr = addPunctuation(wordsArr)
	}

	if (isNumbers) {
		wordsArr = addNumbers(wordsArr)
	}

	wordsArr.forEach(word => {
		const wordWidth = +(textMeasure.width(word) + 10).toFixed(2)

		// Проверяем, поместится ли слово в текущую строку
		if (currentLineWidth + wordWidth > containerWidth) {
			currentLine += 1
			currentLineWidth = 0
			text[currentLine] = [] // Инициализируем новую строку
		}

		// Добавляем слово в текущую строку
		text[currentLine].push(word)
		currentLineWidth += wordWidth
	})

	return text
}

export const prepareText = (text: string[][], mode: Mode): T_Char[][] => {
	const newText = text.map(line => {
		const newLine: T_Char[] = []
		line.map(word => {
			const chars: T_Char[] = [...word].map(char => ({ char, state: 'default' }))

			// Добавляем пробел
			chars.push({ char: ' ', state: 'default' })

			newLine.push(...chars)
		})
		return newLine
	})
	if (mode === 'words') {
		newText[newText.length - 1].pop()
	}
	return newText
}

export const updateActiveLine = (
	activeLineRef: RefObject<HTMLDivElement>,
	wordsRef: RefObject<HTMLDivElement>,
	linesBeforeStart: number,
	charHeight: number
) => {
	if (!activeLineRef.current || !wordsRef.current) return

	const newOffset = -activeLineRef.current.offsetTop + charHeight * linesBeforeStart

	wordsRef.current.style.transform = `translateY(${newOffset}px)`
}

type T_CompareChars = (
	preparedText: T_Char[][],
	currentCharIndex: number,
	currentLineIndex: number,
	pressedKey: string,
	mistakes: number
) => { newPreparedText: T_Char[][]; newMistakes: number }

type T_ChangeIndex = (
	preparedText: T_Char[][],
	currentCharIndex: number,
	currentLineIndex: number,
	action: 'increment' | 'decrement'
) => { newCurrentCharIndex: number; newCurrentLineIndex: number }

type T_BackspaceHandler = (char: T_Char) => T_Char

export const changeIndex: T_ChangeIndex = (preparedText, currentCharIndex, currentLineIndex, action) => {
	const res: ReturnType<T_ChangeIndex> = {
		newCurrentCharIndex: currentCharIndex,
		newCurrentLineIndex: currentLineIndex,
	}

	const charsInCurrentLine = preparedText[currentLineIndex].length - 1

	if (action === 'increment') {
		if (currentCharIndex === charsInCurrentLine) {
			res.newCurrentCharIndex = 0
			res.newCurrentLineIndex += 1
		} else {
			res.newCurrentCharIndex += 1
		}
	} else {
		if (currentCharIndex !== 0) {
			res.newCurrentCharIndex -= 1
		}
	}

	return res
}

const updateCharState = ({ char }: T_Char, newState: T_Char['state']) => ({ char, state: newState })

export const compareChars: T_CompareChars = (
	preparedText,
	currentCharIndex,
	currentLineIndex,
	pressedKey,
	mistakes
) => {
	incorrectLetterAudio.pause()
	incorrectLetterAudio.currentTime = 0
	correctLetterAudio.pause()
	correctLetterAudio.currentTime = 0

	let newMistakes = mistakes

	const currentChar = preparedText[currentLineIndex][currentCharIndex]

	if (currentChar.char === pressedKey) {
		currentChar.state = updateCharState(currentChar, 'correct').state
		correctLetterAudio.play()
	} else {
		currentChar.state = updateCharState(currentChar, 'incorrect').state
		incorrectLetterAudio.play()
		newMistakes += 1
	}

	return { newPreparedText: preparedText, newMistakes }
}

export const backspaceHandler: T_BackspaceHandler = (char: T_Char) => {
	return updateCharState(char, 'default')
}

export const splitIntoWords = (arr: T_Char[]) => {
	const words = []
	let currentWord = []

	for (const obj of arr) {
		if (obj.char === ' ') {
			if (currentWord.length > 0) {
				words.push(currentWord)
				currentWord = []
			}
		} else {
			currentWord.push(obj)
		}
	}

	// Добавляем последнее слово, если оно есть
	if (currentWord.length > 0) {
		words.push(currentWord)
	}

	return words
}

export const getTypedAndCorrectWords = (
	preparedText: T_Char[][],
	currentLineIndex: number,
	currentCharIndex: number
) => {
	const typedObjWordsWithSpaces = preparedText
		.slice(0, currentLineIndex + 1)
		.map((line, i) => (i === currentLineIndex ? line.slice(0, currentCharIndex + 1) : line))
		.flat()

	const typedObjWords = splitIntoWords(typedObjWordsWithSpaces)

	const typedWords = typedObjWords.flatMap(chars => chars.map(({ char }) => char).join(''))

	const correctWords = typedObjWords.flatMap(chars => {
		const isCorrectWord = chars.every(({ state }) => state === 'correct')
		return isCorrectWord ? chars.map(({ char }) => char).join('') : []
	})

	return [typedWords, correctWords]
}
