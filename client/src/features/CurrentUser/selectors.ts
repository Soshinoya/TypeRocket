import type { T_RootState } from 'store/types'

export const selectAccessToken = (state: T_RootState) => state.currentUser.accessToken
export const selectCurrentUser = (state: T_RootState) => state.currentUser.user
export const selectExperience = (state: T_RootState) => state.currentUser.experience
export const selectActivity = (state: T_RootState) => state.currentUser.activity
