import { random } from './utils'

export const getRandomWords = (words: string[], wordCount: number): string[] => {
	if (wordCount > words.length) {
		throw new Error('Запрошенное количество слов превышает количество доступных в тексте')
	}

	// Выбираем рандомные слова
	const randomWords: string[] = []
	const usedIndices = new Set<number>()

	while (randomWords.length < wordCount) {
		const randomIndex = random(words.length)

		if (!usedIndices.has(randomIndex)) {
			randomWords.push(words[randomIndex])
			usedIndices.add(randomIndex)
		}
	}

	return randomWords
}
