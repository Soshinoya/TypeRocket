export enum Languages {
	'english-200' = 'English 200',
	'english-1k' = 'English 1K',
}

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
	language: Languages
	punctuation: boolean
	numbers: boolean
	playerMode: PlayerMode
	mode: Mode
	words: I_ModeOption[]
	time: I_ModeOption[]
}
