import type { Action, CaseReducer, PayloadAction, ThunkAction } from '@reduxjs/toolkit'

import store from './index'

export interface I_Action {
	type: string
	payload: {
		count: number
		enabled: boolean
	}
}

export type T_RootState = ReturnType<typeof store.getState>
export type T_AppThunk<ReturnType = void> = ThunkAction<ReturnType, T_RootState, unknown, Action<string>>
export type T_Reducer<S, A = any> = CaseReducer<S, PayloadAction<A>>
