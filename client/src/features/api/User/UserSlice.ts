import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { TUserCredentials, type TUser } from 'types/User'

export const UserSlice = createApi({
	reducerPath: 'user',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/user' }),
	tagTypes: ['User'],
	endpoints: builder => ({
		isNameExists: builder.query<string, Pick<TUser, 'username'>>({
			query: credentials => `/is_user_name_exists/${credentials.username}`,
		}),
		isEmailExists: builder.query<string, Pick<TUser, 'email'>>({
			query: credentials => `/is_user_email_exists/${credentials.email}`,
		}),
		getUser: builder.mutation<TUser, Pick<TUser, 'email' | 'password'>>({
			query: credentials => `/get_user/${credentials.email}/${credentials.password}`,
			invalidatesTags: ['User'],
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

export const {
	useLazyIsNameExistsQuery,
	useLazyIsEmailExistsQuery,
	useGetUserMutation,
	useCreateUserMutation,
	useDeleteUserMutation,
} = UserSlice
