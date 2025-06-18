import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { TUser, TUserExperience } from 'types/User'

type TInitialStateType = {
	accessToken: string
	user: TUser | null
	experience: TUserExperience | null
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
	},
})

export const { setCurrentUser, setAccessToken, setExperience } = currentUserSlice.actions
export default currentUserSlice.reducer
