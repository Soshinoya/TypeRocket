const punctuationCharacters = ['()', ',', "''", '""', '.', '-', '!', '?', ';', ':']

export const tolowercase = (str: string): string => {
	if (str === ' ') return ' '
	if (str == null) return ' '
	return str.toLowerCase()
}

export const random = (n: number): number => {
	return Math.floor(Math.random() * n)
}

export const addPunctuation = (words: string[]): string[] => {
	return words.map(word => {
		// Генерируем случайное число для вероятности добавления пунктуации
		const shouldAddPunctuation = Math.random() > 0.6 // 40% вероятность
		if (!shouldAddPunctuation) return word

		// Рандомно выбираем пунктуационный символ
		const punctuation = punctuationCharacters[Math.floor(Math.random() * punctuationCharacters.length)]

		// Добавляем пунктуацию в случайное место (в начало, конец или оборачиваем слово)
		if (punctuation === '()') {
			return `(${word})`
		} else if (punctuation === '""') {
			return `"${word}"`
		} else if (punctuation === "''") {
			return `'${word}'`
		} else if (['.', ',', '!', '?', ';', ':'].indexOf(punctuation) !== -1) {
			return `${word}${punctuation}`
		} else {
			return `${punctuation}${word}`
		}
	})
}

export const addNumbers = (
	words: string[],
	min: number = 1,
	max: number = 100,
	probability: number = 0.6 // Вероятность добавления числа (от 0 до 1)
): string[] => {
	const result = [...words] // Создаем копию массива
	const numberOfInsertions = Math.floor(Math.random() * (words.length / 2)) + 1 // Количество чисел для добавления

	for (let i = 0; i < numberOfInsertions; i++) {
		if (Math.random() <= probability) {
			// Условие с учетом вероятности
			const randomIndex = Math.floor(Math.random() * (result.length + 1)) // Случайная позиция
			const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min // Генерация числа
			result.splice(randomIndex, 0, randomNumber.toString()) // Вставка числа
		}
	}

	return result
}
