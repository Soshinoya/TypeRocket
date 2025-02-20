export const calculateWPM = (wordsArr: string[], timeInSeconds: number, errors: number): number => {
	const charactersCount = wordsArr.map(word => word + ' ').join('').length

	// Проверка: время должно быть больше 0
	if (timeInSeconds <= 0) {
		throw new Error('Время должно быть больше 0')
	}

	const wpm = (charactersCount / 5 - errors) / (timeInSeconds / 60)

	// Возвращаем округленный результат
	return Math.round(wpm)
}
