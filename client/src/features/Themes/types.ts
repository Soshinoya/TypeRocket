export type SingleTheme = {
	id: string
	title: string
	primaryLight: string
	primary: string
	primarySemiBold: string
	primaryBold: string
	accentLight: string
	accent: string
	accentSemiBold: string
}

export interface I_Theme {
	currentTheme: SingleTheme
	allThemes: SingleTheme[]
}
