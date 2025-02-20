export const calculateWPM = (correctWords: string[], timeInSeconds: number): number => {
	const charactersCount = correctWords.map(word => word + ' ').join('').length

	console.log(
		`WPM params: correctWords - ${correctWords}; timeInSeconds - ${timeInSeconds}; charactersCount - ${charactersCount}`
	)

	// Проверка: время должно быть больше 0
	if (timeInSeconds <= 0) {
		throw new Error('Время должно быть больше 0')
	}

	const wpm = charactersCount / 5 / (timeInSeconds / 60)

	// Возвращаем округленный результат
	return Math.round(wpm)
}

export const calculateRawWPM = (wordsTyped: string[], timeInSeconds: number): number => {
	const charactersCount = wordsTyped.map(word => word + ' ').join('').length

	console.log(
		`Raw WPM params: wordsTyped - ${wordsTyped}; timeInSeconds - ${timeInSeconds}; charactersCount - ${charactersCount}`
	)

	// Проверка: время должно быть больше 0
	if (timeInSeconds <= 0) {
		throw new Error('Время должно быть больше 0')
	}

	const rawWpm = charactersCount / 5 / (timeInSeconds / 60)

	// Возвращаем округленный результат
	return Math.round(rawWpm)
}
