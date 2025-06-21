export type TAchievement = {
	id: number
	title: string
	description: string
	experienceGained: number
}

export type TResultMetrics = {
	wpm: number
	rawWpm: number
	accuracy: number
	consistency: number
}

// export type TTestName =
// 	| 'test_15s'
// 	| 'test_30s'
// 	| 'test_60s'
// 	| 'test_120s'
// 	| 'test_10w'
// 	| 'test_20w'
// 	| 'test_40w'
// 	| 'test_80w'
