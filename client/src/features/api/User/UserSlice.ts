import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import { TUserCredentials, type TUser } from 'types/User'

import { Paths } from 'utils/paths'
import { getRefreshToken } from 'utils/utils'

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:3000/user',
	credentials: 'include',
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
	args,
	api,
	extraOptions
) => {
	let result = await baseQuery(args, api, extraOptions)

	if (result.error?.status === 403) {
		// Отправляем запрос на обновление токена
		const refreshResult = await baseQuery(
			{
				url: '/refresh',
				method: 'POST',
				body: { refreshToken: getRefreshToken() },
			},
			api,
			extraOptions
		)

		if (refreshResult.data) {
			// Повторяем оригинальный запрос с новым токеном
			result = await baseQuery(args, api, extraOptions)
		} else {
			// Логика выхода, если refresh не удался
			await baseQuery({ url: '/logout', method: 'POST' }, api, extraOptions)
			window.location.href = Paths.login
		}
	}
	return result
}

export const UserSlice = createApi({
	reducerPath: 'user',
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

export const { useLoginMutation, useRegisterMutation, useDeleteUserMutation } = UserSlice
