export const calculateWPM = (typedText: string[], timeInSeconds: number): number => {
	// Проверка: время должно быть больше 0
	if (timeInSeconds <= 0) {
		throw new Error('Время должно быть больше 0.')
	}

	// Разделяем текст на слова
	// const words = typedText.trim().split(/\s+/)
	const words = typedText

	console.log('words: ', words)

	// Считаем количество слов
	const wordCount = words.length

	// Переводим время в минуты
	const timeInMinutes = timeInSeconds / 60

	// Рассчитываем WPM
	const wpm = wordCount / timeInMinutes

	// Возвращаем округленный результат
	return Math.round(wpm)
}
