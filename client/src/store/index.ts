import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { T_RootState } from './types'

import { UserApiSlice } from 'api/User/UserApiSlice'
import currentUser from 'features/CurrentUser/reducer'

import { ExperienceApiSlice } from 'api/Experience/ExperienceApiSlice'

import TypingZone from 'features/TypingZone/reducer'
import Notifications from 'features/Notification/reducer'
import Themes from 'features/Themes/reducer'

const reducer = combineReducers({
	TypingZone,
	currentUser,
	[UserApiSlice.reducerPath]: UserApiSlice.reducer,
	[ExperienceApiSlice.reducerPath]: ExperienceApiSlice.reducer,
	Notifications,
	Themes,
})

const store = configureStore({
	reducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(UserApiSlice.middleware, ExperienceApiSlice.middleware),
})

export default store

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<T_RootState> = useSelector
