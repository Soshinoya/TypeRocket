import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Activity } from 'react-activity-calendar'

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
		metrics: null,
		achievements: null,
		userAchievements: null,
	}
}

const setStateInLocalStorage = (state: TInitialStateType, key: string, value: any) => {
	localStorage.setItem('currentUser', JSON.stringify({ ...state, [key]: value }))
}

const initialState: TInitialStateType = getInitialState()
// const initialState: TInitialStateType = {
// 	accessToken:
// 		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1NDQ4ODcwMywiZXhwIjoxNzU0NDg5NjAzfQ.0XtVMZmC5-nCgvJmY4epYjbH4T6uiHg2z7fk_RHkDDk',
// 	user: {
// 		id: 2,
// 		username: 'test2',
// 		email: 'test2@test.test',
// 		password: '$2b$10$V5pBs3RKBm3mk8nSf3PuC.DaEMMsandxYBcm8Z3RfEipoz6dwxNqu',
// 		creation_date: '2025-07-31T21:00:00.000Z',
// 		description: 'Hey there! I am using TypeRocket',
// 	},
// 	experience: { level: 0, progress: 600 },
// 	activity: [{ date: '2025-08-01', count: 3, level: 1 }],
// 	bestResults: [
// 		{ testName: 'test_10w', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
// 		{ testName: 'test_20w', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
// 		{ testName: 'test_40w', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
// 		{ testName: 'test_80w', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
// 		{ testName: 'test_15s', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
// 		{ testName: 'test_30s', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
// 		{ testName: 'test_60s', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
// 		{ testName: 'test_120s', resultMetrics: { wpm: 0, rawWpm: 0, accuracy: 0, consistency: 0 } },
// 	],
// 	metrics: { last_activity_date: '2025-08-06', streak: 0, keystrokes: 400 },
// 	achievements: [
// 		{
// 			id: 1,
// 			title: 'First quick print',
// 			description: 'Type 80 keystrokes',
// 			type: 'keystrokes',
// 			target: 80,
// 			experience_gained: 200,
// 		},
// 		{
// 			id: 2,
// 			title: 'Great pace',
// 			description: 'Type 160 keystrokes',
// 			type: 'keystrokes',
// 			target: 160,
// 			experience_gained: 400,
// 		},
// 		{
// 			id: 3,
// 			title: 'Keyboard shortcut I',
// 			description: 'Perform 1,000 keystrokes',
// 			type: 'keystrokes',
// 			target: 1000,
// 			experience_gained: 1000,
// 		},
// 		{
// 			id: 4,
// 			title: 'Keyboard shortcut II',
// 			description: 'Perform 2,500 keystrokes',
// 			type: 'keystrokes',
// 			target: 2500,
// 			experience_gained: 2500,
// 		},
// 		{
// 			id: 5,
// 			title: 'Daily Sprinter',
// 			description: 'Practice typing 3 days in a row',
// 			type: 'streak',
// 			target: 3,
// 			experience_gained: 3000,
// 		},
// 		{
// 			id: 6,
// 			title: 'Steel endurance',
// 			description: 'Practice for 7 days in a row',
// 			type: 'streak',
// 			target: 7,
// 			experience_gained: 5000,
// 		},
// 	],
// 	userAchievements: [
// 		{
// 			achievement_id: 1,
// 			completion_date: '2025-07-31T21:00:00.000Z',
// 			title: 'First quick print',
// 			description: 'Type 80 keystrokes',
// 		},
// 	],
// }

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
	},
})

export const {
	setCurrentUser,
	setAccessToken,
	setExperience,
	setActivity,
	setBestResults,
	setMetrics,
	setAchievements,
	setUserAchievements,
} = currentUserSlice.actions
export default currentUserSlice.reducer
