import { TAchievement } from './Public'

export type UserExperience = {
	level: number
	experience: number
}

export type UserAchievement = {
	id: TAchievement['id']
	dateOfCompletion: string
}
