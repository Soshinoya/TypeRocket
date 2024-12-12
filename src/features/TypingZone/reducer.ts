import { createSlice } from '@reduxjs/toolkit'

import type { I_Action, T_Reducer } from 'store/types'

import { I_ModeOption, Languages, Mode, PlayerMode, type I_TypingZone } from './types'

const initialState: I_TypingZone = {
	language: Languages['english-200'],
	punctuation: false,
	numbers: false,
	playerMode: PlayerMode['single'],
	mode: Mode['words'],
	words: [
		{ count: 10, enabled: false },
		{ count: 20, enabled: false },
		{ count: 40, enabled: false },
		{ count: 80, enabled: true },
		{ count: 160, enabled: false },
	],
	time: [
		{ count: 15, enabled: false },
		{ count: 30, enabled: false },
		{ count: 60, enabled: false },
		{ count: 120, enabled: false },
	],
}

export const languageReducer: T_Reducer<I_TypingZone, Languages> = (state, action) => {
	state.language = action.payload
}

export const punctuationReducer: T_Reducer<I_TypingZone, boolean> = (state, action) => {
	state.punctuation = action.payload
}

export const numbersReducer: T_Reducer<I_TypingZone, boolean> = (state, action) => {
	state.numbers = action.payload
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

		if (action.payload.count === updatedItem.count && action.payload.enabled) {
			updatedItem.enabled = true
		}

		return updatedItem
	})
}

// При использовании wordsReducer в компоненте сделать проверку на то, нажал ли пользователь на уже активное число
export const wordsReducer: T_Reducer<I_TypingZone, I_ModeOption> = (state, action) => {
	state.words = updateItems(state.words, action)
}

// При использовании timeReducer в компоненте сделать проверку на то, нажал ли пользователь на уже активное число
export const timeReducer: T_Reducer<I_TypingZone, I_ModeOption> = (state, action) => {
	state.time = updateItems(state.time, action)
}

const appSlice = createSlice({
	name: 'APP',
	initialState,
	reducers: {
		setLanguageAction: languageReducer,
		setPunctuationAction: punctuationReducer,
		setNumbersAction: numbersReducer,
		setPlayerModeAction: playerModeReducer,
		setModeAction: modeReducer,
		setActiveWordsAction: wordsReducer,
		setActiveTimeAction: timeReducer,
	},
})

export const {
	setLanguageAction,
	setPunctuationAction,
	setNumbersAction,
	setPlayerModeAction,
	setModeAction,
	setActiveWordsAction,
	setActiveTimeAction,
} = appSlice.actions

// prettier-ignore
// Пример для асинхронных действий
// export const setLanguage = (language: Languages): T_AppThunk => (dispatch: Dispatch) => {
// 	dispatch(setLanguageAction(language))
// }

export default appSlice.reducer
