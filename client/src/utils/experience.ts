export type TypingTestParams = {
	hasPunctuation: boolean
	hasNumbers: boolean
	mode: 'words' | 'time'
	count: number // number of words or seconds depending on mode
	wpm: number // words per minute
	accuracy: number // accuracy percentage 0-100
	consistency: number // consistency metric, 0-1 or 0-100
	errorCount: number
	xpMultiplier?: number // Optional multiplier to increase experience points
}

export const computeExperience = ({
	hasPunctuation,
	hasNumbers,
	mode,
	count,
	wpm,
	accuracy,
	consistency,
	errorCount,
	xpMultiplier = 2,
}: TypingTestParams): number => {
	// Normalize accuracy and consistency (assume consistency is 0-100)
	const accuracyFactor = Math.max(0, Math.min(accuracy / 100, 1))
	const consistencyNorm = consistency > 1 ? consistency / 100 : consistency // convert to 0-1 if >1

	// Base XP calculation:
	// If mode is words, base XP related to count * accuracy * consistency
	// If mode is time, base XP related to (wpm * minutes) * accuracy * consistency
	// count in time mode is seconds, so minutes = count / 60

	let baseXP = 0

	if (mode === 'words') {
		baseXP = count * accuracyFactor * consistencyNorm
	} else {
		const minutes = count / 60
		baseXP = wpm * minutes * accuracyFactor * consistencyNorm
	}

	// Experience scaling: add weight for speed (wpm) and penalize errors
	// Speed multiplier is sqrt(wpm / 40) to reward higher speed but with diminishing returns (assuming 40 wpm avg)
	const speedMultiplier = Math.sqrt(wpm / 40)

	// Penalize errors: error penalty reduces XP, but not below zero; each error reduces by 2.5% XP (capped)
	const errorPenalty = Math.min(1, 0.025 * errorCount)
	const errorMultiplier = 1 - errorPenalty

	// Bonus multipliers for punctuation and numbers presence
	const punctuationBonus = hasPunctuation ? 1.1 : 1
	const numbersBonus = hasNumbers ? 1.1 : 1

	// Total XP calculation including new XP multiplier
	let xp = baseXP * speedMultiplier * errorMultiplier * punctuationBonus * numbersBonus * xpMultiplier * 10

	// Ensure XP is never negative and round to nearest integer
	xp = Math.max(0, Math.round(xp))

	return xp
}

export const increaseExperience = (earnedExperience: number, currentExperience: number) => {
	const totalExperience = currentExperience + earnedExperience
	let levelsCount = 0

	// Проверяем, сколько уровней мы можем получить
	if (totalExperience >= 1000) {
		levelsCount = Math.floor(totalExperience / 1000)
	}

	// Оставшийся опыт после получения уровней
	const progress = totalExperience % 1000

	return { level: levelsCount, progress }
}
