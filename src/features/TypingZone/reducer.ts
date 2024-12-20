import { createSlice } from '@reduxjs/toolkit'

import type { I_Action, T_Reducer } from 'store/types'

import { languages, I_ModeOption, Mode, PlayerMode, type I_TypingZone, Language } from './types'

import { languagesData } from 'data/languages/languages'

import { addNumbers, addPunctuation } from 'utils/utils'
import { getRandomWords } from 'utils/getRandomWords'

const initialConfig: I_TypingZone = {
	language: languages.english_200,
	isPunctuation: false,
	isNumbers: false,
	playerMode: PlayerMode['single'],
	mode: Mode['words'],
	wordOptions: [
		{ count: 20, enabled: true },
		{ count: 40, enabled: false },
		{ count: 80, enabled: false },
		{ count: 160, enabled: false },
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
export const updateText = ({
	language,
	isPunctuation,
	isNumbers,
	mode,
	wordOptions,
	timeOptions,
}: I_TypingZone): string[] => {
	let newText: string[]

	// newText присваиваем исходный набор слов
	newText = languagesData[language.key]

	// Изменение количества слов в тексте
	if (mode === Mode['words']) {
		try {
			const wordCount = wordOptions.find(option => option.enabled)?.count || wordOptions[0].count
			newText = getRandomWords(newText, wordCount)
		} catch (error) {
			console.error(error)
			// dispatch(setWordOptionsAction(wordOptions[0]))
			newText = new Array(15).fill('error', 0)
		}
	} else if (mode === Mode['time']) {
	}

	// Добавляем пунктуацию, если она включена
	if (isPunctuation) {
		newText = addPunctuation(newText)
	}

	// Добавляем цифры, если они включены
	if (isNumbers) {
		newText = addNumbers(newText)
	}

	return newText
}

const initialState: I_TypingZone = { ...initialConfig, text: updateText(initialConfig) }

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
}

export const timeOptionsReducer: T_Reducer<I_TypingZone, I_ModeOption> = (state, action) => {
	state.timeOptions = updateItems(state.timeOptions, action)
}

export const textReducer: T_Reducer<I_TypingZone, string[]> = (state, action) => {
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
