import { FC, useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch } from 'store/index'

import { I_Notification } from 'features/Notification/types'
import { TUserCredentials } from 'types/User'
import { setAccessToken, setActivity, setCurrentUser, setExperience } from 'features/CurrentUser/reducer'

import { setNotificationAction } from 'features/Notification/reducer'

import { useRegisterMutation } from 'api/User/UserApiSlice'
import { useGetExperienceMutation } from 'api/Experience/ExperienceApiSlice'
import { useSetActivityMutation } from 'api/Activity/ActivityApiSlice'

import { Paths } from 'utils/paths'
import { getErrorMessage } from 'utils/utils'

import styles from './Register.module.scss'

import Input from 'components/Input/Input'
import Button from 'components/Button/Button'

const Register: FC = () => {
	const navigation = useNavigate()

	const dispatch = useAppDispatch()

	const [register] = useRegisterMutation()

	const [getExperience] = useGetExperienceMutation()

	const [setActivityMutation] = useSetActivityMutation()

	const [userCredentials, setUserCredentials] = useState<TUserCredentials>({
		username: '',
		email: '',
		password: '',
		repeatPassword: '',
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
				username: '',
				email: '',
				password: '',
				repeatPassword: '',
			})
		}

		try {
			// Создание пользователя
			const { data: newUser, error: creationError } = await register(userCredentials)

			if (creationError) {
				throw new Error(getErrorMessage(creationError))
			}

			// Успешная регистрация
			setNotification({
				title: 'Successful registration',
				subtitle: 'You have been successfully registered',
				status: 'success',
				isActive: true,
			})

			const { data: newExperience } = await getExperience({ accessToken: newUser.accessToken })

			if (newExperience) {
				dispatch(setExperience(newExperience))
			}

			const { data: newActivity } = await setActivityMutation({ accessToken: newUser.accessToken })

			if (newActivity) {
				dispatch(setActivity(newActivity))
			}

			dispatch(setCurrentUser(newUser.user))
			dispatch(setAccessToken(newUser.accessToken))

			navigation(Paths.profile)

			resetForm()

			console.log(newUser.user, '\n', newUser.accessToken)
		} catch (error) {
			setNotification({
				title: 'Registration error',
				subtitle: error instanceof Error ? error.message : 'Unknown error occurred',
				status: 'error',
				isActive: true,
			})

			console.error('Registration failed: ', error)
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
		<div className={styles['register']}>
			<h1 className={styles['register__title']}>Create an account</h1>
			<p className={styles['register__subtitle']}>Let`s begin your 30-day risk-free trial</p>
			<form className={styles['register-form']} action='#' onSubmit={onFormSubmit}>
				<div className={styles['register-form__inputs']}>
					<Input
						value={userCredentials.username}
						onChange={onInputChange}
						name='username'
						label='Username'
						type='username'
						autocomplete='false'
						maxLength={30}
						adjacentInputValues={userCredentials}
						validateTips={validateTips}
						setValidateTips={setValidateTips}
					/>
					<Input
						value={userCredentials.email}
						onChange={onInputChange}
						name='email'
						label='E-mail'
						type='email'
						autocomplete='false'
						maxLength={40}
						adjacentInputValues={userCredentials}
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
						adjacentInputValues={userCredentials}
						validateTips={validateTips}
						setValidateTips={setValidateTips}
						authType='register'
					/>
					<Input
						value={userCredentials.repeatPassword}
						onChange={onInputChange}
						name='repeatPassword'
						label='Repeat password'
						type='password'
						autocomplete='false'
						maxLength={30}
						adjacentInputValues={userCredentials}
						validateTips={validateTips}
						setValidateTips={setValidateTips}
						authType='register'
					/>
				</div>
				<Button text='Create account' action={() => {}} />
				<div className={styles['register-form__text']}>
					<p>Have an account already?</p>
					<Link to='/login'>Sign in</Link>
				</div>
			</form>
		</div>
	)
}

export default Register
