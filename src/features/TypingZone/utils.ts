import { T_Letter } from './types'

// Генерация начального массива текста
export const generateInitialTextArr = (text: string[]): T_Letter[][] =>
	text.map((word, wordIndex, words) =>
		[...word]
			.map(letter => ({ key: letter, state: 'default' }))
			.concat(wordIndex < words.length - 1 ? [{ key: ' ', state: 'default' }] : [])
	)

export const adjustWordPositions = (wordsElement: HTMLElement, topOffset: number) => {
	wordsElement.querySelectorAll('[word-id]').forEach(element => {
		const el = element as HTMLElement
		const currentTop = parseInt(el.style.top) || 0
		el.style.top = `${currentTop - topOffset}px`
	})
}

export const closure = (
	textArr: T_Letter[][],
	globalIndex: { wordIndex: number; letterIndex: number },
	setGlobalIndex: React.Dispatch<React.SetStateAction<{ wordIndex: number; letterIndex: number }>>,
	setTextArr: React.Dispatch<React.SetStateAction<T_Letter[][]>>
) => {
	const changeGlobalIndex = (action: 'increment' | 'decrement') => {
		setGlobalIndex(({ wordIndex, letterIndex }) => {
			const currentWord = textArr[wordIndex]

			if (action === 'increment') {
				return handleIncrement(wordIndex, letterIndex, currentWord)
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
			return { wordIndex: wordIndex - 1, letterIndex: textArr[wordIndex - 1].length - 1 }
		}
		return { wordIndex, letterIndex }
	}

	const updateLetterState = (state: 'correct' | 'incorrect', increment = true) => {
		setTextArr(prev => {
			const updated = [...prev]
			const { wordIndex, letterIndex } = globalIndex
			updated[wordIndex][letterIndex].state = state
			return updated
		})
		if (increment) changeGlobalIndex('increment')
	}

	return { changeGlobalIndex, updateLetterState }
}
