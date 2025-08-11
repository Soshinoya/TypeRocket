import type { T_RootState } from 'store/types'

export const selectWpm = (state: T_RootState) => state.Statistics.wpm
export const selectRawWpm = (state: T_RootState) => state.Statistics.rawWpm
export const selectAccuracy = (state: T_RootState) => state.Statistics.accuracy
export const selectConsistency = (state: T_RootState) => state.Statistics.consistency
export const selectWpmPerTimeArr = (state: T_RootState) => state.Statistics.wpmPerTimeArr
export const selectTypedWords = (state: T_RootState) => state.Statistics.typedWords
export const selectCorrectWords = (state: T_RootState) => state.Statistics.correctWords
export const selectKeystrokes = (state: T_RootState) => state.Statistics.keystrokes
