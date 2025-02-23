import { FC, useRef } from 'react'

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'

import type { ChartData, ChartOptions } from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type T_Dataset = {
	dataset: any[]
	options: {
		label: string
		borderColor: string
		backgroundColor: string
	}
}

type ChartProps = {
	horizontalDataArr: any[]
	verticalDataArrays: T_Dataset[]
}

const Chart: FC<ChartProps> = ({ horizontalDataArr, verticalDataArrays }) => {
	const chartRef = useRef(null)

	const data: ChartData = {
		labels: horizontalDataArr,
		datasets: verticalDataArrays.map(({ dataset, options }) => {
			return {
				label: options.label,
				data: horizontalDataArr.map((_, i) => dataset[i]),
				borderColor: options.borderColor,
				backgroundColor: options.backgroundColor,
			}
		}),
	}

	const options: ChartOptions = {
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
					color: '#fa5b17',
					font: {
						family: 'Epilogue',
						size: 14,
					},
				},
				grid: {
					color: '#363636',
				},
				ticks: {
					color: '#f2d0c2',
					backdropColor: '#f2d0c2',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Words per minute',
					color: '#fa5b17',
					font: {
						family: 'Epilogue',
						size: 14,
					},
				},
				grid: {
					color: '#363636',
				},
				ticks: {
					color: '#f2d0c2',
					backdropColor: '#f2d0c2',
				},
			},
		},
	}

	// @ts-ignore
	return <Line ref={chartRef} options={options} data={data} />
}

export default Chart
