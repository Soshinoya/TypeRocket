import { createApi } from '@reduxjs/toolkit/query/react'

import { TAchievement, TUserAchievement } from 'types/Public'

import { baseQueryWithReauth } from 'api/baseQuery'

export const AchievementsApiSlice = createApi({
	reducerPath: 'achievementsApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Achievements', 'UserAchievements'],
	endpoints: builder => ({
		getAchievements: builder.query<TAchievement[], void>({
			query: () => ({ url: '/get_achievements' }),
		}),
		getCompletedAchievements: builder.mutation<TUserAchievement[], { accessToken: string }>({
			query: credentials => ({
				url: '/get_completed_achievements',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['UserAchievements'],
		}),
		addCompletedAchievement: builder.mutation<
			Pick<TUserAchievement, 'achievement_id' | 'completion_date'>,
			{ accessToken: string } & Pick<TUserAchievement, 'achievement_id'>
		>({
			query: credentials => ({
				url: '/add_completed_achievement',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['Achievements'],
		}),
	}),
})

export const { useLazyGetAchievementsQuery, useGetCompletedAchievementsMutation, useAddCompletedAchievementMutation } =
	AchievementsApiSlice
