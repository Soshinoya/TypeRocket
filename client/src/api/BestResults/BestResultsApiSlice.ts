import { createApi } from '@reduxjs/toolkit/query/react'

import { TUser, TUserBestResults } from 'types/User'

import { baseQueryWithReauth } from 'api/baseQuery'

export const BestResultsApiSlice = createApi({
	reducerPath: 'bestResultsApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['BestResults'],
	endpoints: builder => ({
		getAllBestResults: builder.query<TUserBestResults[], TUser['id']>({
			query: (userId: TUser['id']) => ({ url: `/get_all_best_results/${userId}` }),
		}),
		setBestResults: builder.mutation<void, { accessToken: string } | TUserBestResults>({
			query: params => ({
				url: '/set_best_result',
				method: 'POST',
				body: params,
			}),
			invalidatesTags: ['BestResults'],
		}),
	}),
})

export const { useLazyGetAllBestResultsQuery, useSetBestResultsMutation } = BestResultsApiSlice
