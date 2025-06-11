import type { T_RootState } from 'store/types'

export const selectCurrentTheme = (state: T_RootState) => state.Themes.currentTheme
export const selectAllThemes = (state: T_RootState) => state.Themes.allThemes
