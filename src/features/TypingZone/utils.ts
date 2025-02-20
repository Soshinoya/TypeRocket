import { T_Letter, T_Word } from './types'

// Генерация начального массива текста
export const generateInitialTextArr = (text: string[]): T_Word[] =>
	text.map((word, wordIndex, words) => {
		// Создаем массив букв для текущего слова
		const letters = [...word].map(letter => ({ key: letter, state: 'default' }))

		// Если это не последнее слово, добавляем пробел
		if (wordIndex < words.length - 1) {
			letters.push({ key: ' ', state: 'default' })
		}

		return {
			state: 'default', // Добавляем состояние слова по умолчанию
			letters,
		}
	})

export const adjustWordPositions = (wordsElement: HTMLElement, topOffset: number) => {
	wordsElement.querySelectorAll('[word-id]').forEach(element => {
		const el = element as HTMLElement
		const currentTop = parseInt(el.style.top) || 0
		el.style.top = `${currentTop - topOffset}px`
	})
}

export const closure = (
	textArr: T_Word[],
	globalIndex: { wordIndex: number; letterIndex: number },
	setGlobalIndex: React.Dispatch<React.SetStateAction<{ wordIndex: number; letterIndex: number }>>,
	setTextArr: React.Dispatch<React.SetStateAction<T_Word[]>>
) => {
	const changeGlobalIndex = (action: 'increment' | 'decrement') => {
		setGlobalIndex(({ wordIndex, letterIndex }) => {
			const currentWord = textArr[wordIndex]

			if (action === 'increment') {
				return handleIncrement(wordIndex, letterIndex, currentWord.letters)
			} else {
				return handleDecrement(wordIndex, letterIndex)
			}
		})
	}

	const handleIncrement = (wordIndex: number, letterIndex: number, currentWord: T_Letter[]) => {
		if (letterIndex < currentWord.length - 1) {
			return { wordIndex, letterIndex: letterIndex + 1 }
		}
		if (wordIndex < textArr.length - 1) {
			return { wordIndex: wordIndex + 1, letterIndex: 0 }
		}
		return { wordIndex, letterIndex }
	}

	const handleDecrement = (wordIndex: number, letterIndex: number) => {
		const cursor = document.querySelector('.blinking-cursor') as HTMLElement
		if (parseInt(cursor.style.left) === 0) return { wordIndex, letterIndex }

		if (letterIndex > 0) {
			return { wordIndex, letterIndex: letterIndex - 1 }
		}
		if (wordIndex > 0) {
			return { wordIndex: wordIndex - 1, letterIndex: textArr[wordIndex - 1].letters.length - 1 }
		}
		return { wordIndex, letterIndex }
	}

	const updateLetterState = (state: 'correct' | 'incorrect', increment = true) => {
		setTextArr(prev => {
			const updated = [...prev]
			const { wordIndex, letterIndex } = globalIndex
			updated[wordIndex].letters[letterIndex].state = state
			return updated
		})
		if (increment) changeGlobalIndex('increment')
	}

	return { changeGlobalIndex, updateLetterState }
}
