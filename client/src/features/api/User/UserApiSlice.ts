import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import Cookies from 'universal-cookie'

import { setAccessToken } from 'features/CurrentUser/reducer'

import { TUserCredentials, type TUser } from 'types/User'

import { Paths } from 'utils/paths'

const cookies = new Cookies()

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:3000/user',
	credentials: 'include',
})

// baseQueryWithReauth делает обычный запрос, если accessToken не подошел (статус 403), то делаем запрос на обновление access токена
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
	args,
	api,
	extraOptions
) => {
	let result = await baseQuery(args, api, extraOptions)

	if (result.error?.status === 401 || result.error?.status === 403) {
		// Отправляем запрос на обновление токена
		const refreshResult = await baseQuery(
			{
				url: '/refresh',
				method: 'POST',
				body: { refreshToken: cookies.get('refreshToken') },
			},
			api,
			extraOptions
		)

		if (refreshResult.data) {
			// Повторяем оригинальный запрос с новым токеном
			type RefreshResponse = { accessToken: string }
			const { accessToken: newAccessToken } = refreshResult.data as RefreshResponse

			// Сохраняем новый токен в хранилище
			api.dispatch(setAccessToken(newAccessToken))

			result = await baseQuery(args, api, extraOptions)
		} else {
			// Логика выхода, если refresh не удался
			await baseQuery({ url: '/logout', method: 'POST' }, api, extraOptions)
			localStorage.removeItem('currentUser')
			window.location.href = Paths.login
		}
	}
	return result
}

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
