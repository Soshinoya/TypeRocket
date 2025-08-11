import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { T_RootState } from './types'

import { UserApiSlice } from 'api/User/UserApiSlice'
import currentUser from 'features/CurrentUser/reducer'

import { ExperienceApiSlice } from 'api/Experience/ExperienceApiSlice'
import { ActivityApiSlice } from 'api/Activity/ActivityApiSlice'
import { BestResultsApiSlice } from 'api/BestResults/BestResultsApiSlice'
import { AchievementsApiSlice } from 'api/Achievements/Achievements'

import TypingZone from 'features/TypingZone/reducer'
import Text from 'features/Text/reducer'
import Statistics from 'features/Statistics/reducer'
import Notifications from 'features/Notification/reducer'
import Themes from 'features/Themes/reducer'
import { UserMetricsApiSlice } from 'api/UserMetrics/UserMetrics'

const reducer = combineReducers({
	TypingZone,
	Text,
	Statistics,
	currentUser,
	[UserApiSlice.reducerPath]: UserApiSlice.reducer,
	[ExperienceApiSlice.reducerPath]: ExperienceApiSlice.reducer,
	[ActivityApiSlice.reducerPath]: ActivityApiSlice.reducer,
	[BestResultsApiSlice.reducerPath]: BestResultsApiSlice.reducer,
	[UserMetricsApiSlice.reducerPath]: UserMetricsApiSlice.reducer,
	[AchievementsApiSlice.reducerPath]: AchievementsApiSlice.reducer,
	Notifications,
	Themes,
})

const store = configureStore({
	reducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			UserApiSlice.middleware,
			ExperienceApiSlice.middleware,
			ActivityApiSlice.middleware,
			BestResultsApiSlice.middleware,
			UserMetricsApiSlice.middleware,
			AchievementsApiSlice.middleware
		),
})

export default store

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<T_RootState> = useSelector
