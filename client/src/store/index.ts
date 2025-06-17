import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { T_RootState } from './types'

import TypingZone from 'features/TypingZone/reducer'
import Notifications from 'features/Notification/reducer'
import Themes from 'features/Themes/reducer'

import { UserApiSlice } from 'features/api/User/UserApiSlice'
import currentUser from 'features/CurrentUser/reducer'

const reducer = combineReducers({
	TypingZone,
	currentUser,
	[UserApiSlice.reducerPath]: UserApiSlice.reducer,
	Notifications,
	Themes,
})

const store = configureStore({
	reducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(UserApiSlice.middleware),
})

export default store

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<T_RootState> = useSelector
