export const getRandomWords = (text: string, wordCount: number): string => {
	// Разбиваем текст на слова
	const words = text.split(/\s+/).filter(Boolean) // Убираем пустые строки

	if (wordCount > words.length) {
		throw new Error('Запрошенное количество слов превышает количество доступных в тексте')
	}

	// Выбираем рандомные слова
	const randomWords: string[] = []
	const usedIndices = new Set<number>()

	while (randomWords.length < wordCount) {
		const randomIndex = Math.floor(Math.random() * words.length)

		if (!usedIndices.has(randomIndex)) {
			randomWords.push(words[randomIndex])
			usedIndices.add(randomIndex)
		}
	}

	return randomWords.join(' ')
}
