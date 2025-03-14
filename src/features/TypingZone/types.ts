import { nanoid } from '@reduxjs/toolkit'

export type Language = {
	id: string
	key: string
	name: string
}

export const languages: { [key: string]: Language } = {
	english_200: {
		id: nanoid(10),
		key: 'english_200',
		name: 'English 200',
	},
	english_1k: {
		id: nanoid(10),
		key: 'english_1k',
		name: 'English 1K',
	},
	russian_200: {
		id: nanoid(10),
		key: 'russian_200',
		name: 'Russian 200',
	},
	russian_1k: {
		id: nanoid(10),
		key: 'russian_1k',
		name: 'Russian 1K',
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
	text: string[][]
}

// Тип буквы с состоянием
export type T_Letter = {
	state: string
	key: string
}

// Тип слова с состоянием
export type T_Word = {
	state: string
	letters: T_Letter[]
}

export type T_CurrentLetterRect = {
	// top: string
	left: string
}
