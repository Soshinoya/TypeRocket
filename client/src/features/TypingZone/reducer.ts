import { createSlice } from '@reduxjs/toolkit'

import type { T_Reducer } from 'store/types'

import { type I_TypingZone } from './types'

const initialConfig: I_TypingZone = {
	isTestStarted: false,
	isTestFinished: false,
}

const initialState: I_TypingZone = initialConfig

export const isTestStartedReducer: T_Reducer<I_TypingZone, boolean> = (state, action) => {
	state.isTestStarted = action.payload
}

export const isTestFinishedReducer: T_Reducer<I_TypingZone, boolean> = (state, action) => {
	state.isTestFinished = action.payload
}

const TypingZoneSlice = createSlice({
	name: 'APP',
	initialState,
	reducers: {
		setIsTestStartedAction: isTestStartedReducer,
		setIsTestFinishedAction: isTestFinishedReducer,
		resetTestStateAction(state) {
			state.isTestStarted = false
			state.isTestFinished = false
		},
	},
})

export const { setIsTestStartedAction, setIsTestFinishedAction, resetTestStateAction } = TypingZoneSlice.actions

export default TypingZoneSlice.reducer
