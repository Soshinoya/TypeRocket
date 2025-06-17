import type { T_RootState } from 'store/types'

export const selectCurrentUser = (state: T_RootState) => state.currentUser.user
export const selectAccessToken = (state: T_RootState) => state.currentUser.accessToken
