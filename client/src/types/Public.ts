export type TAchievement = {
	id: number
	title: string
	description: string
	type: string
	target: number
	experience_gained: number
}

export type TUserAchievement = {
	achievement_id: number
	completion_date: string
	title: string
	description: string
}

export type TResultMetrics = {
	wpm: number
	rawWpm: number
	accuracy: number
	consistency: number
}

export type TUserMetrics = {
	last_activity_date: string
	streak: number
	keystrokes: number
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
