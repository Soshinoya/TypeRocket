import { FC } from 'react'

import styles from './Progressbar.module.scss'

type ProgressbarProps = {
	percentage: number
}

const Progressbar: FC<ProgressbarProps> = ({ percentage }) => {
	return (
		<div className={styles['progressbar']}>
			<span className={styles['progressbar__progress']} style={{ width: `${percentage}%` }}></span>
		</div>
	)
}

export default Progressbar
