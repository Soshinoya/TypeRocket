import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Activity } from 'react-activity-calendar'
import Cookies from 'universal-cookie'

import { TUser, TUserBestResults, TUserExperience } from 'types/User'
import { TUserMetrics, TAchievement, TUserAchievement } from 'types/Public'

type TInitialStateType = {
	accessToken: string
	user: TUser | null
	experience: TUserExperience | null
	activity: Activity[] | null
	bestResults: TUserBestResults[]
	metrics: TUserMetrics | null
	achievements: TAchievement[] | null
	userAchievements: TUserAchievement[] | null
}

const cookies = new Cookies()

const initialState: TInitialStateType = {
	accessToken: '',
	user: null,
	experience: null,
	activity: null,
	bestResults: [
		{ testName: 'test_10w', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
		{ testName: 'test_20w', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
		{ testName: 'test_40w', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
		{ testName: 'test_80w', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
		{ testName: 'test_15s', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
		{ testName: 'test_30s', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
		{ testName: 'test_60s', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
		{ testName: 'test_120s', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
	],
	metrics: null,
	achievements: null,
	userAchievements: null,
}

const getStoredState = (): TInitialStateType | null => {
	try {
		const storedUser = localStorage.getItem('currentUser')
		if (storedUser) {
			return JSON.parse(storedUser) as TInitialStateType
		}
	} catch (error) {
		console.error('Failed to parse stored user data', error)
		localStorage.removeItem('currentUser')
	}

	return null
}

const setStateInLocalStorage = (state: TInitialStateType, key: string, value: any) => {
	localStorage.setItem('currentUser', JSON.stringify({ ...state, [key]: value }))
}

const getInitialState = () => getStoredState() || initialState

const currentUserSlice = createSlice({
	name: 'currentUser',
	initialState: getInitialState(),
	reducers: {
		setAccessToken(state: TInitialStateType, action: PayloadAction<string>) {
			state.accessToken = action.payload
			setStateInLocalStorage(state, 'accessToken', action.payload)
		},
		setCurrentUser(state: TInitialStateType, action: PayloadAction<TUser | null>) {
			state.user = action.payload
			setStateInLocalStorage(state, 'user', action.payload)
		},
		setExperience(state: TInitialStateType, action: PayloadAction<TUserExperience | null>) {
			state.experience = action.payload
			setStateInLocalStorage(state, 'experience', action.payload)
		},
		setActivity(state: TInitialStateType, action: PayloadAction<Activity[] | Activity | null>) {
			const { payload } = action

			if (payload === null) {
				state.activity = null
			} else if (Array.isArray(payload)) {
				state.activity = payload
			} else {
				if (!state.activity) {
					state.activity = [payload]
				} else {
					const existingActivityIndex = state.activity.findIndex(item => item.date === payload.date)

					if (existingActivityIndex !== -1) {
						state.activity[existingActivityIndex] = payload
					} else {
						state.activity = [...state.activity, payload]
					}
				}
			}

			setStateInLocalStorage(state, 'activity', state.activity)
		},
		setAllBestResults(state: TInitialStateType, action: PayloadAction<TUserBestResults[]>) {
			return { ...state, bestResults: action.payload }
		},
		setBestResults(state: TInitialStateType, action: PayloadAction<TUserBestResults>) {
			const updatedBestResults = state.bestResults.map(result => {
				if (result.testName === action.payload.testName) {
					return {
						...result,
						resultMetrics: { ...action.payload.resultMetrics },
					}
				}
				return result
			})

			setStateInLocalStorage(state, 'bestResults', updatedBestResults)

			return {
				...state,
				bestResults: updatedBestResults,
			}
		},
		setMetrics(state: TInitialStateType, action: PayloadAction<TUserMetrics | null>) {
			state.metrics = action.payload
			setStateInLocalStorage(state, 'metrics', action.payload)
		},
		setAchievements(state: TInitialStateType, action: PayloadAction<TAchievement[] | null>) {
			state.achievements = action.payload
			setStateInLocalStorage(state, 'achievements', action.payload)
		},
		setUserAchievements(state: TInitialStateType, action: PayloadAction<TUserAchievement[] | null>) {
			state.userAchievements = action.payload
			setStateInLocalStorage(state, 'userAchievements', action.payload)
		},
		logout() {
			localStorage.removeItem('currentUser')
			cookies.remove('refreshToken', {
				path: '/',
				domain: window.location.hostname,
				// secure: true, // если используете HTTPS
				// sameSite: 'strict'
			})
			return initialState
		},
	},
})

export const {
	setAccessToken,
	setCurrentUser,
	setExperience,
	setActivity,
	setAllBestResults,
	setBestResults,
	setMetrics,
	setAchievements,
	setUserAchievements,
	logout,
} = currentUserSlice.actions
export default currentUserSlice.reducer
