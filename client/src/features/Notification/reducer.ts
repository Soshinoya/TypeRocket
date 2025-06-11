import { createSlice } from '@reduxjs/toolkit'

import type { T_Reducer } from 'store/types'

import { type I_Notification } from './types'

const initialConfig: I_Notification[] = []

const initialState: I_Notification[] = initialConfig

export const notificationsReducer: T_Reducer<I_Notification[], I_Notification> = (state, action) => {
	return [action.payload, ...state]
}

export const deleteNotificationReducer: T_Reducer<I_Notification[], I_Notification['id']> = (state, action) => {
	return state.filter(({ id }) => id !== action.payload)
}

const NotificationsSlice = createSlice({
	name: 'Notifications',
	initialState,
	reducers: {
		setNotificationAction: notificationsReducer,
		deleteNotificationAction: deleteNotificationReducer,
	},
})

export const { setNotificationAction, deleteNotificationAction } = NotificationsSlice.actions

export default NotificationsSlice.reducer
