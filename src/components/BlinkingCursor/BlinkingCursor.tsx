import { FC } from 'react'

import styles from './BlinkingCursor.module.scss'

type BlinkingCursorProps = {
	top: string
	left: string
}

const BlinkingCursor: FC<BlinkingCursorProps> = ({ top, left }) => {
	return <div className={styles['blinking-cursor']} style={{ top, left }}></div>
}

export default BlinkingCursor
