import { createSlice } from '@reduxjs/toolkit'

import type { I_Action, T_Reducer } from 'store/types'

import { I_ModeOption, Languages, Mode, PlayerMode, type I_TypingZone } from './types'

const initialState: I_TypingZone = {
	language: Languages['english-200'],
	isPunctuation: false,
	isNumbers: false,
	playerMode: PlayerMode['single'],
	mode: Mode['time'],
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
}

export const languageReducer: T_Reducer<I_TypingZone, Languages> = (state, action) => {
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
} = TypingZoneSlice.actions

// prettier-ignore
// Пример для асинхронных действий
// export const setLanguage = (language: Languages): T_AppThunk => (dispatch: Dispatch) => {
// 	dispatch(setLanguageAction(language))
// }

export default TypingZoneSlice.reducer
