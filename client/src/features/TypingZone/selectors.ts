import type { T_RootState } from 'store/types'

export const selectLanguage = (state: T_RootState) => state.TypingZone.language
export const selectIsPunctuation = (state: T_RootState) => state.TypingZone.isPunctuation
export const selectIsNumbers = (state: T_RootState) => state.TypingZone.isNumbers
export const selectPlayerMode = (state: T_RootState) => state.TypingZone.playerMode
export const selectMode = (state: T_RootState) => state.TypingZone.mode
export const selectWordOptions = (state: T_RootState) => state.TypingZone.wordOptions
export const selectTimeOptions = (state: T_RootState) => state.TypingZone.timeOptions
export const selectText = (state: T_RootState) => state.TypingZone.text
