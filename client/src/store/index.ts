import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { T_RootState } from './types'

import TypingZone from 'features/TypingZone/reducer'
import Notifications from 'features/Notification/reducer'
import Themes from 'features/Themes/reducer'

import { UserSlice } from 'features/api/User/UserSlice'

const reducer = combineReducers({
	TypingZone,
	[UserSlice.reducerPath]: UserSlice.reducer,
	Notifications,
	Themes,
})

const store = configureStore({
	reducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(UserSlice.middleware),
})

export default store

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<T_RootState> = useSelector
