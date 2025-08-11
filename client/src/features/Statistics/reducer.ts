import { createSlice } from '@reduxjs/toolkit'

import type { T_Reducer } from 'store/types'

import { type Statistics } from './types'

const initialConfig: Statistics = {
	wpm: 0,
	rawWpm: 0,
	accuracy: 0,
	consistency: 0,
	wpmPerTimeArr: [],
	typedWords: [],
	correctWords: [],
	keystrokes: 0,
}

const initialState: Statistics = initialConfig

export const wpmReducer: T_Reducer<Statistics, Statistics['wpm']> = (state, action) => {
	state.wpm = action.payload
}

export const rawWpmReducer: T_Reducer<Statistics, Statistics['rawWpm']> = (state, action) => {
	state.rawWpm = action.payload
}

export const accuracyReducer: T_Reducer<Statistics, Statistics['accuracy']> = (state, action) => {
	state.accuracy = action.payload
}

export const consistencyReducer: T_Reducer<Statistics, Statistics['consistency']> = (state, action) => {
	state.consistency = action.payload
}

export const wpmPerTimeArrReducer: T_Reducer<Statistics, Statistics['wpmPerTimeArr']> = (state, action) => {
	state.wpmPerTimeArr = action.payload
}

export const typedWordsReducer: T_Reducer<Statistics, Statistics['typedWords']> = (state, action) => {
	state.typedWords = action.payload
}

export const correctWordsReducer: T_Reducer<Statistics, Statistics['correctWords']> = (state, action) => {
	state.correctWords = action.payload
}

export const keystrokesReducer: T_Reducer<Statistics, Statistics['keystrokes']> = (state, action) => {
	state.keystrokes = action.payload
}

const StatisticsSlice = createSlice({
	name: 'Statistics',
	initialState,
	reducers: {
		setWpmAction: wpmReducer,
		setRawWpmAction: rawWpmReducer,
		setAccuracyAction: accuracyReducer,
		setConsistencyAction: consistencyReducer,
		setWpmPerTimeArrAction: wpmPerTimeArrReducer,
		setTypedWordsAction: typedWordsReducer,
		setCorrectWordsAction: correctWordsReducer,
		setKeystrokesAction: keystrokesReducer,
	},
})

export const {
	setWpmAction,
	setRawWpmAction,
	setAccuracyAction,
	setConsistencyAction,
	setWpmPerTimeArrAction,
	setTypedWordsAction,
	setCorrectWordsAction,
	setKeystrokesAction,
} = StatisticsSlice.actions

export default StatisticsSlice.reducer
