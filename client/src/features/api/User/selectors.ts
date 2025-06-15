import type { T_RootState } from 'store/types'

export const selectUser = (state: T_RootState) => state.user
