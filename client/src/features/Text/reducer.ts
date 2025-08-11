import { createSlice } from '@reduxjs/toolkit'

import type { T_Reducer } from 'store/types'

import { languages, I_ModeOption, Mode, PlayerMode, type I_Text, Language } from './types'

import { updateItems, updateText } from './utils'

const initialConfig: I_Text = {
	currentCharIndex: 0,
	currentLineIndex: 0,
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
	mistakes: 0,
}

const initialState: I_Text = { ...initialConfig, text: updateText(initialConfig, 0) }

export const currentCharIndexReducer: T_Reducer<I_Text, number> = (state, action) => {
	state.currentCharIndex = action.payload
}

export const currentLineIndexReducer: T_Reducer<I_Text, number> = (state, action) => {
	state.currentLineIndex = action.payload
}

export const languageReducer: T_Reducer<I_Text, Language> = (state, action) => {
	state.language = action.payload
}

export const isPunctuationReducer: T_Reducer<I_Text, boolean> = (state, action) => {
	state.isPunctuation = action.payload
}

export const isNumbersReducer: T_Reducer<I_Text, boolean> = (state, action) => {
	state.isNumbers = action.payload
}

export const playerModeReducer: T_Reducer<I_Text, PlayerMode> = (state, action) => {
	state.playerMode = action.payload
}

export const modeReducer: T_Reducer<I_Text, Mode> = (state, action) => {
	state.mode = action.payload

	state.timeOptions.map(option => (option.enabled = false))
	state.wordOptions.map(option => (option.enabled = false))

	if (action.payload === Mode['time']) {
		state.timeOptions[0].enabled = true
	} else {
		state.wordOptions[0].enabled = true
	}
}

export const wordOptionsReducer: T_Reducer<I_Text, I_ModeOption> = (state, action) => {
	state.wordOptions = updateItems(state.wordOptions, action)
	state.timeOptions.map(option => (option.enabled = false))
}

export const timeOptionsReducer: T_Reducer<I_Text, I_ModeOption> = (state, action) => {
	state.timeOptions = updateItems(state.timeOptions, action)
	state.wordOptions.map(option => (option.enabled = false))
}

export const textReducer: T_Reducer<I_Text, string[][]> = (state, action) => {
	state.text = action.payload
}

export const mistakesReducer: T_Reducer<I_Text, number> = (state, action) => {
	state.mistakes = action.payload
}

const TextSlice = createSlice({
	name: 'Text',
	initialState,
	reducers: {
		setCurrentCharIndexAction: currentCharIndexReducer,
		setCurrentLineIndexAction: currentLineIndexReducer,
		setLanguageAction: languageReducer,
		setIsPunctuationAction: isPunctuationReducer,
		setIsNumbersAction: isNumbersReducer,
		setPlayerModeAction: playerModeReducer,
		setModeAction: modeReducer,
		setWordOptionsAction: wordOptionsReducer,
		setTimeOptionsAction: timeOptionsReducer,
		setTextAction: textReducer,
		setMistakesAction: mistakesReducer,
	},
})

export const {
	setCurrentCharIndexAction,
	setCurrentLineIndexAction,
	setLanguageAction,
	setIsPunctuationAction,
	setIsNumbersAction,
	setPlayerModeAction,
	setModeAction,
	setWordOptionsAction,
	setTimeOptionsAction,
	setTextAction,
	setMistakesAction,
} = TextSlice.actions

// prettier-ignore
// Пример для асинхронных действий
// export const setLanguage = (language: Languages): T_AppThunk => (dispatch: Dispatch) => {
// 	dispatch(setLanguageAction(language))
// }

export default TextSlice.reducer
