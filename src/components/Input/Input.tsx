import { FC } from 'react'

import styles from './Input.module.scss'

type InputProps = {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
	name?: string
	label?: string
	type?: 'username' | 'text' | 'password' | 'email'
	modificator?: 'error' | 'disabled'
	autocomplete?: string
	maxLength?: number
}

const Input: FC<InputProps> = ({
	value,
	onChange,
	onBlur,
	name,
	label,
	type,
	modificator,
	autocomplete,
	maxLength = 30,
}) => {
	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target

		switch (type) {
			case 'username':
				if (value.includes(' ')) {
					console.error('Username should not contain spaces')
				}
				if (value.length > 30) {
					console.error('Username should not exceed 30 characters')
				}
				break
			case 'text':
				// Логика для текстового поля
				break
			case 'password':
				if (value.includes(' ')) {
					console.error('Password should not contain spaces')
				}
				break
			case 'email':
				if (value.includes(' ')) {
					console.error('Email should not contain spaces')
				}
				break
		}

		onChange(e)
	}

	return (
		<div className={styles['input__wrapper']}>
			{label && (
				<label htmlFor={name} className={styles['input__label']}>
					{label}
				</label>
			)}
			<input
				id={name}
				className={`${styles['input']} ${modificator ? styles[`input--${modificator}`] : ''}`}
				value={value}
				onChange={onChangeHandler}
				name={name}
				type={type}
				autoComplete={autocomplete}
				onBlur={onBlur}
				maxLength={maxLength}
			/>
		</div>
	)
}

export default Input
