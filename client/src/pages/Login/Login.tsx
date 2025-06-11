import { Link } from 'react-router-dom'
import { FC, useCallback, useState } from 'react'

import s from './Login.module.scss'

import Input from 'components/Input/Input'
import Button from 'components/Button/Button'

type LoginProps = {}

type Fields = {
	email: string
	password: string
}

const Login: FC<LoginProps> = () => {
	const [fields, setFields] = useState<Fields>({
		email: '',
		password: '',
	})

	const onChangeInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFields({
				...fields,
				[e.target.name]: e.target.value,
			})
		},
		[fields]
	)

	return (
		<div className={s['login']}>
			<h1 className={s['login__title']}>Sign in to TypeRocket</h1>
			<p className={s['login__subtitle']}>We’re glad you are back</p>
			<form className={s['login-form']} action='#'>
				<div className={s['login-form__inputs']}>
					<Input
						value={fields.email}
						onChange={onChangeInput}
						name='email'
						label='E-mail'
						type='email'
						autocomplete='false'
						maxLength={40}
					/>
					<Input
						value={fields.password}
						onChange={onChangeInput}
						name='password'
						label='Password'
						type='password'
						autocomplete='false'
						maxLength={30}
					/>
				</div>
				<Button text='Create account' action={() => {}} />
				<div className={s['login-form__text']}>
					<p>Don’t have an account already?</p>
					<Link to='/register'>Sign up now</Link>
				</div>
			</form>
		</div>
	)
}

export default Login
