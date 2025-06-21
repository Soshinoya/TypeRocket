import { createSlice } from '@reduxjs/toolkit'
import MeasureText from 'text-measure'

import type { I_Action, T_Reducer } from 'store/types'

import { languages, I_ModeOption, Mode, PlayerMode, type I_TypingZone, Language } from './types'

import { languagesData } from 'data/languages/languages'

import { addNumbers, addPunctuation } from 'utils/utils'
import { getRandomWords } from 'utils/getRandomWords'

const textMeasure = new MeasureText('32px JetBrains Mono')

const initialConfig: I_TypingZone = {
	language: languages.english_200,
	isPunctuation: false,
	isNumbers: false,
	playerMode: PlayerMode['single'],
	mode: Mode['time'],
	wordOptions: [
		{ count: 10, enabled: false },
		{ count: 20, enabled: false },
		{ count: 40, enabled: false },
		{ count: 80, enabled: false },
	],
	timeOptions: [
		{ count: 15, enabled: true },
		{ count: 30, enabled: false },
		{ count: 60, enabled: false },
		{ count: 120, enabled: false },
	],
	text: [],
}

// Обновление текста
export const updateText = (state: I_TypingZone, containerWidth: number): string[][] => {
	console.log('Функция updateText вызывается слишком часто? Это нехорошо...', containerWidth)

	const { language, isPunctuation, isNumbers, mode, wordOptions } = state

	let text: string[][] = []
	let currentLine: number = 0
	let currentLineWidth: number = 0

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

const initialState: I_TypingZone = { ...initialConfig, text: updateText(initialConfig, 0) }

export const languageReducer: T_Reducer<I_TypingZone, Language> = (state, action) => {
	state.language = action.payload
}

export const isPunctuationReducer: T_Reducer<I_TypingZone, boolean> = (state, action) => {
	state.isPunctuation = action.payload
}

export const isNumbersReducer: T_Reducer<I_TypingZone, boolean> = (state, action) => {
	state.isNumbers = action.payload
}

export const playerModeReducer: T_Reducer<I_TypingZone, PlayerMode> = (state, action) => {
	state.playerMode = action.payload
}

export const modeReducer: T_Reducer<I_TypingZone, Mode> = (state, action) => {
	state.mode = action.payload

	state.timeOptions.map(option => (option.enabled = false))
	state.wordOptions.map(option => (option.enabled = false))

	if (action.payload === Mode['time']) {
		state.timeOptions[0].enabled = true
	} else {
		state.wordOptions[0].enabled = true
	}
}

const updateItems = (items: I_ModeOption[], action: I_Action): I_ModeOption[] => {
	return items.map(item => {
		const updatedItem = { ...item }

		updatedItem.enabled = false

		if (action.payload.count === updatedItem.count) {
			updatedItem.enabled = true
		}

		return updatedItem
	})
}

export const wordOptionsReducer: T_Reducer<I_TypingZone, I_ModeOption> = (state, action) => {
	state.wordOptions = updateItems(state.wordOptions, action)
	state.timeOptions.map(option => (option.enabled = false))
}

export const timeOptionsReducer: T_Reducer<I_TypingZone, I_ModeOption> = (state, action) => {
	state.timeOptions = updateItems(state.timeOptions, action)
	state.wordOptions.map(option => (option.enabled = false))
}

export const textReducer: T_Reducer<I_TypingZone, string[][]> = (state, action) => {
	state.text = action.payload
}

const TypingZoneSlice = createSlice({
	name: 'APP',
	initialState,
	reducers: {
		setLanguageAction: languageReducer,
		setIsPunctuationAction: isPunctuationReducer,
		setIsNumbersAction: isNumbersReducer,
		setPlayerModeAction: playerModeReducer,
		setModeAction: modeReducer,
		setWordOptionsAction: wordOptionsReducer,
		setTimeOptionsAction: timeOptionsReducer,
		setTextAction: textReducer,
	},
})

export const {
	setLanguageAction,
	setIsPunctuationAction,
	setIsNumbersAction,
	setPlayerModeAction,
	setModeAction,
	setWordOptionsAction,
	setTimeOptionsAction,
	setTextAction,
} = TypingZoneSlice.actions

// prettier-ignore
// Пример для асинхронных действий
// export const setLanguage = (language: Languages): T_AppThunk => (dispatch: Dispatch) => {
// 	dispatch(setLanguageAction(language))
// }

export default TypingZoneSlice.reducer
