type WpmPerTime = { time: number; wpm: number; rawWpm: number }

export type Statistics = {
	wpm: number
	rawWpm: number
	accuracy: number
	consistency: number
	wpmPerTimeArr: WpmPerTime[]
	typedWords: string[]
	correctWords: string[]
	keystrokes: number
}
