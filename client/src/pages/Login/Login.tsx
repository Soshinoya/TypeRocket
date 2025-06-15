import { FC, useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch } from 'store/index'

import { TUserCredentials } from 'types/User'

import { I_Notification } from 'features/Notification/types'
import { setNotificationAction } from 'features/Notification/reducer'

import { useLazyGetUserQuery, useLazyIsEmailExistsQuery } from 'features/api/User/UserSlice'

import { Paths } from 'utils/paths'
import { addToValidateTips } from 'utils/utils'

import styles from './Login.module.scss'

import Input from 'components/Input/Input'
import Button from 'components/Button/Button'

const Login: FC = () => {
	const dispatch = useAppDispatch()

	const navigation = useNavigate()

	const [checkEmailExists] = useLazyIsEmailExistsQuery()

	const [authentication] = useLazyGetUserQuery()

	const [userCredentials, setUserCredentials] = useState<Omit<TUserCredentials, 'username' | 'repeatPassword'>>({
		email: '',
		password: '',
	})

	const [notification, setNotification] = useState<Omit<I_Notification, 'id' | 'duration'> & { isActive: boolean }>({
		title: '',
		subtitle: '',
		status: 'success',
		isActive: false,
	})

	const [validateTips, setValidateTips] = useState<Map<string, string>>(new Map())

	const onFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		const getErrorMessage = (error: any): string => {
			if (error?.data?.message) return error.data.message
			if (error?.message) return error.message
			return 'Unknown error occurred'
		}

		const resetForm = () => {
			setUserCredentials({
				email: '',
				password: '',
			})
		}

		try {
			// 1. Проверка существования email
			const emailCheck = await checkEmailExists({ email: userCredentials.email })

			// Обработка ошибок проверки
			if (emailCheck.error) {
				const error = emailCheck.error
				throw new Error(getErrorMessage(error))
			}

			// Проверка существующих пользователей
			if (!emailCheck.data) {
				const errorMessage = 'The email address has not been registered yet'
				addToValidateTips('email', errorMessage, setValidateTips)
				throw new Error(errorMessage)
			}

			// 2. Вход в систему
			const { data: user, error: authenticationError } = await authentication(userCredentials)

			if (authenticationError) {
				throw new Error(getErrorMessage(authenticationError))
			} else if (!user) {
				const errorMessage = 'Invalid password'
				addToValidateTips('password', errorMessage, setValidateTips)
				throw new Error(errorMessage)
			}

			// 3. Успешная аутентификация
			setNotification({
				title: 'Successful login',
				subtitle: 'You have been successfully logged in',
				status: 'success',
				isActive: true,
			})

			navigation(Paths.profile)

			resetForm()

			console.log(user)

			return user
		} catch (error) {
			setNotification({
				title: 'Login error',
				subtitle: error instanceof Error ? error.message : 'Unknown error occurred',
				status: 'error',
				isActive: true,
			})

			console.error('Login failed: ', error)
			return null
		}
	}

	useEffect(() => {
		const { title, subtitle, status, isActive } = notification
		if (isActive) {
			dispatch(
				setNotificationAction({
					id: nanoid(10),
					title: title,
					subtitle: subtitle,
					status: status,
				})
			)
		}
	}, [notification])

	const onInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) =>
			setUserCredentials(prev => ({
				...prev,
				[event.target.name]: event.target.value,
			})),
		[]
	)

	return (
		<div className={styles['login']}>
			<h1 className={styles['login__title']}>Sign in to TypeRocket</h1>
			<p className={styles['login__subtitle']}>We’re glad you are back</p>
			<form className={styles['login-form']} action='#' onSubmit={onFormSubmit}>
				<div className={styles['login-form__inputs']}>
					<Input
						value={userCredentials.email}
						onChange={onInputChange}
						name='email'
						label='E-mail'
						type='email'
						autocomplete='false'
						maxLength={40}
						validateTips={validateTips}
						setValidateTips={setValidateTips}
					/>
					<Input
						value={userCredentials.password}
						onChange={onInputChange}
						name='password'
						label='Password'
						type='password'
						autocomplete='false'
						maxLength={30}
						validateTips={validateTips}
						setValidateTips={setValidateTips}
					/>
				</div>
				<Button text='Log in' action={() => {}} />
				<div className={styles['login-form__text']}>
					<p>Don’t have an account already?</p>
					<Link to='/register'>Sign up now</Link>
				</div>
			</form>
		</div>
	)
}

export default Login
