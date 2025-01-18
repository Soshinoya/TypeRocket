import { FC } from 'react'

import styles from './Button.module.scss'

type ButtonProps = {
	text: string
	action: Function
	variant?: 'filled' | 'outline'
}

const Button: FC<ButtonProps> = ({ variant = 'filled', text, action }) => {
	return (
		<button className={`${styles['button']} ${styles[`button--${variant}`]}`} onClick={() => action()}>
			{text}
		</button>
	)
}

export default Button
