import { FC } from 'react'

import { useAppSelector } from 'store/index'

import { selectCurrentTheme } from 'features/Themes/selectors'

import Chart from './Chart'

type ResultWpmChartProps = {
	wpmPerTimeArr: { time: number; wpm: number; rawWpm: number }[]
}

const ResultWpmChart: FC<ResultWpmChartProps> = ({ wpmPerTimeArr }) => {
	const { primary, accentLight, accent } = useAppSelector(selectCurrentTheme)

	const isMobile = window.matchMedia('(max-width: 1024px)').matches

	return (
		<Chart
			verticalDataArrays={[
				{
					dataset: wpmPerTimeArr.map(item => item.wpm),
					options: {
						label: 'wpm',
						borderColor: accent,
						backgroundColor: accent,
					},
				},
				{
					dataset: wpmPerTimeArr.map(item => item.rawWpm),
					options: {
						label: 'raw wpm',
						borderColor: primary,
						backgroundColor: primary,
					},
				},
			]}
			horizontalDataArr={wpmPerTimeArr.map(item => item.time)}
			argOptions={{
				maintainAspectRatio: false,
				responsive: true,
				plugins: {
					legend: {
						position: 'top' as const,
					},
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Time',
							color: accent,
							font: {
								family: 'Epilogue',
								size: 14,
							},
						},
						grid: {
							color: '#363636',
						},
						ticks: {
							color: accentLight,
							backdropColor: accentLight,
						},
					},
					y: {
						title: {
							display: isMobile ? false : true,
							text: 'Words per minute',
							color: accent,
							font: {
								family: 'Epilogue',
								size: 14,
							},
						},
						grid: {
							color: '#363636',
						},
						ticks: {
							color: accentLight,
							backdropColor: accentLight,
						},
					},
				},
			}}
		/>
	)
}

export default ResultWpmChart
