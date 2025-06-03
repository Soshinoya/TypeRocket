import { FC, useEffect, useState } from 'react'

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

import { useAppSelector } from 'store/index'

import { selectCurrentTheme } from 'features/Themes/selectors'

import 'react-circular-progressbar/dist/styles.css'

import s from './CircularProgressbar.module.scss'

type CircularProgressProps = {
	value: number
}

const CircularProgress: FC<CircularProgressProps> = ({ value }) => {
	const { primary, primarySemiBold } = useAppSelector(selectCurrentTheme)

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
				className={s['CircularProgressbar']}
				value={percentage}
				strokeWidth={8}
				styles={buildStyles({
					rotation: 0,
					trailColor: primarySemiBold,
					pathColor: primary,
					strokeLinecap: 'round',
					pathTransitionDuration: 0,
				})}
			>
				<h3 className={s['percentage']}>{`${percentage}%`}</h3>
			</CircularProgressbarWithChildren>
		</div>
	)
}

export default CircularProgress
