import { TAchievement, TResultMetrics } from './Public'

export type TUser = {
	id: number
	username: string
	email: string
	password: string
	creation_date: string
	description: string
}

export type TUserCredentials = Pick<TUser, 'username' | 'email'> & {
	password: string
	repeatPassword: string
}

export type TUserPreferences = {
	id: number
	userId: TUser['id']
	currentThemeId: string
}

export type TUserExperience = {
	level: number
	progress: number
}

export type TUserAchievement = {
	id: number
	userId: TUser['id']
	achievementId: TAchievement['id']
	completionDate: string
}

export type TUserBestResults = {
	testName: string
	resultMetrics: TResultMetrics
}

export type TUserActivity = {
	userId: TUser['id']
	count: number
	date: string
	level: number
}
