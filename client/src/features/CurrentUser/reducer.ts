import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Activity } from 'react-activity-calendar'

import { TUser, TUserBestResults, TUserExperience } from 'types/User'

type TInitialStateType = {
	accessToken: string
	user: TUser | null
	experience: TUserExperience | null
	activity: Activity[] | null
	bestResults: TUserBestResults[]
}

const getInitialState = (): TInitialStateType => {
	try {
		const storedUser = localStorage.getItem('currentUser')
		if (storedUser) {
			console.log('storedUser from localStorage: ', JSON.parse(storedUser))
			return JSON.parse(storedUser) as TInitialStateType
		}
	} catch (error) {
		console.error('Failed to parse stored user data', error)
		localStorage.removeItem('currentUser')
	}

	return {
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
	}
}

const setStateInLocalStorage = (state: TInitialStateType, key: string, value: any) => {
	localStorage.setItem('currentUser', JSON.stringify({ ...state, [key]: value }))
}

const initialState: TInitialStateType = getInitialState()

const currentUserSlice = createSlice({
	name: 'currentUser',
	initialState,
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
	},
})

export const { setCurrentUser, setAccessToken, setExperience, setActivity, setBestResults } = currentUserSlice.actions
export default currentUserSlice.reducer
