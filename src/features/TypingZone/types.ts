export type Language = {
	key: string
	name: string
}

export const languages: { [key: string]: Language } = {
	english_200: {
		key: 'english_200',
		name: 'English 200',
	},
	english_1k: {
		key: 'english_1k',
		name: 'English 1K',
	},
} as const

export enum PlayerMode {
	'single' = 'singleplayer',
	'multi' = 'multiplayer',
}

export enum Mode {
	'words' = 'words',
	'time' = 'time',
}

export interface I_ModeOption {
	count: number
	enabled: boolean
}

export interface I_TypingZone {
	language: Language
	isPunctuation: boolean
	isNumbers: boolean
	playerMode: PlayerMode
	mode: Mode
	wordOptions: I_ModeOption[]
	timeOptions: I_ModeOption[]
	text: string[]
}
