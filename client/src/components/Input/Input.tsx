import { FC, useEffect, useState } from 'react'
import styles from './Input.module.scss'

type InputProps = {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
	name?: string
	label?: string
	type?: 'username' | 'text' | 'password' | 'email'
	autocomplete?: string
	maxLength?: number
	adjacentInputValues?: { [key: string]: string }
	validateTips?: Map<string, string>
	setValidateTips?: (key: string, value: string) => void
	authType?: 'register' | 'login'
}

// Валидаторы вынесены в константы для переиспользования
const USERNAME_ERRORS = {
	SPACE: 'Username should not contain spaces',
	LENGTH: 'Username should not exceed 30 characters',
}

const PASSWORD_ERRORS = {
	SPACE: 'Password should not contain spaces',
	LENGTH: 'Password should be at least 8 characters',
	MATCH: 'Passwords do not match',
}

const EMAIL_ERRORS = {
	SPACE: 'Email should not contain spaces',
	INVALID: 'Please enter a valid email address',
}

// Функции валидации
const validateUsername = (value: string) => {
	if (value.includes(' ')) return USERNAME_ERRORS.SPACE
	if (value.length > 29) return USERNAME_ERRORS.LENGTH
	return ''
}

const validatePassword = (value: string) => {
	if (value.includes(' ')) return PASSWORD_ERRORS.SPACE
	if (value.length < 8) return PASSWORD_ERRORS.LENGTH
	return ''
}

const validateEmail = (value: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (value.includes(' ')) return EMAIL_ERRORS.SPACE
	if (!emailRegex.test(value)) return EMAIL_ERRORS.INVALID
	return ''
}

const Input: FC<InputProps> = ({
	value,
	onChange,
	onBlur,
	name = '',
	label,
	type,
	autocomplete,
	maxLength = 30,
	adjacentInputValues,
	validateTips = new Map(),
	setValidateTips = () => {},
	authType,
}) => {
	const [modificator, setModificator] = useState<'' | 'error' | 'disabled'>('')

	// Основная функция валидации
	const validateField = (currentValue: string, fieldName: string) => {
		let error = ''

		switch (fieldName) {
			case 'username':
				error = validateUsername(currentValue)
				break
			case 'password':
				error = validatePassword(currentValue)
				break
			case 'email':
				error = validateEmail(currentValue)
				break
			case 'repeatPassword':
				error = validatePassword(currentValue) || error
				break
		}

		// Проверка совпадения паролей при регистрации
		if (authType === 'register' && ['password', 'repeatPassword'].includes(fieldName)) {
			const otherField = fieldName === 'password' ? 'repeatPassword' : 'password'
			const otherValue = adjacentInputValues?.[otherField] || ''

			if (!error && otherValue && currentValue !== otherValue) {
				error = PASSWORD_ERRORS.MATCH
			}
		}

		if (error) setModificator('error')
		else setModificator('')

		setValidateTips(fieldName, error)
	}

	// Обработчик изменений
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e)
		validateField(e.target.value, name)
	}

	// Обработчик потери фокуса
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		onBlur?.(e)
		validateField(value, name)
	}

	// Валидация при изменении связанных полей
	useEffect(() => {
		if (authType === 'register' && name === 'password' && adjacentInputValues?.repeatPassword) {
			validateField(value, name)
		}
	}, [adjacentInputValues?.repeatPassword])

	useEffect(() => {
		if (authType === 'register' && name === 'repeatPassword' && adjacentInputValues?.password) {
			validateField(value, name)
		}
	}, [adjacentInputValues?.password])

	return (
		<div className={styles.input__wrapper}>
			<input
				id={name}
				className={`${styles.input} ${modificator && styles[`input--${modificator}`]}`}
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
				name={name}
				type={type}
				autoComplete={autocomplete}
				maxLength={maxLength}
				aria-invalid={modificator === 'error'}
			/>

			{label && (
				<label htmlFor={name} className={styles.input__label}>
					{label}
				</label>
			)}

			{validateTips.get(name) && (
				<p className={styles['validate-tip']} role='alert'>
					{validateTips.get(name)}
				</p>
			)}
		</div>
	)
}

export default Input
