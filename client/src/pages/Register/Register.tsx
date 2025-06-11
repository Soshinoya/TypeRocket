import { Link } from 'react-router-dom'
import { FC, useCallback, useState } from 'react'

import s from './Register.module.scss'

import Input from 'components/Input/Input'
import Button from 'components/Button/Button'

type RegisterProps = {}

type Fields = {
	username: string
	email: string
	password: string
	repeatPassword: string
}

const Register: FC<RegisterProps> = () => {
	const [fields, setFields] = useState<Fields>({
		username: '',
		email: '',
		password: '',
		repeatPassword: '',
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
		<div className={s['register']}>
			<h1 className={s['register__title']}>Create an account</h1>
			<p className={s['register__subtitle']}>Let`s begin your 30-day risk-free trial</p>
			<form className={s['register-form']} action='#'>
				<div className={s['register-form__inputs']}>
					<Input
						value={fields.username}
						onChange={onChangeInput}
						name='username'
						label='Username'
						type='username'
						autocomplete='false'
						maxLength={30}
					/>
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
					<Input
						value={fields.repeatPassword}
						onChange={onChangeInput}
						name='repeatPassword'
						label='Repeat password'
						type='password'
						autocomplete='false'
						maxLength={30}
					/>
				</div>
				<Button text='Create account' action={() => {}} />
				<div className={s['register-form__text']}>
					<p>Have an account already?</p>
					<Link to='/login'>Sign in</Link>
				</div>
			</form>
		</div>
	)
}

export default Register
