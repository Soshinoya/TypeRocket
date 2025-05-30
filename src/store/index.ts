import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { T_RootState } from './types'

import TypingZone from 'features/TypingZone/reducer'
import Notifications from 'features/Notification/reducer'

const reducer = combineReducers({
	TypingZone,
	Notifications,
})

const store = configureStore({ reducer })

export default store

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<T_RootState> = useSelector
