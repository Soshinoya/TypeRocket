export type TAchievement = {
	id: number
	title: string
	description: string
	experienceGained: number
}

export type TResultMetrics = {
	id: number
	wpm: number
	rawWpm: number
	accuracy: number
	consistency: number
	date: string
}

export type TTestNames = {
	id: number
	name: string
}
