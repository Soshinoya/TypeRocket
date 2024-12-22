import { FC } from 'react'

import styles from './Button.module.scss'

type ButtonProps = {
	text: string
	action: Function
}

const Button: FC<ButtonProps> = ({ text, action }) => {
	return (
		<button className={styles['button']} onClick={() => action()}>
			{text}
		</button>
	)
}

export default Button
