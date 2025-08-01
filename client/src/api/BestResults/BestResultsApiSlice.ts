import { createApi } from '@reduxjs/toolkit/query/react'

import { TUserBestResults } from 'types/User'

import { baseQueryWithReauth } from 'api/baseQuery'

export const BestResultsApiSlice = createApi({
	reducerPath: 'bestResultsApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['BestResults'],
	endpoints: builder => ({
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

export const { useSetBestResultsMutation } = BestResultsApiSlice
