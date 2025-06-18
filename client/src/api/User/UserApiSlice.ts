import { createApi } from '@reduxjs/toolkit/query/react'

import { TUserCredentials, type TUser } from 'types/User'

import { baseQueryWithReauth } from 'api/baseQuery'

export const UserApiSlice = createApi({
	reducerPath: 'userApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['User'],
	endpoints: builder => ({
		login: builder.mutation<{ user: TUser; accessToken: string }, Pick<TUser, 'email' | 'password'>>({
			query: credentials => ({
				url: '/login',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['User'],
		}),
		register: builder.mutation<{ user: TUser; accessToken: string }, TUserCredentials | string>({
			query: user => ({
				url: '/register',
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

export const { useLoginMutation, useRegisterMutation, useDeleteUserMutation } = UserApiSlice
