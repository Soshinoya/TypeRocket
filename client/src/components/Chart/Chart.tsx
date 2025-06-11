import { FC } from 'react'

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
	argOptions: ChartOptions
}

const Chart: FC<ChartProps> = ({ horizontalDataArr, verticalDataArrays, argOptions }) => {
	const data: ChartData = {
		labels: horizontalDataArr,
		datasets: verticalDataArrays.map(({ dataset, options }) => {
			return {
				label: options.label,
				data: horizontalDataArr.map((_, i) => dataset[i]),
				borderColor: options.borderColor,
				backgroundColor: options.backgroundColor,
				pointRadius: 2,
			}
		}),
	}

	const options: ChartOptions = argOptions

	// @ts-ignore
	return <Line options={options} data={data} />
}

export default Chart
