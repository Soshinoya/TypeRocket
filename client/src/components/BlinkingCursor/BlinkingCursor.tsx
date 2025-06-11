import { FC } from 'react'

import styles from './BlinkingCursor.module.scss'

type BlinkingCursorProps = {
	// top: string
	left: string
}

// const BlinkingCursor: FC<BlinkingCursorProps> = ({ top, left }) => {
const BlinkingCursor: FC<BlinkingCursorProps> = ({ left }) => {
	// return <div className={`blinking-cursor ${styles['blinking-cursor']}`} style={{ top, left }}></div>
	return <div className={`blinking-cursor ${styles['blinking-cursor']}`} style={{ left }}></div>
}

export default BlinkingCursor
