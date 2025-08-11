import type { T_RootState } from 'store/types'

export const selectCurrentCharIndex = (state: T_RootState) => state.Text.currentCharIndex
export const selectCurrentLineIndex = (state: T_RootState) => state.Text.currentLineIndex
export const selectLanguage = (state: T_RootState) => state.Text.language
export const selectIsPunctuation = (state: T_RootState) => state.Text.isPunctuation
export const selectIsNumbers = (state: T_RootState) => state.Text.isNumbers
export const selectPlayerMode = (state: T_RootState) => state.Text.playerMode
export const selectMode = (state: T_RootState) => state.Text.mode
export const selectWordOptions = (state: T_RootState) => state.Text.wordOptions
export const selectTimeOptions = (state: T_RootState) => state.Text.timeOptions
export const selectText = (state: T_RootState) => state.Text.text
export const selectMistakes = (state: T_RootState) => state.Text.mistakes
