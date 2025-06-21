import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Activity } from 'react-activity-calendar'

import { TUser, TUserExperience } from 'types/User'

type TInitialStateType = {
	accessToken: string
	user: TUser | null
	experience: TUserExperience | null
	activity: Activity[] | null
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
	},
})

export const { setCurrentUser, setAccessToken, setExperience, setActivity } = currentUserSlice.actions
export default currentUserSlice.reducer
