import { FC, useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch } from 'store/index'

import { TUserCredentials } from 'types/User'

import { I_Notification } from 'features/Notification/types'
import { setNotificationAction } from 'features/Notification/reducer'
import { setAccessToken, setCurrentUser, setExperience } from 'features/CurrentUser/reducer'

import { useLoginMutation } from 'api/User/UserApiSlice'
import { useGetExperienceMutation } from 'api/Experience/ExperienceApiSlice'

import { Paths } from 'utils/paths'
import { getErrorMessage } from 'utils/utils'

import styles from './Login.module.scss'

import Input from 'components/Input/Input'
import Button from 'components/Button/Button'

const Login: FC = () => {
	const dispatch = useAppDispatch()

	const navigation = useNavigate()

	const [authentication] = useLoginMutation()

	const [getExperience] = useGetExperienceMutation()

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

		const resetForm = () => {
			setUserCredentials({
				email: '',
				password: '',
			})
		}

		try {
			// Вход в систему
			const { data: newUser, error } = await authentication(userCredentials)

			if (error) {
				throw new Error(getErrorMessage(error))
			}

			// Успешная аутентификация
			setNotification({
				title: 'Successful login',
				subtitle: 'You have been successfully logged in',
				status: 'success',
				isActive: true,
			})

			const { data: newExperience } = await getExperience({ accessToken: newUser.accessToken })

			if (newExperience) {
				dispatch(setExperience(newExperience))
			}

			dispatch(setCurrentUser(newUser.user))
			dispatch(setAccessToken(newUser.accessToken))

			navigation(Paths.profile)

			resetForm()

			console.log(newUser.user, '\n', newUser.accessToken)
		} catch (error) {
			setNotification({
				title: 'Login failed',
				subtitle: error instanceof Error ? error.message : 'Unknown error occurred',
				status: 'error',
				isActive: true,
			})

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
