import { createSlice } from '@reduxjs/toolkit'

import type { T_Reducer } from 'store/types'

import { themes } from 'data/themes'

import { SingleTheme, type I_Theme } from './types'

const localStorageThemeId = localStorage.getItem('theme')

document.body.setAttribute('data-theme', localStorageThemeId ?? 'default')

const initialConfig: I_Theme = {
	currentTheme: themes.find(({ id }) => id === localStorageThemeId) ?? themes[0],
	allThemes: themes,
}

export const themeChangeReducer: T_Reducer<I_Theme, SingleTheme> = (state, action) => {
	state.currentTheme = action.payload
	document.body.setAttribute('data-theme', action.payload.id)
	localStorage.setItem('theme', action.payload.id)
}

const ThemesSlice = createSlice({
	name: 'Themes',
	initialState: initialConfig,
	reducers: {
		themeChangeAction: themeChangeReducer,
	},
})

export const { themeChangeAction } = ThemesSlice.actions

export default ThemesSlice.reducer
