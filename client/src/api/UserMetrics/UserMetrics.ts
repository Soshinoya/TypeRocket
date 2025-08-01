import { createApi } from '@reduxjs/toolkit/query/react'

import { TUserMetrics } from 'types/Public'

import { baseQueryWithReauth } from 'api/baseQuery'

export const UserMetricsApiSlice = createApi({
	reducerPath: 'userMetricsApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['UserMetrics'],
	endpoints: builder => ({
		getMetrics: builder.mutation<TUserMetrics, { accessToken: string }>({
			query: credentials => ({
				url: '/get_metrics',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['UserMetrics'],
		}),
		updateStreak: builder.mutation<TUserMetrics, { accessToken: string } & Omit<TUserMetrics, 'keystrokes'>>({
			query: credentials => ({
				url: '/update_metrics_streak',
				method: 'PATCH',
				body: credentials,
			}),
			invalidatesTags: ['UserMetrics'],
		}),
		updateKeystrokes: builder.mutation<TUserMetrics, { accessToken: string } & Pick<TUserMetrics, 'keystrokes'>>({
			query: credentials => ({
				url: '/update_metrics_keystrokes',
				method: 'PATCH',
				body: credentials,
			}),
			invalidatesTags: ['UserMetrics'],
		}),
	}),
})

export const { useGetMetricsMutation, useUpdateStreakMutation, useUpdateKeystrokesMutation } = UserMetricsApiSlice
