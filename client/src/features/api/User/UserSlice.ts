import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { TUserCredentials, type TUser } from 'types/User'

export const UserSlice = createApi({
	reducerPath: 'user',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/user' }),
	tagTypes: ['User'],
	endpoints: builder => ({
		getUser: builder.query<TUser, Pick<TUser, 'email' | 'password'>>({
			query: credentials => `/get_user/${credentials.email}/${credentials.password}`,
			providesTags: ['User'],
		}),
		createUser: builder.mutation<TUser, TUserCredentials | string>({
			query: user => ({
				url: '/create_user',
				method: 'POST',
				body: user,
			}),
			invalidatesTags: ['User'],
		}),
		deleteUser: builder.mutation<string, Pick<TUser, 'id'>>({
			query: user => ({
				url: '/delete_user',
				method: 'DELETE',
				body: user,
			}),
			invalidatesTags: ['User'],
		}),
	}),
})

export const { useLazyGetUserQuery, useGetUserQuery, useCreateUserMutation, useDeleteUserMutation } = UserSlice
