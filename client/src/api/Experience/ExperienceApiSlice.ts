import { createApi } from '@reduxjs/toolkit/query/react'

import { TUserExperience } from 'types/User'

import { baseQueryWithReauth } from 'api/baseQuery'

export const ExperienceApiSlice = createApi({
	reducerPath: 'experienceApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Experience'],
	endpoints: builder => ({
		getExperience: builder.mutation<TUserExperience, { accessToken: string }>({
			query: accessToken => ({
				url: '/get_experience',
				method: 'POST',
				body: accessToken,
			}),
			invalidatesTags: ['Experience'],
		}),
		addExperience: builder.mutation<TUserExperience, TUserExperience | { accessToken: string }>({
			query: accessToken => ({
				url: '/add_experience',
				method: 'PATCH',
				body: accessToken,
			}),
			invalidatesTags: ['Experience'],
		}),
	}),
})

export const { useGetExperienceMutation, useAddExperienceMutation } = ExperienceApiSlice
