import { T_Letter, T_Word } from './types'

// Генерация начального массива текста
export const generateInitialTextArr = (text: string[][]): T_Word[][] =>
	text.map(lineWords =>
		lineWords.map((word, wordIndex, words) => {
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
	)

export const closure = (
	textArr: T_Word[][],
	globalIndex: { lineIndex: number; wordIndex: number; letterIndex: number },
	setGlobalIndex: React.Dispatch<React.SetStateAction<{ lineIndex: number; wordIndex: number; letterIndex: number }>>,
	setTextArr: React.Dispatch<React.SetStateAction<T_Word[][]>>
) => {
	const { lineIndex, wordIndex, letterIndex } = globalIndex
	const changeGlobalIndex = (action: 'increment' | 'decrement') => {
		setGlobalIndex(() => {
			const currentWord = textArr[0][wordIndex]

			if (action === 'increment') {
				return { lineIndex, ...handleIncrement(currentWord.letters) }
			} else {
				return { lineIndex, ...handleDecrement() }
			}
		})
	}

	const handleIncrement = (currentWord: T_Letter[]) => {
		if (letterIndex === currentWord.length - 1 && wordIndex === textArr[0].length - 1) {
			return { lineIndex: lineIndex + 1, wordIndex: 0, letterIndex: 0 }
		}
		if (letterIndex < currentWord.length - 1) {
			return { wordIndex, letterIndex: letterIndex + 1 }
		}
		if (wordIndex < textArr.flat().length - 1) {
			return { wordIndex: wordIndex + 1, letterIndex: 0 }
		}
		return { wordIndex, letterIndex }
	}

	const handleDecrement = () => {
		const cursor = document.querySelector('.blinking-cursor') as HTMLElement
		if (parseInt(cursor.style.left) === 0) return { wordIndex, letterIndex }

		if (letterIndex > 0) {
			return { wordIndex, letterIndex: letterIndex - 1 }
		}
		if (wordIndex > 0) {
			return { wordIndex: wordIndex - 1, letterIndex: textArr[0][wordIndex - 1].letters.length - 1 }
		}
		return { wordIndex, letterIndex }
	}

	const updateLetterState = (state: 'correct' | 'incorrect', increment = true) => {
		setTextArr(prev => {
			const updated = [...prev]
			updated[0][wordIndex].letters[letterIndex].state = state
			return updated
		})
		if (increment) changeGlobalIndex('increment')
	}

	return { changeGlobalIndex, updateLetterState }
}
