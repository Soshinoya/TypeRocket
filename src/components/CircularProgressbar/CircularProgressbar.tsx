import { FC, useEffect, useState } from 'react'

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

import 'react-circular-progressbar/dist/styles.css'

import s from './CircularProgressbar.module.scss'

type CircularProgressProps = {
	value: number
}

const CircularProgress: FC<CircularProgressProps> = ({ value }) => {
	const [percentage, setPercentage] = useState(0)

	useEffect(() => {
		setPercentage(0)
		const interval = setInterval(() => {
			setPercentage(prev => {
				if (prev === value) {
					clearInterval(interval)
					return prev
				}
				return prev + 1
			})
		}, 15)

		return () => clearInterval(interval)
	}, [value])

	return (
		<div style={{ width: 100 }}>
			<CircularProgressbarWithChildren
				value={percentage}
				strokeWidth={8}
				styles={buildStyles({
					rotation: 0,
					strokeLinecap: 'round',
					pathColor: '#D2FC04',
					trailColor: '#404D01',
					pathTransitionDuration: 0,
				})}
			>
				<h3 className={s['percentage']}>{`${percentage}%`}</h3>
			</CircularProgressbarWithChildren>
		</div>
	)
}

export default CircularProgress
