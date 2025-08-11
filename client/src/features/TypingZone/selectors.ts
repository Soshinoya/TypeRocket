import type { T_RootState } from 'store/types'

export const selectIsTestStarted = (state: T_RootState) => state.TypingZone.isTestStarted
export const selectIsTestFinished = (state: T_RootState) => state.TypingZone.isTestFinished
