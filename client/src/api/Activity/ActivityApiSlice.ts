import { createApi } from '@reduxjs/toolkit/query/react'
import { Activity } from 'react-activity-calendar'

import { baseQueryWithReauth } from 'api/baseQuery'

export const ActivityApiSlice = createApi({
	reducerPath: 'activityApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Activity'],
	endpoints: builder => ({
		getActivity: builder.mutation<Activity[], { accessToken: string }>({
			query: accessToken => ({
				url: '/get_activity',
				method: 'POST',
				body: accessToken,
			}),
			invalidatesTags: ['Activity'],
		}),
		setActivity: builder.mutation<Activity, { accessToken: string }>({
			query: accessToken => ({
				url: '/set_activity',
				method: 'POST',
				body: accessToken,
			}),
			invalidatesTags: ['Activity'],
		}),
	}),
})

export const { useGetActivityMutation, useSetActivityMutation } = ActivityApiSlice
