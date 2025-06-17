import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TUser } from 'types/User'

type TInitialStateType = { user: TUser | null; accessToken: string }

const getInitialState = (): TInitialStateType => {
	try {
		const storedUser = localStorage.getItem('currentUser')
		if (storedUser) {
			return JSON.parse(storedUser) as TInitialStateType
		}
	} catch (error) {
		console.error('Failed to parse stored user data', error)
		localStorage.removeItem('currentUser')
	}

	return {
		user: null,
		accessToken: '',
	}
}

const initialState: TInitialStateType = getInitialState()

const currentUserSlice = createSlice({
	name: 'currentUser',
	initialState,
	reducers: {
		setCurrentUser(state: TInitialStateType, action: PayloadAction<TUser | null>) {
			state.user = action.payload
			localStorage.setItem(
				'currentUser',
				JSON.stringify({ user: action.payload, accessToken: state.accessToken })
			)
		},
		setAccessToken(state: TInitialStateType, action: PayloadAction<string>) {
			state.accessToken = action.payload
			localStorage.setItem('currentUser', JSON.stringify({ user: state.user, accessToken: action.payload }))
		},
	},
})

export const { setCurrentUser, setAccessToken } = currentUserSlice.actions
export default currentUserSlice.reducer
