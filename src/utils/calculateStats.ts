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

export const calculateAcc = (wordsTyped: string[], errors: number): number => {
	const charactersCount = wordsTyped.map(word => word + ' ').join('').length

	console.log('Accurancy: ', Math.round((charactersCount - errors) / charactersCount * 100), '%')

	return Math.round((charactersCount - errors) / charactersCount * 100)
}

// Функция для вычисления консистентности
export const calculateConsistency = (timeBetweenKeyStrokes: number[]): number => {
	timeBetweenKeyStrokes.shift() // Удаляем первое значение из массива (время первого нажатия)

	let consistency: number = 0

	const count = timeBetweenKeyStrokes.length // Длина массива

	let sumOfSquares: number = 0 // Сумма квадратов отклонений

	let totalTime: number = 0 // Сумма значений времени

	// Считаем сумму всех значений времени
	for (let i = 0; i < count; i++) {
		totalTime += timeBetweenKeyStrokes[i]
	}

	const averageTime = totalTime / count // Среднее значение времени
	const roundedAverage = Math.round(averageTime) // Округляем среднее

	// Считаем сумму квадратов отклонений от среднего
	for (let i = 0; i < count; i++) {
		sumOfSquares += Math.pow(timeBetweenKeyStrokes[i] - roundedAverage, 2)
	}

	const variance = sumOfSquares / count // Среднее значение квадратов отклонений

	const standardDeviation = Math.abs(Math.sqrt(variance) - 40) // Стандартное отклонение с вычитанием 40

	const coefficientOfVariation = standardDeviation / roundedAverage // Коэффициент вариации

	// Вычисляем консистентность
	consistency = 100 - coefficientOfVariation * 100 // Преобразуем в процент

	// Ограничиваем значение консистентности от 0 до 100
	if (consistency > 100 || consistency < 0) {
		consistency = 0
	} else {
		consistency = Math.round(consistency)
	}

	console.log(`Consistency: ${consistency}%`)

	return consistency
}